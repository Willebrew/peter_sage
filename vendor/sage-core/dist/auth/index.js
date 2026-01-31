"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/auth/index.ts
var auth_exports = {};
__export(auth_exports, {
  AUTH_ENV_VARS: () => AUTH_ENV_VARS,
  AuthorizationError: () => AuthorizationError,
  InMemoryAPIKeyStore: () => InMemoryAPIKeyStore,
  InMemoryRateLimitStore: () => InMemoryRateLimitStore,
  Permissions: () => Permissions,
  RateLimitPresets: () => RateLimitPresets,
  createAPIKeyAuth: () => createAPIKeyAuth,
  createAPIKeyMiddleware: () => createAPIKeyMiddleware,
  createAuthClientConfig: () => createAuthClientConfig,
  createAuthConfig: () => createAuthConfig,
  createBetterAuthMiddleware: () => createBetterAuthMiddleware,
  createCommonRoles: () => createCommonRoles,
  createJWKSVerifier: () => createJWKSVerifier,
  createJWTMiddleware: () => createJWTMiddleware,
  createJWTSigner: () => createJWTSigner,
  createJWTVerifier: () => createJWTVerifier,
  createNoopAuthMiddleware: () => createNoopAuthMiddleware,
  createRBAC: () => createRBAC,
  createRateLimitMiddleware: () => createRateLimitMiddleware,
  createRateLimiter: () => createRateLimiter,
  decodeJWT: () => decodeJWT,
  defineRole: () => defineRole,
  extractBearerToken: () => extractBearerToken,
  extractSessionCookie: () => extractSessionCookie,
  generateAPIKey: () => generateAPIKey,
  getCurrentUser: () => getCurrentUser,
  getUserFromToken: () => getUserFromToken,
  hashAPIKey: () => hashAPIKey,
  requireAuth: () => requireAuth,
  requireUser: () => requireUser,
  signJWT: () => signJWT,
  validateAPIKey: () => validateAPIKey,
  validateAuthEnv: () => validateAuthEnv,
  verifyJWT: () => verifyJWT,
  withAuth: () => withAuth
});
module.exports = __toCommonJS(auth_exports);

// src/auth/jwt.ts
var jose = __toESM(require("jose"));
function createJWTVerifier(key, options) {
  const opts = {
    algorithms: ["RS256", "ES256", "HS256"],
    clockTolerance: 60,
    ...options
  };
  return {
    /**
     * Verify a JWT token
     */
    async verify(token) {
      try {
        let verifyKey;
        switch (key.type) {
          case "secret":
            verifyKey = typeof key.value === "string" ? new TextEncoder().encode(key.value) : key.value;
            break;
          case "jwks": {
            const JWKS = jose.createRemoteJWKSet(new URL(key.url));
            const { payload: payload2 } = await jose.jwtVerify(token, JWKS, {
              issuer: opts.issuer,
              audience: opts.audience,
              clockTolerance: opts.clockTolerance,
              maxTokenAge: opts.maxTokenAge ? `${opts.maxTokenAge}s` : void 0
            });
            return { valid: true, payload: payload2 };
          }
          case "publicKey":
            verifyKey = await jose.importSPKI(key.value, opts.algorithms[0] || "RS256");
            break;
          case "privateKey":
            verifyKey = await jose.importPKCS8(key.value, opts.algorithms[0] || "RS256");
            break;
          default:
            return { valid: false, error: "Invalid key type" };
        }
        const { payload } = await jose.jwtVerify(token, verifyKey, {
          issuer: opts.issuer,
          audience: opts.audience,
          clockTolerance: opts.clockTolerance,
          maxTokenAge: opts.maxTokenAge ? `${opts.maxTokenAge}s` : void 0
        });
        return { valid: true, payload };
      } catch (error) {
        if (error instanceof jose.errors.JWTExpired) {
          return { valid: false, error: "Token expired" };
        }
        if (error instanceof jose.errors.JWTClaimValidationFailed) {
          return { valid: false, error: `Claim validation failed: ${error.message}` };
        }
        if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
          return { valid: false, error: "Invalid signature" };
        }
        return {
          valid: false,
          error: error instanceof Error ? error.message : "Token verification failed"
        };
      }
    }
  };
}
function createJWTSigner(key, algorithm = "HS256") {
  return {
    /**
     * Sign a payload to create a JWT
     */
    async sign(payload, options) {
      let signKey;
      switch (key.type) {
        case "secret":
          signKey = typeof key.value === "string" ? new TextEncoder().encode(key.value) : key.value;
          break;
        case "privateKey":
          signKey = await jose.importPKCS8(key.value, algorithm);
          break;
        default:
          throw new Error("Cannot sign with JWKS or public key");
      }
      const jwt = new jose.SignJWT(payload).setProtectedHeader({ alg: algorithm });
      if (options?.issuer) {
        jwt.setIssuer(options.issuer);
      }
      if (options?.audience) {
        jwt.setAudience(options.audience);
      }
      if (options?.expiresIn) {
        if (options.expiresIn < 0) {
          const expTime = Math.floor(Date.now() / 1e3) + options.expiresIn;
          jwt.setExpirationTime(expTime);
        } else {
          jwt.setExpirationTime(`${options.expiresIn}s`);
        }
      }
      if (options?.notBefore) {
        jwt.setNotBefore(`${options.notBefore}s`);
      }
      if (options?.jti) {
        jwt.setJti(options.jti);
      }
      jwt.setIssuedAt();
      return jwt.sign(signKey);
    }
  };
}
function decodeJWT(token) {
  try {
    const decoded = jose.decodeJwt(token);
    return decoded;
  } catch {
    return null;
  }
}
async function verifyJWT(token, secret, options) {
  const verifier = createJWTVerifier({ type: "secret", value: secret }, options);
  return verifier.verify(token);
}
async function signJWT(payload, secret, options) {
  const signer = createJWTSigner({ type: "secret", value: secret });
  return signer.sign(payload, options);
}
function createJWKSVerifier(jwksUrl, options) {
  return createJWTVerifier({ type: "jwks", url: jwksUrl }, options);
}

// src/auth/api-key.ts
var import_crypto = require("crypto");
var InMemoryAPIKeyStore = class {
  keys = /* @__PURE__ */ new Map();
  hashIndex = /* @__PURE__ */ new Map();
  async store(key) {
    this.keys.set(key.id, key);
    this.hashIndex.set(key.hash, key.id);
  }
  async findByHash(hash) {
    const id = this.hashIndex.get(hash);
    if (!id) return null;
    return this.keys.get(id) ?? null;
  }
  async findById(id) {
    return this.keys.get(id) ?? null;
  }
  async update(id, updates) {
    const key = this.keys.get(id);
    if (key) {
      this.keys.set(id, { ...key, ...updates });
    }
  }
  async revoke(id) {
    const key = this.keys.get(id);
    if (key) {
      key.revoked = true;
      this.keys.set(id, key);
    }
  }
  async listByUser(userId) {
    return Array.from(this.keys.values()).filter((k) => k.userId === userId && !k.revoked);
  }
};
var DEFAULT_CONFIG = {
  hashAlgorithm: "sha256",
  prefix: "sk_",
  keyLength: 32
};
function generateAPIKey(userId, name, permissions = [], options) {
  const config = { ...DEFAULT_CONFIG, ...options };
  const keyBytes = (0, import_crypto.randomBytes)(config.keyLength);
  const keyBase64 = keyBytes.toString("base64url");
  const fullKey = `${config.prefix}${keyBase64}`;
  const hash = hashAPIKey(fullKey, config.hashAlgorithm);
  const id = (0, import_crypto.randomBytes)(16).toString("hex");
  const expiresAt = options?.expiresIn ? Date.now() + options.expiresIn * 1e3 : void 0;
  const record = {
    id,
    prefix: `${config.prefix}${keyBase64.slice(0, 8)}...`,
    hash,
    userId,
    name,
    permissions,
    expiresAt,
    createdAt: Date.now()
  };
  return { key: fullKey, record };
}
function hashAPIKey(key, algorithm = "sha256") {
  return (0, import_crypto.createHash)(algorithm).update(key).digest("hex");
}
async function validateAPIKey(key, store, algorithm = "sha256") {
  const hash = hashAPIKey(key, algorithm);
  const record = await store.findByHash(hash);
  if (!record) {
    return { valid: false, error: "Invalid API key" };
  }
  if (record.revoked) {
    return { valid: false, error: "API key has been revoked" };
  }
  if (record.expiresAt && record.expiresAt < Date.now()) {
    return { valid: false, error: "API key has expired" };
  }
  await store.update(record.id, { lastUsedAt: Date.now() });
  return { valid: true, key: record };
}
function createAPIKeyAuth(store, config) {
  const hashAlgorithm = config?.hashAlgorithm ?? "sha256";
  return {
    /**
     * Generate a new API key
     */
    generate(userId, name, permissions = [], options) {
      const result = generateAPIKey(userId, name, permissions, { ...config, ...options });
      return store.store(result.record).then(() => result);
    },
    /**
     * Validate an API key from request
     */
    async validate(key) {
      return validateAPIKey(key, store, hashAlgorithm);
    },
    /**
     * Extract API key from request headers
     */
    extractFromRequest(request) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        if (token.startsWith(config?.prefix ?? "sk_")) {
          return token;
        }
      }
      const apiKeyHeader = request.headers.get("X-API-Key");
      if (apiKeyHeader) {
        return apiKeyHeader;
      }
      return null;
    },
    /**
     * Revoke an API key
     */
    revoke(keyId) {
      return store.revoke(keyId);
    },
    /**
     * List keys for a user
     */
    listKeys(userId) {
      return store.listByUser(userId);
    }
  };
}
function createAPIKeyMiddleware(store, config) {
  const auth = createAPIKeyAuth(store, config);
  return async (request) => {
    const key = auth.extractFromRequest(request);
    if (!key) {
      return { authenticated: false, error: "No API key provided" };
    }
    const result = await auth.validate(key);
    if (!result.valid || !result.key) {
      return { authenticated: false, error: result.error };
    }
    return {
      authenticated: true,
      userId: result.key.userId,
      permissions: result.key.permissions
    };
  };
}

// src/auth/rbac.ts
function createRBAC(config) {
  const roleMap = /* @__PURE__ */ new Map();
  const permissionCache = /* @__PURE__ */ new Map();
  for (const role of config.roles) {
    roleMap.set(role.name, role);
  }
  function getRolePermissions(roleName, visited = /* @__PURE__ */ new Set()) {
    const cached = permissionCache.get(roleName);
    if (cached) return cached;
    if (visited.has(roleName)) {
      return /* @__PURE__ */ new Set();
    }
    visited.add(roleName);
    const role = roleMap.get(roleName);
    if (!role) {
      return /* @__PURE__ */ new Set();
    }
    const permissions = new Set(role.permissions);
    if (role.inherits) {
      for (const inheritedRole of role.inherits) {
        const inheritedPerms = getRolePermissions(inheritedRole, visited);
        for (const perm of inheritedPerms) {
          permissions.add(perm);
        }
      }
    }
    permissionCache.set(roleName, permissions);
    return permissions;
  }
  function getUserPermissions(user) {
    const permissions = /* @__PURE__ */ new Set();
    if (config.superAdminRole && user.roles.includes(config.superAdminRole)) {
      permissions.add("*");
      return permissions;
    }
    for (const roleName of user.roles) {
      const rolePerms = getRolePermissions(roleName);
      for (const perm of rolePerms) {
        permissions.add(perm);
      }
    }
    if (user.permissions) {
      for (const perm of user.permissions) {
        permissions.add(perm);
      }
    }
    return permissions;
  }
  function hasPermission(user, permission) {
    const permissions = getUserPermissions(user);
    if (permissions.has("*")) {
      return true;
    }
    if (permissions.has(permission)) {
      return true;
    }
    const parts = permission.split(":");
    for (let i = parts.length - 1; i > 0; i--) {
      const wildcard = parts.slice(0, i).join(":") + ":*";
      if (permissions.has(wildcard)) {
        return true;
      }
    }
    return false;
  }
  function hasAllPermissions(user, permissions) {
    return permissions.every((p) => hasPermission(user, p));
  }
  function hasAnyPermission(user, permissions) {
    return permissions.some((p) => hasPermission(user, p));
  }
  function hasRole(user, roleName) {
    return user.roles.includes(roleName);
  }
  function hasAnyRole(user, roleNames) {
    return roleNames.some((r) => hasRole(user, r));
  }
  return {
    /**
     * Get all roles
     */
    getRoles() {
      return config.roles;
    },
    /**
     * Get a role by name
     */
    getRole(name) {
      return roleMap.get(name);
    },
    /**
     * Get the default role
     */
    getDefaultRole() {
      return config.defaultRole ? roleMap.get(config.defaultRole) : void 0;
    },
    /**
     * Get all permissions for a role
     */
    getRolePermissions,
    /**
     * Get all permissions for a user
     */
    getUserPermissions,
    /**
     * Check if user has permission
     */
    hasPermission,
    /**
     * Check if user has all permissions
     */
    hasAllPermissions,
    /**
     * Check if user has any permission
     */
    hasAnyPermission,
    /**
     * Check if user has role
     */
    hasRole,
    /**
     * Check if user has any role
     */
    hasAnyRole,
    /**
     * Require a permission (throws if denied)
     */
    requirePermission(user, permission) {
      if (!hasPermission(user, permission)) {
        throw new AuthorizationError(`Missing permission: ${permission}`, [permission]);
      }
    },
    /**
     * Require all permissions (throws if any denied)
     */
    requireAllPermissions(user, permissions) {
      const missing = permissions.filter((p) => !hasPermission(user, p));
      if (missing.length > 0) {
        throw new AuthorizationError(`Missing permissions: ${missing.join(", ")}`, missing);
      }
    },
    /**
     * Require any permission (throws if all denied)
     */
    requireAnyPermission(user, permissions) {
      if (!hasAnyPermission(user, permissions)) {
        throw new AuthorizationError(
          `Missing at least one of: ${permissions.join(", ")}`,
          permissions
        );
      }
    },
    /**
     * Require a role (throws if denied)
     */
    requireRole(user, roleName) {
      if (!hasRole(user, roleName)) {
        throw new AuthorizationError(`Missing role: ${roleName}`);
      }
    },
    /**
     * Require any role (throws if all denied)
     */
    requireAnyRole(user, roleNames) {
      if (!hasAnyRole(user, roleNames)) {
        throw new AuthorizationError(`Missing at least one role: ${roleNames.join(", ")}`);
      }
    },
    /**
     * Authorize with detailed result
     */
    authorize(user, permission) {
      if (hasPermission(user, permission)) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Permission denied",
        missingPermissions: [permission]
      };
    },
    /**
     * Clear the permission cache (call after role changes)
     */
    clearCache() {
      permissionCache.clear();
    }
  };
}
var AuthorizationError = class extends Error {
  missingPermissions;
  constructor(message, missingPermissions) {
    super(message);
    this.name = "AuthorizationError";
    this.missingPermissions = missingPermissions;
  }
};
var Permissions = {
  // Resource CRUD pattern
  create: (resource) => `${resource}:create`,
  read: (resource) => `${resource}:read`,
  update: (resource) => `${resource}:update`,
  delete: (resource) => `${resource}:delete`,
  list: (resource) => `${resource}:list`,
  all: (resource) => `${resource}:*`,
  // Common permissions
  ADMIN: "admin",
  SUPER_ADMIN: "*"
};
function defineRole(name, permissions, options) {
  return {
    name,
    permissions,
    description: options?.description,
    inherits: options?.inherits
  };
}
function createCommonRoles() {
  return {
    viewer: defineRole("viewer", [
      Permissions.read("*"),
      Permissions.list("*")
    ], { description: "Can view all resources" }),
    editor: defineRole("editor", [
      Permissions.create("*"),
      Permissions.update("*")
    ], {
      description: "Can create and edit resources",
      inherits: ["viewer"]
    }),
    admin: defineRole("admin", [
      Permissions.delete("*"),
      "admin"
    ], {
      description: "Full access to all resources",
      inherits: ["editor"]
    }),
    superAdmin: defineRole("super_admin", ["*"], {
      description: "Super administrator with all permissions"
    })
  };
}

// src/auth/rate-limiter.ts
var InMemoryRateLimitStore = class {
  windows = /* @__PURE__ */ new Map();
  cleanupInterval = null;
  constructor(cleanupIntervalMs = 6e4) {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, window] of this.windows) {
        if (window.resetAt < now) {
          this.windows.delete(key);
        }
      }
    }, cleanupIntervalMs);
  }
  async increment(key, windowMs) {
    const now = Date.now();
    const existing = this.windows.get(key);
    if (existing && existing.resetAt > now) {
      existing.count++;
      return { count: existing.count, resetAt: existing.resetAt };
    }
    const newWindow = { count: 1, resetAt: now + windowMs };
    this.windows.set(key, newWindow);
    return newWindow;
  }
  async get(key) {
    const window = this.windows.get(key);
    if (!window || window.resetAt < Date.now()) {
      return null;
    }
    return window;
  }
  async reset(key) {
    this.windows.delete(key);
  }
  /**
   * Stop the cleanup interval
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
};
function defaultKeyGenerator(context) {
  if (context.userId) {
    return `user:${context.userId}`;
  }
  if (context.apiKeyId) {
    return `apikey:${context.apiKeyId}`;
  }
  if (context.ip) {
    return `ip:${context.ip}`;
  }
  return "global";
}
function createRateLimiter(config) {
  const store = config.store ?? new InMemoryRateLimitStore();
  const keyGenerator = config.keyGenerator ?? defaultKeyGenerator;
  return {
    /**
     * Check and consume a request
     */
    async check(context) {
      if (config.skip) {
        const shouldSkip = await config.skip(context);
        if (shouldSkip) {
          return {
            allowed: true,
            remaining: config.maxRequests,
            limit: config.maxRequests,
            resetIn: config.windowMs,
            resetAt: Date.now() + config.windowMs,
            current: 0
          };
        }
      }
      const key = keyGenerator(context);
      const { count, resetAt } = await store.increment(key, config.windowMs);
      const result = {
        allowed: count <= config.maxRequests,
        remaining: Math.max(0, config.maxRequests - count),
        limit: config.maxRequests,
        resetIn: Math.max(0, resetAt - Date.now()),
        resetAt,
        current: count
      };
      if (!result.allowed && config.onRateLimitExceeded) {
        config.onRateLimitExceeded(context, result);
      }
      return result;
    },
    /**
     * Get current state without consuming
     */
    async peek(context) {
      const key = keyGenerator(context);
      const state = await store.get(key);
      if (!state) {
        return {
          allowed: true,
          remaining: config.maxRequests,
          limit: config.maxRequests,
          resetIn: config.windowMs,
          resetAt: Date.now() + config.windowMs,
          current: 0
        };
      }
      return {
        allowed: state.count < config.maxRequests,
        remaining: Math.max(0, config.maxRequests - state.count),
        limit: config.maxRequests,
        resetIn: Math.max(0, state.resetAt - Date.now()),
        resetAt: state.resetAt,
        current: state.count
      };
    },
    /**
     * Reset rate limit for a context
     */
    async reset(context) {
      const key = keyGenerator(context);
      await store.reset(key);
    },
    /**
     * Get the underlying store
     */
    getStore() {
      return store;
    }
  };
}
function createRateLimitMiddleware(config) {
  const limiter = createRateLimiter(config);
  return async (request, context) => {
    const fullContext = {
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? void 0,
      path: new URL(request.url).pathname,
      method: request.method,
      ...context
    };
    const result = await limiter.check(fullContext);
    const headers = {
      "X-RateLimit-Limit": String(result.limit),
      "X-RateLimit-Remaining": String(result.remaining),
      "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1e3))
    };
    if (!result.allowed) {
      headers["Retry-After"] = String(Math.ceil(result.resetIn / 1e3));
      return {
        allowed: false,
        headers,
        response: new Response(
          JSON.stringify({
            error: "Rate limit exceeded",
            retryAfter: Math.ceil(result.resetIn / 1e3)
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...headers
            }
          }
        )
      };
    }
    return { allowed: true, headers };
  };
}
var RateLimitPresets = {
  /** Standard API rate limit: 100 requests per minute */
  standard: {
    maxRequests: 100,
    windowMs: 60 * 1e3
  },
  /** Strict rate limit: 10 requests per minute */
  strict: {
    maxRequests: 10,
    windowMs: 60 * 1e3
  },
  /** Lenient rate limit: 1000 requests per minute */
  lenient: {
    maxRequests: 1e3,
    windowMs: 60 * 1e3
  },
  /** Auth endpoints: 5 requests per minute */
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1e3
  },
  /** Chat/AI endpoints: 20 requests per minute */
  chat: {
    maxRequests: 20,
    windowMs: 60 * 1e3
  }
};

// src/auth/server.ts
function createAuthConfig(config) {
  const {
    databaseUrl,
    siteUrl,
    audience = "sage",
    sessionExpiry = 60 * 60 * 24 * 7,
    // 7 days
    emailPassword = true,
    google
  } = config;
  const authConfig = {
    database: {
      type: "postgres",
      url: databaseUrl
    },
    emailAndPassword: {
      enabled: emailPassword,
      requireEmailVerification: true
    },
    session: {
      expiresIn: sessionExpiry,
      updateAge: 60 * 60 * 24,
      // Refresh daily
      freshAge: 60 * 5
      // 5 min sensitive age
    },
    plugins: [],
    advanced: {
      cookiePrefix: "sage-auth"
    }
  };
  const jwtConfig = {
    audience,
    issuer: siteUrl || process.env.SITE_URL || "http://localhost:3000",
    expiresIn: 60 * 15
    // 15 min JWT expiry
  };
  authConfig.jwt = jwtConfig;
  if (google) {
    authConfig.socialProviders = {
      google: {
        clientId: google.clientId,
        clientSecret: google.clientSecret
      }
    };
  }
  return authConfig;
}
async function getUserFromToken(auth, headers) {
  try {
    const result = await auth.api.getSession({ headers });
    return result;
  } catch {
    return null;
  }
}
function requireAuth(result) {
  if (!result) {
    throw new Error("Unauthorized");
  }
  return result;
}
var AUTH_ENV_VARS = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "SITE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET"
];
function validateAuthEnv() {
  const missing = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.BETTER_AUTH_SECRET) missing.push("BETTER_AUTH_SECRET");
  return {
    valid: missing.length === 0,
    missing
  };
}

// src/auth/client.ts
function createAuthClientConfig(config) {
  return {
    baseURL: config?.baseUrl || ""
  };
}

// src/auth/middleware.ts
function defaultAuthErrorResponse(error) {
  return new Response(
    JSON.stringify({ error: "Unauthorized", message: error }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}
function withAuth(handler, options) {
  const { middleware, optional = false, onAuthError = defaultAuthErrorResponse } = options;
  return async function authHandler(request) {
    const authResult = await middleware(request);
    if (!authResult.authenticated || !authResult.user) {
      if (optional) {
        return handler(request, { id: "anonymous" });
      }
      return onAuthError(authResult.error || "Authentication required");
    }
    return handler(request, authResult.user);
  };
}
function extractBearerToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
function extractSessionCookie(request, cookieName = "sage-auth.session_token") {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }
  const cookies = parseCookies(cookieHeader);
  return cookies[cookieName] || null;
}
function parseCookies(cookieHeader) {
  const cookies = {};
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split("=");
    if (name && rest.length > 0) {
      cookies[name] = rest.join("=");
    }
  }
  return cookies;
}
function createJWTMiddleware(options) {
  const { secret, issuer, audience } = options;
  return async (request) => {
    const token = extractBearerToken(request);
    if (!token) {
      return { authenticated: false, error: "No authorization token provided" };
    }
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return { authenticated: false, error: "Invalid token format" };
      }
      const payloadStr = Buffer.from(parts[1], "base64url").toString("utf-8");
      const payload = JSON.parse(payloadStr);
      if (payload.exp && payload.exp < Date.now() / 1e3) {
        return { authenticated: false, error: "Token expired" };
      }
      if (issuer && payload.iss !== issuer) {
        return { authenticated: false, error: "Invalid issuer" };
      }
      if (audience && payload.aud !== audience) {
        return { authenticated: false, error: "Invalid audience" };
      }
      console.warn("[SAGE] JWT middleware: Signature verification not implemented. Use Better Auth adapter for production.");
      return {
        authenticated: true,
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name
        }
      };
    } catch (error) {
      return {
        authenticated: false,
        error: `Token validation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  };
}
function createNoopAuthMiddleware(mockUser) {
  return async () => {
    return {
      authenticated: true,
      user: mockUser
    };
  };
}

// src/auth/better-auth.ts
function createBetterAuthMiddleware(auth, options = {}) {
  const {
    cookieName = "sage-auth.session_token",
    allowBearerToken = true
  } = options;
  return async (request) => {
    try {
      const headers = new Headers();
      const sessionCookie = extractSessionCookie(request, cookieName);
      if (sessionCookie) {
        headers.set("Cookie", request.headers.get("Cookie") || "");
      }
      if (allowBearerToken && !sessionCookie) {
        const authHeader = request.headers.get("Authorization");
        if (authHeader) {
          headers.set("Authorization", authHeader);
        }
      }
      const result = await auth.api.getSession({ headers });
      if (!result || !result.user) {
        return {
          authenticated: false,
          error: "Invalid or expired session"
        };
      }
      const user = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name
      };
      return {
        authenticated: true,
        user,
        session: result.session
      };
    } catch (error) {
      return {
        authenticated: false,
        error: `Auth validation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  };
}
async function getCurrentUser(auth, request) {
  const middleware = createBetterAuthMiddleware(auth);
  const result = await middleware(request);
  return result.authenticated ? result.user || null : null;
}
async function requireUser(auth, request) {
  const user = await getCurrentUser(auth, request);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AUTH_ENV_VARS,
  AuthorizationError,
  InMemoryAPIKeyStore,
  InMemoryRateLimitStore,
  Permissions,
  RateLimitPresets,
  createAPIKeyAuth,
  createAPIKeyMiddleware,
  createAuthClientConfig,
  createAuthConfig,
  createBetterAuthMiddleware,
  createCommonRoles,
  createJWKSVerifier,
  createJWTMiddleware,
  createJWTSigner,
  createJWTVerifier,
  createNoopAuthMiddleware,
  createRBAC,
  createRateLimitMiddleware,
  createRateLimiter,
  decodeJWT,
  defineRole,
  extractBearerToken,
  extractSessionCookie,
  generateAPIKey,
  getCurrentUser,
  getUserFromToken,
  hashAPIKey,
  requireAuth,
  requireUser,
  signJWT,
  validateAPIKey,
  validateAuthEnv,
  verifyJWT,
  withAuth
});
//# sourceMappingURL=index.js.map