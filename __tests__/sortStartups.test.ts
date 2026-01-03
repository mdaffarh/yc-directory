/**
 * Unit Tests for sortStartups
 * Testing sorting algorithms for startup arrays
 */

import { sortStartups, type StartupForSort } from "@/lib/helpers"

describe("sortStartups", () => {
  const mockStartups: StartupForSort[] = [
    { _createdAt: "2025-01-15T10:00:00Z", views: 50 },
    { _createdAt: "2025-01-10T10:00:00Z", views: 100 },
    { _createdAt: "2025-01-20T10:00:00Z", views: 30 },
    { _createdAt: "2025-01-05T10:00:00Z", views: 75 },
  ]

  describe("Sort by Newest", () => {
    test("should sort startups by creation date (newest first)", () => {
      const result = sortStartups(mockStartups, "newest")

      expect(result[0]._createdAt).toBe("2025-01-20T10:00:00Z")
      expect(result[1]._createdAt).toBe("2025-01-15T10:00:00Z")
      expect(result[2]._createdAt).toBe("2025-01-10T10:00:00Z")
      expect(result[3]._createdAt).toBe("2025-01-05T10:00:00Z")
    })

    test("should not mutate original array", () => {
      const original = [...mockStartups]
      sortStartups(mockStartups, "newest")

      expect(mockStartups).toEqual(original)
    })

    test("should handle empty array", () => {
      const result = sortStartups([], "newest")

      expect(result).toEqual([])
    })

    test("should handle single item array", () => {
      const single = [{ _createdAt: "2025-01-10T10:00:00Z", views: 10 }]
      const result = sortStartups(single, "newest")

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(single[0])
    })
  })

  describe("Sort by Most Viewed", () => {
    test("should sort startups by views (highest first)", () => {
      const result = sortStartups(mockStartups, "most_viewed")

      expect(result[0].views).toBe(100)
      expect(result[1].views).toBe(75)
      expect(result[2].views).toBe(50)
      expect(result[3].views).toBe(30)
    })

    test("should handle null views as 0", () => {
      const startupsWithNull: StartupForSort[] = [
        { _createdAt: "2025-01-10T10:00:00Z", views: 50 },
        { _createdAt: "2025-01-15T10:00:00Z", views: null },
        { _createdAt: "2025-01-20T10:00:00Z", views: 30 },
      ]

      const result = sortStartups(startupsWithNull, "most_viewed")

      expect(result[0].views).toBe(50)
      expect(result[1].views).toBe(30)
      expect(result[2].views).toBe(null)
    })

    test("should handle undefined views as 0", () => {
      const startupsWithUndefined: StartupForSort[] = [{ _createdAt: "2025-01-10T10:00:00Z", views: 50 }, { _createdAt: "2025-01-15T10:00:00Z" }, { _createdAt: "2025-01-20T10:00:00Z", views: 30 }]

      const result = sortStartups(startupsWithUndefined, "most_viewed")

      expect(result[0].views).toBe(50)
      expect(result[1].views).toBe(30)
      expect(result[2].views).toBeUndefined()
    })

    test("should not mutate original array", () => {
      const original = [...mockStartups]
      sortStartups(mockStartups, "most_viewed")

      expect(mockStartups).toEqual(original)
    })
  })

  describe("Edge Cases", () => {
    test("should handle all items with same date when sorting by newest", () => {
      const sameDate: StartupForSort[] = [
        { _createdAt: "2025-01-10T10:00:00Z", views: 10 },
        { _createdAt: "2025-01-10T10:00:00Z", views: 20 },
        { _createdAt: "2025-01-10T10:00:00Z", views: 30 },
      ]

      const result = sortStartups(sameDate, "newest")

      expect(result).toHaveLength(3)
      // Order should remain stable
    })

    test("should handle all items with same views when sorting by most_viewed", () => {
      const sameViews: StartupForSort[] = [
        { _createdAt: "2025-01-10T10:00:00Z", views: 50 },
        { _createdAt: "2025-01-15T10:00:00Z", views: 50 },
        { _createdAt: "2025-01-20T10:00:00Z", views: 50 },
      ]

      const result = sortStartups(sameViews, "most_viewed")

      expect(result).toHaveLength(3)
      result.forEach(item => expect(item.views).toBe(50))
    })

    test("should preserve object properties when sorting", () => {
      interface ExtendedStartup extends StartupForSort {
        title: string
      }

      const extended: ExtendedStartup[] = [
        { _createdAt: "2025-01-10T10:00:00Z", views: 10, title: "First" },
        { _createdAt: "2025-01-20T10:00:00Z", views: 20, title: "Second" },
      ]

      const result = sortStartups(extended, "newest")

      expect(result[0].title).toBe("Second")
      expect(result[1].title).toBe("First")
    })
  })
})
