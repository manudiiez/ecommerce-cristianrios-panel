import type { Access } from 'payload'

export const anyone: Access = () => true

export const admins: Access = ({ req: { user } }) => Boolean(user)
