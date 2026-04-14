"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Globe } from "lucide-react"
import Link from "next/link"

export default function NewWebsitePage() {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("Vous devez etre connecte pour ajouter un site web")
      setIsLoading(false)
      return
    }

    // Validate URL
    let validUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      validUrl = `https://${url}`
    }

    try {
      new URL(validUrl)
    } catch {
      setError("Veuillez entrer une URL valide")
      setIsLoading(false)
      return
    }

    const { error: insertError } = await supabase.from("websites").insert({
      name,
      url: validUrl,
      user_id: user.id,
      status: "pending",
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Ajouter un nouveau site web</CardTitle>
          <CardDescription>
            Entrez les details de votre site pour commencer l&apos;analyse IA
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nom du site</Label>
              <Input
                id="name"
                type="text"
                placeholder="Mon super site"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Un nom convivial pour identifier votre site
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL du site</Label>
              <Input
                id="url"
                type="text"
                placeholder="https://exemple.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                L&apos;URL complete de votre site incluant https://
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                "Ajouter le site"
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
