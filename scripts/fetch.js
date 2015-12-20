import dotenv from 'dotenv'
import mongoose from 'mongoose'

import * as RepoService from 'api/Repo.service'

const name = process.argv[2]
const arg = process.argv[3]

if (!name || name.indexOf('/') === -1) {
  throw new Error('Give me a repo, fuck&r.')
}

mongoose.connect('mongodb://localhost/statoss', { db: { safe: true } })

dotenv.load()

RepoService.fetch(name, arg === 'hard')
  .then(() => { process.exit(0) })
  .catch(err => {
    /* eslint-disable no-console */
    console.log(err)
    /* eslint-enable no-console */
  })
