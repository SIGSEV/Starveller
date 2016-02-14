import schedule from 'node-schedule'

import { refreshAll } from 'api/Repo.service'

schedule.scheduleJob('00 00 00 * * *', () => {
  console.log(`==> STARTING CRON, BRO`)
  refreshAll()
})
