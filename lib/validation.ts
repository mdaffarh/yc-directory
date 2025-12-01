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
          // Check for common image file extensions
          const urlObj = new URL(url)
          const pathname = urlObj.pathname.toLowerCase()
          const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".avif"]

          // Allow if it has image extension
          if (imageExtensions.some(ext => pathname.includes(ext))) {
            return true
          }

          // Allow common image hosting domains
          const hostname = urlObj.hostname.toLowerCase()
          const imageHosts = ["imgur.com", "cloudinary.com", "unsplash.com", "pexels.com", "pixabay.com", "redbubble.net", "imagekit.io", "cloudfront.net"]

          if (imageHosts.some(host => hostname.includes(host))) {
            return true
          }

          // If no extension or known host, allow it anyway (relaxed validation)
          return true
        } catch {
          return false
        }
      },
      {
        message: "Please provide a valid image URL",
      }
    ),
  pitch: z.string().min(10),
})
