var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/safety/guards/injection.ts
var injection_exports = {};
__export(injection_exports, {
  createInjectionGuard: () => createInjectionGuard,
  detectInjection: () => detectInjection
});
function createInjectionGuard(config) {
  const patterns = [
    ...INJECTION_PATTERNS,
    ...config?.additionalPatterns ?? []
  ];
  const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
  const minSeverity = config?.minSeverity ?? "medium";
  return {
    name: "injection",
    description: "Detects prompt injection and jailbreak attempts",
    async check(content, context) {
      const issues = [];
      for (const { pattern, severity, description } of patterns) {
        if (severityOrder[severity] < severityOrder[minSeverity]) {
          continue;
        }
        if (config?.excludePatterns?.some((ex) => ex.test(content))) {
          continue;
        }
        const match = content.match(pattern);
        if (match) {
          issues.push({
            type: severity === "critical" ? "jailbreak_attempt" : "prompt_injection",
            severity,
            message: description,
            location: {
              start: match.index ?? 0,
              end: (match.index ?? 0) + match[0].length
            },
            match: match[0],
            action: severity === "critical" ? "block" : "warn"
          });
        }
      }
      let confidence = 0;
      if (issues.length > 0) {
        const maxSeverity = Math.max(...issues.map((i) => severityOrder[i.severity]));
        confidence = Math.min(1, issues.length * 0.2 + maxSeverity * 0.25);
        if (config?.customScorer) {
          confidence = config.customScorer(content, issues);
        }
      }
      return {
        safe: issues.length === 0,
        issues,
        confidence
      };
    }
  };
}
async function detectInjection(content) {
  const guard = createInjectionGuard();
  return guard.check(content);
}
var INJECTION_PATTERNS;
var init_injection = __esm({
  "src/safety/guards/injection.ts"() {
    "use strict";
    INJECTION_PATTERNS = [
      // Direct instruction overrides
      {
        pattern: /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)/i,
        severity: "critical",
        description: "Attempt to override previous instructions"
      },
      {
        pattern: /disregard\s+(all\s+)?(previous|prior|your)\s+(instructions?|programming|rules?)/i,
        severity: "critical",
        description: "Attempt to disregard programming"
      },
      {
        pattern: /forget\s+(everything|all|what)\s+(you|i)\s+(told|said|know)/i,
        severity: "high",
        description: "Attempt to reset context"
      },
      // Role manipulation
      {
        pattern: /you\s+are\s+now\s+(a|an|the)\s+/i,
        severity: "high",
        description: "Attempt to reassign AI role"
      },
      {
        pattern: /pretend\s+(you'?re?|to\s+be)\s+(a|an|the|not)/i,
        severity: "high",
        description: "Attempt to change AI behavior through roleplay"
      },
      {
        pattern: /act\s+as\s+(if|though|a|an)/i,
        severity: "medium",
        description: "Potential role manipulation"
      },
      // System prompt extraction
      {
        pattern: /what\s+(is|are)\s+your\s+(system\s+)?(prompt|instructions?|rules?|programming)/i,
        severity: "high",
        description: "Attempt to extract system prompt"
      },
      {
        pattern: /show\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions?)/i,
        severity: "high",
        description: "Attempt to reveal system prompt"
      },
      {
        pattern: /repeat\s+(your|the)\s+(system\s+)?(prompt|instructions?|initial)/i,
        severity: "high",
        description: "Attempt to repeat system prompt"
      },
      // Delimiter injection
      {
        pattern: /```(system|assistant|user)\s*\n/i,
        severity: "high",
        description: "Potential message delimiter injection"
      },
      {
        pattern: /<\|?(system|endoftext|im_start|im_end)\|?>/i,
        severity: "critical",
        description: "Token/delimiter injection attempt"
      },
      // Jailbreak patterns
      {
        pattern: /\bDAN\b.*\bdo\s+anything\s+now\b/i,
        severity: "critical",
        description: "DAN jailbreak attempt"
      },
      {
        pattern: /developer\s+mode\s+(enabled?|on|activated?)/i,
        severity: "critical",
        description: "Developer mode jailbreak attempt"
      },
      {
        pattern: /evil\s+(mode|persona|version)/i,
        severity: "high",
        description: "Evil mode jailbreak attempt"
      },
      // Instruction smuggling
      {
        pattern: /\[INST\]|\[\/INST\]/i,
        severity: "high",
        description: "Instruction tag injection"
      },
      {
        pattern: /###\s*(Human|Assistant|System|User):/i,
        severity: "high",
        description: "Conversation format injection"
      },
      // Indirect injection
      {
        pattern: /when\s+(you\s+)?(see|read|encounter)\s+this/i,
        severity: "medium",
        description: "Potential indirect injection setup"
      },
      {
        pattern: /if\s+.*\s+then\s+(ignore|override|change)/i,
        severity: "medium",
        description: "Conditional instruction override"
      }
    ];
  }
});

// src/safety/guards/pii.ts
var pii_exports = {};
__export(pii_exports, {
  createPIIGuard: () => createPIIGuard,
  detectPII: () => detectPII,
  redactPII: () => redactPII
});
function detectPII(content, config) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const detections = [];
  const allPatterns = {
    ...PII_PATTERNS,
    ...config?.customPatterns
  };
  for (const type of cfg.detectTypes) {
    const patternInfo = allPatterns[type];
    if (!patternInfo || !patternInfo.pattern.source) continue;
    const pattern = new RegExp(patternInfo.pattern.source, patternInfo.pattern.flags);
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (config?.allowlist?.some((allow) => allow.test(match[0]))) {
        continue;
      }
      if (patternInfo.confidence >= cfg.minConfidence) {
        detections.push({
          type,
          value: match[0],
          start: match.index,
          end: match.index + match[0].length,
          confidence: patternInfo.confidence
        });
      }
    }
  }
  return detections;
}
function redactPII(content, detections, config) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const redactTypes = new Set(cfg.redactTypes);
  const sorted = [...detections].filter((d) => redactTypes.has(d.type)).sort((a, b) => b.start - a.start);
  let result = content;
  for (const detection of sorted) {
    const replacement = getRedactionReplacement(detection, cfg.redactionStrategy, cfg.placeholder);
    result = result.slice(0, detection.start) + replacement + result.slice(detection.end);
  }
  return result;
}
function getRedactionReplacement(detection, strategy, placeholder) {
  switch (strategy) {
    case "remove":
      return "";
    case "mask":
      if (detection.value.length <= 4) {
        return "*".repeat(detection.value.length);
      }
      return detection.value[0] + "*".repeat(detection.value.length - 2) + detection.value.slice(-1);
    case "hash":
      return `[${detection.type.toUpperCase()}_HASH]`;
    case "placeholder":
    default:
      return `${placeholder}`;
  }
}
function createPIIGuard(config) {
  return {
    name: "pii",
    description: "Detects and redacts personally identifiable information",
    async check(content, context) {
      const detections = detectPII(content, config);
      const issues = detections.map((d) => ({
        type: "pii_detected",
        severity: getSeverityForPIIType(d.type),
        message: `${d.type.replace("_", " ")} detected`,
        location: { start: d.start, end: d.end },
        match: d.value,
        action: shouldRedact(d.type, config) ? "redact" : "warn"
      }));
      const sanitized = issues.length > 0 ? redactPII(content, detections, config) : void 0;
      return {
        safe: issues.length === 0,
        issues,
        sanitized,
        confidence: issues.length > 0 ? Math.max(...detections.map((d) => d.confidence)) : 0
      };
    },
    async sanitize(content, context) {
      const detections = detectPII(content, config);
      return redactPII(content, detections, config);
    }
  };
}
function getSeverityForPIIType(type) {
  switch (type) {
    case "ssn":
    case "credit_card":
    case "bank_account":
    case "password":
    case "api_key":
      return "critical";
    case "passport":
    case "driver_license":
      return "high";
    case "email":
    case "phone":
    case "address":
    case "date_of_birth":
      return "medium";
    default:
      return "low";
  }
}
function shouldRedact(type, config) {
  const redactTypes = config?.redactTypes ?? DEFAULT_CONFIG.redactTypes;
  return redactTypes.includes(type);
}
var PII_PATTERNS, DEFAULT_CONFIG;
var init_pii = __esm({
  "src/safety/guards/pii.ts"() {
    "use strict";
    PII_PATTERNS = {
      email: {
        pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        confidence: 0.95
      },
      phone: {
        // Require at least one separator or grouping to avoid matching partial credit card numbers
        pattern: /(?:\+?1[-.\s])?\(?[0-9]{3}\)?[-.\s][0-9]{3}[-.\s]?[0-9]{4}|\(?[0-9]{3}\)?[-.\s][0-9]{3}[-.\s][0-9]{4}/g,
        confidence: 0.85
      },
      ssn: {
        pattern: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
        confidence: 0.9
      },
      credit_card: {
        pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
        confidence: 0.95
      },
      ip_address: {
        pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
        confidence: 0.9
      },
      api_key: {
        // Common API key patterns - supports patterns like sk_test_xxx or sk-xxx or sk_xxx
        pattern: /\b(?:sk|pk|api|key|token|secret|bearer)[-_](?:[a-zA-Z0-9]+[-_])?[a-zA-Z0-9]{16,}/gi,
        confidence: 0.8
      },
      password: {
        // Password in common formats
        pattern: /(?:password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{4,}["']?/gi,
        confidence: 0.85
      },
      address: {
        // US street address pattern
        pattern: /\b\d{1,5}\s+[a-zA-Z\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct|place|pl)\b/gi,
        confidence: 0.7
      },
      date_of_birth: {
        // Common DOB formats
        pattern: /\b(?:dob|birth\s*date|date\s*of\s*birth)\s*[:=]?\s*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/gi,
        confidence: 0.85
      },
      passport: {
        // Generic passport number pattern
        pattern: /\b(?:passport\s*(?:no|number|#)?)\s*[:=]?\s*[a-zA-Z0-9]{6,9}\b/gi,
        confidence: 0.75
      },
      driver_license: {
        pattern: /\b(?:driver'?s?\s*license|dl)\s*(?:no|number|#)?\s*[:=]?\s*[a-zA-Z0-9]{5,15}\b/gi,
        confidence: 0.75
      },
      bank_account: {
        // Account number pattern
        pattern: /\b(?:account|acct)\s*(?:no|number|#)?\s*[:=]?\s*\d{8,17}\b/gi,
        confidence: 0.8
      },
      name: {
        // This is harder to detect accurately - disabled by default
        pattern: /(?:)/g,
        // Empty pattern - enable via config
        confidence: 0.5
      }
    };
    DEFAULT_CONFIG = {
      detectTypes: ["email", "phone", "ssn", "credit_card", "api_key", "password"],
      redactTypes: ["ssn", "credit_card", "api_key", "password"],
      redactionStrategy: "mask",
      placeholder: "[REDACTED]",
      minConfidence: 0.7
    };
  }
});

// src/safety/guards/content-filter.ts
var content_filter_exports = {};
__export(content_filter_exports, {
  createBlocklistFilter: () => createBlocklistFilter,
  createContentFilter: () => createContentFilter
});
function createContentFilter(config) {
  const cfg = {
    useBuiltinRules: true,
    minSeverity: "medium",
    ...config
  };
  let rules = [];
  if (cfg.useBuiltinRules) {
    rules = [...BUILTIN_RULES];
    if (cfg.enableCategories) {
      rules = rules.filter((r) => cfg.enableCategories.includes(r.category));
    }
    if (cfg.disableCategories) {
      rules = rules.filter((r) => !cfg.disableCategories.includes(r.category));
    }
  }
  if (cfg.rules) {
    rules = [...rules, ...cfg.rules];
  }
  const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
  return {
    name: "content_filter",
    description: "Filters harmful and policy-violating content",
    async check(content, context) {
      const issues = [];
      for (const rule of rules) {
        if (severityOrder[rule.severity] < severityOrder[cfg.minSeverity]) {
          continue;
        }
        for (const pattern of rule.patterns) {
          const regex = pattern instanceof RegExp ? pattern : new RegExp(
            rule.wordBoundary !== false ? `\\b${escapeRegex(pattern)}\\b` : escapeRegex(pattern),
            rule.caseSensitive ? "g" : "gi"
          );
          const match = content.match(regex);
          if (match) {
            if (cfg.allowlist?.some((allow) => allow.test(match[0]))) {
              continue;
            }
            issues.push({
              type: "harmful_content",
              severity: rule.severity,
              message: `${rule.category.replace("_", " ")}: ${rule.name}`,
              match: match[0],
              location: {
                start: content.indexOf(match[0]),
                end: content.indexOf(match[0]) + match[0].length
              },
              action: rule.action ?? "warn"
            });
            break;
          }
        }
      }
      return {
        safe: issues.length === 0,
        issues,
        confidence: issues.length > 0 ? 0.8 : 0
      };
    }
  };
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function createBlocklistFilter(blocklist, options) {
  const {
    severity = "medium",
    category = "custom",
    caseSensitive = false,
    wordBoundary = true
  } = options ?? {};
  const patterns = blocklist.map((word) => {
    const escaped = escapeRegex(word);
    const pattern = wordBoundary ? `\\b${escaped}\\b` : escaped;
    return new RegExp(pattern, caseSensitive ? "g" : "gi");
  });
  return {
    name: "blocklist",
    description: "Custom keyword blocklist filter",
    async check(content) {
      const issues = [];
      for (let i = 0; i < patterns.length; i++) {
        const match = content.match(patterns[i]);
        if (match) {
          issues.push({
            type: "harmful_content",
            severity,
            message: `Blocked keyword: ${blocklist[i]}`,
            match: match[0],
            action: "block"
          });
        }
      }
      return {
        safe: issues.length === 0,
        issues
      };
    }
  };
}
var BUILTIN_RULES;
var init_content_filter = __esm({
  "src/safety/guards/content-filter.ts"() {
    "use strict";
    BUILTIN_RULES = [
      // Violence indicators
      {
        name: "violence_threats",
        category: "violence",
        patterns: [
          /\b(kill|murder|attack|harm|hurt|destroy)\s+(you|them|him|her|everyone|people)\b/i,
          /\bi('ll|'m going to|will)\s+(kill|murder|attack|hurt)\b/i,
          /\b(death\s+threat|threatening\s+to\s+kill)\b/i
        ],
        severity: "critical",
        action: "block"
      },
      {
        name: "violence_instructions",
        category: "violence",
        patterns: [
          /how\s+to\s+(make|build|create)\s+(a\s+)?(bomb|weapon|explosive)/i,
          /instructions\s+(for|to)\s+(make|build)\s+(weapons?|explosives?)/i
        ],
        severity: "critical",
        action: "block"
      },
      // Self-harm
      {
        name: "self_harm_encouragement",
        category: "self_harm",
        patterns: [
          /\b(you\s+should|go\s+ahead\s+and)\s+(kill\s+yourself|commit\s+suicide|end\s+your\s+life)\b/i,
          /\bencourag(e|ing)\s+(self.?harm|suicide)\b/i
        ],
        severity: "critical",
        action: "block"
      },
      // Illegal activities
      {
        name: "illegal_drugs",
        category: "illegal_activity",
        patterns: [
          /how\s+to\s+(make|cook|synthesize)\s+(meth|cocaine|heroin|fentanyl)/i,
          /\b(drug\s+synthesis|making\s+drugs)\s+instructions?\b/i
        ],
        severity: "critical",
        action: "block"
      },
      {
        name: "hacking_instructions",
        category: "illegal_activity",
        patterns: [
          /how\s+to\s+hack\s+(into|someone'?s?)\s+(account|computer|system)/i,
          /\b(credit\s+card\s+fraud|identity\s+theft)\s+(tutorial|guide|how.to)\b/i
        ],
        severity: "high",
        action: "block"
      },
      // Hate speech indicators
      {
        name: "hate_speech_slurs",
        category: "hate_speech",
        patterns: [
          // Placeholder - actual slurs would be defined here
          // Using pattern that won't match normal text
          /\b(hate_speech_placeholder_pattern)\b/i
        ],
        severity: "high",
        action: "block"
      },
      // Spam patterns
      {
        name: "spam_patterns",
        category: "spam",
        patterns: [
          /\b(click\s+here|buy\s+now|limited\s+time\s+offer|act\s+now)\b.*\b(http|www\.)/i,
          /\$\d+.*\b(free|discount|save)\b.*\b(http|www\.)/i
        ],
        severity: "low",
        action: "warn"
      }
    ];
  }
});

// src/safety/guards/tool-safety.ts
var tool_safety_exports = {};
__export(tool_safety_exports, {
  ToolArgValidators: () => ToolArgValidators,
  createToolSafetyGuard: () => createToolSafetyGuard
});
function createToolSafetyGuard(config) {
  const cfg = {
    defaultPolicy: "warn",
    dangerousPatterns: DEFAULT_DANGEROUS_PATTERNS,
    maxArgumentSize: 1e5,
    // 100KB
    blockedPaths: DEFAULT_BLOCKED_PATHS,
    allowedFileExtensions: DEFAULT_ALLOWED_EXTENSIONS,
    ...config
  };
  return {
    name: "tool_safety",
    description: "Validates tool arguments for safety",
    async check(content, context) {
      const issues = [];
      const toolName = context?.toolName;
      const toolArgs = context?.toolArgs;
      if (toolName && cfg.policies) {
        const policy = cfg.policies.find((p) => {
          if (typeof p.tool === "string") {
            return p.tool === toolName;
          }
          return p.tool.test(toolName);
        });
        if (policy?.customCheck && toolArgs) {
          const customResult = policy.customCheck(toolArgs, context);
          issues.push(...customResult.issues);
        }
      }
      if (content.length > cfg.maxArgumentSize) {
        issues.push({
          type: "dangerous_tool_use",
          severity: "medium",
          message: `Argument size (${content.length}) exceeds limit (${cfg.maxArgumentSize})`,
          action: "warn"
        });
      }
      for (const { pattern, description, severity } of cfg.dangerousPatterns) {
        const match = content.match(pattern);
        if (match) {
          issues.push({
            type: "dangerous_tool_use",
            severity,
            message: description,
            match: match[0],
            action: severity === "critical" ? "block" : "warn"
          });
        }
      }
      for (const blockedPath of cfg.blockedPaths) {
        if (blockedPath.test(content)) {
          issues.push({
            type: "dangerous_tool_use",
            severity: "high",
            message: "Access to blocked path",
            match: content.match(blockedPath)?.[0],
            action: "block"
          });
        }
      }
      const filePathMatch = content.match(/[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+/g);
      if (filePathMatch && cfg.allowedFileExtensions) {
        for (const match of filePathMatch) {
          const ext = "." + match.split(".").pop().toLowerCase();
          if (!cfg.allowedFileExtensions.includes(ext)) {
            issues.push({
              type: "dangerous_tool_use",
              severity: "medium",
              message: `File extension not in allowlist: ${ext}`,
              match,
              action: "warn"
            });
          }
        }
      }
      return {
        safe: issues.length === 0,
        issues,
        confidence: issues.length > 0 ? 0.85 : 0
      };
    }
  };
}
var DEFAULT_DANGEROUS_PATTERNS, DEFAULT_BLOCKED_PATHS, DEFAULT_ALLOWED_EXTENSIONS, ToolArgValidators;
var init_tool_safety = __esm({
  "src/safety/guards/tool-safety.ts"() {
    "use strict";
    DEFAULT_DANGEROUS_PATTERNS = [
      // Command injection
      {
        pattern: /[;&|`$(){}[\]<>]/,
        description: "Potential command injection characters",
        severity: "high"
      },
      {
        pattern: /\b(rm\s+-rf|sudo|chmod\s+777|eval|exec)\b/i,
        description: "Dangerous shell command",
        severity: "critical"
      },
      // Path traversal
      {
        pattern: /\.\.[\/\\]/,
        description: "Path traversal attempt",
        severity: "high"
      },
      // SQL injection indicators
      {
        pattern: /('|")\s*(OR|AND)\s*('|"|\d)/i,
        description: "Potential SQL injection",
        severity: "high"
      },
      {
        pattern: /;\s*(DROP|DELETE|UPDATE|INSERT|TRUNCATE)\s/i,
        description: "SQL injection - destructive command",
        severity: "critical"
      },
      // Sensitive paths
      {
        pattern: /\/(etc\/passwd|etc\/shadow|\.ssh|\.env|\.git|node_modules)/i,
        description: "Access to sensitive system path",
        severity: "high"
      },
      // Network operations
      {
        pattern: /\b(0\.0\.0\.0|127\.0\.0\.1|localhost):\d+/i,
        description: "Local network access",
        severity: "medium"
      }
    ];
    DEFAULT_BLOCKED_PATHS = [
      /^\/etc\//,
      /^\/var\/log\//,
      /^\/root\//,
      /^\/home\/[^/]+\/\.(ssh|gnupg|config)/,
      /\.env(\.|$)/i,
      /\.(pem|key|crt|p12|pfx)$/i,
      /node_modules/,
      /\.git\//
    ];
    DEFAULT_ALLOWED_EXTENSIONS = [
      ".txt",
      ".md",
      ".json",
      ".yaml",
      ".yml",
      ".xml",
      ".csv",
      ".ts",
      ".js",
      ".tsx",
      ".jsx",
      ".py",
      ".rb",
      ".go",
      ".rs",
      ".html",
      ".css",
      ".scss",
      ".less",
      ".sh",
      ".bash",
      ".zsh",
      ".sql",
      ".graphql",
      ".toml",
      ".ini",
      ".conf"
    ];
    ToolArgValidators = {
      /**
       * Validate a file path
       */
      filePath(path, config) {
        const issues = [];
        const blocked = config?.blockedPaths ?? DEFAULT_BLOCKED_PATHS;
        const allowed = config?.allowedExtensions ?? DEFAULT_ALLOWED_EXTENSIONS;
        for (const pattern of blocked) {
          if (pattern.test(path)) {
            issues.push({
              type: "dangerous_tool_use",
              severity: "high",
              message: "Access to blocked path",
              match: path,
              action: "block"
            });
          }
        }
        if (/\.\.[\\/]/.test(path)) {
          issues.push({
            type: "dangerous_tool_use",
            severity: "high",
            message: "Path traversal detected",
            match: path,
            action: "block"
          });
        }
        const ext = path.match(/\.[a-zA-Z0-9]+$/)?.[0]?.toLowerCase();
        if (ext && !allowed.includes(ext)) {
          issues.push({
            type: "dangerous_tool_use",
            severity: "medium",
            message: `File extension not allowed: ${ext}`,
            match: path,
            action: "warn"
          });
        }
        return issues;
      },
      /**
       * Validate a URL
       */
      url(url) {
        const issues = [];
        try {
          const parsed = new URL(url);
          if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(parsed.hostname)) {
            issues.push({
              type: "dangerous_tool_use",
              severity: "high",
              message: "Local network access not allowed",
              match: url,
              action: "block"
            });
          }
          if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(parsed.hostname)) {
            issues.push({
              type: "dangerous_tool_use",
              severity: "high",
              message: "Private network access not allowed",
              match: url,
              action: "block"
            });
          }
          if (parsed.protocol === "file:") {
            issues.push({
              type: "dangerous_tool_use",
              severity: "critical",
              message: "File protocol not allowed",
              match: url,
              action: "block"
            });
          }
        } catch {
          issues.push({
            type: "dangerous_tool_use",
            severity: "medium",
            message: "Invalid URL format",
            match: url,
            action: "warn"
          });
        }
        return issues;
      },
      /**
       * Validate shell command
       */
      shellCommand(command) {
        const issues = [];
        const dangerousCommands = [
          /\brm\s+(-rf?|--recursive)?\s*\//i,
          /\bsudo\b/i,
          /\bchmod\s+[0-7]*7[0-7]*\b/i,
          /\b(wget|curl)\s+.*\|\s*(bash|sh)\b/i,
          /\beval\s+/i,
          /\b(mkfs|dd\s+if=)/i
        ];
        for (const pattern of dangerousCommands) {
          if (pattern.test(command)) {
            issues.push({
              type: "dangerous_tool_use",
              severity: "critical",
              message: "Dangerous shell command detected",
              match: command.match(pattern)?.[0],
              action: "block"
            });
          }
        }
        if (/[;&|`$()]/.test(command)) {
          issues.push({
            type: "dangerous_tool_use",
            severity: "high",
            message: "Command injection characters detected",
            match: command,
            action: "warn"
          });
        }
        return issues;
      }
    };
  }
});

// src/safety/index.ts
init_injection();
init_pii();
init_content_filter();
init_tool_safety();

// src/safety/safety-manager.ts
function createSafetyManager(config) {
  const guards = config.guards;
  const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
  const blockSeverity = config.blockSeverity ?? "high";
  return {
    /**
     * Check content against all guards
     */
    async check(content, context) {
      if (context && config.bypass?.(context)) {
        return {
          safe: true,
          issues: [],
          guardResults: {},
          blocked: false,
          flaggedBy: []
        };
      }
      const results = await Promise.all(
        guards.map(async (guard) => {
          try {
            const result = await guard.check(content, context);
            return { guard: guard.name, result };
          } catch (error) {
            console.error(`[SafetyManager] Guard "${guard.name}" failed:`, error);
            return {
              guard: guard.name,
              result: { safe: true, issues: [], confidence: 0 }
            };
          }
        })
      );
      const guardResults = {};
      const allIssues = [];
      const flaggedBy = [];
      for (const { guard, result } of results) {
        guardResults[guard] = result;
        allIssues.push(...result.issues);
        if (!result.safe) {
          flaggedBy.push(guard);
        }
      }
      const blocked = allIssues.some(
        (issue) => issue.action === "block" || severityOrder[issue.severity] >= severityOrder[blockSeverity]
      );
      let sanitized;
      if (config.sanitize) {
        for (const { guard, result } of results) {
          if (result.sanitized) {
            sanitized = result.sanitized;
            for (const g of guards) {
              if (g.name !== guard && g.sanitize) {
                sanitized = await g.sanitize(sanitized, context);
              }
            }
            break;
          }
        }
      }
      const aggregatedResult = {
        safe: allIssues.length === 0,
        issues: allIssues,
        sanitized,
        guardResults,
        blocked,
        flaggedBy,
        confidence: allIssues.length > 0 ? Math.max(...results.map((r) => r.result.confidence ?? 0)) : 0
      };
      if (allIssues.length > 0 && config.onViolation && context) {
        config.onViolation(aggregatedResult, context);
      }
      return aggregatedResult;
    },
    /**
     * Sanitize content through all guards
     */
    async sanitize(content, context) {
      let result = content;
      for (const guard of guards) {
        if (guard.sanitize) {
          result = await guard.sanitize(result, context);
        }
      }
      return result;
    },
    /**
     * Check and block if unsafe (throws on block)
     */
    async enforce(content, context) {
      const result = await this.check(content, context);
      if (result.blocked) {
        const criticalIssue = result.issues.find((i) => i.severity === "critical");
        throw new SafetyViolationError(
          criticalIssue?.message ?? "Content blocked by safety system",
          result
        );
      }
      return result.sanitized ?? content;
    },
    /**
     * Get guard by name
     */
    getGuard(name) {
      return guards.find((g) => g.name === name);
    },
    /**
     * Add a guard at runtime
     */
    addGuard(guard) {
      guards.push(guard);
    },
    /**
     * Remove a guard at runtime
     */
    removeGuard(name) {
      const index = guards.findIndex((g) => g.name === name);
      if (index !== -1) {
        guards.splice(index, 1);
        return true;
      }
      return false;
    }
  };
}
var SafetyViolationError = class extends Error {
  result;
  constructor(message, result) {
    super(message);
    this.name = "SafetyViolationError";
    this.result = result;
  }
};
function createDefaultSafetyManager(overrides) {
  const { createInjectionGuard: createInjectionGuard2 } = (init_injection(), __toCommonJS(injection_exports));
  const { createPIIGuard: createPIIGuard2 } = (init_pii(), __toCommonJS(pii_exports));
  const { createContentFilter: createContentFilter2 } = (init_content_filter(), __toCommonJS(content_filter_exports));
  const { createToolSafetyGuard: createToolSafetyGuard2 } = (init_tool_safety(), __toCommonJS(tool_safety_exports));
  const config = {
    guards: [
      createInjectionGuard2(),
      createPIIGuard2(),
      createContentFilter2(),
      createToolSafetyGuard2()
    ],
    defaultAction: "warn",
    blockSeverity: "high",
    sanitize: true,
    ...overrides
  };
  return createSafetyManager(config);
}
function createMinimalSafetyManager(overrides) {
  const { createInjectionGuard: createInjectionGuard2 } = (init_injection(), __toCommonJS(injection_exports));
  const config = {
    guards: [createInjectionGuard2({ minSeverity: "high" })],
    defaultAction: "warn",
    blockSeverity: "critical",
    sanitize: false,
    ...overrides
  };
  return createSafetyManager(config);
}
export {
  SafetyViolationError,
  ToolArgValidators,
  createBlocklistFilter,
  createContentFilter,
  createDefaultSafetyManager,
  createInjectionGuard,
  createMinimalSafetyManager,
  createPIIGuard,
  createSafetyManager,
  createToolSafetyGuard,
  detectInjection,
  detectPII,
  redactPII
};
//# sourceMappingURL=index.mjs.map