import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: analyses } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", user?.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })

  const analysesByType = {
    ux: analyses?.filter((a) => a.type === "ux") || [],
    bugs: analyses?.filter((a) => a.type === "bugs") || [],
    competitive: analyses?.filter((a) => a.type === "competitive") || [],
    full: analyses?.filter((a) => a.type === "full") || [],
  }

  const getAverageScore = (analysesArray: typeof analyses) => {
    if (!analysesArray || analysesArray.length === 0) return null
    const scores = analysesArray.filter((a) => a.score !== null).map((a) => a.score as number)
    if (scores.length === 0) return null
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const getTrend = (analysesArray: typeof analyses) => {
    if (!analysesArray || analysesArray.length < 2) return "neutral"
    const recent = analysesArray.slice(0, 3)
    const older = analysesArray.slice(3, 6)
    const recentAvg = getAverageScore(recent)
    const olderAvg = getAverageScore(older)
    if (recentAvg === null || olderAvg === null) return "neutral"
    if (recentAvg > olderAvg) return "up"
    if (recentAvg < olderAvg) return "down"
    return "neutral"
  }

  const stats = [
    {
      name: "UX Analysis",
      count: analysesByType.ux.length,
      avgScore: getAverageScore(analysesByType.ux),
      trend: getTrend(analysesByType.ux),
    },
    {
      name: "Bug Detection",
      count: analysesByType.bugs.length,
      avgScore: getAverageScore(analysesByType.bugs),
      trend: getTrend(analysesByType.bugs),
    },
    {
      name: "Competitive Analysis",
      count: analysesByType.competitive.length,
      avgScore: getAverageScore(analysesByType.competitive),
      trend: getTrend(analysesByType.competitive),
    },
    {
      name: "Full Analysis",
      count: analysesByType.full.length,
      avgScore: getAverageScore(analysesByType.full),
      trend: getTrend(analysesByType.full),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Overview of all your website analyses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stat.avgScore !== null ? `${stat.avgScore}` : "-"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.count} {stat.count === 1 ? "analysis" : "analyses"}
                  </p>
                </div>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-600"
                      : stat.trend === "down"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : stat.trend === "down" ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Your latest completed analyses across all websites</CardDescription>
        </CardHeader>
        <CardContent>
          {!analyses || analyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">No analytics yet</h3>
              <p className="text-sm text-muted-foreground">
                Run some analyses to see your analytics data here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.slice(0, 10).map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium capitalize text-primary">
                      {analysis.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {analysis.score !== null && (
                      <span
                        className={`font-semibold ${
                          analysis.score >= 80
                            ? "text-green-600"
                            : analysis.score >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {analysis.score}/100
                      </span>
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
