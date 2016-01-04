import mongoose, { Schema } from 'mongoose'

const RepoSchema = new Schema({

  name: { type: String, required: true },
  complete: { type: Boolean, default: false },

  summary: {
    createdAt: Date,
    lastFetch: Date,
    description: String,
    starsCount: { type: Number, default: 0 },
    forksCount: { type: Number, default: 0 },
    watchersCount: { type: Number, default: 0 }
  },

  stars: {
    byDay: [{ date: Date, stars: Number }],
    byWeek: [{ date: Date, stars: Number }],
    byMonth: [{ date: Date, stars: Number }],
    byYear: [{ date: Date, stars: Number }]
  },

  events: [{
    type: { type: String },
    data: { type: Schema.Types.Mixed, default: {} }
  }],

  cache: {
    lastPage: { type: Number, default: 0 },
    stars: { type: Array, default: [] }
  }

})

export default mongoose.model('Repo', RepoSchema)
