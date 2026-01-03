/**
 * Pure helper functions for business logic
 * These functions are designed to be easily testable with 100% code coverage
 */

// ==========================================
// 1. FORM VALIDATION HELPER
// ==========================================

export interface StartupFormData {
  title: string
  description: string
  category: string
  pitch: string
}

export interface ValidationResult {
  isValid: boolean
  errors: {
    title?: string
    description?: string
    category?: string
    pitch?: string
  }
}

/**
 * Validates startup form data
 * @param data - Form data to validate
 * @returns Validation result with errors if any
 */
export function validateStartupForm(data: StartupFormData): ValidationResult {
  const errors: ValidationResult["errors"] = {}

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.title = "Title is required"
  } else if (data.title.length < 3) {
    errors.title = "Title must be at least 3 characters"
  } else if (data.title.length > 100) {
    errors.title = "Title must not exceed 100 characters"
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.description = "Description is required"
  } else if (data.description.length < 20) {
    errors.description = "Description must be at least 20 characters"
  } else if (data.description.length > 500) {
    errors.description = "Description must not exceed 500 characters"
  }

  // Category validation
  if (!data.category || data.category.trim().length === 0) {
    errors.category = "Category is required"
  } else if (data.category.length < 3) {
    errors.category = "Category must be at least 3 characters"
  } else if (data.category.length > 20) {
    errors.category = "Category must not exceed 20 characters"
  }

  // Pitch validation
  if (!data.pitch || data.pitch.trim().length === 0) {
    errors.pitch = "Pitch is required"
  } else if (data.pitch.length < 10) {
    errors.pitch = "Pitch must be at least 10 characters"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// ==========================================
// 2. SORTING HELPER
// ==========================================

export type SortOption = "newest" | "most_viewed"

export interface StartupForSort {
  _createdAt: string
  views?: number | null
}

/**
 * Sorts array of startups by specified criteria
 * @param startups - Array of startups to sort
 * @param sortBy - Sort criteria (newest or most_viewed)
 * @returns Sorted array (does not mutate original)
 */
export function sortStartups<T extends StartupForSort>(startups: T[], sortBy: SortOption): T[] {
  // Create a copy to avoid mutation
  const sorted = [...startups]

  if (sortBy === "newest") {
    return sorted.sort((a, b) => {
      const dateA = new Date(a._createdAt).getTime()
      const dateB = new Date(b._createdAt).getTime()
      return dateB - dateA // Descending (newest first)
    })
  }

  if (sortBy === "most_viewed") {
    return sorted.sort((a, b) => {
      const viewsA = a.views || 0
      const viewsB = b.views || 0
      return viewsB - viewsA // Descending (most viewed first)
    })
  }

  return sorted
}

// ==========================================
// 3. STATISTICS AGGREGATION HELPER
// ==========================================

export interface StartupWithViews {
  views?: number | null
}

/**
 * Calculates total views from array of startups
 * @param startups - Array of startups with views property
 * @returns Total number of views
 */
export function calculateTotalViews(startups: StartupWithViews[]): number {
  return startups.reduce((acc, startup) => {
    return acc + (startup.views || 0)
  }, 0)
}

/**
 * Calculates total likes from array of startups
 * @param startups - Array of startups with likes array
 * @returns Total number of likes
 */
export function calculateTotalLikes(startups: Array<{ likes?: string[] | null }>): number {
  return startups.reduce((acc, startup) => {
    return acc + (startup.likes?.length || 0)
  }, 0)
}

/**
 * Finds startup with highest views
 * @param startups - Array of startups with views
 * @returns Startup with most views or null if empty
 */
export function findTopStartupByViews<T extends StartupWithViews>(startups: T[]): T | null {
  if (startups.length === 0) return null

  return startups.reduce((top, current) => {
    const topViews = top.views || 0
    const currentViews = current.views || 0
    return currentViews > topViews ? current : top
  })
}

// ==========================================
// 4. LIKE TOGGLE HELPER
// ==========================================

/**
 * Toggles user ID in likes array
 * If user ID exists, removes it (unlike)
 * If user ID doesn't exist, adds it (like)
 * @param likesArray - Current array of user IDs who liked
 * @param userId - User ID to toggle
 * @returns New likes array (does not mutate original)
 */
export function toggleLikeInArray(likesArray: string[], userId: string): string[] {
  // Check if user already liked
  const hasLiked = likesArray.includes(userId)

  if (hasLiked) {
    // Unlike: Remove user ID
    return likesArray.filter(id => id !== userId)
  } else {
    // Like: Add user ID
    return [...likesArray, userId]
  }
}

/**
 * Checks if user has liked
 * @param likesArray - Array of user IDs who liked
 * @param userId - User ID to check
 * @returns True if user has liked
 */
export function hasUserLiked(likesArray: string[], userId: string): boolean {
  return likesArray.includes(userId)
}

/**
 * Gets like count
 * @param likesArray - Array of user IDs who liked
 * @returns Number of likes
 */
export function getLikeCount(likesArray: string[] | null | undefined): number {
  return likesArray?.length || 0
}

// ==========================================
// 5. DATE FORMATTING HELPER
// (Already exists in lib/utils.ts, re-exported here for convenience)
// ==========================================

/**
 * Formats ISO date string to human readable format
 * @param date - ISO date string (e.g., "2025-12-10T00:00:00Z")
 * @returns Formatted date string (e.g., "December 10, 2025")
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Formats date to relative time (e.g., "2 days ago")
 * @param date - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(date: string): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInMs = now.getTime() - targetDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}
