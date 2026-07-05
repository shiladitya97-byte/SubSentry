// Ambient declaration for MCP tool files that run in Deno/Node at build/runtime.
declare const process: { env: Record<string, string | undefined> };
