import Link from "next/link"
import { Logo } from "@/components/logo"

const footerLinks = {
  product: [
    { name: "Fonctionnalites", href: "#features" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Comment ca marche", href: "#how-it-works" },
    { name: "Changelog", href: "#" },
  ],
  company: [
    { name: "A propos", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Carrieres", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Politique de confidentialite", href: "#" },
    { name: "Conditions d'utilisation", href: "#" },
    { name: "Politique de cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Logo size="md" />
            </Link>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Plateforme d&apos;intelligence web alimentee par l&apos;IA. Comprenez vos utilisateurs, detectez les problemes et surpassez vos concurrents.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Produit</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Insightrix. Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  )
}
