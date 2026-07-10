import type { CollectionConfig } from 'payload'

import { admins, anyone } from '../access'
import { generateCode } from '../hooks/orders/generateCode'
import { notifyOwner } from '../hooks/orders/notifyOwner'
import { recomputeTotals } from '../hooks/orders/recomputeTotals'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Pedido',
    plural: 'Pedidos',
  },
  admin: {
    useAsTitle: 'code',
    group: 'Ventas',
    defaultColumns: ['code', 'status', 'form.nombre', 'total', 'createdAt'],
    description: 'No es un cobro: es la captura de contacto y el detalle del carrito para que cierres la venta por WhatsApp o email.',
  },
  defaultSort: '-createdAt',
  access: {
    create: anyone,
    read: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeChange: [generateCode, recomputeTotals],
    afterChange: [notifyOwner],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      unique: true,
      label: 'Código de pedido',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'nuevo',
      label: 'Estado',
      admin: {
        description:
          'Nuevo → Contactado (ya hablaste con el cliente) → Cerrado (venta concretada) / Cancelado.',
      },
      options: [
        { label: 'Nuevo', value: 'nuevo' },
        { label: 'Contactado', value: 'contactado' },
        { label: 'Cerrado', value: 'cerrado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
    },
    {
      name: 'form',
      type: 'group',
      label: 'Datos de contacto',
      fields: [
        {
          name: 'nombre',
          type: 'text',
          required: true,
          label: 'Nombre',
        },
        {
          name: 'tel',
          type: 'text',
          required: true,
          label: 'Teléfono',
          admin: {
            description: 'Necesario para armar el link de WhatsApp con el cliente.',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'canal',
          type: 'select',
          defaultValue: 'cualquiera',
          label: 'Canal preferido',
          options: [
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Email', value: 'email' },
            { label: 'Cualquiera', value: 'cualquiera' },
          ],
        },
        {
          name: 'tipo',
          type: 'select',
          defaultValue: 'publico',
          label: 'Tipo de cliente',
          options: [
            { label: 'Público', value: 'publico' },
            { label: 'Revendedor', value: 'revendedor' },
            { label: 'Mayorista', value: 'mayorista' },
          ],
        },
        {
          name: 'notas',
          type: 'textarea',
          label: 'Notas',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      label: 'Ítems del pedido',
      admin: {
        description: 'Foto del carrito al momento del pedido. Los precios quedan congelados acá.',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Tipo',
          options: [
            { label: 'Producto', value: 'product' },
            { label: 'Kit', value: 'kit' },
            { label: 'Oferta relámpago', value: 'flash' },
          ],
        },
        {
          name: 'refId',
          type: 'text',
          required: true,
          label: 'Identificador (slug) del producto/kit/oferta',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nombre',
        },
        {
          name: 'sizeLabel',
          type: 'text',
          label: 'Tamaño',
        },
        {
          name: 'finishLabel',
          type: 'text',
          label: 'Acabado',
        },
        {
          name: 'variantLabel',
          type: 'text',
          label: 'Variante',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          label: 'Precio unitario',
          admin: {
            description: 'Se recalcula en el servidor; el valor enviado por el cliente nunca se usa tal cual.',
          },
        },
        {
          name: 'qty',
          type: 'number',
          required: true,
          min: 1,
          label: 'Cantidad',
        },
        {
          name: 'sizeSlug',
          type: 'text',
          label: 'Tamaño (slug interno)',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'finishSlug',
          type: 'text',
          label: 'Acabado (slug interno)',
          admin: {
            hidden: true,
          },
        },
      ],
    },
    {
      name: 'count',
      type: 'number',
      label: 'Cantidad de ítems',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'total',
      type: 'number',
      label: 'Total',
      admin: {
        readOnly: true,
      },
    },
  ],
}
