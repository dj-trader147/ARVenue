const mongoose = require('mongoose')
const Admin = require('../models/Admin')

const connectDB = async function () {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    })
    console.log('=================================')
    console.log('MongoDB Atlas Connected Successfully!')
    console.log('Host: ' + conn.connection.host)
    console.log('=================================')

    // Auto seed admin for Ahsan Rajpoot if not exists
    const adminExists = await Admin.findOne({ email: 'arvenue0300@gmail.com' })
    if (!adminExists) {
      await Admin.create({
        name: 'Ahsan Rajpoot',
        email: 'arvenue0300@gmail.com',
        password: 'admin123456'
      })
      console.log('Admin Account Seeded: arvenue0300@gmail.com')
    }
  } catch (error) {
    console.warn('=================================')
    console.warn('MongoDB Connection Warning: ' + error.message)
    console.warn('Server is running. Update MONGO_URI in server/.env when cluster is ready.')
    console.warn('=================================')
  }
}

module.exports = connectDB
