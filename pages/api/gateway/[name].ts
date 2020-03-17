import { rpc, method } from "../../../rpc/index";
import { IncomingMessage, OutgoingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";

const handler = rpc(method("add", (a: number, b: number) => a + b));

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const out = await handler(req, res);
  console.log(out);
};
