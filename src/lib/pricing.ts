/**
 * Regla de pricing de la tienda. Módulo compartido: lo usan el hook de
 * recompute de orders y el endpoint /api/pricing/quote. No duplicar esta
 * lógica en otro lado.
 *
 * base = size.price + (finish === "pintada" ? size.paintedAdd : 0)
 * si el producto tiene discount y aplica (scope "all", o scope "finish" con
 * el finish elegido) Y (sizeScope "all", o sizeScope "specific" con el size
 * elegido entre los seleccionados): final = round100(base * (1 - pct/100))
 * si no: final = base
 */

export const round100 = (value: number): number => Math.round(value / 100) * 100

export interface PricingSize {
  price: number
  paintedAdd: number
}

export interface PricingDiscount {
  pct?: number | null
  scope?: ('all' | 'finish') | null
  finish?: string | null
  sizeScope?: ('all' | 'specific') | null
  sizes?: string[] | null
}

/**
 * Shape of `product.discount` as returned by the Local/REST API: `finish`
 * and `sizes` vienen como relationship poblada (objeto con `slug`), id
 * crudo, o vacío, según el depth de la query — nunca un slug directo.
 */
export interface RawProductDiscount {
  pct?: number | null
  scope?: ('all' | 'finish') | null
  finish?: string | number | { slug?: string | null } | null
  sizeScope?: ('all' | 'specific') | null
  sizes?: Array<string | number | { slug?: string | null }> | null
}

export function normalizeDiscount(discount?: RawProductDiscount | null): PricingDiscount | undefined {
  if (!discount) return undefined
  const finishSlug =
    discount.finish && typeof discount.finish === 'object' ? (discount.finish.slug ?? null) : null
  const sizeSlugs =
    discount.sizes
      ?.map((s) => (s && typeof s === 'object' ? (s.slug ?? null) : null))
      .filter((slug): slug is string => Boolean(slug)) ?? null

  return {
    pct: discount.pct,
    scope: discount.scope,
    finish: finishSlug,
    sizeScope: discount.sizeScope,
    sizes: sizeSlugs,
  }
}

export interface ComputeProductPriceArgs {
  size: PricingSize
  finishSlug: string
  sizeSlug: string
  discount?: PricingDiscount | null
}

export interface ComputeProductPriceResult {
  price: number
  was?: number
}

export function computeProductPrice({
  size,
  finishSlug,
  sizeSlug,
  discount,
}: ComputeProductPriceArgs): ComputeProductPriceResult {
  const base = size.price + (finishSlug === 'pintada' ? size.paintedAdd : 0)

  const finishMatches = discount?.scope !== 'finish' || discount?.finish === finishSlug
  const sizeMatches =
    discount?.sizeScope !== 'specific' || Boolean(discount?.sizes?.includes(sizeSlug))
  const discountApplies = Boolean(discount?.pct) && finishMatches && sizeMatches

  if (!discountApplies) return { price: base }

  const final = round100(base * (1 - (discount!.pct as number) / 100))
  return { price: final, was: base }
}
