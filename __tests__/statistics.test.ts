/**
 * Unit Tests for Statistics Aggregation Functions
 * Testing calculateTotalViews, calculateTotalLikes, findTopStartupByViews
 */

import { calculateTotalViews, calculateTotalLikes, findTopStartupByViews, type StartupWithViews } from "@/lib/helpers"

describe("Statistics Aggregation Functions", () => {
  describe("calculateTotalViews", () => {
    test("should calculate total views from array of startups", () => {
      const startups = [{ views: 10 }, { views: 5 }, { views: 25 }]

      const total = calculateTotalViews(startups)

      expect(total).toBe(40)
    })

    test("should handle null views as 0", () => {
      const startups = [{ views: 10 }, { views: null }, { views: 5 }]

      const total = calculateTotalViews(startups)

      expect(total).toBe(15)
    })

    test("should handle undefined views as 0", () => {
      const startups = [{ views: 10 }, {}, { views: 5 }]

      const total = calculateTotalViews(startups)

      expect(total).toBe(15)
    })

    test("should return 0 for empty array", () => {
      const total = calculateTotalViews([])

      expect(total).toBe(0)
    })

    test("should handle all null/undefined views", () => {
      const startups = [{ views: null }, { views: null }, {}]

      const total = calculateTotalViews(startups)

      expect(total).toBe(0)
    })

    test("should handle large numbers", () => {
      const startups = [{ views: 1000000 }, { views: 2000000 }, { views: 3000000 }]

      const total = calculateTotalViews(startups)

      expect(total).toBe(6000000)
    })

    test("should handle zero views", () => {
      const startups = [{ views: 0 }, { views: 10 }, { views: 0 }]

      const total = calculateTotalViews(startups)

      expect(total).toBe(10)
    })
  })

  describe("calculateTotalLikes", () => {
    test("should calculate total likes from array of startups", () => {
      const startups = [{ likes: ["user1", "user2"] }, { likes: ["user3"] }, { likes: ["user4", "user5", "user6"] }]

      const total = calculateTotalLikes(startups)

      expect(total).toBe(6)
    })

    test("should handle null likes as 0", () => {
      const startups = [{ likes: ["user1", "user2"] }, { likes: null }, { likes: ["user3"] }]

      const total = calculateTotalLikes(startups)

      expect(total).toBe(3)
    })

    test("should handle undefined likes as 0", () => {
      const startups = [{ likes: ["user1"] }, {}, { likes: ["user2"] }]

      const total = calculateTotalLikes(startups)

      expect(total).toBe(2)
    })

    test("should return 0 for empty array", () => {
      const total = calculateTotalLikes([])

      expect(total).toBe(0)
    })

    test("should handle empty likes arrays", () => {
      const startups = [{ likes: [] }, { likes: ["user1"] }, { likes: [] }]

      const total = calculateTotalLikes(startups)

      expect(total).toBe(1)
    })
  })

  describe("findTopStartupByViews", () => {
    test("should find startup with highest views", () => {
      const startups = [
        { views: 10, title: "First" },
        { views: 100, title: "Top" },
        { views: 30, title: "Third" },
      ]

      const top = findTopStartupByViews(startups)

      expect(top?.views).toBe(100)
      expect(top?.title).toBe("Top")
    })

    test("should handle null views as 0", () => {
      const startups = [
        { views: null, title: "Null" },
        { views: 10, title: "Top" },
        { views: 5, title: "Low" },
      ]

      const top = findTopStartupByViews(startups)

      expect(top?.views).toBe(10)
      expect(top?.title).toBe("Top")
    })

    test("should handle undefined views as 0", () => {
      const startups = [{ title: "Undefined" }, { views: 10, title: "Top" }, { views: 5, title: "Low" }]

      const top = findTopStartupByViews(startups)

      expect(top?.views).toBe(10)
      expect(top?.title).toBe("Top")
    })

    test("should return null for empty array", () => {
      const top = findTopStartupByViews([])

      expect(top).toBeNull()
    })

    test("should return first item when all have same views", () => {
      const startups = [
        { views: 50, title: "First" },
        { views: 50, title: "Second" },
        { views: 50, title: "Third" },
      ]

      const top = findTopStartupByViews(startups)

      expect(top?.views).toBe(50)
      expect(top?.title).toBe("First")
    })

    test("should handle single item array", () => {
      const startups = [{ views: 42, title: "Only" }]

      const top = findTopStartupByViews(startups)

      expect(top?.views).toBe(42)
      expect(top?.title).toBe("Only")
    })

    test("should return startup with 0 views if all are 0 or null", () => {
      const startups = [{ views: 0, title: "Zero" }, { views: null, title: "Null" }, {}]

      const top = findTopStartupByViews(startups)

      expect(top?.views).toBe(0)
      expect(top?.title).toBe("Zero")
    })
  })
})
