// This is lifted from https://github.com/bufferapp/micro-rpc

import { send, json, createError as microCreateError } from "micro";
import { IncomingMessage, OutgoingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";

type MethodFn = (
  ...args: Array<any | IncomingMessage | OutgoingMessage>
) => any;

type Method = {
  name: string;
  fn: MethodFn;
  docs?: string;
};

export function rpc(...methods: Method[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      query: { name },
      body
    } = req;
    const { args } = body;
    const matchingMethod = methods.find(method => method.name === name);
    if (matchingMethod) {
      const parsedArgs = args ? args : [];
      try {
        const result = Array.isArray(parsedArgs)
          ? await matchingMethod.fn(...parsedArgs, req, res)
          : await matchingMethod.fn(parsedArgs, req, res);
        send(res, 200, { result });
      } catch (err) {
        // error was handled
        if (err.handled) {
          send(res, err.statusCode, {
            error: err.message
          });
        } else {
          // unhandled exception
          throw err;
        }
      }
    } else if (name === "methods") {
      send(res, 200, {
        result: methods
          .map(method => ({
            name: method.name,
            docs: method.docs
          }))
          .concat({
            name: "methods",
            docs: "list all available methods"
          })
      });
    } else {
      send(res, 404, {
        error: "unknown method"
      });
    }
  };
}

export function method(name: string, fn: MethodFn, docs?: string) {
  return {
    name,
    fn,
    docs
  };
}

export function createError({
  message,
  statusCode = 400
}: {
  message: string;
  statusCode: number;
}) {
  const err = microCreateError(statusCode, message);
  return { ...err, handled: true };
}
