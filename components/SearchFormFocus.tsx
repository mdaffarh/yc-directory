"use client"

import { useEffect } from "react"

const SearchFormFocus = () => {
  useEffect(() => {
    // Check if URL has #search hash
    if (window.location.hash === "#search") {
      const searchInput = document.getElementById("search")
      if (searchInput) {
        // Small delay to ensure smooth scroll completes first
        setTimeout(() => {
          searchInput.focus()
        }, 100)
      }
    }
  }, [])

  return null
}

export default SearchFormFocus
