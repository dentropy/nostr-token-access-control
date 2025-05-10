import { SimplePool } from "nostr-tools/pool";
export async function nostrGet(relays, filter) {
  const pool = new SimplePool();
  const events = await pool.querySync(relays, filter);
  return events;
}

let result = await nostrGet(["ws://localhost:6969"], {"ids" : ["d201532f471466d20fc49f6775d12cf0f2601caedae5d3d2938cc7d961bd2398"]})

console.log(result)