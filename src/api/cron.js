import schedule from 'node-schedule'

import { refreshAll, refreshTrending } from 'api/Repo.service'

schedule.scheduleJob('0 0 * * *', () => {
  refreshAll()
  refreshTrending()
})
