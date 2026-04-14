"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon, Menu, X } from "lucide-react"
import { NotificationsCenter } from "./notifications-center"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileSidebar } from "./mobile-sidebar"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>

        {/* Welcome message - hidden on mobile */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold">
            Bienvenue, {profile?.full_name || user.email?.split("@")[0]}
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan : <span className="capitalize">{profile?.plan || "gratuit"}</span>
          </p>
        </div>

        {/* Mobile title */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="font-semibold text-primary">WebIntel AI</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <NotificationsCenter />
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Deconnexion</span>
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}
