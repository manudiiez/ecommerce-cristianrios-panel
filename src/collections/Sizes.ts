import type { CollectionConfig } from 'payload'

import { admins, anyone, lockedAfterCreate } from '../access'

export const Sizes: CollectionConfig = {
  slug: 'sizes',
  labels: {
    singular: 'Tamaño',
    plural: 'Tamaños',
  },
  admin: {
    useAsTitle: 'label',
    group: 'Catálogo',
    defaultColumns: ['label', 'world', 'price', 'paintedAdd', 'order'],
    description:
      'Esta es la tabla de precios de la tienda. El precio de cada producto sale de acá, no se edita en el producto.',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
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
      name: 'label',
      type: 'text',
      required: true,
      label: 'Etiqueta visible',
      admin: {
        description: "Ej: '15 cm', 'Chico'",
      },
    },
    {
      name: 'world',
      type: 'relationship',
      relationTo: 'worlds',
      required: true,
      label: 'Mundo',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Precio base (acabado crudo)',
      admin: {
        description: 'Precio en pesos, sin decimales.',
      },
    },
    {
      name: 'paintedAdd',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      label: 'Recargo por pintado',
      admin: {
        description: 'Se suma al precio base si el cliente elige la versión pintada.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Orden de aparición',
      admin: {
        description: 'Número para ordenar de menor a mayor. Ej: 1, 2, 3…',
      },
    },
  ],
}
