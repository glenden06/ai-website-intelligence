"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Play } from "lucide-react"

interface AnalyzeButtonProps {
  websiteId: string
  websiteUrl: string
  analysisType: string
}

export function AnalyzeButton({ websiteId, websiteUrl, analysisType }: AnalyzeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAnalyze = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteId,
          websiteUrl,
          analysisType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to start analysis")
      }

      const data = await response.json()
      
      // Redirect to the analysis page
      router.push(`/dashboard/websites/${websiteId}/analysis/${data.analysisId}`)
      router.refresh()
    } catch (error) {
      console.error("Analysis error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleAnalyze}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Starting...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Run Analysis
        </>
      )}
    </Button>
  )
}
