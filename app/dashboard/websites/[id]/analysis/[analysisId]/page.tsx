"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, RefreshCw, CheckCircle, AlertCircle, Globe, Clock } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { ScoreGauge } from "@/components/dashboard/score-gauge"

interface Website {
  id: string
  name: string
  url: string
}

interface Analysis {
  id: string
  type: string
  status: string
  score: number | null
  results: {
    markdown?: string
    scrapedData?: Record<string, unknown>
    content?: string
  } | null
  created_at: string
  completed_at: string | null
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState<Website | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamContent, setStreamContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const { data: websiteData } = await supabase
        .from("websites")
        .select("*")
        .eq("id", params.id)
        .single()

      const { data: analysisData } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", params.analysisId)
        .single()

      setWebsite(websiteData)
      setAnalysis(analysisData)
      setIsLoading(false)

      // If analysis is already completed, show the results
      if (analysisData?.status === "completed" && analysisData.results) {
        const content = analysisData.results.markdown || analysisData.results.content || ""
        setStreamContent(content)
      }
    }

    loadData()
  }, [params.id, params.analysisId])

  useEffect(() => {
    if (website && analysis && !hasStartedRef.current && analysis.status === "pending") {
      hasStartedRef.current = true
      startAnalysis()
    }
  }, [website, analysis])

  const startAnalysis = async () => {
    if (!website || !analysis) return

    setIsStreaming(true)
    setStreamContent("")
    setError(null)

    try {
      const response = await fetch("/api/analyze/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteId: website.id,
          analysisId: analysis.id,
          type: analysis.type,
          websiteData: analysis.results?.scrapedData || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("Impossible de lire la reponse")
      }

      let fullContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk
        setStreamContent(fullContent)
      }

      setIsStreaming(false)
      
      // Refresh analysis data
      const supabase = createClient()
      const { data: updatedAnalysis } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysis.id)
        .single()
      
      if (updatedAnalysis) {
        setAnalysis(updatedAnalysis)
      }
      
      router.refresh()
    } catch (err) {
      console.error("Erreur:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setIsStreaming(false)
    }
  }

  const typeLabels: Record<string, string> = {
    ux: "UX",
    bugs: "Detection de bugs",
    competitive: "Concurrentielle",
    full: "Complete",
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de l&apos;analyse...</p>
        </div>
      </div>
    )
  }

  if (!website || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="mb-4 text-muted-foreground">Analyse introuvable</p>
        <Button asChild>
          <Link href="/dashboard">Retour au tableau de bord</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/dashboard/websites/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au site
          </Link>
        </Button>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Analyse {typeLabels[analysis.type] || analysis.type}
              </h1>
              <p className="text-muted-foreground">{website.name}</p>
              <p className="text-sm text-muted-foreground">{website.url}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={
              isStreaming ? "default" : 
              analysis.status === "completed" ? "success" : 
              analysis.status === "error" ? "destructive" : "secondary"
            }>
              {isStreaming ? (
                <>
                  <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  En cours
                </>
              ) : analysis.status === "completed" ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Terminee
                </>
              ) : analysis.status === "error" ? (
                <>
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Erreur
                </>
              ) : (
                "En attente"
              )}
            </Badge>
            
            {analysis.completed_at && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {new Date(analysis.completed_at).toLocaleString("fr-FR")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Card */}
      {analysis.score !== null && !isStreaming && (
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold">Score global</h3>
              <p className="text-sm text-muted-foreground">
                {analysis.score >= 80 ? "Excellent ! Votre site est bien optimise." :
                 analysis.score >= 60 ? "Bien, mais des ameliorations sont possibles." :
                 analysis.score >= 40 ? "Moyen. Plusieurs points a ameliorer." :
                 "Attention, des problemes importants ont ete detectes."}
              </p>
            </div>
            <ScoreGauge score={analysis.score} size="lg" />
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-300">Erreur</h3>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                hasStartedRef.current = false
                setError(null)
                startAnalysis()
              }}
              className="ml-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resultats de l&apos;analyse</CardTitle>
          <CardDescription>
            Rapport detaille genere par l&apos;IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!streamContent && !isStreaming && !error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Demarrage de l&apos;analyse...</p>
              <p className="mt-2 text-sm text-muted-foreground">
                L&apos;IA analyse votre site web en profondeur
              </p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground">
              <ReactMarkdown>{streamContent}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block h-5 w-1 animate-pulse bg-primary ml-1" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {!isStreaming && streamContent && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              hasStartedRef.current = false
              setStreamContent("")
              startAnalysis()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Relancer l&apos;analyse
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/websites/${params.id}`}>
              Voir les autres analyses
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
