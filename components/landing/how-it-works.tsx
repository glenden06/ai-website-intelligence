import { Globe, Cpu, BarChart3, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Globe,
    title: "Ajoutez votre site web",
    description:
      "Entrez simplement l'URL de votre site. Aucune installation de code ni configuration technique requise.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "L'analyse IA demarre",
    description:
      "Notre IA explore votre site, analyse les patterns UX, detecte les problemes et collecte des informations concurrentielles.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Consultez les insights",
    description:
      "Accedez a votre tableau de bord personnalise avec des scores, des rapports detailles et des recommandations priorisees.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Passez a l'action",
    description:
      "Implementez les ameliorations suggerees et observez la performance de votre site s'envoler.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Demarrez en quelques minutes
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Aucune configuration complexe requise. Ajoutez votre site et laissez l&apos;IA faire le travail.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Connection line */}
          <div className="absolute left-8 top-12 hidden h-[calc(100%-96px)] w-0.5 bg-border md:left-1/2 md:block md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-start gap-6 md:flex-row md:items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Step number circle */}
                <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-xl font-bold text-primary-foreground shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                  {step.number}
                </div>

                {/* Content */}
                <div
                  className={`ml-20 flex-1 rounded-xl border border-border bg-card p-6 shadow-sm md:ml-0 ${
                    index % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                  } md:w-[calc(50%-48px)]`}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
