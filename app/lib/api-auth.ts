/**
 * API Authentication Middleware
 * Extracts repeated auth checks from API routes
 * Provides reusable requireAuth(), requireAdmin() functions
 */

import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export interface AuthResult {
  success: true
  session: {
    user: {
      id: string
      role: string
      email?: string | null
      name?: string | null
    }
  }
}

export interface AuthError {
  success: false
  response: NextResponse
}

export type AuthCheckResult = AuthResult | AuthError

/**
 * Require authentication - returns session or 401 response
 * Usage:
 *   const authResult = await requireAuth()
 *   if (!authResult.success) return authResult.response
 *   const { session } = authResult
 */
export async function requireAuth(): Promise<AuthCheckResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  return {
    success: true,
    session: {
      user: {
        id: session.user.id,
        role: session.user.role || 'CLIENT',
        email: session.user.email,
        name: session.user.name,
      },
    },
  }
}

/**
 * Require admin role - returns session or 401/403 response
 * Usage:
 *   const authResult = await requireAdmin()
 *   if (!authResult.success) return authResult.response
 *   const { session } = authResult
 */
export async function requireAdmin(): Promise<AuthCheckResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  if (session.user.role !== 'ADMIN') {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      ),
    }
  }

  return {
    success: true,
    session: {
      user: {
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
      },
    },
  }
}

/**
 * Require specific role - returns session or 401/403 response
 * Usage:
 *   const authResult = await requireRole('ADMIN')
 *   if (!authResult.success) return authResult.response
 *   const { session } = authResult
 */
export async function requireRole(role: string): Promise<AuthCheckResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  if (session.user.role !== role) {
    return {
      success: false,
      response: NextResponse.json(
        { error: `Forbidden - ${role} access required` },
        { status: 403 }
      ),
    }
  }

  return {
    success: true,
    session: {
      user: {
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
      },
    },
  }
}

/**
 * Get current session without requiring auth
 * Returns null if not authenticated
 * Usage:
 *   const session = await getOptionalSession()
 *   if (session) { // do something with session }
 */
export async function getOptionalSession() {
  const session = await auth()
  return session?.user?.id ? session : null
}

/**
 * Create error response helper
 */
export function createErrorResponse(error: string, status: number = 500): NextResponse {
  return NextResponse.json({ error }, { status })
}

/**
 * Create success response helper
 */
export function createSuccessResponse(data: Record<string, unknown>): NextResponse {
  return NextResponse.json({ success: true, ...data })
}

/**
 * Common validation errors
 */
export const ValidationErrors = {
  MISSING_FIELD: (field: string) => createErrorResponse(`Missing required field: ${field}`, 400),
  INVALID_TYPE: (field: string, expected: string) => createErrorResponse(`Invalid type for ${field}, expected ${expected}`, 400),
  NOT_FOUND: (resource: string) => createErrorResponse(`${resource} not found`, 404),
  INTERNAL_ERROR: () => createErrorResponse('Internal server error', 500),
} as const
