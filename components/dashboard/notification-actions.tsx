"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface NotificationActionsProps {
  hasUnread: boolean
}

export function NotificationActions({ hasUnread }: NotificationActionsProps) {
  const router = useRouter()

  const markAllAsRead = async () => {
    const supabase = createClient()
    await supabase
      .from("alerts")
      .update({ is_read: true })
      .eq("is_read", false)
    router.refresh()
  }

  const deleteAllRead = async () => {
    const supabase = createClient()
    await supabase
      .from("alerts")
      .delete()
      .eq("is_read", true)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      {hasUnread && (
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <Check className="mr-2 h-4 w-4" />
          Tout marquer comme lu
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={deleteAllRead}>
        <Trash2 className="mr-2 h-4 w-4" />
        Supprimer les lues
      </Button>
    </div>
  )
}
