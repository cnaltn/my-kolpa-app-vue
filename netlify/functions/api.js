import express, { Router } from 'express'
import serverless from 'serverless-http'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'

const api = express()

const router = Router()

const PORT = 3000

// Define MongoDB schema
const userSchema = new mongoose.Schema({
  name: String,
  count: Number
})

// Create MongoDB model
const UserModel = mongoose.model('User', userSchema)

// Connect to MongoDB
async function main() {
  await mongoose.connect(
    'mongodb+srv://kolpaapp:6879982m@cluster0.spxymxf.mongodb.net/?retryWrites=true&w=majority'
  )
}
main().catch((err) => console.log(err))

api.get('/api/users', async (req, res) => {
  try {
    const users = await UserModel.find()
    res.json({ users })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // limit each IP to 1 request per windowMs
  keyGenerator: (req) => {
    // Use the user's IP address from x-forwarded-for header or remoteAddress as the key
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress
  }
})

api.post('/api/newusers', async (req, res) => {
  const { name, count } = req.body
  try {
    // Sabit veriyi kullanarak UserModel dizisini oluştur
    const usersToInsert = [req.body]

    // UserModel dizisini MongoDB'ye kaydet
    const insertedUsers = await UserModel.insertMany(usersToInsert)

    res.json({ success: true, insertedUsers })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

api.post('/api/increment-count', limiter, async (req, res) => {
  const { userName } = req.body

  try {
    const user = await UserModel.findOne({ name: userName })

    if (user) {
      user.count += 1
      await user.save()
      res.json({ success: true, updatedUser: user })
    } else {
      res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

api.delete('/api/delete-user', async (req, res) => {
  const { name } = req.body

  try {
    const user = await UserModel.findOne({ name: name })

    if (user) {
      await user.deleteOne()
      res.json({ success: true, deletedUser: user })
    } else {
      res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

api.post('/api/set-zero', async (req, res) => {
  try {
    await UserModel.updateMany({}, { $set: { count: 0 } })
    res.json({ success: true, message: 'All user counts set to zero' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

export const handler = serverless(api)
