'use client';

import { useState, useEffect } from 'react';
import { sections } from '@/lib/content';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnimatedBackground } from '@/components/animated-background';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSection = sections[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % sections.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground key={activeIndex} colors={activeSection.colors} />
      
      <Header />
      
      <div className="fixed top-1/2 -left-20 md:-left-16 z-50 pointer-events-none">
        <p className="-rotate-90 text-xs font-bold tracking-widest uppercase text-muted-foreground">
          Printing and Packaging Solutions
        </p>
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div 
          key={activeIndex} 
          className="w-full max-w-3xl text-center animate-fade-in-up"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-primary tracking-tight">
            {activeSection.title}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-primary/80">
            {activeSection.description}
          </p>
        </div>
      </main>

      <Footer
        sections={sections}
        activeSectionIndex={activeIndex}
      />
    </div>
  );
}
