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
  var [imageUrl, setImageUrl] = useState('')
  var [videoFile, setVideoFile] = useState(null)
  var [videoUrl, setVideoUrl] = useState('')
  var [colorNames, setColorNames] = useState('Black, Brown')
  var [selectedSizes, setSelectedSizes] = useState(['40','41','42','43','44','45'])
  var [isPublishing, setIsPublishing] = useState(false)
  var [existingProducts, setExistingProducts] = useState([])

  useEffect(function() {
    fetchProducts()
  }, [])

  function fetchProducts() {
    fetch(API_BASE_URL + '/api/products')
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (data.success) setExistingProducts(data.products)
      })
      .catch(function() {})
  }

  function handleDeptChange(e) {
    var newDept = e.target.value
    setDept(newDept)
    var firstCat = departmentCategories[newDept][0]
    setCategory(firstCat)
    var defaultSizes = adminSizeConfig[newDept] && adminSizeConfig[newDept][firstCat] ? adminSizeConfig[newDept][firstCat] : []
    setSelectedSizes(defaultSizes)
  }

  function handleCatChange(e) {
    var newCat = e.target.value
    setCategory(newCat)
    var defaultSizes = adminSizeConfig[dept] && adminSizeConfig[dept][newCat] ? adminSizeConfig[dept][newCat] : []
    setSelectedSizes(defaultSizes)
  }

  function toggleSize(sizeStr) {
    if (selectedSizes.includes(sizeStr)) {
      setSelectedSizes(selectedSizes.filter(function(s) { return s !== sizeStr }))
    } else {
      setSelectedSizes([...selectedSizes, sizeStr])
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setIsPublishing(true)

    var parsedColors = (category === 'Perfumes' || category === 'Luxury Perfumes')
      ? []
      : colorNames.split(',').map(function(c) { return c.trim() }).filter(Boolean)

    var availableCategorySizes = adminSizeConfig[dept] && adminSizeConfig[dept][category] ? adminSizeConfig[dept][category] : []
    var finalSizes = availableCategorySizes.length > 0 ? selectedSizes : []

    var formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('department', dept)
    formData.append('category', category)
    formData.append('style', style)
    formData.append('description', description)
    formData.append('imageUrl', imageUrl)
    formData.append('videoUrl', videoUrl)
    formData.append('colors', JSON.stringify(parsedColors))
    formData.append('sizes', JSON.stringify(finalSizes))

    if (imageFile) {
      formData.append('imageFile', imageFile)
    }
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
          alert('Product Published Successfully to Website!')
          setName('')
          setPrice('')
          setDescription('')
          setImageUrl('')
          setVideoUrl('')
          setImageFile(null)
          setVideoFile(null)
          fetchProducts()
        } else {
          alert('Error publishing product: ' + (data.message || 'Check network connection.'))
        }
      })
      .catch(function(err) {
        setIsPublishing(false)
        alert('Error connecting to backend server.')
      })
  }

  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    fetch(API_BASE_URL + '/api/products/' + id, { method: 'DELETE' })
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (data.success) {
          alert('Product deleted successfully.')
          fetchProducts()
        }
      })
  }

  var availableSizes = adminSizeConfig[dept] && adminSizeConfig[dept][category] ? adminSizeConfig[dept][category] : []
  var isPerfume = category === 'Perfumes' || category === 'Luxury Perfumes'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '8px', color: '#111' }}>Add New Product</h1>
        <p style={{ color: '#666', fontSize: '0.85rem' }}>Upload files or paste links to publish products directly to the live website.</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Product Name *</label>
            <input 
              type="text" 
              placeholder="e.g. AR VENUE Royal Slipper 2026" 
              value={name}
              onChange={function(e) { setName(e.target.value) }}
              required 
              style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px'}} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Price (Rs.) *</label>
              <input 
                type="number" 
                placeholder="4500" 
                value={price}
                onChange={function(e) { setPrice(e.target.value) }}
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Product Style</label>
              <select value={style} onChange={function(e) { setStyle(e.target.value) }} style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }}>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Exclusive">Exclusive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Department (Collection)</label>
              <select value={dept} onChange={handleDeptChange} style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }}>
                <option value="mens">Mens Collection</option>
                <option value="womens">Womens Collection</option>
                <option value="kids">Kids Collection</option>
                <option value="premium-lounge">Premium Lounge</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Category (Section)</label>
              <select value={category} onChange={handleCatChange} style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }}>
                {departmentCategories[dept].map(function(cat) {
                  return <option key={cat} value={cat}>{cat}</option>
                })}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Description</label>
            <textarea 
              rows="4" 
              placeholder="Product details, fabric, care instructions..." 
              value={description}
              onChange={function(e) { setDescription(e.target.value) }}
              style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Right Column: Media Uploads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Image Input Section */}
          <div style={{ padding: '16px', background: '#FAFAFA', border: '1px dashed #CCC', borderRadius: '4px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Product Image</label>
            
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444' }}>Option A: Choose Image File from Phone/PC</span>
              <input 
                type="file" 
                accept="image/*"
                onChange={function(e) { setImageFile(e.target.files[0] || null) }}
                style={{ width: '100%', marginTop: '4px', fontSize: '0.8rem' }}
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444' }}>Option B: OR Paste Direct Image Link (CDN URL)</span>
              <input 
                type="text" 
                placeholder="https://.../image.jpg" 
                value={imageUrl}
                onChange={function(e) { setImageUrl(e.target.value) }}
                style={{ width: '100%', padding: '8px', border: '1px solid #CCC', borderRadius: '4px', marginTop: '4px', fontSize: '0.8rem' }} 
              />
            </div>
          </div>

          {/* Video Input Section */}
          <div style={{ padding: '16px', background: '#FAFAFA', border: '1px dashed #CCC', borderRadius: '4px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Product Video (Optional)</label>
            
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444' }}>Option A: Choose MP4 Video File</span>
              <input 
                type="file" 
                accept="video/mp4"
                onChange={function(e) { setVideoFile(e.target.files[0] || null) }}
                style={{ width: '100%', marginTop: '4px', fontSize: '0.8rem' }}
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444' }}>Option B: OR Paste Direct Video Link (MP4 URL)</span>
              <input 
                type="text" 
                placeholder="https://.../video.mp4" 
                value={videoUrl}
                onChange={function(e) { setVideoUrl(e.target.value) }}
                style={{ width: '100%', padding: '8px', border: '1px solid #CCC', borderRadius: '4px', marginTop: '4px', fontSize: '0.8rem' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Available Colors (Text)</label>
            {isPerfume ? (
              <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>No colors for perfumes — color option hidden on storefront.</p>
            ) : (
              <input
                type="text"
                value={colorNames}
                onChange={function(e) { setColorNames(e.target.value) }}
                placeholder="e.g. Black, Brown, Gold"
                style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }}
              />
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Available Sizes</label>
            {availableSizes.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>No size required for this category.</p>
            ) : (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {availableSizes.map(function(s) {
                  return (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedSizes.includes(s)} 
                        onChange={function() { toggleSize(s) }} 
                      />
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
            style={{ padding: '16px', background: '#111', color: '#FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '4px', marginTop: 'auto', border: 'none', cursor: 'pointer' }}
          >
            {isPublishing ? 'Publishing Product...' : 'Publish Product to Website'}
          </button>
        </div>
      </form>

      {/* Existing Live Products List */}
      <div className="admin-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Published Products ({existingProducts.length})</h2>
        {existingProducts.length === 0 ? (
          <p style={{ color: '#888' }}>No published products in database yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {existingProducts.map(function(p) {
              var pImg = p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1620806956627-2c9c7f66a203?w=800&q=80'
              if (pImg.startsWith('/')) pImg = API_BASE_URL + pImg
              return (
                <div key={p._id} style={{ border: '1px solid #EEE', borderRadius: '8px', padding: '12px', background: '#FFF' }}>
                  <img src={pImg} alt={p.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }} />
                  <h4 style={{ fontSize: '0.9rem', margin: '8px 0 4px', fontWeight: 600 }}>{p.name}</h4>
                  <div style={{ color: '#8C6D46', fontWeight: 'bold', fontSize: '0.9rem' }}>Rs. {p.price.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', textTransform: 'capitalize' }}>
                    {p.department} &gt; {p.category}
                  </div>
                  <button 
                    onClick={function() { handleDelete(p._id) }}
                    style={{ width: '100%', marginTop: '8px', padding: '6px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    Delete Product
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

export default Products;
