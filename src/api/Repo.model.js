import mongoose, { Schema } from 'mongoose'

const RepoSchema = new Schema({

  name: { type: String, required: true },

  description: String,
  createdAt: Date,

  starsCount: { type: Number, default: 0 },
  watchersCount: { type: Number, default: 0 },
  forksCount: { type: Number, default: 0 },

  stars: [{
    date: Date,
    page: Number
  }],

  events: [{
    link: String,
    title: String,
    comment: String
  }],

  lastPage: { type: Number, default: 1 }

})

export default mongoose.model('Repo', RepoSchema)
