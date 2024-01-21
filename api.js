const express = require('express')
const cors = require('cors')
const serverless = require('serverless-http')
const rateLimit = require('express-rate-limit')

const app = express()
app.use(cors())
app.use(express.json())
const port = 5000

const userData = {
  users: [
    {
      name: 'Enis',
      count: 0
    },
    {
      name: 'Mahmut',
      count: 0
    }
  ]
}

app.get('/api/users', (req, res) => {
  res.send(userData)
})

// Define a rate limiter with options
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // limit each IP to 1 request per windowMs
  keyGenerator: (req) => {
    // Use the user's IP address from x-forwarded-for header or remoteAddress as the key
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress
  }
})

// Apply the rate limiter to the specified route
app.post('/api/increment-count', limiter, (req, res) => {
  const { userName } = req.body

  const userIndex = userData.users.findIndex((user) => user.name === userName)

  if (userIndex !== -1) {
    userData.users[userIndex].count += 1
    res.json({ success: true, updatedUser: userData.users[userIndex] })
  } else {
    res.status(404).json({ success: false, message: 'User not found' })
  }
})

app.post('/api/set-zero', (req, res) => {
  // Sıfırlama işlemi için önce tüm kullanıcıların count değerlerini sıfırlayın
  userData.users.forEach((user) => {
    user.count = 0
  })

  // Sonuçları döndürün
  res.json({ success: true, message: 'All user counts set to zero' })
})

// Other routes...

app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))
