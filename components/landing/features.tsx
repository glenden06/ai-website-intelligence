import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MousePointerClick, Bug, TrendingUp, Lightbulb } from "lucide-react"

const features = [
  {
    icon: MousePointerClick,
    title: "UX Analysis",
    description:
      "Understand how users navigate your site. Identify friction points, optimize conversion funnels, and improve user journeys with AI-powered insights.",
  },
  {
    icon: Bug,
    title: "Bug Detection",
    description:
      "Automatically detect broken links, 404 errors, performance issues, and technical problems before your users encounter them.",
  },
  {
    icon: TrendingUp,
    title: "Competitive Analysis",
    description:
      "Monitor competitor websites for changes, compare offerings, and stay ahead of market trends with continuous surveillance.",
  },
  {
    icon: Lightbulb,
    title: "AI Recommendations",
    description:
      "Receive actionable suggestions prioritized by impact. Our AI analyzes patterns and recommends specific optimizations.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need to Optimize Your Website
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Powerful AI tools working together to give you complete visibility into your
            website&apos;s performance and user experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
