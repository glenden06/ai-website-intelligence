"use client"

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ScoreHistoryChartProps {
  data: Array<{
    date: string
    score: number
    type?: string
  }>
}

export function ScoreHistoryChart({ data }: ScoreHistoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolution des scores</CardTitle>
        <CardDescription>Historique des scores sur les 30 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs" 
                tick={{ fill: 'currentColor' }}
                tickLine={{ stroke: 'currentColor' }}
              />
              <YAxis 
                domain={[0, 100]} 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                tickLine={{ stroke: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface AnalysisDistributionChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

export function AnalysisDistributionChart({ data }: AnalysisDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repartition des analyses</CardTitle>
        <CardDescription>Types d&apos;analyses effectuees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface WebsiteScoresChartProps {
  data: Array<{
    name: string
    ux: number
    bugs: number
    competitive: number
  }>
}

export function WebsiteScoresChart({ data }: WebsiteScoresChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scores par site</CardTitle>
        <CardDescription>Comparaison des scores entre vos sites</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                type="number" 
                domain={[0, 100]}
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="ux" name="UX" fill="#22c55e" radius={[0, 4, 4, 0]} />
              <Bar dataKey="bugs" name="Technique" fill="#f97316" radius={[0, 4, 4, 0]} />
              <Bar dataKey="competitive" name="Compétitif" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface AlertsTrendChartProps {
  data: Array<{
    date: string
    critical: number
    high: number
    medium: number
    low: number
  }>
}

export function AlertsTrendChart({ data }: AlertsTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendance des alertes</CardTitle>
        <CardDescription>Evolution des alertes par severite</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis tick={{ fill: 'currentColor' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="critical" name="Critique" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="high" name="Haute" stroke="#f97316" strokeWidth={2} />
              <Line type="monotone" dataKey="medium" name="Moyenne" stroke="#eab308" strokeWidth={2} />
              <Line type="monotone" dataKey="low" name="Basse" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
