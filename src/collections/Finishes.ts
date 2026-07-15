import type { CollectionConfig } from 'payload'

import { admins, anyone, lockedAfterCreate } from '../access'

export const Finishes: CollectionConfig = {
  slug: 'finishes',
  labels: {
    singular: 'Acabado',
    plural: 'Acabados',
  },
  admin: {
    useAsTitle: 'label',
    group: 'Catálogo',
    defaultColumns: ['label', 'slug', 'swatch'],
    description: 'Los acabados disponibles para los productos (normalmente solo "crudo" y "pintada").',
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
    },
    {
      name: 'sub',
      type: 'text',
      label: 'Subtítulo',
      admin: {
        description: "Ej: 'Sin pintar'",
      },
    },
    {
      name: 'swatch',
      type: 'text',
      label: 'Color (código hex)',
      admin: {
        description: 'Color usado para mostrar una muestra visual de este acabado. Ej: #d8c3a5',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(value)) {
          return 'Formato inválido. Usá un código de color hexadecimal, ej: #d8c3a5.'
        }
        return true
      },
    },
  ],
}
