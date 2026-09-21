import { useState } from 'react'

function HeroVideo() {
  // 10-Second High-End Luxury Brand Video containing dresses, bags, perfumes, apparel
  var [videoUrl] = useState('https://videos.pexels.com/video-files/8148366/8148366-hd_1280_720_25fps.mp4')

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