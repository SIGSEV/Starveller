import _ from 'lodash'
import mongoose, { Schema } from 'mongoose'

import { getSocketServer } from 'api/io'
import { toObj, fullRepo } from 'api/transformRepo'

const RepoSchema = new Schema({

  name: { type: String, required: true },
  complete: { type: Boolean, default: false },

  summary: {
    picture: String,
    mainColor: String,
    createdAt: Date,
    lastFetch: Date,
    description: String,
    language: String,
    starsCount: { type: Number, default: 0 },
    forksCount: { type: Number, default: 0 },
    watchersCount: { type: Number, default: 0 }
  },

  stars: {
    byDay: [{ date: Date, stars: Number }]
  },

  events: [{
    type: { type: String },
    data: { type: Schema.Types.Mixed, default: {} }
  }],

  cache: {
    lastFetch: { type: Date, default: new Date(0) },
    lastPage: { type: Number, default: 1 },
    stars: { type: Array, default: [] },
    rank: { type: Number, default: 1 }
  }

})

RepoSchema.post('save', repo => {
  const io = getSocketServer()
  if (!repo.complete || !io) { return }

  const finalRepo = _.flow(toObj, fullRepo)(repo)
  const { summary: { starsCount } } = repo

  // Add a timeout for small repos, so the socket event will get catched by the browser
  setTimeout(() => io.repoFetched(finalRepo), starsCount < 200 ? 500 : 0)
})

export default mongoose.model('Repo', RepoSchema)
