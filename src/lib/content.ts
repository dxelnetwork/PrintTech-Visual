export type Section = {
  id: string;
  title: string;
  navTitle: string;
  description: string;
  colors: [string, string];
};

export const sections: Section[] = [
  {
    id: 'structural-design',
    title: 'Structural Packaging Design',
    navTitle: 'Structural Design',
    description: 'Engineering precise, cost-effective structures that protect your product and elevate the unboxing experience.',
    colors: ['#2C3E50', '#E0FFFF'],
  },
  {
    id: 'finishing-effects',
    title: 'Premium Finishing & Effects',
    navTitle: 'Finishing & Effects',
    description: 'Leverage metallic foils, embossing, debossing, and spot UV to make your packaging stand out on the shelf.',
    colors: ['#800080', '#CD7F32'],
  },
  {
    id: 'sustainable-solutions',
    title: 'Eco-Friendly Materials & Ink',
    navTitle: 'Sustainable Solutions',
    description: 'Providing certified sustainable paper stocks and biodegradable inks to help you meet your environmental goals.',
    colors: ['#3A5F0B', '#BCB88A'], // Darker Green for better contrast
  },
  {
    id: 'digital-printing',
    title: 'High-Speed Digital Printing',
    navTitle: 'Digital Printing',
    description: 'Rapid prototyping and on-demand variable data printing for short runs and personalized packaging campaigns.',
    colors: ['#FF00FF', '#FFD700'],
  },
];
