/**
 * Auth Types
 */
/**
 * Auth configuration
 */
interface AuthConfig {
    /** PostgreSQL database URL */
    databaseUrl: string;
    /** Site URL for JWT issuer */
    siteUrl?: string;
    /** JWT audience */
    audience?: string;
    /** Session expiration in seconds (default: 7 days) */
    sessionExpiry?: number;
    /** Enable email/password auth */
    emailPassword?: boolean;
    /** Google OAuth config */
    google?: {
        clientId: string;
        clientSecret: string;
    };
}
/**
 * User from auth
 */
interface AuthUser {
    id: string;
    email: string;
    name?: string;
    image?: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Session from auth
 */
interface AuthSession {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
}
/**
 * JWT payload for Convex validation
 */
interface JWTPayload {
    sub: string;
    iss: string;
    aud: string;
    exp: number;
    iat: number;
}
/**
 * Convex auth config for JWT validation
 */
interface ConvexAuthConfig {
    /** JWKS endpoint URL */
    jwksUrl: string;
    /** Expected issuer */
    issuer: string;
    /** Expected audience */
    audience: string;
}

/**
 * JWT Authentication with jose
 *
 * Proper JWT verification with support for RS256, ES256, HS256.
 * Uses the jose library for cryptographic operations.
 */

/**
 * JWT verification options
 */
interface JWTVerifyOptions {
    /** Expected issuer */
    issuer?: string;
    /** Expected audience */
    audience?: string;
    /** Algorithms to accept */
    algorithms?: string[];
    /** Clock tolerance in seconds */
    clockTolerance?: number;
    /** Maximum token age in seconds */
    maxTokenAge?: number;
}
/**
 * JWT signing options
 */
interface JWTSignOptions {
    /** Issuer claim */
    issuer?: string;
    /** Audience claim */
    audience?: string;
    /** Expiration time in seconds from now */
    expiresIn?: number;
    /** Not before time in seconds from now */
    notBefore?: number;
    /** JWT ID */
    jti?: string;
}
/**
 * Result of JWT verification
 */
interface JWTVerifyResult {
    /** Whether verification succeeded */
    valid: boolean;
    /** Decoded payload if valid */
    payload?: JWTPayload;
    /** Error message if invalid */
    error?: string;
}
/**
 * Key types for JWT operations
 */
type JWTKey = {
    type: 'secret';
    value: string | Uint8Array;
} | {
    type: 'jwks';
    url: string;
} | {
    type: 'publicKey';
    value: string;
} | {
    type: 'privateKey';
    value: string;
};
/**
 * Create a JWT verifier
 */
declare function createJWTVerifier(key: JWTKey, options?: JWTVerifyOptions): {
    /**
     * Verify a JWT token
     */
    verify(token: string): Promise<JWTVerifyResult>;
};
/**
 * Create a JWT signer
 */
declare function createJWTSigner(key: JWTKey, algorithm?: string): {
    /**
     * Sign a payload to create a JWT
     */
    sign(payload: Record<string, unknown>, options?: JWTSignOptions): Promise<string>;
};
/**
 * Decode a JWT without verification (for debugging)
 */
declare function decodeJWT(token: string): JWTPayload | null;
/**
 * Verify a JWT with a simple secret (convenience function)
 */
declare function verifyJWT(token: string, secret: string, options?: JWTVerifyOptions): Promise<JWTVerifyResult>;
/**
 * Sign a JWT with a simple secret (convenience function)
 */
declare function signJWT(payload: Record<string, unknown>, secret: string, options?: JWTSignOptions): Promise<string>;
/**
 * Create a JWKS verifier from a URL
 */
declare function createJWKSVerifier(jwksUrl: string, options?: JWTVerifyOptions): {
    /**
     * Verify a JWT token
     */
    verify(token: string): Promise<JWTVerifyResult>;
};

/**
 * API Key Authentication
 *
 * Server-to-server authentication using API keys.
 * Supports key generation, hashing, and validation.
 */
/**
 * API key configuration
 */
interface APIKeyConfig {
    /** Hash algorithm (default: sha256) */
    hashAlgorithm?: 'sha256' | 'sha384' | 'sha512';
    /** Key prefix for identification (e.g., "sk_") */
    prefix?: string;
    /** Key length in bytes (default: 32) */
    keyLength?: number;
}
/**
 * API key with metadata
 */
interface APIKey {
    /** Unique key ID */
    id: string;
    /** Key prefix portion (safe to show) */
    prefix: string;
    /** Hashed key value (for storage) */
    hash: string;
    /** Associated user/service ID */
    userId: string;
    /** Key name/label */
    name: string;
    /** Permissions granted to this key */
    permissions: string[];
    /** Expiration timestamp (optional) */
    expiresAt?: number;
    /** Creation timestamp */
    createdAt: number;
    /** Last used timestamp */
    lastUsedAt?: number;
    /** Whether the key is revoked */
    revoked?: boolean;
}
/**
 * Result of API key generation
 */
interface APIKeyGenerationResult {
    /** The full key (only shown once!) */
    key: string;
    /** The key record (for storage) */
    record: APIKey;
}
/**
 * API key store interface
 */
interface APIKeyStore {
    /** Store a new API key */
    store(key: APIKey): Promise<void>;
    /** Find a key by its hash */
    findByHash(hash: string): Promise<APIKey | null>;
    /** Find a key by ID */
    findById(id: string): Promise<APIKey | null>;
    /** Update key (e.g., lastUsedAt) */
    update(id: string, updates: Partial<APIKey>): Promise<void>;
    /** Delete/revoke a key */
    revoke(id: string): Promise<void>;
    /** List keys for a user */
    listByUser(userId: string): Promise<APIKey[]>;
}
/**
 * In-memory API key store (for testing/development)
 */
declare class InMemoryAPIKeyStore implements APIKeyStore {
    private keys;
    private hashIndex;
    store(key: APIKey): Promise<void>;
    findByHash(hash: string): Promise<APIKey | null>;
    findById(id: string): Promise<APIKey | null>;
    update(id: string, updates: Partial<APIKey>): Promise<void>;
    revoke(id: string): Promise<void>;
    listByUser(userId: string): Promise<APIKey[]>;
}
/**
 * Generate a new API key
 */
declare function generateAPIKey(userId: string, name: string, permissions?: string[], options?: APIKeyConfig & {
    expiresIn?: number;
}): APIKeyGenerationResult;
/**
 * Hash an API key for storage
 */
declare function hashAPIKey(key: string, algorithm?: 'sha256' | 'sha384' | 'sha512'): string;
/**
 * Validate an API key
 */
declare function validateAPIKey(key: string, store: APIKeyStore, algorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<{
    valid: boolean;
    key?: APIKey;
    error?: string;
}>;
/**
 * Create an API key authenticator
 */
declare function createAPIKeyAuth(store: APIKeyStore, config?: APIKeyConfig): {
    /**
     * Generate a new API key
     */
    generate(userId: string, name: string, permissions?: string[], options?: {
        expiresIn?: number;
    }): Promise<APIKeyGenerationResult>;
    /**
     * Validate an API key from request
     */
    validate(key: string): Promise<{
        valid: boolean;
        key?: APIKey;
        error?: string;
    }>;
    /**
     * Extract API key from request headers
     */
    extractFromRequest(request: Request): string | null;
    /**
     * Revoke an API key
     */
    revoke(keyId: string): Promise<void>;
    /**
     * List keys for a user
     */
    listKeys(userId: string): Promise<APIKey[]>;
};
/**
 * Create auth middleware for API keys
 */
declare function createAPIKeyMiddleware(store: APIKeyStore, config?: APIKeyConfig): (request: Request) => Promise<{
    authenticated: boolean;
    userId?: string;
    permissions?: string[];
    error?: string;
}>;

/**
 * Role-Based Access Control (RBAC)
 *
 * Permission and role management for SAGE applications.
 */
/**
 * Role definition
 */
interface Role {
    /** Role name (unique identifier) */
    name: string;
    /** Human-readable description */
    description?: string;
    /** Permissions granted by this role */
    permissions: string[];
    /** Roles this role inherits from */
    inherits?: string[];
}
/**
 * RBAC configuration
 */
interface RBACConfig {
    /** Available roles */
    roles: Role[];
    /** Default role for new users */
    defaultRole?: string;
    /** Super admin role name (has all permissions) */
    superAdminRole?: string;
}
/**
 * User with roles
 */
interface RBACUser {
    /** User ID */
    id: string;
    /** User's roles */
    roles: string[];
    /** Direct permissions (in addition to role permissions) */
    permissions?: string[];
}
/**
 * Authorization result
 */
interface AuthorizationResult {
    /** Whether access is granted */
    allowed: boolean;
    /** Reason for denial (if denied) */
    reason?: string;
    /** Missing permissions (if denied) */
    missingPermissions?: string[];
}
/**
 * Create an RBAC manager
 */
declare function createRBAC(config: RBACConfig): {
    /**
     * Get all roles
     */
    getRoles(): Role[];
    /**
     * Get a role by name
     */
    getRole(name: string): Role | undefined;
    /**
     * Get the default role
     */
    getDefaultRole(): Role | undefined;
    /**
     * Get all permissions for a role
     */
    getRolePermissions: (roleName: string, visited?: Set<string>) => Set<string>;
    /**
     * Get all permissions for a user
     */
    getUserPermissions: (user: RBACUser) => Set<string>;
    /**
     * Check if user has permission
     */
    hasPermission: (user: RBACUser, permission: string) => boolean;
    /**
     * Check if user has all permissions
     */
    hasAllPermissions: (user: RBACUser, permissions: string[]) => boolean;
    /**
     * Check if user has any permission
     */
    hasAnyPermission: (user: RBACUser, permissions: string[]) => boolean;
    /**
     * Check if user has role
     */
    hasRole: (user: RBACUser, roleName: string) => boolean;
    /**
     * Check if user has any role
     */
    hasAnyRole: (user: RBACUser, roleNames: string[]) => boolean;
    /**
     * Require a permission (throws if denied)
     */
    requirePermission(user: RBACUser, permission: string): void;
    /**
     * Require all permissions (throws if any denied)
     */
    requireAllPermissions(user: RBACUser, permissions: string[]): void;
    /**
     * Require any permission (throws if all denied)
     */
    requireAnyPermission(user: RBACUser, permissions: string[]): void;
    /**
     * Require a role (throws if denied)
     */
    requireRole(user: RBACUser, roleName: string): void;
    /**
     * Require any role (throws if all denied)
     */
    requireAnyRole(user: RBACUser, roleNames: string[]): void;
    /**
     * Authorize with detailed result
     */
    authorize(user: RBACUser, permission: string): AuthorizationResult;
    /**
     * Clear the permission cache (call after role changes)
     */
    clearCache(): void;
};
/**
 * Authorization error
 */
declare class AuthorizationError extends Error {
    readonly missingPermissions?: string[];
    constructor(message: string, missingPermissions?: string[]);
}
/**
 * Common permission patterns
 */
declare const Permissions: {
    readonly create: (resource: string) => string;
    readonly read: (resource: string) => string;
    readonly update: (resource: string) => string;
    readonly delete: (resource: string) => string;
    readonly list: (resource: string) => string;
    readonly all: (resource: string) => string;
    readonly ADMIN: "admin";
    readonly SUPER_ADMIN: "*";
};
/**
 * Helper to define roles
 */
declare function defineRole(name: string, permissions: string[], options?: {
    description?: string;
    inherits?: string[];
}): Role;
/**
 * Create common role presets
 */
declare function createCommonRoles(): {
    viewer: Role;
    editor: Role;
    admin: Role;
    superAdmin: Role;
};

/**
 * Rate Limiter
 *
 * Sliding window rate limiting for SAGE APIs.
 * Supports in-memory and Redis-based stores.
 */
/**
 * Rate limit configuration
 */
interface RateLimitConfig {
    /** Maximum requests per window */
    maxRequests: number;
    /** Window size in milliseconds */
    windowMs: number;
    /** Key generator function */
    keyGenerator?: (context: RateLimitContext) => string;
    /** Skip function (return true to skip rate limiting) */
    skip?: (context: RateLimitContext) => boolean | Promise<boolean>;
    /** Handler when rate limit is exceeded */
    onRateLimitExceeded?: (context: RateLimitContext, result: RateLimitResult) => void;
    /** Custom store (default: in-memory) */
    store?: RateLimitStore;
}
/**
 * Rate limit context
 */
interface RateLimitContext {
    /** User ID if authenticated */
    userId?: string;
    /** IP address */
    ip?: string;
    /** Request path */
    path?: string;
    /** Request method */
    method?: string;
    /** API key ID if using API key auth */
    apiKeyId?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Rate limit result
 */
interface RateLimitResult {
    /** Whether the request is allowed */
    allowed: boolean;
    /** Remaining requests in current window */
    remaining: number;
    /** Total requests allowed per window */
    limit: number;
    /** Time until window resets (ms) */
    resetIn: number;
    /** Reset timestamp */
    resetAt: number;
    /** Current request count */
    current: number;
}
/**
 * Rate limit store interface
 */
interface RateLimitStore {
    /** Increment counter and get current state */
    increment(key: string, windowMs: number): Promise<{
        count: number;
        resetAt: number;
    }>;
    /** Get current state without incrementing */
    get(key: string): Promise<{
        count: number;
        resetAt: number;
    } | null>;
    /** Reset counter for a key */
    reset(key: string): Promise<void>;
}
/**
 * In-memory rate limit store using sliding window
 */
declare class InMemoryRateLimitStore implements RateLimitStore {
    private windows;
    private cleanupInterval;
    constructor(cleanupIntervalMs?: number);
    increment(key: string, windowMs: number): Promise<{
        count: number;
        resetAt: number;
    }>;
    get(key: string): Promise<{
        count: number;
        resetAt: number;
    } | null>;
    reset(key: string): Promise<void>;
    /**
     * Stop the cleanup interval
     */
    destroy(): void;
}
/**
 * Create a rate limiter
 */
declare function createRateLimiter(config: RateLimitConfig): {
    /**
     * Check and consume a request
     */
    check(context: RateLimitContext): Promise<RateLimitResult>;
    /**
     * Get current state without consuming
     */
    peek(context: RateLimitContext): Promise<RateLimitResult>;
    /**
     * Reset rate limit for a context
     */
    reset(context: RateLimitContext): Promise<void>;
    /**
     * Get the underlying store
     */
    getStore(): RateLimitStore;
};
/**
 * Create rate limit middleware
 */
declare function createRateLimitMiddleware(config: RateLimitConfig): (request: Request, context?: Partial<RateLimitContext>) => Promise<{
    allowed: boolean;
    response?: Response;
    headers: Record<string, string>;
}>;
/**
 * Common rate limit presets
 */
declare const RateLimitPresets: {
    /** Standard API rate limit: 100 requests per minute */
    readonly standard: {
        readonly maxRequests: 100;
        readonly windowMs: number;
    };
    /** Strict rate limit: 10 requests per minute */
    readonly strict: {
        readonly maxRequests: 10;
        readonly windowMs: number;
    };
    /** Lenient rate limit: 1000 requests per minute */
    readonly lenient: {
        readonly maxRequests: 1000;
        readonly windowMs: number;
    };
    /** Auth endpoints: 5 requests per minute */
    readonly auth: {
        readonly maxRequests: 5;
        readonly windowMs: number;
    };
    /** Chat/AI endpoints: 20 requests per minute */
    readonly chat: {
        readonly maxRequests: 20;
        readonly windowMs: number;
    };
};

/**
 * Auth Server
 *
 * Better Auth server-side configuration.
 * Extracted from Stratus auth.ts.
 */

/**
 * Create auth configuration for Better Auth
 *
 * This returns the configuration object to pass to betterAuth().
 * The consuming app should import betterAuth from 'better-auth' directly.
 *
 * @example
 * ```typescript
 * import { betterAuth } from 'better-auth';
 * import { createAuthConfig } from '@sage/core/auth';
 *
 * export const auth = betterAuth(createAuthConfig({
 *   databaseUrl: process.env.DATABASE_URL,
 *   siteUrl: process.env.SITE_URL,
 * }));
 * ```
 */
declare function createAuthConfig(config: AuthConfig): Record<string, unknown>;
/**
 * Get user from session token
 *
 * This is a helper that should be called with the auth instance
 * from the consuming app.
 */
declare function getUserFromToken(auth: {
    api: {
        getSession: (opts: {
            headers: Headers;
        }) => Promise<{
            user: AuthUser;
            session: AuthSession;
        } | null>;
    };
}, headers: Headers): Promise<{
    user: AuthUser;
    session: AuthSession;
} | null>;
/**
 * Validate that a request is authenticated
 */
declare function requireAuth<T extends {
    user: AuthUser;
    session: AuthSession;
}>(result: T | null): T;
/**
 * Environment variables needed for auth
 */
declare const AUTH_ENV_VARS: readonly ["DATABASE_URL", "BETTER_AUTH_SECRET", "SITE_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
/**
 * Validate auth environment variables
 */
declare function validateAuthEnv(): {
    valid: boolean;
    missing: string[];
};

/**
 * Auth Client
 *
 * @sage/core is server-only. Client-side auth utilities have been moved to @sage/ui.
 *
 * For browser-side auth (session storage, auth headers, etc.):
 * ```typescript
 * import { createAuthClientConfig, getAuthHeaders, storeUser, getStoredUser, clearStoredUser } from '@sage/ui';
 * ```
 */
/**
 * Auth client configuration (server-safe)
 */
interface AuthClientConfig {
    /** Base URL for auth API */
    baseUrl?: string;
}
/**
 * Create auth client configuration
 *
 * Returns a config object for use with better-auth createAuthClient().
 * This is server-safe — it does not reference browser APIs.
 */
declare function createAuthClientConfig(config?: AuthClientConfig): Record<string, unknown>;

/**
 * Auth Middleware
 *
 * Generic auth middleware interface and utilities for protecting SAGE handlers.
 * Supports multiple auth providers through adapters.
 */

/**
 * Authenticated user info extracted from request
 */
interface AuthenticatedUser {
    id: string;
    email?: string;
    name?: string;
}
/**
 * Auth middleware result
 */
interface AuthResult {
    authenticated: boolean;
    user?: AuthenticatedUser;
    session?: AuthSession;
    error?: string;
}
/**
 * Auth middleware function type
 *
 * Takes a request and returns auth result.
 * Implementations can extract auth from headers, cookies, etc.
 */
type AuthMiddleware = (request: Request) => Promise<AuthResult>;
/**
 * Options for creating an auth middleware wrapper
 */
interface AuthMiddlewareOptions {
    /** The auth middleware function */
    middleware: AuthMiddleware;
    /** Allow unauthenticated requests (default: false) */
    optional?: boolean;
    /** Custom error handler */
    onAuthError?: (error: string) => Response;
}
/**
 * Wrap a handler with auth middleware
 *
 * @example
 * ```typescript
 * import { withAuth, createBetterAuthMiddleware } from '@sage/core/auth';
 * import { createChatHandler } from '@sage/core';
 *
 * const authMiddleware = createBetterAuthMiddleware(auth);
 * export const POST = withAuth(createChatHandler(config), { middleware: authMiddleware });
 * ```
 */
declare function withAuth(handler: (request: Request, user: AuthenticatedUser) => Promise<Response>, options: AuthMiddlewareOptions): (request: Request) => Promise<Response>;
/**
 * Extract bearer token from Authorization header
 */
declare function extractBearerToken(request: Request): string | null;
/**
 * Extract session token from cookies
 */
declare function extractSessionCookie(request: Request, cookieName?: string): string | null;
/**
 * Create a simple JWT validation middleware
 *
 * This is a basic implementation. For production, use createBetterAuthMiddleware.
 *
 * @example
 * ```typescript
 * const authMiddleware = createJWTMiddleware({
 *   secret: process.env.JWT_SECRET!,
 *   issuer: 'https://myapp.com',
 * });
 * ```
 */
declare function createJWTMiddleware(options: {
    /** JWT secret for verification */
    secret: string;
    /** Expected issuer */
    issuer?: string;
    /** Expected audience */
    audience?: string;
}): AuthMiddleware;
/**
 * Create a no-op middleware that always succeeds (for testing/development)
 *
 * @example
 * ```typescript
 * const authMiddleware = process.env.NODE_ENV === 'development'
 *   ? createNoopAuthMiddleware({ id: 'dev-user', email: 'dev@example.com' })
 *   : createBetterAuthMiddleware(auth);
 * ```
 */
declare function createNoopAuthMiddleware(mockUser: AuthenticatedUser): AuthMiddleware;

/**
 * Better Auth Adapter
 *
 * Auth middleware adapter for Better Auth integration.
 * This provides first-class support for apps using Better Auth.
 */

/**
 * Better Auth instance interface
 *
 * This matches the Better Auth API shape.
 */
interface BetterAuthInstance {
    api: {
        getSession: (options: {
            headers: Headers;
        }) => Promise<{
            user: AuthUser;
            session: AuthSession;
        } | null>;
    };
}
/**
 * Options for Better Auth middleware
 */
interface BetterAuthMiddlewareOptions {
    /** Cookie name for session token (default: sage-auth.session_token) */
    cookieName?: string;
    /** Allow Bearer token auth as well (default: true) */
    allowBearerToken?: boolean;
}
/**
 * Create an auth middleware using Better Auth
 *
 * This is the recommended auth middleware for SAGE applications.
 *
 * @example
 * ```typescript
 * // auth.ts
 * import { betterAuth } from 'better-auth';
 * import { createAuthConfig } from '@sage/core/auth';
 *
 * export const auth = betterAuth(createAuthConfig({
 *   databaseUrl: process.env.DATABASE_URL!,
 * }));
 *
 * // route.ts
 * import { createChatHandler, withAuth, createBetterAuthMiddleware } from '@sage/core';
 * import { auth } from '@/auth';
 *
 * const authMiddleware = createBetterAuthMiddleware(auth);
 * export const POST = withAuth(createChatHandler(config), { middleware: authMiddleware });
 * ```
 */
declare function createBetterAuthMiddleware(auth: BetterAuthInstance, options?: BetterAuthMiddlewareOptions): AuthMiddleware;
/**
 * Helper to get the current user from a request using Better Auth
 *
 * Useful when you need to get the user outside of the middleware flow.
 *
 * @example
 * ```typescript
 * import { getCurrentUser } from '@sage/core/auth';
 * import { auth } from '@/auth';
 *
 * export async function GET(request: Request) {
 *   const user = await getCurrentUser(auth, request);
 *   if (!user) {
 *     return new Response('Unauthorized', { status: 401 });
 *   }
 *   // ...
 * }
 * ```
 */
declare function getCurrentUser(auth: BetterAuthInstance, request: Request): Promise<AuthenticatedUser | null>;
/**
 * Helper to require authentication and get user, or throw
 *
 * @example
 * ```typescript
 * import { requireUser } from '@sage/core/auth';
 * import { auth } from '@/auth';
 *
 * export async function POST(request: Request) {
 *   const user = await requireUser(auth, request); // throws if not authenticated
 *   // user is guaranteed to exist here
 * }
 * ```
 */
declare function requireUser(auth: BetterAuthInstance, request: Request): Promise<AuthenticatedUser>;

export { type APIKey, type APIKeyConfig, type APIKeyGenerationResult, type APIKeyStore, AUTH_ENV_VARS, type AuthClientConfig, type AuthConfig, type AuthMiddleware, type AuthMiddlewareOptions, type AuthResult, type AuthSession, type AuthUser, type AuthenticatedUser, AuthorizationError, type AuthorizationResult, type BetterAuthInstance, type BetterAuthMiddlewareOptions, type ConvexAuthConfig, InMemoryAPIKeyStore, InMemoryRateLimitStore, type JWTKey, type JWTPayload, type JWTSignOptions, type JWTVerifyOptions, type JWTVerifyResult, Permissions, type RBACConfig, type RBACUser, type RateLimitConfig, type RateLimitContext, RateLimitPresets, type RateLimitResult, type RateLimitStore, type Role, createAPIKeyAuth, createAPIKeyMiddleware, createAuthClientConfig, createAuthConfig, createBetterAuthMiddleware, createCommonRoles, createJWKSVerifier, createJWTMiddleware, createJWTSigner, createJWTVerifier, createNoopAuthMiddleware, createRBAC, createRateLimitMiddleware, createRateLimiter, decodeJWT, defineRole, extractBearerToken, extractSessionCookie, generateAPIKey, getCurrentUser, getUserFromToken, hashAPIKey, requireAuth, requireUser, signJWT, validateAPIKey, validateAuthEnv, verifyJWT, withAuth };
