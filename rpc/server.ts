// This is lifted from https://github.com/bufferapp/micro-rpc

import { send, createError as microCreateError } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { ServiceDefinition, MethodObj, MethodsFor, MethodFn } from "./common";

export const rpc = <serviceDefinition extends ServiceDefinition>(
  _definition: serviceDefinition
) => (...methods: MethodObj<serviceDefinition>[]) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      query: { name },
      body
    } = req;
    const { args } = body;
    const matchingMethod = methods.find(method => method.name === name);
    if (matchingMethod) {
      try {
        // Only unary functions are supported
        const result = await matchingMethod.fn(args, req, res);
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
        results: methods
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
};

export function method<serviceDefinition extends ServiceDefinition>(
  name: MethodsFor<serviceDefinition>,
  fn: MethodFn<serviceDefinition, MethodsFor<serviceDefinition>>,
  docs?: string
): MethodObj<serviceDefinition> {
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
