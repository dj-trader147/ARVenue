import { useParams, Link } from 'react-router-dom'
import './shop.css'
import '../category/category.css' 

var testVideo = 'https://videos.pexels.com/video-files/4434241/4434241-hd_1920_1080_30fps.mp4'

var departmentCats = {
  'mens': ['Jeans', 'Casual Shirts', 'Tank Tops', 'Trousers', 'Jackets', 'Shoes', 'Belts', 'Studs', 'Ties'],
  'womens': ['Dresses', 'Tops', 'Jeans', 'Cosmetics', 'Jewelry', 'Shoes', 'Bags', 'Accessories'],
  'kids': ['Shirts', 'Jeans', 'Shoes', 'Sandals', 'Slippers', 'Jackets', 'Accessories'],
  'premium-lounge': ['Exclusive Suits', 'Luxury Watches', 'Designer Shoes', 'Limited Edition Bags']
}

function DepartmentPage() {
  var params = useParams()
  var dept = params.department
  var categories = departmentCats[dept] || ['All Items']
  
  var deptName = dept.replace('-', ' ').toUpperCase()
  var isPremium = dept === 'premium-lounge'

  return (
    <div style={isPremium ? { background: '#0a0a0a', color: '#FFF', minHeight: '100vh' } : {}}>
      <section className="category-hero-video">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src={testVideo} type="video/mp4" />
        </video>
      </section>

      <div className="breadcrumbs" style={isPremium ? { borderBottomColor: '#333', color: '#AAA' } : {}}>
        Home <span>&gt;</span> Shop <span>&gt;</span> <strong style={isPremium ? { color: '#D4AF37' } : {}}>{deptName}</strong>
      </div>

      <div className="department-categories">
        <h2 style={isPremium ? { color: '#D4AF37' } : {}}>Select Category</h2>
        <div className="dept-cat-grid">
          {categories.map(function(cat, index) {
            var catSlug = cat.toLowerCase().replace(' ', '-')
            return (
              <Link 
                key={index} 
                to={'/shop/' + dept + '/' + catSlug} 
                className="dept-cat-btn"
                style={isPremium ? { background: '#111', color: '#D4AF37', borderColor: '#D4AF37' } : {}}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DepartmentPage
