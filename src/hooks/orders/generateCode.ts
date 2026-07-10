import type { CollectionBeforeChangeHook } from 'payload'

import { APIError } from 'payload'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin caracteres ambiguos (0/O, 1/I, etc.)

const randomSuffix = (length = 6): string => {
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return result
}

export const generateCode: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `HNN-${randomSuffix()}`
    const { totalDocs } = await req.payload.count({
      collection: 'orders',
      where: { code: { equals: candidate } },
      req,
    })

    if (totalDocs === 0) {
      data.code = candidate
      return data
    }
  }

  throw new APIError('No se pudo generar un código de pedido único, reintentá.', 500)
}
