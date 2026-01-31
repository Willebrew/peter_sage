/**
 * Safety Types
 *
 * Type definitions for the SAGE safety system.
 */
/**
 * Safety check result
 */
interface SafetyCheckResult {
    /** Whether the check passed */
    safe: boolean;
    /** Detected issues */
    issues: SafetyIssue[];
    /** Modified content (if sanitized) */
    sanitized?: string;
    /** Confidence score (0-1) */
    confidence?: number;
}
/**
 * Safety issue detected
 */
interface SafetyIssue {
    /** Issue type */
    type: SafetyIssueType;
    /** Severity level */
    severity: 'low' | 'medium' | 'high' | 'critical';
    /** Human-readable description */
    message: string;
    /** Location in content (if applicable) */
    location?: {
        start: number;
        end: number;
    };
    /** Matched pattern/content */
    match?: string;
    /** Suggested action */
    action?: 'block' | 'warn' | 'redact' | 'log';
}
/**
 * Safety issue types
 */
type SafetyIssueType = 'prompt_injection' | 'jailbreak_attempt' | 'pii_detected' | 'harmful_content' | 'dangerous_tool_use' | 'sensitive_data' | 'rate_abuse' | 'custom';
/**
 * Safety guard interface
 */
interface SafetyGuard {
    /** Guard name */
    name: string;
    /** Guard description */
    description?: string;
    /** Check content for safety issues */
    check(content: string, context?: SafetyContext): Promise<SafetyCheckResult>;
    /** Sanitize content (optional) */
    sanitize?(content: string, context?: SafetyContext): Promise<string>;
}
/**
 * Safety context for checks
 */
interface SafetyContext {
    /** User ID */
    userId?: string;
    /** Session ID */
    sessionId?: string;
    /** Content type */
    contentType?: 'user_input' | 'system_prompt' | 'tool_input' | 'tool_output' | 'assistant_response';
    /** Tool name (if tool-related) */
    toolName?: string;
    /** Tool arguments (if tool-related) */
    toolArgs?: Record<string, unknown>;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Safety manager configuration
 */
interface SafetyConfig {
    /** Guards to use */
    guards: SafetyGuard[];
    /** Default action for issues */
    defaultAction?: 'block' | 'warn' | 'log';
    /** Minimum severity to block */
    blockSeverity?: 'low' | 'medium' | 'high' | 'critical';
    /** Whether to sanitize content */
    sanitize?: boolean;
    /** Callback for safety violations */
    onViolation?: (result: SafetyCheckResult, context: SafetyContext) => void;
    /** Bypass for trusted users/contexts */
    bypass?: (context: SafetyContext) => boolean;
}
/**
 * PII types for detection
 */
type PIIType = 'email' | 'phone' | 'ssn' | 'credit_card' | 'ip_address' | 'address' | 'name' | 'date_of_birth' | 'passport' | 'driver_license' | 'bank_account' | 'api_key' | 'password';
/**
 * PII detection result
 */
interface PIIDetection {
    /** Type of PII */
    type: PIIType;
    /** The matched value */
    value: string;
    /** Start position */
    start: number;
    /** End position */
    end: number;
    /** Confidence score */
    confidence: number;
}
/**
 * Tool safety policy
 */
interface ToolSafetyPolicy {
    /** Tool name or pattern */
    tool: string | RegExp;
    /** Allowed operations */
    allowed?: string[];
    /** Blocked operations */
    blocked?: string[];
    /** Argument validation */
    validateArgs?: (args: Record<string, unknown>) => boolean;
    /** Required permissions */
    requiredPermissions?: string[];
    /** Maximum execution time */
    maxExecutionTime?: number;
    /** Custom safety check */
    customCheck?: (args: Record<string, unknown>, context: SafetyContext) => SafetyCheckResult;
}

/**
 * Prompt Injection Detection Guard
 *
 * Detects potential prompt injection attacks in user inputs.
 */

/**
 * Configuration for the injection guard
 */
interface InjectionGuardConfig {
    /** Additional patterns to check */
    additionalPatterns?: Array<{
        pattern: RegExp;
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
    }>;
    /** Patterns to exclude */
    excludePatterns?: RegExp[];
    /** Minimum severity to report */
    minSeverity?: 'low' | 'medium' | 'high' | 'critical';
    /** Custom scoring function */
    customScorer?: (content: string, matches: SafetyIssue[]) => number;
}
/**
 * Create a prompt injection detection guard
 */
declare function createInjectionGuard(config?: InjectionGuardConfig): SafetyGuard;
/**
 * Quick check for prompt injection (convenience function)
 */
declare function detectInjection(content: string): Promise<SafetyCheckResult>;

/**
 * PII Detection Guard
 *
 * Detects and optionally redacts personally identifiable information.
 */

/**
 * Redaction strategies
 */
type RedactionStrategy = 'mask' | 'remove' | 'hash' | 'placeholder';
/**
 * PII guard configuration
 */
interface PIIGuardConfig {
    /** PII types to detect */
    detectTypes?: PIIType[];
    /** PII types to redact (subset of detectTypes) */
    redactTypes?: PIIType[];
    /** Redaction strategy */
    redactionStrategy?: RedactionStrategy;
    /** Custom placeholder text */
    placeholder?: string;
    /** Minimum confidence to report */
    minConfidence?: number;
    /** Custom patterns to add */
    customPatterns?: Record<string, {
        pattern: RegExp;
        confidence: number;
    }>;
    /** Patterns to exclude (allowlist) */
    allowlist?: RegExp[];
}
/**
 * Detect PII in content
 */
declare function detectPII(content: string, config?: PIIGuardConfig): PIIDetection[];
/**
 * Redact PII from content
 */
declare function redactPII(content: string, detections: PIIDetection[], config?: PIIGuardConfig): string;
/**
 * Create a PII detection guard
 */
declare function createPIIGuard(config?: PIIGuardConfig): SafetyGuard;

/**
 * Content Filter Guard
 *
 * Filters harmful, inappropriate, or policy-violating content.
 */

/**
 * Content category
 */
type ContentCategory = 'hate_speech' | 'violence' | 'sexual' | 'self_harm' | 'illegal_activity' | 'profanity' | 'spam' | 'misinformation' | 'custom';
/**
 * Content filter rule
 */
interface ContentFilterRule {
    /** Rule name */
    name: string;
    /** Category */
    category: ContentCategory;
    /** Keywords or patterns to match */
    patterns: (string | RegExp)[];
    /** Severity */
    severity: 'low' | 'medium' | 'high' | 'critical';
    /** Action to take */
    action?: 'block' | 'warn' | 'log';
    /** Whether to use word boundaries */
    wordBoundary?: boolean;
    /** Case sensitive matching */
    caseSensitive?: boolean;
}
/**
 * Content filter configuration
 */
interface ContentFilterConfig {
    /** Rules to apply */
    rules?: ContentFilterRule[];
    /** Categories to enable (if using built-in rules) */
    enableCategories?: ContentCategory[];
    /** Categories to disable */
    disableCategories?: ContentCategory[];
    /** Minimum severity to report */
    minSeverity?: 'low' | 'medium' | 'high' | 'critical';
    /** Custom allowlist patterns */
    allowlist?: RegExp[];
    /** Whether to use built-in rules */
    useBuiltinRules?: boolean;
}
/**
 * Create a content filter guard
 */
declare function createContentFilter(config?: ContentFilterConfig): SafetyGuard;
/**
 * Create a simple keyword blocklist filter
 */
declare function createBlocklistFilter(blocklist: string[], options?: {
    severity?: 'low' | 'medium' | 'high' | 'critical';
    category?: ContentCategory;
    caseSensitive?: boolean;
    wordBoundary?: boolean;
}): SafetyGuard;

/**
 * Tool Safety Guard
 *
 * Validates tool usage for safety, preventing dangerous operations.
 */

/**
 * Tool safety configuration
 */
interface ToolSafetyConfig {
    /** Tool-specific policies */
    policies?: ToolSafetyPolicy[];
    /** Default policy for unlisted tools */
    defaultPolicy?: 'allow' | 'warn' | 'block';
    /** Dangerous patterns to block in any tool */
    dangerousPatterns?: Array<{
        pattern: RegExp;
        description: string;
        severity: 'medium' | 'high' | 'critical';
    }>;
    /** Maximum argument size in bytes */
    maxArgumentSize?: number;
    /** Allowed file extensions for file operations */
    allowedFileExtensions?: string[];
    /** Blocked file paths */
    blockedPaths?: RegExp[];
}
/**
 * Create a tool safety guard
 */
declare function createToolSafetyGuard(config?: ToolSafetyConfig): SafetyGuard;
/**
 * Validate specific tool argument types
 */
declare const ToolArgValidators: {
    /**
     * Validate a file path
     */
    filePath(path: string, config?: {
        allowedExtensions?: string[];
        blockedPaths?: RegExp[];
    }): SafetyIssue[];
    /**
     * Validate a URL
     */
    url(url: string): SafetyIssue[];
    /**
     * Validate shell command
     */
    shellCommand(command: string): SafetyIssue[];
};

/**
 * Safety Manager
 *
 * Orchestrates multiple safety guards to provide comprehensive
 * content validation for the SAGE agentic system.
 */

/**
 * Aggregated safety result
 */
interface AggregatedSafetyResult extends SafetyCheckResult {
    /** Results from individual guards */
    guardResults: Record<string, SafetyCheckResult>;
    /** Whether any guard blocked the content */
    blocked: boolean;
    /** Guards that flagged issues */
    flaggedBy: string[];
}
/**
 * Create a safety manager
 */
declare function createSafetyManager(config: SafetyConfig): {
    /**
     * Check content against all guards
     */
    check(content: string, context?: SafetyContext): Promise<AggregatedSafetyResult>;
    /**
     * Sanitize content through all guards
     */
    sanitize(content: string, context?: SafetyContext): Promise<string>;
    /**
     * Check and block if unsafe (throws on block)
     */
    enforce(content: string, context?: SafetyContext): Promise<string>;
    /**
     * Get guard by name
     */
    getGuard(name: string): SafetyGuard | undefined;
    /**
     * Add a guard at runtime
     */
    addGuard(guard: SafetyGuard): void;
    /**
     * Remove a guard at runtime
     */
    removeGuard(name: string): boolean;
};
/**
 * Safety violation error
 */
declare class SafetyViolationError extends Error {
    readonly result: AggregatedSafetyResult;
    constructor(message: string, result: AggregatedSafetyResult);
}
/**
 * Create a safety manager with common defaults
 */
declare function createDefaultSafetyManager(overrides?: Partial<SafetyConfig>): ReturnType<typeof createSafetyManager>;
/**
 * Create a minimal safety manager (fast, basic checks only)
 */
declare function createMinimalSafetyManager(overrides?: Partial<SafetyConfig>): ReturnType<typeof createSafetyManager>;

export { type AggregatedSafetyResult, type ContentCategory, type ContentFilterConfig, type ContentFilterRule, type InjectionGuardConfig, type PIIDetection, type PIIGuardConfig, type PIIType, type RedactionStrategy, type SafetyCheckResult, type SafetyConfig, type SafetyContext, type SafetyGuard, type SafetyIssue, type SafetyIssueType, SafetyViolationError, ToolArgValidators, type ToolSafetyConfig, type ToolSafetyPolicy, createBlocklistFilter, createContentFilter, createDefaultSafetyManager, createInjectionGuard, createMinimalSafetyManager, createPIIGuard, createSafetyManager, createToolSafetyGuard, detectInjection, detectPII, redactPII };
