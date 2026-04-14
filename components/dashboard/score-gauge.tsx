"use client"

import { cn } from "@/lib/utils"

interface ScoreGaugeProps {
  score: number
  size?: "sm" | "md" | "lg"
  label?: string
  showLabel?: boolean
}

export function ScoreGauge({ 
  score, 
  size = "md", 
  label,
  showLabel = true 
}: ScoreGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(100, score))
  
  const getColor = (score: number) => {
    if (score >= 80) return { stroke: "#22c55e", bg: "bg-green-100 dark:bg-green-950" }
    if (score >= 60) return { stroke: "#eab308", bg: "bg-yellow-100 dark:bg-yellow-950" }
    if (score >= 40) return { stroke: "#f97316", bg: "bg-orange-100 dark:bg-orange-950" }
    return { stroke: "#ef4444", bg: "bg-red-100 dark:bg-red-950" }
  }

  const colors = getColor(normalizedScore)
  
  const sizes = {
    sm: { width: 80, strokeWidth: 6, fontSize: "text-lg", labelSize: "text-xs" },
    md: { width: 120, strokeWidth: 8, fontSize: "text-2xl", labelSize: "text-sm" },
    lg: { width: 160, strokeWidth: 10, fontSize: "text-4xl", labelSize: "text-base" },
  }

  const config = sizes[size]
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (normalizedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative rounded-full", colors.bg)} style={{ width: config.width, height: config.width }}>
        <svg
          width={config.width}
          height={config.width}
          className="-rotate-90 transform"
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", config.fontSize)}>
            {normalizedScore}
          </span>
        </div>
      </div>
      {showLabel && label && (
        <span className={cn("text-muted-foreground", config.labelSize)}>
          {label}
        </span>
      )}
    </div>
  )
}
