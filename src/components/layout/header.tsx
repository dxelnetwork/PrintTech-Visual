import { Package } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Package className="w-7 h-7" />
          <span>PrintTech Visuals</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-primary/80">
          <span className="cursor-default">About</span>
          <span className="cursor-default">Services</span>
          <span className="cursor-default">Portfolio</span>
          <span className="cursor-default">Contact</span>
        </nav>
      </div>
    </header>
  );
}
