import type { CollectionConfig } from 'payload'

import { admins, anyone, lockedAfterCreate } from '../access'
import { validateKitPricing } from '../hooks/kits/validateKitPricing'

export const Kits: CollectionConfig = {
  slug: 'kits',
  labels: {
    singular: 'Kit',
    plural: 'Kits',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Catálogo',
    defaultColumns: ['name', 'world', 'price', 'regular'],
    description: 'Combos de precio fijo. El precio NO se calcula a partir de los ítems que lo componen.',
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeValidate: [validateKitPricing],
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
      name: 'blurb',
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'world',
      type: 'relationship',
      relationTo: 'worlds',
      required: true,
      label: 'Mundo',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      label: 'Ítems del kit',
      admin: {
        description:
          "Ítems que componen el kit. 'Producto' es opcional: dejalo vacío para ítems que solo se venden por WhatsApp (sin ficha de producto).",
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nombre visible',
        },
        {
          name: 'qty',
          type: 'number',
          required: true,
          min: 1,
          label: 'Cantidad',
        },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Producto (opcional)',
        },
        {
          name: 'size',
          type: 'relationship',
          relationTo: 'sizes',
          label: 'Tamaño (opcional)',
        },
        {
          name: 'finish',
          type: 'relationship',
          relationTo: 'finishes',
          label: 'Acabado (opcional)',
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Precio final del kit',
    },
    {
      name: 'regular',
      type: 'number',
      required: true,
      min: 0,
      label: 'Precio de referencia (por separado)',
      admin: {
        description: 'Debe ser mayor al precio final, para mostrar el ahorro.',
      },
    },
    {
      name: 'note',
      type: 'text',
      label: 'Nota',
    },
    {
      name: 'tag',
      type: 'text',
      label: 'Etiqueta',
    },
  ],
}
