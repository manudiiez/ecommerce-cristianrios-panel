import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { seed } from './index'

const run = async () => {
  const payload = await getPayload({ config })
  await seed(payload)
  await payload.destroy()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
