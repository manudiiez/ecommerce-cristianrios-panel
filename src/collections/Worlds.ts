import type { CollectionConfig } from 'payload'

import { admins, anyone } from '../access'

export const Worlds: CollectionConfig = {
  slug: 'worlds',
  labels: {
    singular: 'Mundo',
    plural: 'Mundos',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Catálogo',
    defaultColumns: ['name', 'slug', 'accent'],
  },
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
      admin: {
        description:
          'Identificador único usado por la web (minúsculas, sin espacios ni acentos). No lo cambies una vez publicado o se rompen los enlaces.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'kicker',
      type: 'text',
      label: 'Texto chico (arriba del título)',
    },
    {
      name: 'blurb',
      type: 'text',
      label: 'Descripción breve',
    },
    {
      name: 'accent',
      type: 'select',
      required: true,
      label: 'Color de acento',
      admin: {
        description: 'Color usado para destacar este mundo en el diseño de la web.',
      },
      options: [
        { label: 'Arcilla', value: 'clay' },
        { label: 'Rosa', value: 'rose' },
      ],
    },
  ],
}
