// This is lifted from https://github.com/bufferapp/micro-rpc-client

import fetch from "isomorphic-fetch";
import { ServiceDefinition, RequestFor, MethodsFor } from "./common";

type CredentialOptions = "include" | "omit" | "same-origin" | undefined;

type Options = { url?: string; sendCredentials?: CredentialOptions };

class RpcError extends Error {
  code?: number;
  handled?: boolean;
  status?: any;
}

type ParsedResponse = {
  status: number;
  response: any;
};

class RPCClient<serviceDefinition extends ServiceDefinition> {
  url: string;
  sendCredentials: CredentialOptions;
  constructor(_definition: serviceDefinition, options: Options = {}) {
    this.url = options.url || "http://localhost";
    this.sendCredentials = options.sendCredentials;
  }

  // listMethods() {
  //   return this.call("methods");
  // }

  async call<Method extends MethodsFor<serviceDefinition>>(
    name: Method,
    request: RequestFor<serviceDefinition, Method>
  ) {
    return fetch(`${this.url}/${name}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        args: request
      }),
      credentials: this.sendCredentials
    })
      .then(
        response =>
          new Promise<ParsedResponse>((resolve, reject) => {
            response
              .json()
              .then(parsedResponse =>
                resolve({
                  response: parsedResponse,
                  status: response.status
                })
              )
              .catch(error => reject(error));
          })
      )
      .then(({ response, status }) => {
        if (response.error) {
          const err = new RpcError(response.error);
          err.code = response.code;
          err.handled = response.handled;
          err.status = status;
          throw err;
        }
        return response;
      })
      .then(response => response.result);
  }
}

export default RPCClient;
