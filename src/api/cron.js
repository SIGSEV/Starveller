import schedule from 'node-schedule'

import { refreshAll } from 'api/Repo.service'

schedule.scheduleJob('0 0 * * *', () => {
  /* eslint-disable no-console */
  console.log(`==> STARTING CRON, BRO`)
  /* eslint-enable no-console */
  refreshAll()
})
