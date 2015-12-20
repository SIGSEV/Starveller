import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { fetch } from 'api/Repo.service'

const name = process.argv[2]
const hard = process.argv[3]

if (!name || name.indexOf('/') === -1) {
  throw new Error('Give me a repo and a hard flag, fuck&r.')
}

mongoose.connect('mongodb://localhost/statoss', { db: { safe: true } })

dotenv.load()

fetch(name, hard === 'hard')
  .then(() => { process.exit(0) })
  .catch(err => {
    /* eslint-disable no-console */
    console.log(err)
    /* eslint-enable no-console */
  })
