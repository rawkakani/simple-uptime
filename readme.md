# Simple Uptime

### Requirements

- [Deno](https://deno.com/)

### Getting Started

  ```bash
  echo "ECHO_ENDPOINT=echo_endpoint" > .env
  ```

### How to run

```bash
deno run --env --allow-net --allow-env --unstable-kv --unstable-cron index.js
```


### Roadmap

- [x] Create a new repositor
- [ ] Create a history of uptime (main reason: if you miss checking it up today)
- [ ] Nice uptime status page
