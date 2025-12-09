"use client"

import { toggleLike } from "@/lib/actions"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "@/hooks/use-toast"

interface LikeButtonProps {
  startupId: string
  isLiked: boolean
}

const LikeButton = ({ startupId, isLiked: initialLiked }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const result = await toggleLike(startupId)

        if (result.status === "SUCCESS") {
          setIsLiked(result.isLiked)
          toast({
            title: result.isLiked ? "Liked!" : "Like removed",
            description: result.isLiked ? "You liked this startup" : "Startup removed from your likes",
          })
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to toggle like",
            variant: "destructive",
          })
        }
      } catch {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
        isLiked ? "bg-primary border-primary text-white hover:bg-primary/90" : "bg-white border-black text-black hover:bg-primary-100 hover:border-primary"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Heart className={`size-5 ${isLiked ? "fill-current" : ""}`} />
      <span className="font-medium text-16-medium">{isLiked ? "Liked" : "Like"}</span>
    </button>
  )
}

export default LikeButton
