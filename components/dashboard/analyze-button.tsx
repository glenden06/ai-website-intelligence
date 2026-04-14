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
        throw new Error("Echec du demarrage de l'analyse")
      }

      const data = await response.json()
      
      // Redirect to the analysis page
      router.push(`/dashboard/websites/${websiteId}/analysis/${data.analysisId}`)
      router.refresh()
    } catch (error) {
      console.error("Erreur d'analyse:", error)
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
          Demarrage...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Lancer l&apos;analyse
        </>
      )}
    </Button>
  )
}
