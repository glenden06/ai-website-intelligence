"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  plan: string
}

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold">
          Welcome back, {profile?.full_name || user.email?.split("@")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Plan: <span className="capitalize">{profile?.plan || "free"}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Sign out</span>
        </Button>
      </div>
    </header>
  )
}
