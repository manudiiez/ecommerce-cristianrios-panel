import type { GlobalConfig } from 'payload'

import { admins, anyone } from '../access'

export const Store: GlobalConfig = {
  slug: 'store',
  label: 'Tienda',
  admin: {
    group: 'Configuración',
  },
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre de la tienda',
      defaultValue: 'Hanna · Yesos y Aromas',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Frase / eslogan',
    },
    {
      name: 'whatsapp',
      type: 'text',
      required: true,
      label: 'WhatsApp (formato internacional)',
      admin: {
        description:
          "Solo números, sin '+' ni espacios ni guiones. Ejemplo: 5492610000000 (código de país + código de área + número).",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Este campo es obligatorio.'
        if (!/^\d{6,15}$/.test(value)) {
          return "Formato inválido. Usá solo números, sin '+' ni espacios. Ejemplo: 5492610000000."
        }
        return true
      },
    },
    {
      name: 'whatsappDisplay',
      type: 'text',
      label: 'WhatsApp para mostrar',
      admin: {
        description: 'Cómo se muestra el número en la web, con formato legible. Ej: +54 9 261 000-0000',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email de contacto',
      admin: {
        description: 'A esta dirección llegan los avisos de pedidos nuevos.',
      },
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Usuario de Instagram',
      admin: {
        description: 'Sin @, ej: hanna.yesosyaromas',
      },
    },
  ],
}
