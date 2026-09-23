import { useState } from 'react'
import { API_BASE_URL } from '../utils/api'

var departmentCategories = {
  'mens': ['Slippers', 'Fabrics', 'Bags', 'Perfumes', 'Jeans', 'Trousers', 'Shirts'],
  'womens': ['Slippers', 'Fabrics', 'Bags', 'Perfumes', 'Jeans', 'Trousers', 'Shirts'],
  'kids': ['Slippers', 'Jeans', 'Trousers', 'Shirts'],
  'premium-lounge': ['Exclusive Suits', 'Luxury Perfumes', 'Premium Slippers', 'Limited Edition Bags']
}

function Videos() {
  var [pageType, setPageType] = useState('landing')
  var [dept, setDept] = useState('mens')
  var [category, setCategory] = useState('Slippers')
  var [videoFile, setVideoFile] = useState(null)
  var [videoUrlInput, setVideoUrlInput] = useState('')
  var [uploading, setUploading] = useState(false)

  async function handleUpload(e) {
    e.preventDefault()
    setUploading(true)

    var targetLocation = pageType
    if (pageType === 'department') targetLocation = dept
    if (pageType === 'category') targetLocation = dept + '-' + category.toLowerCase().replace(/ /g, '-')

    var formData = new FormData()
    formData.append('location', targetLocation)
    if (videoFile) {
      formData.append('videoFile', videoFile)
    }
    if (videoUrlInput) {
      formData.append('videoUrl', videoUrlInput)
    }

    try {
      var res = await fetch(API_BASE_URL + '/api/videos/upload', {
        method: 'POST',
        body: formData
      })
      var data = await res.json()

      if (data.success) {
        alert('SUCCESS! Video is now LIVE on customer website for [' + targetLocation.toUpperCase() + ']!')
        setVideoFile(null)
        setVideoUrlInput('')
      } else {
        alert('Upload Failed: ' + (data.message || 'Unknown error'))
      }
    } catch (err) {
      alert('Error uploading video to server: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px', color: '#111' }}>Page Video Manager</h1>

      <div className="admin-card" style={{ maxWidth: '750px', background: '#FFF', border: '1px solid #E5E5E5', padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Upload Video for Specific Page</h3>
        
        {/* Production Cloud Persistence Alert */}
        <div style={{ background: '#FFF3CD', border: '1px solid #FFE69C', color: '#664D03', padding: '16px', borderRadius: '4px', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '24px' }}>
          ?? <strong>PRODUCTION DEPLOYMENT NOTICE:</strong><br/>
          Free web services (Render) reset local directories on routine reboots. For permanent 100% stable videos, we highly recommend using <strong>Option B (Direct MP4 URL)</strong> with links from Pexels, Cloudinary or stable hosting. This guarantees video never disappears!
        </div>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Video Location</label>
            <select value={pageType} onChange={function(e) { setPageType(e.target.value) }} style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px' }}>
              <option value="landing">Main Home Landing Page - Desktop (Widescreen 16:9)</option>
              <option value="landing-mobile">Main Home Landing Page - Mobile (Vertical Portrait 9:16)</option>
              <option value="department">Department Page (Mens, Womens, Kids, Premium)</option>
              <option value="category">Specific Category Page</option>
            </select>
          </div>

          {pageType === 'landing' && (
            <div style={{ background: '#F0F7FF', border: '1px solid #BEE3F8', color: '#2B6CB0', padding: '12px', borderRadius: '4px', fontSize: '0.8rem' }}>
              ?? <strong>Desktop Mode:</strong> Use a horizontal widescreen video (like 16:9) to beautifully stretch on laptop and computer screens.
            </div>
          )}

          {pageType === 'landing-mobile' && (
            <div style={{ background: '#FDF2F8', border: '1px solid #FBCFE8', color: '#BE185D', padding: '12px', borderRadius: '4px', fontSize: '0.8rem' }}>
              ?? <strong>Mobile Mode:</strong> Use a vertical portrait video (like 9:16 format) to fill mobile screens perfectly without side-cropping.
            </div>
          )}

          {pageType === 'department' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Select Department</label>
              <select value={dept} onChange={function(e) { setDept(e.target.value) }} style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px' }}>
                <option value="mens">Mens Collection</option>
                <option value="womens">Womens Collection</option>
                <option value="kids">Kids Collection</option>
                <option value="premium-lounge">Premium Lounge</option>
              </select>
            </div>
          )}

          {pageType === 'category' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Department</label>
                <select value={dept} onChange={function(e) { setDept(e.target.value); setCategory(departmentCategories[e.target.value][0]); }} style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px' }}>
                  <option value="mens">Mens Collection</option>
                  <option value="womens">Womens Collection</option>
                  <option value="kids">Kids Collection</option>
                  <option value="premium-lounge">Premium Lounge</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Category</label>
                <select value={category} onChange={function(e) { setCategory(e.target.value) }} style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px' }}>
                  {departmentCategories[dept].map(function(cat) {
                    return <option key={cat} value={cat}>{cat}</option>
                  })}
                </select>
              </div>
            </div>
          )}

          <div style={{ padding: '24px', background: '#F9FAFB', border: '2px dashed #CCC', borderRadius: '4px', textAlign: 'center' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', cursor: 'pointer' }}>
              Option A: Upload MP4 Video File (Local temporary cache)
            </label>
            <input type="file" accept="video/mp4" onChange={function(e) { setVideoFile(e.target.files[0]) }} style={{ display: 'block', margin: '0 auto 16px' }} />

            <div style={{ margin: '16px 0', color: '#999', fontSize: '0.8rem' }}>&mdash; OR &mdash;</div>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Option B: Paste Direct MP4 Video URL (Recommended - 100% Stable)
            </label>
            <input
              type="url"
              placeholder="https://domain.com/video.mp4"
              value={videoUrlInput}
              onChange={function(e) { setVideoUrlInput(e.target.value) }}
              style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }}
            />
          </div>

          <button type="submit" disabled={uploading} style={{ padding: '16px', background: '#111', color: '#FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '4px' }}>
            {uploading ? 'Applying to Live Website...' : 'Upload & Apply Video'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Videos;
