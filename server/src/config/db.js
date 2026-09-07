const mongoose = require('mongoose')
const dns = require('dns')
const Admin = require('../models/Admin')

// Force IPv4 lookup for Node.js 24 on Render cloud
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first')
}

const connectDB = async function () {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.warn('MONGO_URI Environment Variable is missing!')
    return
  }
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      family: 4
    })
    console.log('=================================')
    console.log('MongoDB Atlas Connected Successfully!')
    console.log('Host: ' + conn.connection.host)
    console.log('=================================')

    // Auto seed admin for Ahsan Rajpoot
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
    console.warn('=================================')
  }
}

module.exports = connectDB
