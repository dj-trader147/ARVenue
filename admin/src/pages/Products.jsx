import { useState } from 'react'

// Yeh exactly wahi categories hain jo customer website par hain
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
    'Jeans': ['28','30','32','34','36','38'],
    'Trousers': ['28','30','32','34','36','38'],
    'Shirts': ['S','M','L','XL','XXL']
  },
  'womens': {
    'Slippers': ['36','37','38','39','40'],
    'Fabrics': [], 'Bags': [], 'Perfumes': [],
    'Jeans': ['24','26','28','30','32'],
    'Trousers': ['24','26','28','30','32'],
    'Shirts': ['XS','S','M','L','XL']
  },
  'kids': {
    'Slippers': ['1','2','3','4','5','6','7','8','9','10','11','12','13'],
    'Jeans': ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y','12-13Y'],
    'Trousers': ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y','12-13Y'],
    'Shirts': ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y','12-13Y']
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
  var [category, setCategory] = useState('Jeans')

  function handleDeptChange(e) {
    var newDept = e.target.value
    setDept(newDept)
    setCategory(departmentCategories[newDept][0]) // Category ko dept ke pehle option pe reset karta hai
  }

  function handleSubmit(e) {
    e.preventDefault()
    alert('Product Published to Customer Website Successfully!\nDepartment: ' + dept + '\nCategory: ' + category)
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px', color: '#111' }}>Add New Product</h1>

      <form onSubmit={handleSubmit} className="admin-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Product Name</label>
            <input type="text" placeholder="e.g. Classic Denim Jeans" required style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Price (Rs.)</label>
              <input type="number" placeholder="4500" required style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Stock Quantity</label>
              <input type="number" placeholder="50" required style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }} />
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
              <select value={category} onChange={function(e) { setCategory(e.target.value) }} style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }}>
                {departmentCategories[dept].map(function(cat) {
                  return <option key={cat} value={cat}>{cat}</option>
                })}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Product Style</label>
            <select style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }}>
              <option>Casual</option>
              <option>Formal</option>
              <option>Exclusive</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Description</label>
            <textarea rows="4" placeholder="Product details..." style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px', resize: 'vertical' }}></textarea>
          </div>
        </div>

        {/* Right Column: Media & Variants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ padding: '16px', background: '#F9FAFB', border: '1px dashed #CCC', borderRadius: '4px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Product Images (Max 4)</label>
            <input type="file" multiple accept="image/*" style={{ fontSize: '0.85rem' }} />
            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>Customers will see these on the website.</p>
          </div>

          <div style={{ padding: '16px', background: '#F9FAFB', border: '1px dashed #CCC', borderRadius: '4px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Product Video (Max 1)</label>
            <input type="file" accept="video/mp4" style={{ fontSize: '0.85rem' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Available Colors</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" defaultValue="#111111" style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }} />
              <input type="color" defaultValue="#D4AF37" style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }} />
              <input type="color" defaultValue="#8B4513" style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }} />
              <button type="button" style={{ padding: '0 16px', height: '40px', background: '#E5E7EB', borderRadius: '4px', fontSize: '0.85rem' }}>+ Add Color</button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Available Sizes</label>
            {(function() {
              var sizes = (adminSizeConfig[dept] && adminSizeConfig[dept][category]) ? adminSizeConfig[dept][category] : [];
              if (sizes.length === 0) {
                return <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>No size required for this category.</p>;
              }
              return (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {sizes.map(function(s) {
                    return <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}><input type="checkbox" defaultChecked /> {s}</label>
                  })}
                </div>
              );
            })()}
          </div>

          <button type="submit" style={{ padding: '16px', background: '#111', color: '#FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '4px', marginTop: 'auto' }}>
            Publish Product to Website
          </button>
        </div>

      </form>
    </div>
  )
}

export default Products
