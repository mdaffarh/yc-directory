/**
 * Unit Tests for Like Toggle Functions
 * Testing toggleLikeInArray, hasUserLiked, getLikeCount
 */

import { toggleLikeInArray, hasUserLiked, getLikeCount } from "@/lib/helpers"

describe("Like Toggle Functions", () => {
  describe("toggleLikeInArray", () => {
    test("should add user ID when not present (like action)", () => {
      const likesArray = ["user1", "user2"]
      const userId = "user3"

      const result = toggleLikeInArray(likesArray, userId)

      expect(result).toContain("user3")
      expect(result).toHaveLength(3)
      expect(result).toEqual(["user1", "user2", "user3"])
    })

    test("should remove user ID when present (unlike action)", () => {
      const likesArray = ["user1", "user2", "user3"]
      const userId = "user2"

      const result = toggleLikeInArray(likesArray, userId)

      expect(result).not.toContain("user2")
      expect(result).toHaveLength(2)
      expect(result).toEqual(["user1", "user3"])
    })

    test("should not mutate original array", () => {
      const likesArray = ["user1", "user2"]
      const original = [...likesArray]
      const userId = "user3"

      toggleLikeInArray(likesArray, userId)

      expect(likesArray).toEqual(original)
    })

    test("should handle empty array (first like)", () => {
      const likesArray: string[] = []
      const userId = "user1"

      const result = toggleLikeInArray(likesArray, userId)

      expect(result).toEqual(["user1"])
      expect(result).toHaveLength(1)
    })

    test("should handle single user unliking (array becomes empty)", () => {
      const likesArray = ["user1"]
      const userId = "user1"

      const result = toggleLikeInArray(likesArray, userId)

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    test("should preserve order when adding user", () => {
      const likesArray = ["user1", "user2", "user3"]
      const userId = "user4"

      const result = toggleLikeInArray(likesArray, userId)

      expect(result).toEqual(["user1", "user2", "user3", "user4"])
    })

    test("should preserve order when removing user from middle", () => {
      const likesArray = ["user1", "user2", "user3", "user4"]
      const userId = "user2"

      const result = toggleLikeInArray(likesArray, userId)

      expect(result).toEqual(["user1", "user3", "user4"])
    })

    test("should handle duplicate user IDs (remove only one)", () => {
      const likesArray = ["user1", "user2", "user2", "user3"]
      const userId = "user2"

      const result = toggleLikeInArray(likesArray, userId)

      // Should remove all instances
      expect(result).toEqual(["user1", "user3"])
    })
  })

  describe("hasUserLiked", () => {
    test("should return true when user has liked", () => {
      const likesArray = ["user1", "user2", "user3"]
      const userId = "user2"

      const result = hasUserLiked(likesArray, userId)

      expect(result).toBe(true)
    })

    test("should return false when user has not liked", () => {
      const likesArray = ["user1", "user2", "user3"]
      const userId = "user4"

      const result = hasUserLiked(likesArray, userId)

      expect(result).toBe(false)
    })

    test("should return false for empty array", () => {
      const likesArray: string[] = []
      const userId = "user1"

      const result = hasUserLiked(likesArray, userId)

      expect(result).toBe(false)
    })

    test("should be case sensitive", () => {
      const likesArray = ["User1", "user2"]
      const userId = "user1"

      const result = hasUserLiked(likesArray, userId)

      expect(result).toBe(false)
    })
  })

  describe("getLikeCount", () => {
    test("should return count of likes", () => {
      const likesArray = ["user1", "user2", "user3"]

      const count = getLikeCount(likesArray)

      expect(count).toBe(3)
    })

    test("should return 0 for empty array", () => {
      const likesArray: string[] = []

      const count = getLikeCount(likesArray)

      expect(count).toBe(0)
    })

    test("should return 0 for null", () => {
      const count = getLikeCount(null)

      expect(count).toBe(0)
    })

    test("should return 0 for undefined", () => {
      const count = getLikeCount(undefined)

      expect(count).toBe(0)
    })

    test("should handle single like", () => {
      const likesArray = ["user1"]

      const count = getLikeCount(likesArray)

      expect(count).toBe(1)
    })

    test("should count duplicate IDs (if present)", () => {
      const likesArray = ["user1", "user1", "user2"]

      const count = getLikeCount(likesArray)

      expect(count).toBe(3)
    })
  })

  describe("Integration Tests", () => {
    test("toggle like flow: like -> unlike -> like", () => {
      let likes = ["user1", "user2"]
      const userId = "user3"

      // Like
      likes = toggleLikeInArray(likes, userId)
      expect(hasUserLiked(likes, userId)).toBe(true)
      expect(getLikeCount(likes)).toBe(3)

      // Unlike
      likes = toggleLikeInArray(likes, userId)
      expect(hasUserLiked(likes, userId)).toBe(false)
      expect(getLikeCount(likes)).toBe(2)

      // Like again
      likes = toggleLikeInArray(likes, userId)
      expect(hasUserLiked(likes, userId)).toBe(true)
      expect(getLikeCount(likes)).toBe(3)
    })

    test("multiple users liking and unliking", () => {
      let likes: string[] = []

      // User1 likes
      likes = toggleLikeInArray(likes, "user1")
      expect(getLikeCount(likes)).toBe(1)

      // User2 likes
      likes = toggleLikeInArray(likes, "user2")
      expect(getLikeCount(likes)).toBe(2)

      // User1 unlikes
      likes = toggleLikeInArray(likes, "user1")
      expect(getLikeCount(likes)).toBe(1)
      expect(hasUserLiked(likes, "user1")).toBe(false)
      expect(hasUserLiked(likes, "user2")).toBe(true)
    })
  })
})
