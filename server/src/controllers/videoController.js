const VideoSetting = require('../models/VideoSetting')

// Get video for specific location
exports.getVideoByLocation = async function(req, res) {
  try {
    const video = await VideoSetting.findOne({ location: req.params.location })
    if (!video) {
      return res.status(200).json({ success: false, message: 'No custom video set' })
    }
    res.status(200).json({ success: true, video: video })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Upload / Set video for location
exports.uploadVideoSetting = async function(req, res) {
  try {
    const { location, videoUrl } = req.body
    let finalUrl = videoUrl || ''

    if (req.file) {
      finalUrl = '/uploads/videos/' + req.file.filename
    }

    if (!finalUrl) {
      return res.status(400).json({ success: false, message: 'Please provide a video file or MP4 URL' })
    }

    const updated = await VideoSetting.findOneAndUpdate(
      { location: location },
      { videoUrl: finalUrl, updatedAt: Date.now() },
      { upsert: true, new: true }
    )

    res.status(200).json({
      success: true,
      message: 'Video updated successfully on live website!',
      video: updated
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
