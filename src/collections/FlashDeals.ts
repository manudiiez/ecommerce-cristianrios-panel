import type { CollectionConfig } from 'payload'

import { admins, anyone } from '../access'
import { soonestEndpoint } from '../endpoints/flashDeals/soonest'
import { epochEndsAt } from '../hooks/flashDeals/epochEndsAt'
import { validateFlashDealPricing } from '../hooks/flashDeals/validateFlashDealPricing'
import { validateVariantGroups } from '../hooks/flashDeals/validateVariantGroups'

export const FlashDeals: CollectionConfig = {
  slug: 'flash-deals',
  labels: {
    singular: 'Oferta relámpago',
    plural: 'Ofertas relámpago',
  },
  endpoints: [soonestEndpoint],
  admin: {
    useAsTitle: 'name',
    group: 'Catálogo',
    defaultColumns: ['name', 'price', 'regular', 'stockLeft', 'endsAt'],
    description:
      'Ofertas por tiempo limitado. Son independientes de productos y kits, con su propio precio fijo.',
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeValidate: [validateFlashDealPricing, validateVariantGroups],
    afterRead: [epochEndsAt],
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
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Precio de oferta',
    },
    {
      name: 'regular',
      type: 'number',
      required: true,
      min: 0,
      label: 'Precio de referencia',
      admin: {
        description: 'Debe ser mayor al precio de oferta.',
      },
    },
    {
      name: 'stockLeft',
      type: 'number',
      required: true,
      min: 0,
      label: 'Stock restante',
    },
    {
      name: 'stockTotal',
      type: 'number',
      required: true,
      min: 0,
      label: 'Stock total',
      admin: {
        description: 'El stock restante no puede ser mayor a este valor.',
      },
    },
    {
      name: 'endsAt',
      type: 'date',
      required: true,
      label: 'Fecha y hora de finalización',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Fecha y hora exacta en que termina la oferta. Se guarda tal cual, nunca se recalcula sola.',
      },
    },
    {
      name: 'variantGroups',
      type: 'array',
      label: 'Grupos de variación',
      admin: {
        description:
          "Ejes de variación del producto (ej: Talla, Color). El frontend arma automáticamente todas las combinaciones posibles (S + Negra, M + Blanca, etc). No cambian el precio.",
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
          label: 'Identificador (slug)',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nombre del grupo',
          admin: {
            description: "Ej: 'Talla', 'Color'",
          },
        },
        {
          name: 'values',
          type: 'array',
          minRows: 1,
          label: 'Valores',
          fields: [
            {
              name: 'slug',
              type: 'text',
              required: true,
              label: 'Identificador (slug)',
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Etiqueta visible',
            },
          ],
        },
      ],
    },
  ],
}
