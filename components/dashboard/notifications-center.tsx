"use client"

import { useState } from "react"
import { Bell, X, AlertTriangle, Bug, Zap, Info, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

interface Alert {
  id: string
  type: "bug" | "ux" | "performance" | "security" | "info"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  message: string
  is_read: boolean
  created_at: string
  website_id?: string
  websites?: { name: string }
}

const fetcher = async () => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("alerts")
    .select("*, websites(name)")
    .order("created_at", { ascending: false })
    .limit(20)
  
  if (error) throw error
  return data as Alert[]
}

const typeIcons: Record<string, React.ElementType> = {
  bug: Bug,
  ux: Zap,
  performance: Zap,
  security: AlertTriangle,
  info: Info,
}

const severityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function NotificationsCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: alerts, error, mutate } = useSWR("alerts", fetcher)

  const unreadCount = alerts?.filter(a => !a.is_read).length || 0

  const markAsRead = async (id: string) => {
    const supabase = createClient()
    await supabase
      .from("alerts")
      .update({ is_read: true })
      .eq("id", id)
    mutate()
  }

  const markAllAsRead = async () => {
    const supabase = createClient()
    await supabase
      .from("alerts")
      .update({ is_read: true })
      .eq("is_read", false)
    mutate()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes}min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString("fr-FR")
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Tout marquer lu
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {error && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Erreur de chargement
                </div>
              )}
              
              {!error && alerts?.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  Aucune notification
                </div>
              )}

              {alerts?.map((alert) => {
                const Icon = typeIcons[alert.type] || Info
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex gap-3 border-b p-4 transition-colors hover:bg-muted/50",
                      !alert.is_read && "bg-primary/5"
                    )}
                    onClick={() => !alert.is_read && markAsRead(alert.id)}
                  >
                    <div className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      severityColors[alert.severity]
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm",
                          !alert.is_read && "font-medium"
                        )}>
                          {alert.title}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn("flex-shrink-0 text-xs", severityColors[alert.severity])}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {alert.message}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        {alert.websites?.name && (
                          <span className="truncate">{alert.websites.name}</span>
                        )}
                        <span>•</span>
                        <span>{formatDate(alert.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
