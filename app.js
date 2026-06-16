const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'ok', version: '1.0' }))
app.get('/health', (req, res) => res.json({ healthy: true }))
app.post('/greet', (req, res) => {
  const { name } = req.body
  res.json({ message: `Hello, ${name}!` })
})

module.exports = app