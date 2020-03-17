import RPCClient from "../rpc/client";
const client = new RPCClient({
  url: "http://localhost:3000/api/gateway"
});

// Now let's do a Remote Procedure Call
async function rpc() {
  const result = await client.call("add", 2, 2);
  return result;
}

export default () => (
  <button
    onClick={async () => {
      const text = await rpc();
      alert(text);
    }}
  >
    Hello
  </button>
);
