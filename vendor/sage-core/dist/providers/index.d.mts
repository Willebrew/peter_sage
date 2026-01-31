import { M as Message } from '../types-CJxL2WlO.mjs';
import { A as APITool } from '../types-BpZ5RLfX.mjs';
import 'zod';
import '../utils/index.mjs';

/**
 * Provider Types
 */

/**
 * Provider configuration
 */
interface ProviderConfig {
    /** API key for the provider */
    apiKey: string;
    /** Base URL for the API (optional, defaults based on provider) */
    baseUrl?: string;
    /** Model to use */
    model: string;
    /** Temperature (0-2) */
    temperature?: number;
    /** Max tokens for response */
    maxTokens?: number;
    /** Enable reasoning effort for supported models */
    enableReasoningEffort?: boolean;
    /** Reasoning effort level */
    reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high';
}
/**
 * LLM Provider interface
 */
interface Provider {
    /** Provider name */
    name: string;
    /**
     * Create a streaming response
     * @returns ReadableStream of SSE events
     */
    stream(messages: Message[], tools: APITool[], config: ProviderConfig): Promise<ReadableStream<Uint8Array>>;
    /**
     * Create a non-streaming response
     */
    complete(messages: Message[], tools: APITool[], config: ProviderConfig): Promise<ProviderResponse>;
}
/**
 * Provider response (non-streaming)
 */
interface ProviderResponse {
    content: string;
    reasoning?: string;
    toolCalls: ProviderToolCall[];
    usage: {
        inputTokens: number;
        outputTokens: number;
    };
    finishReason: 'stop' | 'tool_calls' | 'length' | 'error';
}
/**
 * Tool call from provider
 */
interface ProviderToolCall {
    id: string;
    name: string;
    arguments: string;
}
/**
 * SSE event types from Responses API
 */
type ResponsesAPIEventType = 'response.created' | 'response.output_item.added' | 'response.output_text.delta' | 'response.reasoning.delta' | 'response.reasoning_summary_text.delta' | 'response.function_call_arguments.delta' | 'response.function_call_arguments.done' | 'response.content_part.added' | 'response.completed';
/**
 * Responses API message format
 */
interface ResponsesAPIMessage {
    role: 'user' | 'assistant';
    content: string | ResponsesAPIContentPart[];
}
/**
 * Responses API content part
 */
interface ResponsesAPIContentPart {
    type: 'input_text' | 'input_image' | 'input_file' | 'output_text';
    text?: string;
    image_url?: string;
    file_url?: string;
}
/**
 * Responses API function call item
 */
interface ResponsesAPIFunctionCall {
    type: 'function_call';
    call_id: string;
    name: string;
    arguments: string;
}
/**
 * Responses API function call output
 */
interface ResponsesAPIFunctionCallOutput {
    type: 'function_call_output';
    call_id: string;
    output: string;
}
/**
 * Responses API input item (union)
 */
type ResponsesAPIInputItem = ResponsesAPIMessage | ResponsesAPIFunctionCall | ResponsesAPIFunctionCallOutput;

/**
 * Provider Configuration
 *
 * Loads provider configuration from environment variables.
 * Extracted from Stratus server-config.ts.
 */

/**
 * Load provider configuration from environment variables
 */
declare function loadProviderConfig(overrides?: Partial<ProviderConfig>): ProviderConfig;
/**
 * Validate provider configuration
 */
declare function validateProviderConfig(config: ProviderConfig): void;
/**
 * Get the default API base URL for common providers
 */
declare function getDefaultBaseUrl(provider: string): string;
/**
 * Detect provider from API key prefix or base URL
 */
declare function detectProvider(config: ProviderConfig): string;

/**
 * Responses API Provider
 *
 * Adapter for OpenAI's Responses API format.
 * This is the unified interface for all providers.
 */

/**
 * Create a Responses API provider
 */
declare function createResponsesAPIProvider(): Provider;
/**
 * Default provider instance
 */
declare const responsesAPIProvider: Provider;

export { type Provider, type ProviderConfig, type ProviderResponse, type ProviderToolCall, type ResponsesAPIContentPart, type ResponsesAPIEventType, type ResponsesAPIFunctionCall, type ResponsesAPIFunctionCallOutput, type ResponsesAPIInputItem, type ResponsesAPIMessage, createResponsesAPIProvider, detectProvider, getDefaultBaseUrl, loadProviderConfig, responsesAPIProvider, validateProviderConfig };
