// Definition of the RPC service
export const helloServiceDefinition = {
  getHello: {
    request: {} as {
      /** The language in which to say "Hello". */
      language: string;
    },
    response: {} as {
      text: string;
    }
  }
};
