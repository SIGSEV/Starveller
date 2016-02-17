import schedule from 'node-schedule'

import { refreshAll } from 'api/Repo.service'

console.log(`***************************************`)
console.log(`**         SCHEDULING THINGS         **`)
console.log(`***************************************`)

schedule.scheduleJob('00 00 00 * * *', () => {
  console.log(`==> STARTING CRON, BRO`)
  refreshAll()
})
