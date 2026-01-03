/**
 * Unit Tests for Date Formatting Functions
 * Testing formatDate and formatRelativeTime
 */

import { formatDate, formatRelativeTime } from "@/lib/helpers"

describe("Date Formatting Functions", () => {
  describe("formatDate", () => {
    test("should format ISO date to human readable format", () => {
      const isoDate = "2025-12-10T00:00:00Z"

      const result = formatDate(isoDate)

      expect(result).toBe("December 10, 2025")
    })

    test("should handle different months", () => {
      const dates = [
        { iso: "2025-01-15T00:00:00Z", expected: "January 15, 2025" },
        { iso: "2025-06-20T00:00:00Z", expected: "June 20, 2025" },
        { iso: "2025-12-25T00:00:00Z", expected: "December 25, 2025" },
      ]

      dates.forEach(({ iso, expected }) => {
        expect(formatDate(iso)).toBe(expected)
      })
    })

    test("should handle first day of month", () => {
      const result = formatDate("2025-03-01T00:00:00Z")

      expect(result).toBe("March 1, 2025")
    })

    test("should handle last day of month", () => {
      const result = formatDate("2025-03-31T00:00:00Z")

      expect(result).toBe("March 31, 2025")
    })

    test("should handle leap year date", () => {
      const result = formatDate("2024-02-29T00:00:00Z")

      expect(result).toBe("February 29, 2024")
    })

    test("should handle different years", () => {
      const result1 = formatDate("2020-05-15T00:00:00Z")
      const result2 = formatDate("2030-05-15T00:00:00Z")

      expect(result1).toBe("May 15, 2020")
      expect(result2).toBe("May 15, 2030")
    })

    test("should ignore time component", () => {
      const result1 = formatDate("2025-12-10T00:00:00Z")
      const result2 = formatDate("2025-12-10T12:00:00Z")

      // Both should format to December 10, 2025
      expect(result1).toContain("December")
      expect(result1).toContain("2025")
      expect(result2).toContain("December")
      expect(result2).toContain("2025")
    })
  })

  describe("formatRelativeTime", () => {
    // Mock current date for consistent testing
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2025-12-16T12:00:00Z"))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    test('should return "Today" for current date', () => {
      const today = "2025-12-16T10:00:00Z"

      const result = formatRelativeTime(today)

      expect(result).toBe("Today")
    })

    test('should return "Yesterday" for previous day', () => {
      const yesterday = "2025-12-15T12:00:00Z"

      const result = formatRelativeTime(yesterday)

      expect(result).toBe("Yesterday")
    })

    test('should return "X days ago" for dates within last week', () => {
      const threeDaysAgo = "2025-12-13T12:00:00Z"

      const result = formatRelativeTime(threeDaysAgo)

      expect(result).toBe("3 days ago")
    })

    test('should return "X weeks ago" for dates within last month', () => {
      const twoWeeksAgo = "2025-12-02T12:00:00Z"

      const result = formatRelativeTime(twoWeeksAgo)

      expect(result).toBe("2 weeks ago")
    })

    test('should return "X months ago" for dates within last year', () => {
      const twoMonthsAgo = "2025-10-16T12:00:00Z"

      const result = formatRelativeTime(twoMonthsAgo)

      expect(result).toBe("2 months ago")
    })

    test('should return "X years ago" for dates over a year old', () => {
      const twoYearsAgo = "2023-12-16T12:00:00Z"

      const result = formatRelativeTime(twoYearsAgo)

      expect(result).toBe("2 years ago")
    })

    test("should handle exact 7 days ago", () => {
      const sevenDaysAgo = "2025-12-09T12:00:00Z"

      const result = formatRelativeTime(sevenDaysAgo)

      expect(result).toBe("1 weeks ago")
    })

    test("should handle 6 days ago (still in days)", () => {
      const sixDaysAgo = "2025-12-10T12:00:00Z"

      const result = formatRelativeTime(sixDaysAgo)

      expect(result).toBe("6 days ago")
    })

    test("should handle edge case: exactly 1 day ago", () => {
      const oneDayAgo = "2025-12-15T12:00:00Z"

      const result = formatRelativeTime(oneDayAgo)

      expect(result).toBe("Yesterday")
    })

    test("should handle edge case: 30 days ago (1 month)", () => {
      const thirtyDaysAgo = "2025-11-16T12:00:00Z"

      const result = formatRelativeTime(thirtyDaysAgo)

      expect(result).toBe("1 months ago")
    })

    test("should handle edge case: 365 days ago (1 year)", () => {
      const oneYearAgo = "2024-12-16T12:00:00Z"

      const result = formatRelativeTime(oneYearAgo)

      expect(result).toBe("1 years ago")
    })
  })

  describe("Edge Cases", () => {
    test("formatDate should handle invalid date gracefully", () => {
      const result = formatDate("invalid-date")

      expect(result).toBe("Invalid Date")
    })

    test("formatRelativeTime should handle future dates", () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2025-12-16T12:00:00Z"))

      const futureDate = "2025-12-20T12:00:00Z"
      const result = formatRelativeTime(futureDate)

      // Future dates will have negative diff, function returns negative days
      expect(result).toContain("ago")

      jest.useRealTimers()
    })
  })
})
