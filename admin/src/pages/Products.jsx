import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../utils/api'

var departmentCategories = {
  'mens': ['Slippers', 'Fabrics', 'Bags', 'Perfumes', 'Jeans', 'Trousers', 'Shirts'],
  'womens': ['Slippers', 'Fabrics', 'Bags', 'Perfumes', 'Jeans', 'Trousers', 'Shirts'],
  'kids': ['Slippers', 'Jeans', 'Trousers', 'Shirts'],
  'premium-lounge': ['Exclusive Suits', 'Luxury Perfumes', 'Premium Slippers', 'Limited Edition Bags']
}

var adminSizeConfig = {
  'mens': {
    'Slippers': ['40','41','42','43','44','45'],
    'Fabrics': [], 'Bags': [], 'Perfumes': [],
    'Jeans': ['28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44'],
    'Trousers': ['28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44'],
    'Shirts': ['S','M','L','XL','XXL']
  },
  'womens': {
    'Slippers': ['36','37','38','39','40','41'],
    'Fabrics': [], 'Bags': [], 'Perfumes': [],
    'Jeans': ['26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'],
    'Trousers': ['26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'],
    'Shirts': ['S','M','L','XL']
  },
  'kids': {
    'Slippers': ['6','7','8','9','10','11','12','13','1','2','3','4','5'],
    'Jeans': ['20','21','22','23','24','25','26','27','28','29','30','31'],
    'Trousers': ['20','21','22','23','24','25','26','27','28','29','30','31'],
    'Shirts': ['S','M','L','XL']
  },
  'premium-lounge': {
    'Exclusive Suits': ['S','M','L','XL','XXL'],
    'Luxury Perfumes': [],
    'Premium Slippers': ['40','41','42','43','44','45'],
    'Limited Edition Bags': []
  }
}

function Products() {
  var [dept, setDept] = useState('mens')
  var [category, setCategory] = useState('Slippers')
  var [name, setName] = useState('')
  var [price, setPrice] = useState('')
  var [style, setStyle] = useState('Casual')
  var [description, setDescription] = useState('')
  var [imageFile, setImageFile] = useState(null)
  var [imagePreview, setImagePreview] = useState(null)
  var [videoFile, setVideoFile] = useState(null)
  var [colorNames, setColorNames] = useState('Black, Brown')
  var [selectedSizes, setSelectedSizes] = useState(['40','41','42','43','44','45'])
  var [isPublishing, setIsPublishing] = useState(false)
  var [existingProducts, setExistingProducts] = useState([])
  var [lastSuccess, setLastSuccess] = useState('')

  useEffect(function() {
    fetchProducts()
  }, [])

  function fetchProducts() {
    fetch(API_BASE_URL + '/api/products')
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (data.success) setExistingProducts(data.products || [])
      })
      .catch(function() {})
  }

  function handleDeptChange(e) {
    var newDept = e.target.value
    setDept(newDept)
    var firstCat = departmentCategories[newDept][0]
    setCategory(firstCat)
    var defaultSizes = (adminSizeConfig[newDept] && adminSizeConfig[newDept][firstCat]) ? adminSizeConfig[newDept][firstCat] : []
    setSelectedSizes(defaultSizes)
  }

  function handleCatChange(e) {
    var newCat = e.target.value
    setCategory(newCat)
    var defaultSizes = (adminSizeConfig[dept] && adminSizeConfig[dept][newCat]) ? adminSizeConfig[dept][newCat] : []
    setSelectedSizes(defaultSizes)
  }

  function toggleSize(sizeStr) {
    if (selectedSizes.includes(sizeStr)) {
      setSelectedSizes(selectedSizes.filter(function(s) { return s !== sizeStr }))
    } else {
      setSelectedSizes(selectedSizes.concat([sizeStr]))
    }
  }

  function handleImageChange(e) {
    var file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    setImageFile(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview(null)
    }
  }

  function handleVideoChange(e) {
    var file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    setVideoFile(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLastSuccess('')

    if (!imageFile) {
      alert('Please select a Product Image file from your phone or PC.')
      return
    }

    setIsPublishing(true)

    var isPerfume = category === 'Perfumes' || category === 'Luxury Perfumes'
    var parsedColors = isPerfume ? [] : colorNames.split(',').map(function(c) { return c.trim() }).filter(Boolean)
    var availableCategorySizes = (adminSizeConfig[dept] && adminSizeConfig[dept][category]) ? adminSizeConfig[dept][category] : []
    var finalSizes = availableCategorySizes.length > 0 ? selectedSizes : []

    var formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('department', dept)
    formData.append('category', category)
    formData.append('style', style)
    formData.append('description', description || '')
    formData.append('colors', JSON.stringify(parsedColors))
    formData.append('sizes', JSON.stringify(finalSizes))
    formData.append('imageFile', imageFile)

    if (videoFile) {
      formData.append('videoFile', videoFile)
    }

    fetch(API_BASE_URL + '/api/products', {
      method: 'POST',
      body: formData
    })
      .then(function(res) { return res.json() })
      .then(function(data) {
        setIsPublishing(false)
        if (data.success) {
          setLastSuccess('Product uploaded to Cloudinary CDN & published LIVE on website: ' + name)
          setName('')
          setPrice('')
          setDescription('')
          setImageFile(null)
          setImagePreview(null)
          setVideoFile(null)
          // Reset file inputs in DOM
          var imgInp = document.getElementById('product-image-file-input')
          if (imgInp) imgInp.value = ''
          var vidInp = document.getElementById('product-video-file-input')
          if (vidInp) vidInp.value = ''
          fetchProducts()
        } else {
          alert('Publish failed: ' + (data.message || 'Unknown error'))
        }
      })
      .catch(function(err) {
        setIsPublishing(false)
        alert('Error uploading to Cloudinary: ' + (err.message || 'Cannot connect to backend'))
      })
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this product permanently?')) return
    fetch(API_BASE_URL + '/api/products/' + id, { method: 'DELETE' })
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (data.success) {
          fetchProducts()
        }
      })
  }

  var availableSizes = (adminSizeConfig[dept] && adminSizeConfig[dept][category]) ? adminSizeConfig[dept][category] : []
  var isPerfume = category === 'Perfumes' || category === 'Luxury Perfumes'
  var selectStyle = { width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px', fontSize: '0.9rem' }
  var labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: '#333' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#111', margin: 0 }}>Add New Product</h1>
        <span style={{ fontSize: '0.72rem', background: '#111', color: '#C5A880', padding: '4px 10px', borderRadius: '12px', letterSpacing: '0.05em', fontWeight: 600 }}>
          v3.0 — Direct Cloudinary Upload (No URL Required)
        </span>
      </div>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '24px' }}>
        Select product photos & optional videos directly from your mobile gallery or computer files. Images are permanently hosted 24/7 on Cloudinary CDN.
      </p>

      {lastSuccess && (
        <div style={{ background: '#D4EDDA', border: '1px solid #C3E6CB', color: '#155724', padding: '14px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
          {lastSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card" style={{ maxWidth: '900px', background: '#FFF', border: '1px solid #E5E5E5', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input type="text" value={name} onChange={function(e) { setName(e.target.value) }} required placeholder="e.g. AR VENUE Royal Slipper" style={selectStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Price (Rs.) *</label>
            <input type="number" value={price} onChange={function(e) { setPrice(e.target.value) }} required placeholder="4500" style={selectStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Department</label>
            <select value={dept} onChange={handleDeptChange} style={selectStyle}>
              <option value="mens">Mens Collection</option>
              <option value="womens">Womens Collection</option>
              <option value="kids">Kids Collection</option>
              <option value="premium-lounge">Premium Lounge</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={category} onChange={handleCatChange} style={selectStyle}>
              {departmentCategories[dept].map(function(cat) {
                return <option key={cat} value={cat}>{cat}</option>
              })}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Style</label>
            <select value={style} onChange={function(e) { setStyle(e.target.value) }} style={selectStyle}>
              <option value="Casual">Casual</option>
              <option value="Formal">Formal</option>
              <option value="Exclusive">Exclusive</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea rows="3" value={description} onChange={function(e) { setDescription(e.target.value) }} placeholder="Product details, fabric quality, craftsmanship..." style={{ width: '100%', padding: '12px', border: '1px solid #CCC', borderRadius: '4px', resize: 'vertical' }} />
        </div>

        {/* ===== DIRECT FILE UPLOAD ONLY: PRODUCT IMAGE ===== */}
        <div style={{ padding: '24px', background: '#FAFAFA', border: '2px dashed #C5A880', borderRadius: '6px', textAlign: 'center' }}>
          <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: '#111' }}>
            📷 Upload Product Photo *
          </label>
          <p style={{ fontSize: '0.78rem', color: '#666', marginBottom: '14px' }}>
            Choose image directly from phone gallery or computer (JPG, PNG, WEBP)
          </p>
          <input
            id="product-image-file-input"
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
            style={{ display: 'block', margin: '0 auto 12px', fontSize: '0.85rem' }}
          />

          {imagePreview && (
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#155724', background: '#D4EDDA', padding: '4px 10px', borderRadius: '4px' }}>
                ✓ Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
              </div>
              <img
                src={imagePreview}
                alt="Upload preview"
                style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #C5A880', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
              />
            </div>
          )}
        </div>

        {/* ===== DIRECT FILE UPLOAD ONLY: PRODUCT VIDEO (OPTIONAL) ===== */}
        <div style={{ padding: '24px', background: '#FAFAFA', border: '2px dashed #D1D5DB', borderRadius: '6px', textAlign: 'center' }}>
          <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: '#111' }}>
            🎬 Upload Product Video (Optional)
          </label>
          <p style={{ fontSize: '0.78rem', color: '#666', marginBottom: '14px' }}>
            Upload short video showcase (MP4 format from gallery / camera)
          </p>
          <input
            id="product-video-file-input"
            type="file"
            accept="video/mp4,video/*"
            onChange={handleVideoChange}
            style={{ display: 'block', margin: '0 auto 12px', fontSize: '0.85rem' }}
          />

          {videoFile && (
            <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: 600, color: '#155724', background: '#D4EDDA', padding: '6px 12px', borderRadius: '4px', display: 'inline-block' }}>
              ✓ Video Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>Available Colors (Text)</label>
          {isPerfume ? (
            <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>No colors for perfumes — hidden on storefront.</p>
          ) : (
            <input
              type="text"
              value={colorNames}
              onChange={function(e) { setColorNames(e.target.value) }}
              placeholder="e.g. Black, Brown, Gold"
              style={selectStyle}
            />
          )}
        </div>

        <div>
          <label style={labelStyle}>Available Sizes</label>
          {availableSizes.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>No size required for this category.</p>
          ) : (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {availableSizes.map(function(s) {
                return (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedSizes.includes(s)} onChange={function() { toggleSize(s) }} />
                    {s}
                  </label>
                )
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPublishing}
          style={{ padding: '16px', background: '#111', color: '#C5A880', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', borderRadius: '4px', cursor: isPublishing ? 'wait' : 'pointer', border: 'none', fontSize: '0.9rem', transition: 'background 0.2s ease' }}
        >
          {isPublishing ? 'Uploading to 24/7 Cloud CDN & Publishing...' : 'Publish Product to Live Store'}
        </button>
      </form>

      <div className="admin-card" style={{ maxWidth: '900px', marginTop: '32px', background: '#FFF', border: '1px solid #E5E5E5', padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Published Products ({existingProducts.length})</h2>
        {existingProducts.length === 0 ? (
          <p style={{ color: '#888' }}>No published products yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {existingProducts.map(function(p) {
              var pImg = (p.images && p.images[0]) ? p.images[0] : ''
              return (
                <div key={p._id} style={{ border: '1px solid #EEE', borderRadius: '8px', padding: '12px' }}>
                  {pImg ? (
                    <img src={pImg} alt={p.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '100%', height: '140px', background: '#F3F3F3', borderRadius: '4px' }} />
                  )}
                  <h4 style={{ fontSize: '0.85rem', margin: '8px 0 4px', fontWeight: 600 }}>{p.name}</h4>
                  <div style={{ color: '#8C6D46', fontWeight: 700, fontSize: '0.85rem' }}>Rs. {Number(p.price).toLocaleString()}</div>
                  <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'capitalize' }}>{p.department} / {p.category}</div>
                  <button type="button" onClick={function() { handleDelete(p._id) }} style={{ width: '100%', marginTop: '8px', padding: '6px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                    Delete
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
