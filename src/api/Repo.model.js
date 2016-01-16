import _ from 'lodash'
import mongoose, { Schema } from 'mongoose'

import { getSocketServer } from 'api/io'

const RepoSchema = new Schema({

  name: { type: String, required: true },
  complete: { type: Boolean, default: false },

  shot: String,

  summary: {
    createdAt: Date,
    lastFetch: Date,
    description: String,
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
    lastPage: { type: Number, default: 0 },
    stars: { type: Array, default: [] }
  }

})

RepoSchema.post('save', repo => {
  const io = getSocketServer()
  if (!repo.complete || !io) { return }

  io.repoFetched(_.omit(repo.toObject(), 'cache'))
})

export default mongoose.model('Repo', RepoSchema)
