"use client"

import { deletePitch } from "@/lib/actions"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"

interface StartupActionsProps {
  startupId: string
  isOwner: boolean
  variant?: "default" | "card"
  authorId?: string
}

const StartupActions = ({ startupId, isOwner, variant = "default", authorId }: StartupActionsProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOwner) return null

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this startup? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deletePitch(startupId)

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Startup deleted successfully",
        })
        // Redirect akan otomatis fetch fresh data karena sudah revalidate di server action
        router.push(authorId ? `/user/${authorId}` : "/")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete startup",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Card variant - compact buttons for profile cards
  if (variant === "card") {
    return (
      <div className="flex gap-2">
        <Link href={`/startup/${startupId}/edit`}>
          <Button size="sm" variant="outline" className="text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors">
            <Pencil className="size-3 mr-1" />
            Edit
          </Button>
        </Link>
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="text-xs hover:bg-red-700 transition-colors">
          <Trash2 className="size-3 mr-1" />
          {isDeleting ? "..." : "Delete"}
        </Button>
      </div>
    )
  }

  // Default variant - larger buttons for detail page
  return (
    <div className="flex gap-3 mt-5">
      <Link href={`/startup/${startupId}/edit`}>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Pencil className="size-4 mr-2" />
          Edit
        </Button>
      </Link>
      <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
        <Trash2 className="size-4 mr-2" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  )
}

export default StartupActions
