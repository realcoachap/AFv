import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'
import { NextResponse } from 'next/server'

// Rate limiter for registration endpoint
const registerLimiter = new RateLimiterMemory({
  keyPrefix: 'register',
  points: 5, // 5 attempts
  duration: 60 * 60, // Per hour
})

// Rate limiter for login/auth endpoints
const authLimiter = new RateLimiterMemory({
  keyPrefix: 'auth',
  points: 10, // 10 attempts
  duration: 60 * 15, // Per 15 minutes
})

// Rate limiter for API endpoints
const apiLimiter = new RateLimiterMemory({
  keyPrefix: 'api',
  points: 100, // 100 requests
  duration: 60, // Per minute
})

export async function rateLimitRegister(
  identifier: string
): Promise<{ success: boolean; response?: NextResponse }> {
  try {
    await registerLimiter.consume(identifier)
    return { success: true }
  } catch (rejRes) {
    if (rejRes instanceof RateLimiterRes) {
      const seconds = Math.round(rejRes.msBeforeNext / 1000) || 1
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Too many registration attempts. Please try again later.',
            retryAfter: seconds,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(seconds),
            },
          }
        ),
      }
    }
    return { success: false }
  }
}

export async function rateLimitAuth(
  identifier: string
): Promise<{ success: boolean; response?: NextResponse }> {
  try {
    await authLimiter.consume(identifier)
    return { success: true }
  } catch (rejRes) {
    if (rejRes instanceof RateLimiterRes) {
      const seconds = Math.round(rejRes.msBeforeNext / 1000) || 1
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Too many login attempts. Please try again later.',
            retryAfter: seconds,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(seconds),
            },
          }
        ),
      }
    }
    return { success: false }
  }
}

export async function rateLimitApi(
  identifier: string,
  points?: number
): Promise<{ success: boolean; response?: NextResponse }> {
  try {
    if (points) {
      await apiLimiter.consume(identifier, points)
    } else {
      await apiLimiter.consume(identifier)
    }
    return { success: true }
  } catch (rejRes) {
    if (rejRes instanceof RateLimiterRes) {
      const seconds = Math.round(rejRes.msBeforeNext / 1000) || 1
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfter: seconds,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(seconds),
            },
          }
        ),
      }
    }
    return { success: false }
  }
}
