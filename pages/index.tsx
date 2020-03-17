import RPCClient from "../rpc/client";

import { services } from "../definition";

const client = new RPCClient(services, {
  url: "http://localhost:3000/api/gateway"
});

// Now let's do a Remote Procedure Call
async function rpc() {
  const result = await client.call("add", { a: 2, b: 2 });
  return result;
}

export default () => (
  <button
    onClick={async () => {
      const text = await rpc();
      alert(text);
    }}
  >
    What is 2 + 2?
  </button>
);
