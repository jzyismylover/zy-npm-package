declare module "mcp-server" {
  interface ToolParameters {
    type: string;
    properties: Record<
      string,
      {
        type: string;
        description: string;
      }
    >;
    required: string[];
  }

  interface Tool<T = any> {
    name: string;
    description: string;
    parameters: ToolParameters;
    handler: (params: T) => Promise<any>;
  }

  // 同名是对类实例的补充
  interface MCPServerConfig {
    name: string;
    description: string;
    version: string;
  }

  interface MCPServer {
    registerTool<T>(tool: Tool<T>): void;
    middleware(): any;
  }

  class MCPServer {
    constructor(config: MCPServerConfig);
  }

  export { MCPServer, Tool, ToolParameters, MCPServerConfig };
}
