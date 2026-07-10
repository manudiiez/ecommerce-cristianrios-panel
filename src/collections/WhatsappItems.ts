import type { CollectionConfig } from 'payload'

import { admins, anyone } from '../access'
import { validateCategoryMode } from '../hooks/whatsappItems/validateCategoryMode'

export const WhatsappItems: CollectionConfig = {
  slug: 'whatsapp-items',
  labels: {
    singular: 'Ítem WhatsApp',
    plural: 'Ítems WhatsApp',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Catálogo',
    defaultColumns: ['name', 'category'],
    description:
      'Ítems de categorías de tipo WhatsApp (por ejemplo sahumerios, velas, inciensos): no tienen ficha de producto, solo se consultan por WhatsApp.',
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeValidate: [validateCategoryMode],
  },
  fields: [
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
      admin: {
        description: 'Debe ser una categoría de tipo WhatsApp.',
      },
    },
    {
      name: 'blurb',
      type: 'text',
      label: 'Descripción breve',
    },
    {
      name: 'waMessage',
      type: 'textarea',
      label: 'Mensaje de WhatsApp',
      admin: {
        description: 'Mensaje prellenado que se abre en WhatsApp cuando el cliente hace clic en consultar.',
      },
    },
  ],
}
