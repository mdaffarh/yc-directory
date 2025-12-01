import { z } from "zod"

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
    .string()
    .url()
    .refine(
      url => {
        try {
          const urlObj = new URL(url)
          const pathname = urlObj.pathname.toLowerCase()
          const hostname = urlObj.hostname.toLowerCase()

          // Reject URLs with query parameters that look like redirects
          const searchParams = urlObj.searchParams
          if (searchParams.has("url") || searchParams.has("sa") || pathname.includes("/url")) {
            return false
          }

          // Check for common image file extensions
          const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".avif"]

          // Must have image extension
          if (imageExtensions.some(ext => pathname.includes(ext))) {
            return true
          }

          // Allow common image hosting domains even without extension
          const imageHosts = ["imgur.com", "cloudinary.com", "unsplash.com", "pexels.com", "pixabay.com", "redbubble.net", "imagekit.io", "cloudfront.net", "i.imgur.com"]

          if (imageHosts.some(host => hostname.includes(host))) {
            return true
          }

          // Reject if no extension and not from trusted host
          return false
        } catch {
          return false
        }
      },
      {
        message: "Please provide a direct image URL (not a redirect or webpage link)",
      }
    ),
  pitch: z.string().min(10),
})
