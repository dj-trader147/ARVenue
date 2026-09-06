const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const authRoutes = require('./routes/authRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express()

// Security & Logging Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static Uploads Serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health Endpoint
app.get('/api/health', function (req, res) {
  res.status(200).json({
    status: 'OK',
    brand: 'AR VENUE',
    message: 'Backend server is fully operational',
    timestamp: new Date().toISOString()
  })
})

// Mount Routes
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)

// 404 Handler
app.use(function (req, res) {
  res.status(404).json({
    success: false,
    message: 'API route not found: ' + req.originalUrl
  })
})

// Global Error Handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})

module.exports = app
