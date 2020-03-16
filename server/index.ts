// Implementation of an RPC server
import next from "next";
import path from "path";
import express from "express";
import bodyParser from "body-parser";

import { ModuleRpcServer } from "rpc_ts/lib/server";
import { ModuleRpcCommon } from "rpc_ts/lib/common";
import { ModuleRpcProtocolServer } from "rpc_ts/lib/protocol/server";
import { helloServiceDefinition } from "../definition";
const server = express();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const requestHandler = app.getRequestHandler();

const handler: ModuleRpcServer.ServiceHandlerFor<typeof helloServiceDefinition> = {
  async getHello({ language }) {
    if (language === "Spanish") return { text: "Hola" };
    throw new ModuleRpcServer.ServerRpcError(
      ModuleRpcCommon.RpcErrorType.notFound,
      `language '${language}' not found`
    );
  }
};

app.prepare().then(() => {
  server.use(bodyParser.urlencoded({ extended: false }));

  server.use(
    "/gateway",
    ModuleRpcProtocolServer.registerRpcRoutes(helloServiceDefinition, handler)
  );

  // Allows for cross origin domain request:
  server.use(function(req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    next();
  });

  // Static assets
  server.use("/public", express.static(path.join(__dirname, "../public")));

  // Next.js page routes
  server.all("*", requestHandler as any);

  // Start server
  server.listen(5000, () => {});
});
