import { useState } from 'react'

function HeroVideo() {
  // Fresh Luxury Fashion Editorial Showcase (No hotlink blocks, auto-looping)
  var [videoUrl] = useState('https://assets.mixkit.co/videos/41551/41551-720.mp4')

  return (
    <section className="hero-video-section">
      <video
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </section>
  )
}

export default HeroVideo;