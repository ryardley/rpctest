declare module "@bufferapp/micro-rpc" {
  export const rpc = (a: any) => any;
  export const method = (name: string, callback: (...a: any[]) => any) => any;
}

declare module "@bufferapp/micro-rpc-client" {
  export default any;
}
