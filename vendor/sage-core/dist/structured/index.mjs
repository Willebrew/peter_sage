// src/structured/schema-converter.ts
function zodToJsonSchema(schema, definitions) {
  const defs = definitions ?? /* @__PURE__ */ new Map();
  const result = convertZodType(schema, defs);
  if (defs.size > 0) {
    const $defs = {};
    for (const [name, def] of defs) {
      $defs[name] = def;
    }
    return { ...result, $defs };
  }
  return result;
}
function getTypeName(schema) {
  return schema._def.typeName ?? "unknown";
}
function convertZodType(schema, definitions) {
  const typeName = getTypeName(schema);
  switch (typeName) {
    case "ZodString":
      return convertZodString(schema);
    case "ZodNumber":
      return convertZodNumber(schema);
    case "ZodBoolean":
      return { type: "boolean" };
    case "ZodNull":
      return { type: "null" };
    case "ZodArray":
      return convertZodArray(schema, definitions);
    case "ZodObject":
      return convertZodObject(schema, definitions);
    case "ZodEnum":
      return convertZodEnum(schema);
    case "ZodNativeEnum":
      return convertZodNativeEnum(schema);
    case "ZodLiteral":
      return convertZodLiteral(schema);
    case "ZodUnion":
      return convertZodUnion(schema, definitions);
    case "ZodDiscriminatedUnion":
      return convertZodDiscriminatedUnion(schema, definitions);
    case "ZodOptional":
      return convertZodType(schema.unwrap(), definitions);
    case "ZodNullable":
      return convertZodNullable(schema, definitions);
    case "ZodDefault":
      return convertZodDefault(schema, definitions);
    case "ZodEffects":
      return convertZodType(schema.innerType(), definitions);
    case "ZodRecord":
      return convertZodRecord(schema, definitions);
    case "ZodTuple":
      return convertZodTuple(schema, definitions);
    case "ZodLazy":
      return convertZodType(schema.schema, definitions);
    case "ZodAny":
    case "ZodUnknown":
      return {};
    // Any valid JSON
    case "ZodNever":
      return { not: {} };
    // Never matches anything
    default:
      console.warn(`[SchemaConverter] Unknown Zod type: ${typeName}, treating as any`);
      return {};
  }
}
function convertZodString(schema) {
  const result = { type: "string" };
  const checks = schema._def.checks || [];
  for (const check of checks) {
    switch (check.kind) {
      case "min":
        result.minLength = check.value;
        break;
      case "max":
        result.maxLength = check.value;
        break;
      case "length":
        result.minLength = check.value;
        result.maxLength = check.value;
        break;
      case "email":
        result.format = "email";
        break;
      case "url":
        result.format = "uri";
        break;
      case "uuid":
        result.format = "uuid";
        break;
      case "datetime":
        result.format = "date-time";
        break;
      case "date":
        result.format = "date";
        break;
      case "time":
        result.format = "time";
        break;
      case "regex":
        if (check.regex) {
          result.pattern = check.regex.source;
        }
        break;
    }
  }
  return result;
}
function convertZodNumber(schema) {
  const checks = schema._def.checks || [];
  const isInt = checks.some((c) => c.kind === "int");
  const result = { type: isInt ? "integer" : "number" };
  for (const check of checks) {
    switch (check.kind) {
      case "min":
        result.minimum = check.value;
        break;
      case "max":
        result.maximum = check.value;
        break;
    }
  }
  return result;
}
function convertZodArray(schema, definitions) {
  return {
    type: "array",
    items: convertZodType(schema.element, definitions)
  };
}
function convertZodObject(schema, definitions) {
  const shape = schema.shape;
  const properties = {};
  const required = [];
  for (const [key, value] of Object.entries(shape)) {
    const zodValue = value;
    properties[key] = convertZodType(zodValue, definitions);
    if (zodValue.description) {
      properties[key].description = zodValue.description;
    }
    if (!isZodOptional(zodValue)) {
      required.push(key);
    }
  }
  const result = {
    type: "object",
    properties,
    additionalProperties: false
    // OpenAI structured outputs require this
  };
  if (required.length > 0) {
    result.required = required;
  }
  return result;
}
function isZodOptional(schema) {
  const typeName = getTypeName(schema);
  if (typeName === "ZodOptional") return true;
  if (typeName === "ZodDefault") return true;
  if (typeName === "ZodNullable") {
    return false;
  }
  return false;
}
function convertZodEnum(schema) {
  return {
    type: "string",
    enum: schema.options
  };
}
function convertZodNativeEnum(schema) {
  const enumObj = schema._def.values;
  if (!enumObj || !Array.isArray(enumObj)) {
    return { type: "string" };
  }
  const isStringEnum = enumObj.every((v) => typeof v === "string");
  if (isStringEnum) {
    return {
      type: "string",
      enum: enumObj
    };
  }
  return { enum: enumObj };
}
function convertZodLiteral(schema) {
  const value = schema.value;
  if (typeof value === "string") {
    return { type: "string", const: value };
  }
  if (typeof value === "number") {
    return { type: "number", const: value };
  }
  if (typeof value === "boolean") {
    return { type: "boolean", const: value };
  }
  if (value === null) {
    return { type: "null" };
  }
  return { const: value };
}
function convertZodUnion(schema, definitions) {
  const options = schema.options.map((opt) => convertZodType(opt, definitions));
  return { anyOf: options };
}
function convertZodDiscriminatedUnion(schema, definitions) {
  const def = schema._def;
  if (!def.options) {
    return {};
  }
  const options = def.options.map((opt) => convertZodType(opt, definitions));
  return { oneOf: options };
}
function convertZodNullable(schema, definitions) {
  const inner = convertZodType(schema.unwrap(), definitions);
  return { anyOf: [inner, { type: "null" }] };
}
function convertZodDefault(schema, definitions) {
  const inner = convertZodType(schema._def.innerType, definitions);
  return {
    ...inner,
    default: schema._def.defaultValue()
  };
}
function convertZodRecord(schema, definitions) {
  return {
    type: "object",
    additionalProperties: convertZodType(schema.valueSchema, definitions)
  };
}
function convertZodTuple(schema, definitions) {
  const items = schema.items.map((item) => convertZodType(item, definitions));
  return {
    type: "array",
    items: items.length === 1 ? items[0] : items
  };
}
function wrapForOpenAI(schema, name, description) {
  return {
    type: "json_schema",
    json_schema: {
      name,
      description,
      schema,
      strict: true
    }
  };
}

// src/structured/output.ts
var DEFAULT_CONFIG = {
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4o-2024-08-06",
  temperature: 0,
  maxTokens: 4096
};
async function generateStructuredOutput(options, config) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config, ...options.config };
  const jsonSchema = zodToJsonSchema(options.schema);
  const schemaName = options.schemaName ?? "response";
  const responseFormat = wrapForOpenAI(jsonSchema, schemaName, options.schemaDescription);
  const messages = [];
  if (mergedConfig.systemPrompt) {
    messages.push({
      role: "system",
      content: mergedConfig.systemPrompt
    });
  }
  messages.push({
    role: "user",
    content: options.prompt
  });
  const maxRetries = mergedConfig.retry?.maxRetries ?? 3;
  const initialDelay = mergedConfig.retry?.initialDelayMs ?? 1e3;
  const maxDelay = mergedConfig.retry?.maxDelayMs ?? 1e4;
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${mergedConfig.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${mergedConfig.apiKey}`
        },
        body: JSON.stringify({
          model: mergedConfig.model,
          messages,
          response_format: responseFormat,
          temperature: mergedConfig.temperature,
          max_tokens: mergedConfig.maxTokens
        })
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} - ${errorBody}`);
      }
      const result = await response.json();
      const choice = result.choices[0];
      if (choice.message.refusal) {
        return {
          data: void 0,
          raw: "",
          usage: {
            inputTokens: result.usage.prompt_tokens,
            outputTokens: result.usage.completion_tokens
          },
          refusal: true,
          refusalMessage: choice.message.refusal
        };
      }
      const rawContent = choice.message.content ?? "";
      let parsed;
      try {
        parsed = JSON.parse(rawContent);
      } catch (parseError) {
        throw new Error(`Failed to parse JSON response: ${parseError}`);
      }
      const validated = options.schema.parse(parsed);
      return {
        data: validated,
        raw: rawContent,
        usage: {
          inputTokens: result.usage.prompt_tokens,
          outputTokens: result.usage.completion_tokens
        },
        refusal: false
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (lastError.message.includes("Failed to parse") || lastError.message.includes("Zod")) {
        throw lastError;
      }
      if (attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError ?? new Error("Unknown error");
}
function createStructuredOutputGenerator(config) {
  return {
    /**
     * Generate structured output
     */
    generate(options) {
      return generateStructuredOutput(options, config);
    },
    /**
     * Simple helper for common use case
     */
    async extract(prompt, schema, schemaName) {
      const result = await generateStructuredOutput(
        { prompt, schema, schemaName },
        config
      );
      if (result.refusal) {
        throw new Error(`Model refused to respond: ${result.refusalMessage}`);
      }
      return result.data;
    }
  };
}
async function generateStructuredOutputResponses(options, config) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config, ...options.config };
  const jsonSchema = zodToJsonSchema(options.schema);
  const schemaName = options.schemaName ?? "response";
  const input = [
    {
      role: "user",
      content: options.prompt
    }
  ];
  const response = await fetch(`${mergedConfig.baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${mergedConfig.apiKey}`,
      "OpenAI-Beta": "responses=v1"
    },
    body: JSON.stringify({
      model: mergedConfig.model,
      instructions: mergedConfig.systemPrompt,
      input,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          description: options.schemaDescription,
          schema: jsonSchema,
          strict: true
        }
      },
      temperature: mergedConfig.temperature,
      max_output_tokens: mergedConfig.maxTokens
    })
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Responses API error: ${response.status} - ${errorBody}`);
  }
  const result = await response.json();
  const textOutput = result.output.find((o) => o.type === "message");
  const rawContent = textOutput?.content ?? "";
  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch (parseError) {
    throw new Error(`Failed to parse JSON response: ${parseError}`);
  }
  const validated = options.schema.parse(parsed);
  return {
    data: validated,
    raw: rawContent,
    usage: {
      inputTokens: result.usage.input_tokens,
      outputTokens: result.usage.output_tokens
    },
    refusal: false
  };
}

// src/structured/parser.ts
function extractJson(input) {
  const codeBlockMatch = input.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  const jsonMatch = input.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return input.trim();
}
function repairJson(input) {
  let result = input;
  result = result.replace(/,(\s*[}\]])/g, "$1");
  result = result.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
  result = result.replace(/'/g, '"');
  result = result.replace(/\/\/.*$/gm, "");
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  return result;
}
function parseJson(input) {
  let jsonStr = extractJson(input);
  try {
    const data = JSON.parse(jsonStr);
    return { success: true, data };
  } catch {
  }
  try {
    jsonStr = repairJson(jsonStr);
    const data = JSON.parse(jsonStr);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse JSON"
    };
  }
}
function parseAndValidate(input, schema) {
  const parseResult = parseJson(input);
  if (!parseResult.success) {
    return parseResult;
  }
  const validationResult = schema.safeParse(parseResult.data);
  if (validationResult.success) {
    return {
      success: true,
      data: validationResult.data
    };
  }
  const issues = validationResult.error.issues.map((issue) => ({
    path: issue.path,
    message: issue.message
  }));
  return {
    success: false,
    error: `Validation failed: ${issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    issues
  };
}
function parseJsonStrict(input) {
  try {
    const data = JSON.parse(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse JSON"
    };
  }
}
function parseJsonWithDefault(input, defaultValue) {
  const result = parseJson(input);
  return result.success ? result.data : defaultValue;
}
function isValidJson(input) {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}
function safeStringify(value, indent) {
  try {
    return JSON.stringify(value, null, indent);
  } catch (error) {
    const seen = /* @__PURE__ */ new WeakSet();
    return JSON.stringify(value, (_, val) => {
      if (typeof val === "object" && val !== null) {
        if (seen.has(val)) {
          return "[Circular]";
        }
        seen.add(val);
      }
      return val;
    }, indent);
  }
}
export {
  createStructuredOutputGenerator,
  extractJson,
  generateStructuredOutput,
  generateStructuredOutputResponses,
  isValidJson,
  parseAndValidate,
  parseJson,
  parseJsonStrict,
  parseJsonWithDefault,
  repairJson,
  safeStringify,
  wrapForOpenAI,
  zodToJsonSchema
};
//# sourceMappingURL=index.mjs.map