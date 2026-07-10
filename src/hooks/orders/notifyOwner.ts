import type { CollectionAfterChangeHook } from 'payload'

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string,
  )

export const notifyOwner: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  try {
    const store = await req.payload.findGlobal({ slug: 'store', req })
    const digits = (doc.form?.tel || '').replace(/\D/g, '')
    const waLink = digits ? `https://wa.me/${digits}` : null

    const itemsHtml = (doc.items ?? [])
      .map((item: { name: string; sizeLabel?: string; finishLabel?: string; qty: number; unitPrice: number }) => {
        const details = [item.sizeLabel, item.finishLabel].filter(Boolean).join(' / ')
        return `<li>${item.qty}x ${escapeHtml(item.name)}${details ? ` (${escapeHtml(details)})` : ''} — $${item.unitPrice}</li>`
      })
      .join('')

    const html = `
      <h2>Nuevo pedido ${escapeHtml(doc.code)}</h2>
      <p><strong>Cliente:</strong> ${escapeHtml(doc.form?.nombre || '')}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(doc.form?.tel || '')}</p>
      ${doc.form?.email ? `<p><strong>Email:</strong> ${escapeHtml(doc.form.email)}</p>` : ''}
      <p><strong>Canal preferido:</strong> ${escapeHtml(doc.form?.canal || '')}</p>
      <p><strong>Tipo de cliente:</strong> ${escapeHtml(doc.form?.tipo || '')}</p>
      ${doc.form?.notas ? `<p><strong>Notas:</strong> ${escapeHtml(doc.form.notas)}</p>` : ''}
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> $${doc.total}</p>
      ${waLink ? `<p><a href="${waLink}">Contactar al cliente por WhatsApp</a></p>` : ''}
    `

    await req.payload.sendEmail({
      to: store.email,
      subject: `Nuevo pedido ${doc.code}`,
      html,
    })
  } catch (err) {
    req.payload.logger.error(`No se pudo enviar el email del pedido ${doc.code}: ${err}`)
  }

  return doc
}
