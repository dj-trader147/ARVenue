import { useState } from 'react'

var departmentCategories = {
  'mens': ['Jeans', 'Casual Shirts', 'Tank Tops', 'Trousers', 'Jackets', 'Shoes', 'Belts', 'Studs', 'Ties'],
  'womens': ['Dresses', 'Tops', 'Jeans', 'Cosmetics', 'Jewelry', 'Shoes', 'Bags', 'Accessories'],
  'kids': ['Shirts', 'Jeans', 'Shoes', 'Sandals', 'Slippers', 'Jackets', 'Accessories'],
  'premium-lounge': ['Exclusive Suits', 'Luxury Watches', 'Designer Shoes', 'Limited Edition Bags']
}

function Videos() {
  var [pageType, setPageType] = useState('landing')
  var [dept, setDept] = useState('mens')

  function handleUpload(e) {
    e.preventDefault()
    alert('Video Uploaded & Live on Customer Website!')
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px', color: '#111' }}>Page Video Manager</h1>

      <div className="admin-card" style={{ maxWidth: '700px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Upload Video for Specific Page</h3>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px' }}>
          Choose where you want the video to appear. Uploading will replace the existing video.
        </p>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Video Location</label>
            <select value={pageType} onChange={function(e) { setPageType(e.target.value) }} style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px' }}>
              <option value="landing">Main Home Landing Page (Top Hero Video)</option>
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
                <select style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px' }}>
                  {departmentCategories[dept].map(function(cat) {
                    return <option key={cat} value={cat}>{cat}</option>
                  })}
                </select>
              </div>
            </div>
          )}

          <div style={{ padding: '32px', background: '#F9FAFB', border: '2px dashed #CCC', borderRadius: '4px', textAlign: 'center' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', cursor: 'pointer' }}>
              Select Video File (.mp4)
            </label>
            <input type="file" accept="video/mp4" required style={{ display: 'block', margin: '0 auto' }} />
            <p style={{ fontSize: '0.72rem', color: '#888', marginTop: '12px' }}>Max size: 100MB</p>
          </div>

          <button type="submit" style={{ padding: '16px', background: '#111', color: '#FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '4px' }}>
            Upload & Apply to Website
          </button>
        </form>
      </div>
    </div>
  )
}

export default Videos
