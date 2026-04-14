"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Globe, Sparkles } from "lucide-react"

interface AnalyzeButtonProps {
  websiteId: string
  websiteUrl: string
  analysisType: string
}

export function AnalyzeButton({ websiteId, websiteUrl, analysisType }: AnalyzeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "scraping" | "analyzing">("idle")
  const router = useRouter()

  const handleAnalyze = async () => {
    setIsLoading(true)
    setStatus("scraping")

    try {
      // Step 1: Scrape the website
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: websiteUrl }),
      })

      let websiteData = null
      if (scrapeResponse.ok) {
        const scrapeResult = await scrapeResponse.json()
        if (scrapeResult.success) {
          websiteData = scrapeResult.data
        }
      }

      setStatus("analyzing")

      // Step 2: Start the analysis with scraped data
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteId,
          websiteUrl,
          analysisType,
          websiteData,
        }),
      })

      if (!response.ok) {
        throw new Error("Echec du demarrage de l'analyse")
      }

      const data = await response.json()
      
      // Redirect to the analysis page
      router.push(`/dashboard/websites/${websiteId}/analysis/${data.analysisId}`)
      router.refresh()
    } catch (error) {
      console.error("Erreur d'analyse:", error)
      setIsLoading(false)
      setStatus("idle")
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "scraping":
        return "Collecte des donnees..."
      case "analyzing":
        return "Demarrage de l'analyse..."
      default:
        return "Lancer l'analyse"
    }
  }

  const getStatusIcon = () => {
    if (!isLoading) return <Play className="mr-2 h-4 w-4" />
    switch (status) {
      case "scraping":
        return <Globe className="mr-2 h-4 w-4 animate-pulse" />
      case "analyzing":
        return <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
      default:
        return <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleAnalyze}
      disabled={isLoading}
      className="min-w-[160px]"
    >
      {getStatusIcon()}
      {getStatusText()}
    </Button>
  )
}
