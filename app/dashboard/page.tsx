import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, TrendingUp, AlertTriangle, CheckCircle, Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: websites, error: websitesError } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const { data: analyses } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const totalWebsites = websites?.length || 0
  const completedAnalyses = analyses?.filter((a) => a.status === "completed").length || 0
  const averageScore =
    analyses?.filter((a) => a.score !== null).reduce((acc, a) => acc + (a.score || 0), 0) /
      (analyses?.filter((a) => a.score !== null).length || 1) || 0
  const issuesFound = analyses?.reduce((acc, a) => {
    const results = a.results as { issues?: number } | null
    return acc + (results?.issues || 0)
  }, 0) || 0

  const statusLabels: Record<string, string> = {
    completed: "Termine",
    analyzing: "En cours",
    error: "Erreur",
    pending: "En attente",
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total sites web</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWebsites}</div>
            <p className="text-xs text-muted-foreground">Sites surveilles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Analyses terminees</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAnalyses}</div>
            <p className="text-xs text-muted-foreground">Analyses effectuees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageScore)}</div>
            <p className="text-xs text-muted-foreground">Sur 100</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Problemes detectes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issuesFound}</div>
            <p className="text-xs text-muted-foreground">Sur tous les sites</p>
          </CardContent>
        </Card>
      </div>

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
              <Globe className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">Aucun site web</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Ajoutez votre premier site pour commencer a obtenir des insights IA.
              </p>
              <Button asChild>
                <Link href="/dashboard/websites/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter votre premier site
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {websites?.map((website) => (
                <div
                  key={website.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
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
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        website.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : website.status === "analyzing"
                            ? "bg-blue-100 text-blue-700"
                            : website.status === "error"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[website.status] || website.status}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/websites/${website.id}`}>Voir les details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
