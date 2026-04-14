"use client"

import { ScoreHistoryChart, AnalysisDistributionChart } from "./stats-charts"

interface DashboardChartsProps {
  scoreHistory: Array<{ date: string; score: number }>
  analysisDistribution: Array<{ name: string; value: number; color: string }>
}

export function DashboardCharts({ scoreHistory, analysisDistribution }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {scoreHistory.length > 1 && (
        <ScoreHistoryChart data={scoreHistory} />
      )}
      {analysisDistribution.length > 0 && (
        <AnalysisDistributionChart data={analysisDistribution} />
      )}
    </div>
  )
}
