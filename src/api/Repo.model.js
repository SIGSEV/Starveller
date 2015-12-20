import mongoose, { Schema } from 'mongoose'

const RepoSchema = new Schema({

  name: { type: String, required: true },
  stars: [{
    date: Date,
    page: Number
  }],

  starCount: { type: Number, default: 0 },

  events: [{
    link: String,
    title: String,
    comment: String
  }],

  lastPage: { type: Number, default: 1 }

})

export default mongoose.model('Repo', RepoSchema)
