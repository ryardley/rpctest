import type { NextApiRequest, NextApiResponse } from "next";

export type MethodFn<
  serviceDefinition extends ServiceDefinition,
  Method extends MethodsFor<serviceDefinition>
> = (
  request: RequestFor<serviceDefinition, Method>,
  req?: NextApiRequest,
  res?: NextApiResponse
) => ResponseFor<serviceDefinition, Method>;

export type MethodObj<serviceDefinition extends ServiceDefinition> = {
  name: MethodsFor<serviceDefinition> | "methods";
  fn: MethodFn<serviceDefinition, MethodsFor<serviceDefinition>>;
  docs?: string;
};

export type ServiceDefinition = {
  [method: string]: { request: any; response: any; type?: any };
};

export type MethodsFor<serviceDefinition extends ServiceDefinition> = Extract<
  keyof serviceDefinition,
  string
>;

export type RequestFor<
  serviceDefinition extends ServiceDefinition,
  method extends MethodsFor<serviceDefinition>
> = serviceDefinition[method]["request"];

export type ResponseFor<
  serviceDefinition extends ServiceDefinition,
  method extends MethodsFor<serviceDefinition>
> = serviceDefinition[method]["response"];
