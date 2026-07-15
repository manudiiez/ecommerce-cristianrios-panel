import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

export const admins: Access = ({ req: { user } }) => Boolean(user)

export const lockedAfterCreate: FieldAccess = () => false
