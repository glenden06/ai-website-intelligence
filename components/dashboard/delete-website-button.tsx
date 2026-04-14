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
    if (!confirm("Etes-vous sur de vouloir supprimer ce site ? Cette action est irreversible.")) {
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
      <span className="sr-only">Supprimer le site</span>
    </Button>
  )
}
