import { rpc, method } from "../../../rpc/index";
import { NextApiRequest, NextApiResponse } from "next";
import { services } from "../../../definition";

const createHandler = rpc(services);

const handler = createHandler(method("add", ({ a, b }) => a + b));

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const out = await handler(req, res);
  console.log(out);
};
