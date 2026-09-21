import { useState } from 'react'

function HeroVideo() {
  // Pure hardcoded demo video to test layout without any backend interference
  var [videoUrl] = useState('https://assets.mixkit.co/videos/40893/40893-720.mp4')

  return (
    <section className="hero-video-section" style={{ background: '#0a0a0a', width: '100%', overflow: 'hidden' }}>
      <video
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </section>
  )
}

export default HeroVideo;