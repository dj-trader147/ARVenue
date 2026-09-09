const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { getVideoByLocation, uploadVideoSetting } = require('../controllers/videoController')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/videos'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
})

router.get('/:location', getVideoByLocation)
router.post('/upload', upload.single('videoFile'), uploadVideoSetting)

module.exports = router
