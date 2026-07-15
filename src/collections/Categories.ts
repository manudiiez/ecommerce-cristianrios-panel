import type { CollectionConfig } from 'payload'

import { admins, anyone, lockedAfterCreate } from '../access'
import { populateCount } from '../hooks/categories/populateCount'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoría',
    plural: 'Categorías',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Catálogo',
    defaultColumns: ['name', 'world', 'mode', 'count'],
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    afterRead: [populateCount],
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
      name: 'world',
      type: 'relationship',
      relationTo: 'worlds',
      required: true,
      label: 'Mundo',
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'catalog',
      label: 'Tipo de categoría',
      admin: {
        description:
          "'Catálogo': los productos se muestran con ficha, precio, y se agregan al pedido. 'WhatsApp': son ítems simples (por ejemplo sahumerios, velas, inciensos) que solo muestran un botón para consultar por WhatsApp, sin ficha de producto.",
      },
      options: [
        { label: 'Catálogo', value: 'catalog' },
        { label: 'WhatsApp', value: 'whatsapp' },
      ],
    },
    {
      name: 'discount',
      type: 'group',
      label: 'Descuento de la categoría',
      admin: {
        description: 'Opcional. Dejalo vacío si esta categoría no tiene un descuento general.',
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
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Nota interna',
    },
    {
      name: 'count',
      type: 'number',
      virtual: true,
      label: 'Cantidad de productos',
      admin: {
        readOnly: true,
        description: 'Se calcula solo, contando los productos de esta categoría.',
      },
    },
  ],
}
