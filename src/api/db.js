import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.load()

mongoose.connect(process.env.MONGO, { db: { safe: true } })
