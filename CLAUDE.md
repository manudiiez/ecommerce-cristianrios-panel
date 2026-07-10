# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

# Convenciones del proyecto

- El precio vive en `sizes` (price + paintedAdd), NUNCA en products. No "corregir" esto.
- Kits y flash-deals tienen precio FIJO, no calculado desde componentes.
- Pricing: base = size.price + (pintada ? paintedAdd : 0); descuento → round100. Enteros ARS.
- orders: count/total/unitPrice se recalculan server-side en beforeChange. Nunca confiar en el cliente.
- flash-deals.endsAt: fecha absoluta persistida, jamás calculada por request.
- Discriminador de líneas de pedido: campo `type`, no flags booleanos.
- Access: catálogo read público / escritura admin; orders create público, resto admin.
- Admin en español, pensado para usuaria no técnica.