import RPCClient from "../rpc/client";

import { services } from "../definition";

const client = new RPCClient(services, {
  url: "/api/gateway"
});

export default () => (
  <button
    onClick={async () => {
      alert(await client.call("add", { a: 2, b: 2 }));
    }}
  >
    What is 2 + 2?
  </button>
);
