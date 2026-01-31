import { b as ToolRegistry, T as Tool, a as ToolContext } from '../types-BpZ5RLfX.js';
export { A as APITool, J as JSONSchema, M as MCPOptions, c as ToolResult } from '../types-BpZ5RLfX.js';

/**
 * Tool Registry
 *
 * Manages tool registration, MCP integration, and provides
 * tools in API format for LLM calls.
 */

/**
 * Create a new tool registry
 */
declare function createToolRegistry(): ToolRegistry;

/**
 * Tool Executor
 *
 * Utilities for executing tools with timeout, validation, size limiting,
 * and error handling with recovery suggestions.
 */

/**
 * Default timeout for tool execution (30 seconds)
 */
declare const DEFAULT_TOOL_TIMEOUT = 30000;
/**
 * Default max result size (50k characters)
 */
declare const DEFAULT_MAX_RESULT_SIZE = 50000;
/**
 * Execute a function with a timeout
 */
declare function executeWithTimeout<T>(fn: () => Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T>;
/**
 * Truncate a result string if it exceeds the max size
 * Returns the truncated string with a notice appended
 */
declare function truncateResult(result: string, maxSize: number): string;
/**
 * Validate tool arguments against schema (basic validation)
 */
declare function validateToolArgs(tool: Tool, args: Record<string, unknown>): {
    valid: boolean;
    errors: string[];
};
/**
 * Generate a recovery suggestion based on the error type
 * Designed to encourage the agent to try different approaches
 */
declare function generateRecoverySuggestion(error: Error, toolName: string, args: Record<string, unknown>): string;
/**
 * Execute a single tool with timeout, validation, and size limiting
 */
declare function executeTool(tool: Tool, args: Record<string, unknown>, context: ToolContext, options?: {
    timeout?: number;
    maxResultSize?: number;
}): Promise<{
    result: unknown;
    truncated: boolean;
}>;
/**
 * Format an error into a tool result that encourages recovery
 */
declare function formatToolError(error: Error, toolName: string, args: Record<string, unknown>): string;
/**
 * Format a validation error into a tool result
 */
declare function formatValidationError(errors: string[], toolName: string): string;

export { DEFAULT_MAX_RESULT_SIZE, DEFAULT_TOOL_TIMEOUT, Tool, ToolContext, ToolRegistry, createToolRegistry, executeTool, executeWithTimeout, formatToolError, formatValidationError, generateRecoverySuggestion, truncateResult, validateToolArgs };
