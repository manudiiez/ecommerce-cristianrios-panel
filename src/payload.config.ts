import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Worlds } from './collections/Worlds'
import { Categories } from './collections/Categories'
import { Sizes } from './collections/Sizes'
import { Finishes } from './collections/Finishes'
import { Products } from './collections/Products'
import { WhatsappItems } from './collections/WhatsappItems'
import { Kits } from './collections/Kits'
import { FlashDeals } from './collections/FlashDeals'
import { Orders } from './collections/Orders'
import { Store } from './globals/Store'
import { quoteEndpoint } from './endpoints/pricing/quote'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Worlds,
    Categories,
    Sizes,
    Finishes,
    Products,
    WhatsappItems,
    Kits,
    FlashDeals,
    Orders,
  ],
  globals: [Store],
  endpoints: [quoteEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@hanna.local',
    defaultFromName: 'Hanna · Yesos y Aromas',
    skipVerify: !process.env.SMTP_HOST,
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  sharp,
  plugins: [],
})
