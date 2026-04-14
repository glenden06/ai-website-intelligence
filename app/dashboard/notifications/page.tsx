import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Bug, Zap, AlertTriangle, Info, Check, Trash2 } from "lucide-react"
import Link from "next/link"
import { NotificationActions } from "@/components/dashboard/notification-actions"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: alerts } = await supabase
    .from("alerts")
    .select("*, websites(name, url)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const unreadCount = alerts?.filter(a => !a.is_read).length || 0

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

  const severityLabels: Record<string, string> = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    critical: "Critique",
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes les notifications sont lues"
            }
          </p>
        </div>
        {alerts && alerts.length > 0 && (
          <NotificationActions hasUnread={unreadCount > 0} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les notifications</CardTitle>
          <CardDescription>
            Alertes et notifications de vos analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!alerts || alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Aucune notification</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Les alertes apparaitront ici lorsque des problemes seront detectes sur vos sites.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const Icon = typeIcons[alert.type] || Info
                return (
                  <div
                    key={alert.id}
                    className={`flex gap-4 rounded-lg border p-4 transition-colors ${
                      !alert.is_read ? "bg-primary/5 border-primary/20" : ""
                    }`}
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${severityColors[alert.severity]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${!alert.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                              {alert.title}
                            </h4>
                            {!alert.is_read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                        </div>
                        <Badge className={severityColors[alert.severity]}>
                          {severityLabels[alert.severity]}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        {alert.websites && (
                          <Link 
                            href={`/dashboard/websites/${alert.website_id}`}
                            className="hover:text-primary hover:underline"
                          >
                            {(alert.websites as { name: string }).name}
                          </Link>
                        )}
                        <span>{formatDate(alert.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
