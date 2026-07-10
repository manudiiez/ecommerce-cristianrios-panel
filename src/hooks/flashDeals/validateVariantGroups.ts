import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'

interface VariantGroup {
  slug: string
  name: string
  values?: Array<{ slug: string; label: string }> | null
}

export const validateVariantGroups: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
}) => {
  if (!data) return data

  const merged = { ...originalDoc, ...data }
  const groups = (merged.variantGroups ?? []) as VariantGroup[]

  const groupSlugs = new Set<string>()
  for (const group of groups) {
    if (groupSlugs.has(group.slug)) {
      throw new APIError(`El grupo de variación '${group.slug}' está repetido.`, 400)
    }
    groupSlugs.add(group.slug)

    const valueSlugs = new Set<string>()
    for (const value of group.values ?? []) {
      if (valueSlugs.has(value.slug)) {
        throw new APIError(
          `El valor '${value.slug}' está repetido dentro del grupo '${group.slug}'.`,
          400,
        )
      }
      valueSlugs.add(value.slug)
    }
  }

  return data
}
