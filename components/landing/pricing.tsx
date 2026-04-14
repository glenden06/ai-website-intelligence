import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "pour toujours",
    description: "Parfait pour essayer WebIntel AI",
    features: [
      "1 site web",
      "Analyse hebdomadaire",
      "Insights UX de base",
      "Detection de bugs",
      "Rapports par email",
    ],
    cta: "Commencer",
    href: "/auth/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    price: "29€",
    period: "par mois",
    description: "Pour les entreprises en croissance",
    features: [
      "10 sites web",
      "Analyse quotidienne",
      "Insights UX avances",
      "Detection de bugs",
      "Analyse concurrentielle",
      "Recommandations IA",
      "Support prioritaire",
      "Acces API",
    ],
    cta: "Essai gratuit",
    href: "/auth/sign-up?plan=pro",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "99€",
    period: "par mois",
    description: "Pour les grandes organisations",
    features: [
      "Sites web illimites",
      "Analyse en temps reel",
      "Acces complet",
      "Integrations personnalisees",
      "Support dedie",
      "Garantie SLA",
      "Rapports personnalises",
      "Collaboration d'equipe",
    ],
    cta: "Contacter les ventes",
    href: "/auth/sign-up?plan=enterprise",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Tarification simple et transparente
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Commencez gratuitement et evoluez selon vos besoins. Pas de frais caches, annulation a tout moment.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Le plus populaire
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
