import { z } from 'zod';

/**
 * Structured Outputs Types
 *
 * Type definitions for structured output generation with JSON Schema.
 */

/**
 * JSON Schema type (subset used for structured outputs)
 * Note: 'type' is optional because compound schemas (anyOf, oneOf, etc.) don't require it
 */
interface JSONSchema {
    type?: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';
    properties?: Record<string, JSONSchema & {
        description?: string;
    }>;
    items?: JSONSchema | JSONSchema[];
    required?: string[];
    enum?: (string | number | boolean | null)[];
    const?: unknown;
    description?: string;
    default?: unknown;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
    additionalProperties?: boolean | JSONSchema;
    oneOf?: JSONSchema[];
    anyOf?: JSONSchema[];
    allOf?: JSONSchema[];
    not?: JSONSchema;
    $ref?: string;
    $defs?: Record<string, JSONSchema>;
}
/**
 * Configuration for structured output generation
 */
interface StructuredOutputConfig {
    /** Provider API key */
    apiKey: string;
    /** Provider base URL */
    baseUrl?: string;
    /** Model to use */
    model?: string;
    /** Temperature (lower = more deterministic) */
    temperature?: number;
    /** Maximum tokens for response */
    maxTokens?: number;
    /** System prompt to prepend */
    systemPrompt?: string;
    /** Retry configuration */
    retry?: {
        maxRetries?: number;
        initialDelayMs?: number;
        maxDelayMs?: number;
    };
}
/**
 * Result of structured output generation
 */
interface StructuredOutputResult<T> {
    /** The parsed, validated data */
    data: T;
    /** Raw JSON string from LLM */
    raw: string;
    /** Token usage */
    usage: {
        inputTokens: number;
        outputTokens: number;
    };
    /** Whether the response was refusal */
    refusal: boolean;
    /** Refusal message if any */
    refusalMessage?: string;
}
/**
 * Options for a single structured output request
 */
interface StructuredOutputOptions<T extends z.ZodType> {
    /** The prompt/question to answer */
    prompt: string;
    /** Zod schema for the expected output */
    schema: T;
    /** Name for the schema (used in API) */
    schemaName?: string;
    /** Description for the schema */
    schemaDescription?: string;
    /** Override config for this request */
    config?: Partial<StructuredOutputConfig>;
}
/**
 * Parsing result with validation errors
 */
interface ParseResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    issues?: Array<{
        path: (string | number)[];
        message: string;
    }>;
}

/**
 * Schema Converter
 *
 * Converts Zod schemas to JSON Schema for use with OpenAI's structured outputs.
 * Handles common Zod types and produces OpenAI-compatible JSON Schema.
 */

/**
 * Convert a Zod schema to JSON Schema
 */
declare function zodToJsonSchema(schema: z.ZodType, definitions?: Map<string, JSONSchema>): JSONSchema;
/**
 * Wrap a JSON Schema for OpenAI's structured outputs format
 */
declare function wrapForOpenAI(schema: JSONSchema, name: string, description?: string): {
    type: 'json_schema';
    json_schema: {
        name: string;
        description?: string;
        schema: JSONSchema;
        strict: true;
    };
};

/**
 * Structured Output Generator
 *
 * Generates structured outputs from LLMs using JSON Schema mode.
 * Supports both OpenAI and compatible APIs.
 */

/**
 * Generate structured output from an LLM
 *
 * @param options - Options including prompt and Zod schema
 * @param config - Provider configuration
 * @returns Parsed and validated result
 */
declare function generateStructuredOutput<T extends z.ZodType>(options: StructuredOutputOptions<T>, config: StructuredOutputConfig): Promise<StructuredOutputResult<z.infer<T>>>;
/**
 * Create a structured output generator with pre-configured settings
 */
declare function createStructuredOutputGenerator(config: StructuredOutputConfig): {
    /**
     * Generate structured output
     */
    generate<T extends z.ZodType>(options: StructuredOutputOptions<T>): Promise<StructuredOutputResult<z.infer<T>>>;
    /**
     * Simple helper for common use case
     */
    extract<T extends z.ZodType>(prompt: string, schema: T, schemaName?: string): Promise<z.infer<T>>;
};
/**
 * Generate structured output using the Responses API (for SAGE)
 * This version works with the OpenAI Responses API format
 */
declare function generateStructuredOutputResponses<T extends z.ZodType>(options: StructuredOutputOptions<T>, config: StructuredOutputConfig): Promise<StructuredOutputResult<z.infer<T>>>;

/**
 * JSON Parser with Validation
 *
 * Utilities for parsing and validating JSON against schemas.
 * Handles common edge cases like markdown code blocks and partial JSON.
 */

/**
 * Extract JSON from a string that might contain markdown code blocks
 */
declare function extractJson(input: string): string;
/**
 * Attempt to repair common JSON issues
 */
declare function repairJson(input: string): string;
/**
 * Parse JSON string with automatic extraction and repair
 */
declare function parseJson<T>(input: string): ParseResult<T>;
/**
 * Parse and validate JSON against a Zod schema
 */
declare function parseAndValidate<T extends z.ZodType>(input: string, schema: T): ParseResult<z.infer<T>>;
/**
 * Strictly parse JSON (no repair, no extraction)
 */
declare function parseJsonStrict<T>(input: string): ParseResult<T>;
/**
 * Parse JSON with a fallback default value
 */
declare function parseJsonWithDefault<T>(input: string, defaultValue: T): T;
/**
 * Check if a string is valid JSON
 */
declare function isValidJson(input: string): boolean;
/**
 * Safely stringify an object to JSON with error handling
 */
declare function safeStringify(value: unknown, indent?: number): string;

export { type JSONSchema, type ParseResult, type StructuredOutputConfig, type StructuredOutputOptions, type StructuredOutputResult, createStructuredOutputGenerator, extractJson, generateStructuredOutput, generateStructuredOutputResponses, isValidJson, parseAndValidate, parseJson, parseJsonStrict, parseJsonWithDefault, repairJson, safeStringify, wrapForOpenAI, zodToJsonSchema };
