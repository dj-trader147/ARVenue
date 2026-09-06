require('dotenv').config()
const dns = require('dns')

// Fix Windows ISP DNS SRV lookup issue for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4'])
} catch (e) {
  console.log('DNS fallback set')
}

const app = require('./src/app')
const connectDB = require('./src/config/db')

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await connectDB()
    app.listen(PORT, function () {
      console.log('=================================')
      console.log('  AR VENUE Backend Server')
      console.log('  Port: ' + PORT)
      console.log('  Env:  ' + (process.env.NODE_ENV || 'development'))
      console.log('=================================')
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

startServer()
