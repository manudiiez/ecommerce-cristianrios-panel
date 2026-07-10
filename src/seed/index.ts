import type { Payload } from 'payload'

import { categoriesData } from './data/categories'
import { finishesData } from './data/finishes'
import { flashDealsData } from './data/flashDeals'
import { kitsData } from './data/kits'
import { productsData } from './data/products'
import { sizesData } from './data/sizes'
import { whatsappItemsData } from './data/whatsappItems'
import { worldsData } from './data/worlds'
import { upsertByField, upsertBySlug } from './lib/upsertBySlug'

type SlugMap = Record<string, string | number>

async function seedWorlds(payload: Payload): Promise<SlugMap> {
  const map: SlugMap = {}
  for (const world of worldsData) {
    const doc = await upsertBySlug(payload, 'worlds', world.slug, world)
    map[world.slug] = doc.id
  }
  return map
}

async function seedFinishes(payload: Payload): Promise<SlugMap> {
  const map: SlugMap = {}
  for (const finish of finishesData) {
    const doc = await upsertBySlug(payload, 'finishes', finish.slug, finish)
    map[finish.slug] = doc.id
  }
  return map
}

async function seedSizes(payload: Payload, worldIdBySlug: SlugMap): Promise<SlugMap> {
  const map: SlugMap = {}
  for (const size of sizesData) {
    const { worldSlug, ...rest } = size
    const doc = await upsertBySlug(payload, 'sizes', size.slug, {
      ...rest,
      world: worldIdBySlug[worldSlug],
    })
    map[size.slug] = doc.id
  }
  return map
}

async function seedCategories(payload: Payload, worldIdBySlug: SlugMap): Promise<SlugMap> {
  const map: SlugMap = {}
  for (const category of categoriesData) {
    const { worldSlug, ...rest } = category
    const doc = await upsertBySlug(payload, 'categories', category.slug, {
      ...rest,
      world: worldIdBySlug[worldSlug],
    })
    map[category.slug] = doc.id
  }
  return map
}

async function seedProducts(
  payload: Payload,
  maps: {
    worldIdBySlug: SlugMap
    categoryIdBySlug: SlugMap
    sizeIdBySlug: SlugMap
    finishIdBySlug: SlugMap
  },
): Promise<SlugMap> {
  const map: SlugMap = {}
  for (const product of productsData) {
    const { worldSlug, categorySlug, sizeSlugs, finishSlugs, discount, ...rest } = product

    const resolvedDiscount = discount
      ? {
          pct: discount.pct,
          label: discount.label,
          scope: discount.scope,
          ...('finishSlug' in discount && discount.finishSlug
            ? { finish: maps.finishIdBySlug[discount.finishSlug] }
            : {}),
        }
      : undefined

    const doc = await upsertBySlug(payload, 'products', product.slug, {
      ...rest,
      world: maps.worldIdBySlug[worldSlug],
      category: maps.categoryIdBySlug[categorySlug],
      availableSizes: sizeSlugs.map((s) => maps.sizeIdBySlug[s]),
      finishes: finishSlugs.map((f) => maps.finishIdBySlug[f]),
      ...(resolvedDiscount ? { discount: resolvedDiscount } : {}),
    })
    map[product.slug] = doc.id
  }
  return map
}

async function seedWhatsappItems(payload: Payload, categoryIdBySlug: SlugMap): Promise<void> {
  for (const item of whatsappItemsData) {
    const { categorySlug, ...rest } = item
    await upsertByField(payload, 'whatsapp-items', 'name', item.name, {
      ...rest,
      category: categoryIdBySlug[categorySlug],
    })
  }
}

async function seedKits(
  payload: Payload,
  maps: { worldIdBySlug: SlugMap; productIdBySlug: SlugMap; sizeIdBySlug: SlugMap; finishIdBySlug: SlugMap },
): Promise<void> {
  for (const kit of kitsData) {
    const { worldSlug, items, ...rest } = kit

    const resolvedItems = items.map((item) => {
      const { productSlug, sizeSlug, finishSlug, ...itemRest } = item as {
        name: string
        qty: number
        productSlug?: string
        sizeSlug?: string
        finishSlug?: string
      }
      return {
        ...itemRest,
        ...(productSlug ? { product: maps.productIdBySlug[productSlug] } : {}),
        ...(sizeSlug ? { size: maps.sizeIdBySlug[sizeSlug] } : {}),
        ...(finishSlug ? { finish: maps.finishIdBySlug[finishSlug] } : {}),
      }
    })

    await upsertBySlug(payload, 'kits', kit.slug, {
      ...rest,
      world: maps.worldIdBySlug[worldSlug],
      items: resolvedItems,
    })
  }
}

async function seedFlashDeals(payload: Payload): Promise<void> {
  for (const deal of flashDealsData) {
    await upsertBySlug(payload, 'flash-deals', deal.slug, deal)
  }
}

export async function seed(payload: Payload): Promise<void> {
  payload.logger.info('Seed: mundos y acabados...')
  const worldIdBySlug = await seedWorlds(payload)
  const finishIdBySlug = await seedFinishes(payload)

  payload.logger.info('Seed: tamaños y categorías...')
  const sizeIdBySlug = await seedSizes(payload, worldIdBySlug)
  const categoryIdBySlug = await seedCategories(payload, worldIdBySlug)

  payload.logger.info('Seed: productos e ítems de WhatsApp...')
  const productIdBySlug = await seedProducts(payload, {
    worldIdBySlug,
    categoryIdBySlug,
    sizeIdBySlug,
    finishIdBySlug,
  })
  await seedWhatsappItems(payload, categoryIdBySlug)

  payload.logger.info('Seed: kits y ofertas relámpago...')
  await seedKits(payload, { worldIdBySlug, productIdBySlug, sizeIdBySlug, finishIdBySlug })
  await seedFlashDeals(payload)

  payload.logger.info('Seed completado.')
}
