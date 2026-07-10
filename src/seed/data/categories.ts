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
  { slug: 'buda', name: 'Buda', worldSlug: 'holistico', mode: 'catalog' as const },
  { slug: 'ganesha', name: 'Ganesha', worldSlug: 'holistico', mode: 'catalog' as const },
  { slug: 'mano-de-fatima', name: 'Mano de Fátima', worldSlug: 'holistico', mode: 'catalog' as const },
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
