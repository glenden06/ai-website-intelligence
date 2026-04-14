import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MousePointerClick, Bug, TrendingUp, Lightbulb } from "lucide-react"

const features = [
  {
    icon: MousePointerClick,
    title: "Analyse UX",
    description:
      "Comprenez comment les utilisateurs naviguent sur votre site. Identifiez les points de friction, optimisez les tunnels de conversion et ameliorez les parcours utilisateurs grace a des insights alimentes par l'IA.",
  },
  {
    icon: Bug,
    title: "Detection de bugs",
    description:
      "Detectez automatiquement les liens casses, les erreurs 404, les problemes de performance et les defauts techniques avant que vos utilisateurs ne les rencontrent.",
  },
  {
    icon: TrendingUp,
    title: "Analyse concurrentielle",
    description:
      "Surveillez les sites web de vos concurrents pour detecter les changements, comparez les offres et restez en avance sur les tendances du marche.",
  },
  {
    icon: Lightbulb,
    title: "Recommandations IA",
    description:
      "Recevez des suggestions actionnables priorisees par impact. Notre IA analyse les patterns et recommande des optimisations specifiques.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Tout ce dont vous avez besoin pour optimiser votre site
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Des outils IA puissants qui travaillent ensemble pour vous donner une visibilite complete sur la performance et l&apos;experience utilisateur de votre site.
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
