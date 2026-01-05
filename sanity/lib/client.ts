import { createClient } from "next-sanity"

import { apiVersion, dataset, projectId } from "../env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  // true = isr (cached and update every 60 seconds)
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
  perspective: 'published',
  // Request timeout (30 seconds)
  token: undefined,
  ignoreBrowserTokenWarning: true,
  withCredentials: false,
})

// Utility function to retry Sanity queries with exponential backoff
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    fallback?: T
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    fallback,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFn()
    } catch (error) {
      lastError = error as Error
      
      // Check if it's a network or 503 error
      const isRetryable = 
        error instanceof Error && 
        (error.message.includes('503') || 
         error.message.includes('fetch failed') ||
         error.message.includes('network') ||
         error.message.includes('ECONNRESET') ||
         error.message.includes('TLS'))

      if (!isRetryable || attempt === maxRetries - 1) {
        // Don't retry on final attempt or non-retryable errors
        break
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        initialDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      )

      console.warn(
        `Sanity API request failed (attempt ${attempt + 1}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`,
        error
      )

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // If we have a fallback, use it instead of throwing
  if (fallback !== undefined) {
    console.error('All Sanity API retry attempts failed, using fallback:', lastError)
    return fallback
  }

  // Otherwise throw the last error
  console.error('All Sanity API retry attempts failed:', lastError)
  throw lastError
}
