"use client"

import React, { useActionState, useState } from "react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import dynamic from "next/dynamic"
import { Button } from "./ui/button"
import { Send } from "lucide-react"
import { formSchema } from "@/lib/validation"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createPitch } from "@/lib/actions"
import { STARTUP_CATEGORIES } from "@/lib/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [pitch, setPitch] = useState("")
  const [category, setCategory] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      // Validate image file
      const imageFile = formData.get("link") as File
      if (!imageFile || imageFile.size === 0) {
        setErrors({ link: "Please upload an image" })
        toast({
          title: "Error",
          description: "Please upload an image for your startup",
          variant: "destructive",
        })
        return { ...prevState, error: "Image required", status: "ERROR" }
      }

      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: category,
        pitch,
      }

      await formSchema.parseAsync(formValues)

      const result = await createPitch(prevState, formData, pitch, category)

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        })
        router.push(`/startup/${result._id}`)
      }

      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors

        setErrors(fieldErrors as unknown as Record<string, string>)
        toast({
          title: "Error",
          description: "Please check your inputs and try again",
        })
        return { ...prevState, error: "Validation failed", status: "ERROR" }
      }

      toast({
        title: "Error",
        description: "An unexpected error has occured",
      })
      return {
        ...prevState,
        error: "An unexpected error has occured",
        status: "ERROR",
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        })
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: "", status: "INITIAL" })

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input id="title" name="title" value={title} onChange={e => setTitle(e.target.value)} className="startup-form_input" required placeholder="Startup Title" />

        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} className="startup-form_textarea" required placeholder="Startup Description (Min. 20 characters)" />

        {errors.description && <p className="startup-form_error">{errors.description}</p>}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="startup-form_input">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {STARTUP_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="category" value={category} />

        {errors.category && <p className="startup-form_error">{errors.category}</p>}
      </div>
      <div>
        <label htmlFor="image" className="startup-form_label">
          Startup Image
        </label>

        <div className="startup-form_image-upload">
          <label htmlFor="link" className="startup-form_image-label">
            {imagePreview ? (
              <div className="relative w-full h-full group">
                <Image src={imagePreview} alt="Preview" fill className="rounded-lg object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <p className="text-white text-sm font-medium">Click to change image</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium mb-1">Click to upload image</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </label>
          <Input id="link" name="link" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="category" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={value => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly decribe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-6" />
      </Button>
    </form>
  )
}

export default StartupForm
