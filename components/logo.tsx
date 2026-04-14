import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: "h-6 w-6", text: "text-lg", gap: "gap-1.5" },
    md: { icon: "h-8 w-8", text: "text-xl", gap: "gap-2" },
    lg: { icon: "h-10 w-10", text: "text-2xl", gap: "gap-2.5" },
    xl: { icon: "h-12 w-12", text: "text-3xl", gap: "gap-3" },
  }

  return (
    <div className={cn("flex items-center", sizes[size].gap, className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-cyan-400 shadow-lg shadow-primary/25",
        sizes[size].icon
      )}>
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
        
        {/* Logo icon - stylized "I" for Insightrix */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative h-[60%] w-[60%]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Neural network / insight pattern */}
          <circle cx="12" cy="5" r="2" fill="white" />
          <circle cx="6" cy="12" r="1.5" fill="white" opacity="0.8" />
          <circle cx="18" cy="12" r="1.5" fill="white" opacity="0.8" />
          <circle cx="12" cy="19" r="2" fill="white" />
          <circle cx="12" cy="12" r="2.5" fill="white" />
          
          {/* Connection lines */}
          <line x1="12" y1="7" x2="12" y2="9.5" stroke="white" strokeWidth="1.5" opacity="0.9" />
          <line x1="12" y1="14.5" x2="12" y2="17" stroke="white" strokeWidth="1.5" opacity="0.9" />
          <line x1="7.5" y1="12" x2="9.5" y2="12" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="14.5" y1="12" x2="16.5" y2="12" stroke="white" strokeWidth="1.5" opacity="0.7" />
          
          {/* Diagonal connections */}
          <line x1="10" y1="10" x2="8" y2="11" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="14" y1="10" x2="16" y2="11" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="10" y1="14" x2="8" y2="13" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="14" y1="14" x2="16" y2="13" stroke="white" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
      
      {showText && (
        <span className={cn(
          "font-bold tracking-tight",
          sizes[size].text
        )}>
          <span className="text-foreground">Insight</span>
          <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">rix</span>
        </span>
      )}
    </div>
  )
}
