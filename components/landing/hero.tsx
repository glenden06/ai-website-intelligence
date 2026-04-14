"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Zap, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Analyse de site web propulsee par l&apos;IA</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Comprenez votre site web{" "}
            <span className="text-primary">comme jamais auparavant</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Obtenez des insights approfondis sur l&apos;experience utilisateur, detectez les bugs automatiquement et gardez une longueur d&apos;avance sur vos concurrents grace a une analyse IA 24h/24.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" asChild>
              <Link href="/auth/sign-up">
                Essai gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="#how-it-works">
                <Play className="mr-2 h-5 w-5" />
                Comment ca marche
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Configuration en 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Insights en temps reel</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-sm text-muted-foreground">Tableau de bord Insightrix</span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted p-8">
              <div className="grid h-full grid-cols-3 gap-4">
                <div className="col-span-2 rounded-lg bg-background/80 p-4 shadow-sm">
                  <div className="mb-3 h-4 w-32 rounded bg-muted" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-4/5 rounded bg-muted" />
                    <div className="h-3 w-3/5 rounded bg-muted" />
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <div className="mb-2 h-8 w-8 rounded bg-primary/20" />
                      <div className="h-3 w-12 rounded bg-muted" />
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3">
                      <div className="mb-2 h-8 w-8 rounded bg-primary/20" />
                      <div className="h-3 w-12 rounded bg-muted" />
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3">
                      <div className="mb-2 h-8 w-8 rounded bg-primary/20" />
                      <div className="h-3 w-12 rounded bg-muted" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg bg-background/80 p-4 shadow-sm">
                    <div className="mb-2 h-3 w-20 rounded bg-muted" />
                    <div className="text-2xl font-bold text-primary">94</div>
                    <div className="h-2 w-16 rounded bg-muted" />
                  </div>
                  <div className="rounded-lg bg-background/80 p-4 shadow-sm">
                    <div className="mb-2 h-3 w-20 rounded bg-muted" />
                    <div className="text-2xl font-bold text-green-500">+23%</div>
                    <div className="h-2 w-16 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-x-20 -bottom-20 -z-10 h-40 bg-gradient-to-t from-primary/10 to-transparent blur-2xl" />
        </div>
      </div>
    </section>
  )
}
