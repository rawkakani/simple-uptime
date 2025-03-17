const kv = await Deno.openKv();

const HOST = Deno.env.get("ECHO_ENDPOINT");
const TIMEOUT = 45;

console.log("Checking uptime of", HOST, "with timeout of", TIMEOUT);

// CRON Job to check every minute if the echo server is up
Deno.cron("Uptime Check", "*/1 * * * *", async () => {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const controller = new AbortController();
  // timeout the request after 5 seconds
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#canceling_a_request
  // uptime check to the echo server
  fetch(HOST, { signal: controller.signal })
    .then((res) => {
      // set true if the server is up
      kv.set(["uptime_status", Date.now()], res.ok, { expireIn: ONE_DAY });
      console.log(res.ok);
    })
    .catch((err) => {
      // set false if the server is down
      kv.set(["uptime_status", Date.now()], false, { expireIn: ONE_DAY });
      console.log(err);
    })
    .finally(() => clearTimeout(timeoutId));
});

Deno.serve(async (req) => {
  // Retrieve today's uptime
  const entries = kv.list({ prefix: ["uptime_status"] });
  const uptime = [];

  for await (const entry of entries) {
    uptime.push(entry.value);
  }

  const percentage =
    (uptime.filter((value) => value).length / uptime.length) * 100;

  return new Response(percentage);
});
