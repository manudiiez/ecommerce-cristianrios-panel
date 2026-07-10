export const categoriesData = [
  // Religioso — catálogo
  { slug: 'jesus', name: 'Jesús', worldSlug: 'religioso', mode: 'catalog' as const },
  {
    slug: 'virgen',
    name: 'Virgen',
    worldSlug: 'religioso',
    mode: 'catalog' as const,
    discount: { pct: 10, label: '10% OFF' },
  },
  { slug: 'angeles', name: 'Ángeles', worldSlug: 'religioso', mode: 'catalog' as const },
  // Holístico — catálogo
  { slug: 'figuras', name: 'Figuras', worldSlug: 'holistico', mode: 'catalog' as const },
  { slug: 'portavelas', name: 'Portavelas', worldSlug: 'holistico', mode: 'catalog' as const },
  { slug: 'decorativos', name: 'Decorativos', worldSlug: 'holistico', mode: 'catalog' as const },
  // Holístico — consulta por WhatsApp
  {
    slug: 'sahumerios',
    name: 'Sahumerios',
    worldSlug: 'holistico',
    mode: 'whatsapp' as const,
    note: 'Ítems de consulta por WhatsApp, sin ficha de producto.',
  },
  {
    slug: 'velas',
    name: 'Velas',
    worldSlug: 'holistico',
    mode: 'whatsapp' as const,
    note: 'Ítems de consulta por WhatsApp, sin ficha de producto.',
  },
  {
    slug: 'inciensos',
    name: 'Inciensos',
    worldSlug: 'holistico',
    mode: 'whatsapp' as const,
    note: 'Ítems de consulta por WhatsApp, sin ficha de producto.',
  },
]
