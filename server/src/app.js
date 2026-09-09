const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')

const authRoutes = require('./routes/authRoutes')
const orderRoutes = require('./routes/orderRoutes')
const videoRoutes = require('./routes/videoRoutes')

const app = express()

// Auto-create upload directories
const videoUploadDir = path.join(__dirname, '../uploads/videos')
const imageUploadDir = path.join(__dirname, '../uploads/images')
if (!fs.existsSync(videoUploadDir)) fs.mkdirSync(videoUploadDir, { recursive: true })
if (!fs.existsSync(imageUploadDir)) fs.mkdirSync(imageUploadDir, { recursive: true })

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({ origin: '*', credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

// Serve static uploads with explicit CORS and Video Range Headers
app.use('/uploads', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(path.join(__dirname, '../uploads')))

app.get('/api/health', function (req, res) {
  res.status(200).json({
    status: 'OK',
    brand: 'AR VENUE',
    message: 'Backend server is fully operational',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/videos', videoRoutes)

app.use(function (req, res) {
  res.status(404).json({ success: false, message: 'API route not found: ' + req.originalUrl })
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' })
})

module.exports = app
