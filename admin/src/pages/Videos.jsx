import { useState } from 'react'
import { API_BASE_URL } from '../utils/api'

var departmentCategories = {
  'mens': ['Jeans', 'Casual Shirts', 'Tank Tops', 'Trousers', 'Jackets', 'Shoes', 'Belts', 'Studs', 'Ties'],
  'womens': ['Dresses', 'Tops', 'Jeans', 'Cosmetics', 'Jewelry', 'Shoes', 'Bags', 'Accessories'],
  'kids': ['Shirts', 'Jeans', 'Shoes', 'Sandals', 'Slippers', 'Jackets', 'Accessories'],
  'premium-lounge': ['Exclusive Suits', 'Luxury Watches', 'Designer Shoes', 'Limited Edition Bags']
}

function Videos() {
  var [pageType, setPageType] = useState('landing')
  var [dept, setDept] = useState('mens')
  var [category, setCategory] = useState('Jeans')
  var [videoFile, setVideoFile] = useState(null)
  var [videoUrlInput, setVideoUrlInput] = useState('')
  var [uploading, setUploading] = useState(false)

  async function handleUpload(e) {
    e.preventDefault()
    setUploading(true)

    // Calculate location slug
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
        alert('SUCCESS! Video is now LIVE on customer website for [' + targetLocation + ']!')
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

      <div className="admin-card" style={{ maxWidth: '700px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Upload Video for Specific Page</h3>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px' }}>
          Choose where you want the video to appear. Uploading will replace the existing video on that live page.
        </p>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Video Location</label>
            <select value={pageType} onChange={function(e) { setPageType(e.target.value) }} style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px' }}>
              <option value="landing">Main Home Landing Page (Hero Video)</option>
              <option value="department">Department Page (Mens, Womens, Kids, Premium)</option>
              <option value="category">Specific Category Page (Jeans, Shoes, etc.)</option>
            </select>
          </div>

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
                <select value={dept} onChange={function(e) { setDept(e.target.value) }} style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px' }}>
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
              Option A: Upload MP4 Video File
            </label>
            <input type="file" accept="video/mp4" onChange={function(e) { setVideoFile(e.target.files[0]) }} style={{ display: 'block', margin: '0 auto 16px' }} />

            <div style={{ margin: '16px 0', color: '#999', fontSize: '0.8rem' }}>&mdash; OR &mdash;</div>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Option B: Paste Direct MP4 Video URL
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
            {uploading ? 'Uploading Video to Live Website...' : 'Upload & Apply to Website'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Videos
