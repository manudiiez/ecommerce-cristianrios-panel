import type { CollectionConfig } from 'payload'

import { admins, anyone } from '../access'
import { soonestEndpoint } from '../endpoints/flashDeals/soonest'
import { epochEndsAt } from '../hooks/flashDeals/epochEndsAt'
import { validateFlashDealPricing } from '../hooks/flashDeals/validateFlashDealPricing'

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
    beforeValidate: [validateFlashDealPricing],
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
      name: 'variants',
      type: 'array',
      label: 'Variantes',
      admin: {
        description: 'Variantes cosméticas (color, aroma). No cambian el precio.',
      },
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
}
