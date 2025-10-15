'use client';

import type { Section } from '@/lib/content';

interface FooterProps {
  sections: Section[];
  activeSectionIndex: number;
}

export function Footer({ sections, activeSectionIndex }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 px-8 py-6">
      <nav className="flex items-center justify-center gap-x-4 md:gap-x-10 text-xs md:text-sm font-medium">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`
              relative py-2 transition-colors duration-300
              ${activeSectionIndex === index ? 'text-primary' : 'text-muted-foreground'}
            `}
          >
            {section.navTitle}
            <span
              className={`
                absolute left-0 bottom-0 w-full h-0.5 bg-primary transition-transform duration-500 ease-in-out
                ${activeSectionIndex === index ? 'scale-x-100' : 'scale-x-0'}
              `}
              style={{ transformOrigin: 'center' }}
            />
          </div>
        ))}
      </nav>
    </footer>
  );
}
