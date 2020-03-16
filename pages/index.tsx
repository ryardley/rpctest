import { ModuleRpcProtocolClient } from "rpc_ts/lib/protocol/client";
import { helloServiceDefinition } from "../definition";

const cilent = ModuleRpcProtocolClient.getRpcClient(helloServiceDefinition, {
  remoteAddress: `http://localhost:5000/gateway`
});

// Now let's do a Remote Procedure Call
async function rpc() {
  const { text } = await cilent.getHello({ language: "Spanish" });
  return text;
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
