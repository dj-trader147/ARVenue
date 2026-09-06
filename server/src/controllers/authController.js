const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

function generateToken(id) {
  return jwt.sign(
    { id: id },
    process.env.JWT_SECRET || 'arvenue_super_secret_key_change_in_production_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  )
}

// @desc    Seed Initial Admin Account (Ahsan Rajpoot)
// @route   POST /api/auth/seed
exports.seedAdmin = async function (req, res) {
  try {
    const adminExists = await Admin.findOne({ email: 'arvenue0300@gmail.com' })
    if (adminExists) {
      return res.status(200).json({
        success: true,
        message: 'Admin account already exists',
        email: adminExists.email
      })
    }

    const admin = await Admin.create({
      name: 'Ahsan Rajpoot',
      email: 'arvenue0300@gmail.com',
      password: 'admin123456' // Initial password, can be changed later
    })

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully!',
      email: admin.email,
      note: 'Default password is: admin123456'
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// @desc    Admin Login
// @route   POST /api/auth/login
exports.login = async function (req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password')
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const isMatch = await admin.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const token = generateToken(admin._id)

    res.status(200).json({
      success: true,
      token: token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// @desc    Get Current Admin
// @route   GET /api/auth/me
exports.getMe = async function (req, res) {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
