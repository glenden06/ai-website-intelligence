"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, RefreshCw, CheckCircle } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

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
  results: Record<string, unknown> | null
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState<Website | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/analyze/stream",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          analysisId: params.analysisId,
          websiteUrl: website?.url,
          analysisType: analysis?.type,
        },
      }),
    }),
  })

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
    }

    loadData()
  }, [params.id, params.analysisId])

  useEffect(() => {
    if (website && analysis && !hasStarted && analysis.status === "pending") {
      setHasStarted(true)
      // Start the analysis
      startAnalysis()
    }
  }, [website, analysis, hasStarted])

  const startAnalysis = async () => {
    if (!website || !analysis) return

    // Update status to running
    const supabase = createClient()
    await supabase
      .from("analyses")
      .update({ status: "running" })
      .eq("id", analysis.id)

    // Send initial message to start analysis
    sendMessage({ text: `Please analyze the website: ${website.url}` })
  }

  const saveResults = async () => {
    if (!analysis || messages.length === 0) return

    const supabase = createClient()

    // Extract score from AI response (simplified extraction)
    const lastMessage = messages[messages.length - 1]
    const messageText = lastMessage.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") || ""
    
    const scoreMatch = messageText.match(/(\d{1,3})\/100|score[:\s]+(\d{1,3})/i)
    const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 75

    await supabase
      .from("analyses")
      .update({
        status: "completed",
        score: Math.min(score, 100),
        results: { content: messageText },
        completed_at: new Date().toISOString(),
      })
      .eq("id", analysis.id)

    await supabase
      .from("websites")
      .update({ 
        status: "completed",
        last_analyzed_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    router.refresh()
  }

  useEffect(() => {
    if (status === "ready" && messages.length > 0 && hasStarted) {
      saveResults()
    }
  }, [status, messages.length, hasStarted])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!website || !analysis) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Analysis not found</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const getUIMessageText = (msg: typeof messages[0]): string => {
    if (!msg.parts || !Array.isArray(msg.parts)) return ""
    return msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href={`/dashboard/websites/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Website
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold capitalize">{analysis.type} Analysis</h1>
            <p className="text-sm text-muted-foreground">{website.name} - {website.url}</p>
          </div>
          <div className="flex items-center gap-2">
            {status === "streaming" ? (
              <span className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </span>
            ) : status === "ready" && messages.length > 0 ? (
              <span className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Complete
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 && status !== "streaming" ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Starting analysis...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {messages
                .filter((m) => m.role === "assistant")
                .map((message) => (
                  <div key={message.id}>
                    <ReactMarkdown>{getUIMessageText(message)}</ReactMarkdown>
                  </div>
                ))}
              {status === "streaming" && (
                <span className="inline-block h-4 w-2 animate-pulse bg-primary" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
