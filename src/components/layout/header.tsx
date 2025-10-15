import { Package, Menu } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#", label: "About" },
  { href: "#", label: "Solutions" },
  { href: "#", label: "Products" },
  { href: "#", label: "Gallery" },
  { href: "#", label: "Clients" },
  { href: "#", label: "News" },
  { href: "#", label: "History" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Contact" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Package className="w-7 h-7" />
          <span>PrintTech Visuals</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-primary/80">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-6 mt-16 text-lg font-medium">
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="hover:text-primary transition-colors text-foreground">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}