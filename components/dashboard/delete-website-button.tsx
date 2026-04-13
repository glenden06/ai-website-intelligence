"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteWebsiteButtonProps {
  websiteId: string
}

export function DeleteWebsiteButton({ websiteId }: DeleteWebsiteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this website? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    const supabase = createClient()
    
    await supabase.from("websites").delete().eq("id", websiteId)

    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 text-destructive" />
      )}
      <span className="sr-only">Delete website</span>
    </Button>
  )
}
