import type { CollectionConfig } from 'payload'

import { admins, anyone, lockedAfterCreate } from '../access'
import { relatedEndpoint } from '../endpoints/products/related'
import { validateProductRelations } from '../hooks/products/validateProductRelations'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Producto',
    plural: 'Productos',
  },
  endpoints: [relatedEndpoint],
  admin: {
    useAsTitle: 'name',
    group: 'Catálogo',
    defaultColumns: ['name', 'category', 'world', 'featured', 'tag'],
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeValidate: [validateProductRelations],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Identificador (slug)',
      access: {
        update: lockedAfterCreate,
      },
      admin: {
        description:
          'Identificador único usado por la web (minúsculas, sin espacios ni acentos). No se puede modificar una vez creado el ítem; si te equivocaste, borralo y creá uno nuevo.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Categoría',
    },
    {
      name: 'world',
      type: 'relationship',
      relationTo: 'worlds',
      required: true,
      label: 'Mundo',
      admin: {
        description: 'Se valida automáticamente que coincida con el mundo de la categoría elegida.',
      },
    },
    {
      name: 'availableSizes',
      type: 'relationship',
      relationTo: 'sizes',
      hasMany: true,
      required: true,
      label: 'Tamaños disponibles',
      admin: {
        description: 'Deben pertenecer al mismo mundo del producto.',
      },
    },
    {
      name: 'finishes',
      type: 'relationship',
      relationTo: 'finishes',
      hasMany: true,
      required: true,
      label: 'Acabados disponibles',
    },
    {
      name: 'blurb',
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'tag',
      type: 'text',
      label: 'Etiqueta',
      admin: {
        description: "Ej: 'Nuevo', 'Más vendido'",
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado',
      admin: {
        description: 'Para mostrarlo en los destacados de la home.',
      },
    },
    {
      name: 'featuredOrder',
      type: 'number',
      label: 'Orden en destacados',
      admin: {
        condition: (data) => Boolean(data?.featured),
      },
    },
    {
      name: 'discount',
      type: 'group',
      label: 'Descuento',
      admin: {
        description: 'Opcional. Dejalo vacío si este producto no tiene descuento.',
      },
      fields: [
        {
          name: 'pct',
          type: 'number',
          min: 1,
          max: 99,
          label: 'Porcentaje de descuento',
        },
        {
          name: 'label',
          type: 'text',
          label: 'Etiqueta a mostrar',
          admin: {
            description: "Ej: '20% OFF'",
          },
        },
        {
          name: 'scope',
          type: 'select',
          defaultValue: 'all',
          label: 'Alcance del descuento',
          options: [
            { label: 'Todos los acabados', value: 'all' },
            { label: 'Solo un acabado', value: 'finish' },
          ],
        },
        {
          name: 'finish',
          type: 'relationship',
          relationTo: 'finishes',
          label: 'Acabado con descuento',
          admin: {
            condition: (_, siblingData) => siblingData?.scope === 'finish',
            description: "Solo aplica si el alcance es 'Solo un acabado'.",
          },
        },
      ],
    },
  ],
}
