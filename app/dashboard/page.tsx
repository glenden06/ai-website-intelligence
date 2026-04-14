import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, TrendingUp, AlertTriangle, CheckCircle, Plus, ArrowRight, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { ScoreGauge } from "@/components/dashboard/score-gauge"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const { data: analyses } = await supabase
    .from("analyses")
    .select("*, websites(name, url)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: alerts } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", user?.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5)

  const totalWebsites = websites?.length || 0
  const completedAnalyses = analyses?.filter((a) => a.status === "completed").length || 0
  const recentAnalyses = analyses?.filter((a) => a.status === "completed" && a.score !== null) || []
  const averageScore =
    recentAnalyses.reduce((acc, a) => acc + (a.score || 0), 0) / (recentAnalyses.length || 1) || 0
  const unreadAlerts = alerts?.length || 0

  const statusLabels: Record<string, string> = {
    completed: "Termine",
    analyzing: "En cours",
    error: "Erreur",
    pending: "En attente",
  }

  const typeLabels: Record<string, string> = {
    ux: "UX",
    bugs: "Bugs",
    competitive: "Concurrence",
    full: "Complete",
  }

  // Prepare chart data
  const scoreHistory = recentAnalyses
    .filter(a => a.score !== null)
    .slice(0, 7)
    .reverse()
    .map(a => ({
      date: new Date(a.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      score: a.score || 0,
    }))

  const analysisDistribution = [
    { name: "UX", value: analyses?.filter(a => a.type === "ux").length || 0, color: "#22c55e" },
    { name: "Bugs", value: analyses?.filter(a => a.type === "bugs").length || 0, color: "#f97316" },
    { name: "Concurrence", value: analyses?.filter(a => a.type === "competitive").length || 0, color: "#0ea5e9" },
    { name: "Complete", value: analyses?.filter(a => a.type === "full").length || 0, color: "#8b5cf6" },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/10" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total sites web</CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWebsites}</div>
            <p className="text-xs text-muted-foreground">Sites surveilles</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-green-500/10" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Analyses terminees</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedAnalyses}</div>
            <p className="text-xs text-muted-foreground">Analyses effectuees</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ScoreGauge score={Math.round(averageScore)} size="sm" showLabel={false} />
              <div>
                <div className="text-3xl font-bold">{Math.round(averageScore)}</div>
                <p className="text-xs text-muted-foreground">Sur 100</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-orange-500/10" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unreadAlerts}</div>
            <p className="text-xs text-muted-foreground">Non lues</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {recentAnalyses.length > 0 && (
        <DashboardCharts 
          scoreHistory={scoreHistory}
          analysisDistribution={analysisDistribution}
        />
      )}

      {/* Recent Analyses */}
      {recentAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analyses recentes</CardTitle>
            <CardDescription>Dernieres analyses effectuees sur vos sites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnalyses.slice(0, 5).map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <ScoreGauge score={analysis.score || 0} size="sm" showLabel={false} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {(analysis.websites as { name: string })?.name || "Site inconnu"}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {typeLabels[analysis.type] || analysis.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(analysis.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/websites/${analysis.website_id}/analysis/${analysis.id}`}>
                      Voir
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Websites List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vos sites web</CardTitle>
            <CardDescription>Gerez et analysez vos sites web</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/websites/new">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un site
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {totalWebsites === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Aucun site web</h3>
              <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                Ajoutez votre premier site pour commencer a obtenir des insights IA et ameliorer vos performances.
              </p>
              <Button asChild>
                <Link href="/dashboard/websites/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter votre premier site
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {websites?.slice(0, 5).map((website) => (
                <div
                  key={website.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{website.name}</h4>
                      <p className="text-sm text-muted-foreground">{website.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        website.status === "completed"
                          ? "success"
                          : website.status === "analyzing"
                            ? "default"
                            : website.status === "error"
                              ? "destructive"
                              : "secondary"
                      }
                    >
                      {statusLabels[website.status] || website.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/websites/${website.id}`}>
                        Voir
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {websites && websites.length > 5 && (
                <div className="pt-2 text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard/websites">
                      Voir tous les sites ({websites.length})
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <Link href="/dashboard/websites/new">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Ajouter un site</h3>
                <p className="text-sm text-muted-foreground">
                  Ajoutez un nouveau site web a analyser
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <Link href="/dashboard/analytics">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Voir les statistiques</h3>
                <p className="text-sm text-muted-foreground">
                  Consultez les statistiques detaillees
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
