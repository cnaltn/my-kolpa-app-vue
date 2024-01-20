import express, { Router } from 'express'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bodyParser = require('body-parser')
const cors = require('cors')
import serverless from 'serverless-http'

const api = express()
const router = Router()
api.use(cors())
api.use(bodyParser.json())

const usersData = [
  { name: 'Enis', count: 0 },
  { name: 'Mahmut', count: 0 }
]

router.get('/users', (req, res) => {
  res.json({
    users: usersData
  })
})

router.get('/hello', (req, res) => res.send('Hello World!'))

router.post('/increment-count', (req, res) => {
  const { userName } = req.body

  const userIndex = usersData.findIndex((user) => user.name === userName)

  if (userIndex !== -1) {
    usersData[userIndex].count += 1
    res.json({ success: true, updatedUser: usersData[userIndex] })
  } else {
    res.status(404).json({ success: false, message: 'User not found' })
  }
})

api.use('/api/', router)

export const handler = serverless(api)
