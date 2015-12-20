import { createRepo } from 'api/Repo.service'

const name = process.argv[2]
const hard = process.argv[3]

if (!name || name.indexOf('/') === -1) {
  throw new Error('Give me a repo and a hard flag, fuck&r.')
}

createRepo(name, hard === 'hard', true)
  .then(() => { process.exit(0) })
  .catch(err => {
    /* eslint-disable no-console */
    console.log(err)
    /* eslint-enable no-console */
  })
