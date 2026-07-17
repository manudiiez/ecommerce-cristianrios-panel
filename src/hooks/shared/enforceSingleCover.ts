import type { CollectionBeforeValidateHook } from 'payload'

export const enforceSingleCover = (fieldName: string): CollectionBeforeValidateHook => {
  return ({ data }) => {
    if (!data) return data

    const images = data[fieldName]
    if (!Array.isArray(images) || images.length === 0) return data

    const coverIndex = images.findIndex((image) => image?.cover)
    const resolvedCoverIndex = coverIndex === -1 ? 0 : coverIndex

    images.forEach((image, index) => {
      if (image) image.cover = index === resolvedCoverIndex
    })

    return data
  }
}
