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
  var [deviceTarget, setDeviceTarget] = useState('desktop')
  var [dept, setDept] = useState('mens')
  var [category, setCategory] = useState('Slippers')
  var [videoFile, setVideoFile] = useState(null)
  var [videoUrlInput, setVideoUrlInput] = useState('')
  var [uploading, setUploading] = useState(false)
  var [lastSuccess, setLastSuccess] = useState('')

  function buildLocationKey() {
    var base = pageType
    if (pageType === 'department') base = dept
    if (pageType === 'category') base = dept + '-' + category.toLowerCase().replace(/ /g, '-')
    if (deviceTarget === 'mobile') base = base + '-mobile'
    return base
  }

  async function handleUpload(e) {
    e.preventDefault()
    setUploading(true)
    setLastSuccess('')

    var targetLocation = buildLocationKey()

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
        var deviceLabel = deviceTarget === 'desktop' ? 'Desktop (16:9)' : 'Mobile (9:16)'
        var pageLabel = pageType === 'landing' ? 'Home Landing' : pageType === 'department' ? dept.toUpperCase() : dept.toUpperCase() + ' > ' + category
        setLastSuccess('Video is now LIVE for [' + pageLabel + '] on ' + deviceLabel + '!')
        setVideoFile(null)
        setVideoUrlInput('')
      } else {
        alert('Upload Failed: ' + (data.message || 'Unknown error'))
      }
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  var selectStyle = { width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px', fontSize: '0.9rem' }
  var labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: '#333' }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px', color: '#111' }}>Page Video Manager</h1>

      <div className="admin-card" style={{ maxWidth: '750px', background: '#FFF', border: '1px solid #E5E5E5', padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Upload Video for Specific Page</h3>
        
        <div style={{ background: '#FFF3CD', border: '1px solid #FFE69C', color: '#664D03', padding: '16px', borderRadius: '4px', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '24px' }}>
          ?? <strong>PRODUCTION NOTICE:</strong> Use <strong>Option B (Direct MP4 URL)</strong> from Cloudinary, Pexels, or any stable CDN for permanent 24/7 videos.
        </div>

        {lastSuccess && (
          <div style={{ background: '#D4EDDA', border: '1px solid #C3E6CB', color: '#155724', padding: '14px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
            ? {lastSuccess}
          </div>
        )}

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>1. Select Page</label>
              <select value={pageType} onChange={function(e) { setPageType(e.target.value); setLastSuccess('') }} style={selectStyle}>
                <option value="landing">Home Landing Page</option>
                <option value="department">Department Page</option>
                <option value="category">Category Page</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>2. Device Target</label>
              <select value={deviceTarget} onChange={function(e) { setDeviceTarget(e.target.value); setLastSuccess('') }} style={selectStyle}>
                <option value="desktop">Desktop / Laptop (Widescreen 16:9)</option>
                <option value="mobile">Mobile / Phone (Vertical Portrait 9:16)</option>
              </select>
            </div>
          </div>

          {pageType === 'landing' && deviceTarget === 'desktop' && (
            <div style={{ background: '#EBF8FF', border: '1px solid #BEE3F8', color: '#2B6CB0', padding: '12px', borderRadius: '4px', fontSize: '0.8rem' }}>
              ?? <strong>Desktop Landing:</strong> Use a horizontal widescreen video (16:9). This will fill the full screen on laptops and computers.
            </div>
          )}

          {pageType === 'landing' && deviceTarget === 'mobile' && (
            <div style={{ background: '#FDF2F8', border: '1px solid #FBCFE8', color: '#BE185D', padding: '12px', borderRadius: '4px', fontSize: '0.8rem' }}>
              ?? <strong>Mobile Landing:</strong> Use a vertical portrait video (9:16). This will fill the full screen on mobile phones without side cropping.
            </div>
          )}

          {pageType === 'department' && (
            <div>
              <label style={labelStyle}>3. Select Department</label>
              <select value={dept} onChange={function(e) { setDept(e.target.value); setLastSuccess('') }} style={selectStyle}>
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
                <label style={labelStyle}>3. Department</label>
                <select value={dept} onChange={function(e) { setDept(e.target.value); setCategory(departmentCategories[e.target.value][0]); setLastSuccess('') }} style={selectStyle}>
                  <option value="mens">Mens Collection</option>
                  <option value="womens">Womens Collection</option>
                  <option value="kids">Kids Collection</option>
                  <option value="premium-lounge">Premium Lounge</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>4. Category</label>
                <select value={category} onChange={function(e) { setCategory(e.target.value); setLastSuccess('') }} style={selectStyle}>
                  {departmentCategories[dept].map(function(cat) {
                    return <option key={cat} value={cat}>{cat}</option>
                  })}
                </select>
              </div>
            </div>
          )}

          <div style={{ background: '#F0FFF4', border: '1px solid #C6F6D5', padding: '12px', borderRadius: '4px', fontSize: '0.8rem', color: '#276749' }}>
            ?? <strong>Save Location:</strong> <code style={{ background: '#E2E8F0', padding: '2px 8px', borderRadius: '3px' }}>{buildLocationKey()}</code>
            <br/>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>This is the database key where your video URL will be stored.</span>
          </div>

          <div style={{ padding: '24px', background: '#F9FAFB', border: '2px dashed #CCC', borderRadius: '4px', textAlign: 'center' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', cursor: 'pointer' }}>
              Option A: Upload MP4 Video File
            </label>
            <input type="file" accept="video/mp4" onChange={function(e) { setVideoFile(e.target.files[0]) }} style={{ display: 'block', margin: '0 auto 16px' }} />

            <div style={{ margin: '16px 0', color: '#999', fontSize: '0.8rem' }}>&mdash; OR &mdash;</div>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Option B: Paste Direct MP4 Video URL (Recommended)
            </label>
            <input
              type="url"
              placeholder="https://domain.com/video.mp4"
              value={videoUrlInput}
              onChange={function(e) { setVideoUrlInput(e.target.value) }}
              style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }}
            />
          </div>

          <button type="submit" disabled={uploading} style={{ padding: '16px', background: '#111', color: '#FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '4px', cursor: uploading ? 'wait' : 'pointer' }}>
            {uploading ? 'Applying to Live Website...' : 'Upload & Apply Video'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Videos;
