import schedule from 'node-schedule'

import { refreshAll, refreshFeatured } from 'api/Repo.service'

schedule.scheduleJob('0 0 * * *', () => {
  refreshAll()
  refreshFeatured()
})
