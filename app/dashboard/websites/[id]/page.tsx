import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Globe, MousePointerClick, Bug, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"
import { AnalyzeButton } from "@/components/dashboard/analyze-button"

interface WebsiteDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function WebsiteDetailPage({ params }: WebsiteDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: website, error } = await supabase
    .from("websites")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single()

  if (error || !website) {
    notFound()
  }

  const { data: analyses } = await supabase
    .from("analyses")
    .select("*")
    .eq("website_id", id)
    .order("created_at", { ascending: false })

  const analysisTypes = [
    {
      type: "ux",
      name: "Analyse UX",
      description: "Analysez l'experience utilisateur et les patterns de navigation",
      icon: MousePointerClick,
    },
    {
      type: "bugs",
      name: "Detection de bugs",
      description: "Trouvez les liens casses, erreurs et problemes techniques",
      icon: Bug,
    },
    {
      type: "competitive",
      name: "Analyse concurrentielle",
      description: "Comparez avec la concurrence et les tendances du marche",
      icon: TrendingUp,
    },
    {
      type: "full",
      name: "Analyse complete",
      description: "Analyse complete avec toutes les fonctionnalites",
      icon: Sparkles,
    },
  ]

  const statusLabels: Record<string, string> = {
    completed: "Termine",
    analyzing: "En cours",
    running: "En cours",
    error: "Erreur",
    pending: "En attente",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{website.name}</h1>
              <p className="text-sm text-muted-foreground">{website.url}</p>
            </div>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
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
      </div>

      {/* Analysis Types */}
      <div className="grid gap-4 md:grid-cols-2">
        {analysisTypes.map((analysis) => {
          const latestAnalysis = analyses?.find((a) => a.type === analysis.type)
          return (
            <Card key={analysis.type}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <analysis.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{analysis.name}</CardTitle>
                    <CardDescription>{analysis.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {latestAnalysis ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Derniere execution :</span>
                      <span>
                        {new Date(latestAnalysis.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {latestAnalysis.score !== null && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score :</span>
                        <span className="font-semibold text-primary">
                          {latestAnalysis.score}/100
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <AnalyzeButton
                        websiteId={website.id}
                        websiteUrl={website.url}
                        analysisType={analysis.type}
                      />
                      {latestAnalysis.status === "completed" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/dashboard/websites/${website.id}/analysis/${latestAnalysis.id}`}
                          >
                            Voir les resultats
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Aucune analyse effectuee
                    </p>
                    <AnalyzeButton
                      websiteId={website.id}
                      websiteUrl={website.url}
                      analysisType={analysis.type}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Analysis History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des analyses</CardTitle>
          <CardDescription>Analyses precedentes pour ce site</CardDescription>
        </CardHeader>
        <CardContent>
          {!analyses || analyses.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune analyse. Lancez votre premiere analyse ci-dessus.
            </p>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-muted px-2 py-1 text-xs font-medium capitalize">
                      {analysis.type === "ux" ? "UX" : analysis.type === "bugs" ? "Bugs" : analysis.type === "competitive" ? "Concurrence" : "Complet"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(analysis.created_at).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {analysis.score !== null && (
                      <span className="font-medium">{analysis.score}/100</span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        analysis.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : analysis.status === "running"
                            ? "bg-blue-100 text-blue-700"
                            : analysis.status === "error"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[analysis.status] || analysis.status}
                    </span>
                    {analysis.status === "completed" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/websites/${website.id}/analysis/${analysis.id}`}
                        >
                          Voir
                        </Link>
                      </Button>
                    )}
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
