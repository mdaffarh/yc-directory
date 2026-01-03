/**
 * Unit Tests for validateStartupForm
 * Testing form validation logic
 */

import { validateStartupForm, type StartupFormData } from "@/lib/helpers"

describe("validateStartupForm", () => {
  describe("Valid Data", () => {
    test("should return valid for correct form data", () => {
      const validData: StartupFormData = {
        title: "Valid Startup Title",
        description: "This is a valid description that meets the minimum character requirement.",
        category: "Technology",
        pitch: "This is a valid pitch for our startup.",
      }

      const result = validateStartupForm(validData)

      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })
  })

  describe("Title Validation", () => {
    test("should return error when title is empty", () => {
      const data: StartupFormData = {
        title: "",
        description: "Valid description with enough characters.",
        category: "Tech",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe("Title is required")
    })

    test("should return error when title is too short", () => {
      const data: StartupFormData = {
        title: "Ab",
        description: "Valid description with enough characters.",
        category: "Tech",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe("Title must be at least 3 characters")
    })

    test("should return error when title is too long", () => {
      const data: StartupFormData = {
        title: "a".repeat(101),
        description: "Valid description with enough characters.",
        category: "Tech",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe("Title must not exceed 100 characters")
    })

    test("should trim whitespace when checking if title is empty", () => {
      const data: StartupFormData = {
        title: "   ",
        description: "Valid description with enough characters.",
        category: "Tech",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe("Title is required")
    })
  })

  describe("Description Validation", () => {
    test("should return error when description is empty", () => {
      const data: StartupFormData = {
        title: "Valid Title",
        description: "",
        category: "Tech",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.description).toBe("Description is required")
    })

    test("should return error when description is too short", () => {
      const data: StartupFormData = {
        title: "Valid Title",
        description: "Too short",
        category: "Tech",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.description).toBe("Description must be at least 20 characters")
    })

    test("should return error when description is too long", () => {
      const data: StartupFormData = {
        title: "Valid Title",
        description: "a".repeat(501),
        category: "Tech",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.description).toBe("Description must not exceed 500 characters")
    })
  })

  describe("Category Validation", () => {
    test("should return error when category is empty", () => {
      const data: StartupFormData = {
        title: "Valid Title",
        description: "Valid description with enough characters.",
        category: "",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.category).toBe("Category is required")
    })

    test("should return error when category is too short", () => {
      const data: StartupFormData = {
        title: "Valid Title",
        description: "Valid description with enough characters.",
        category: "Ab",
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.category).toBe("Category must be at least 3 characters")
    })

    test("should return error when category is too long", () => {
      const data: StartupFormData = {
        title: "Valid Title",
        description: "Valid description with enough characters.",
        category: "a".repeat(21),
        pitch: "Valid pitch",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.category).toBe("Category must not exceed 20 characters")
    })
  })

  describe("Pitch Validation", () => {
    test("should return error when pitch is empty", () => {
      const data: StartupFormData = {
        title: "Valid Title",
        description: "Valid description with enough characters.",
        category: "Tech",
        pitch: "",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.pitch).toBe("Pitch is required")
    })

    test("should return error when pitch is too short", () => {
      const data: StartupFormData = {
        title: "Valid Title",
        description: "Valid description with enough characters.",
        category: "Tech",
        pitch: "Short",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.pitch).toBe("Pitch must be at least 10 characters")
    })
  })

  describe("Multiple Errors", () => {
    test("should return multiple errors when multiple fields are invalid", () => {
      const data: StartupFormData = {
        title: "",
        description: "Too short",
        category: "",
        pitch: "",
      }

      const result = validateStartupForm(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBeDefined()
      expect(result.errors.description).toBeDefined()
      expect(result.errors.category).toBeDefined()
      expect(result.errors.pitch).toBeDefined()
      expect(Object.keys(result.errors)).toHaveLength(4)
    })
  })
})
