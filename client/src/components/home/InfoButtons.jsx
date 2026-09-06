import { Link } from 'react-router-dom'

var infoData = [
  { icon: '\uD83D\uDE9A', text: 'Free Delivery Above Rs. 10,000', link: '/shipping', external: false },
  { icon: '\uD83D\uDCB5', text: 'Cash On Delivery Available', link: '/faq', external: false },
  { icon: '\uD83D\uDD04', text: 'Easy 7-Day Returns', link: '/refund-policy', external: false },
  { icon: '\u2728', text: 'Premium Quality Guaranteed', link: '/about', external: false },
  { icon: '\uD83C\uDF81', text: 'Luxury Packaging', link: '/about', external: false },
  { icon: '\uD83D\uDCCD', text: 'Farooqabad Store Outlet', link: '/contact', external: false },
  { icon: '\uD83D\uDEE1\uFE0F', text: '100% Original Products', link: '/about', external: false },
  { icon: '\uD83D\uDCF1', text: 'Order Via WhatsApp', link: 'https://wa.me/923057192862', external: true }
]

function InfoButtons() {
  return (
    <section className="info-buttons-section">
      <div className="info-buttons-grid">
        {infoData.map(function(item, index) {
          if (item.external) {
            return (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="info-btn" 
                key={index}
                style={{ textDecoration: 'none' }}
              >
                <span className="info-btn-icon">{item.icon}</span>
                <span className="info-btn-text">{item.text}</span>
              </a>
            )
          }

          return (
            <Link 
              to={item.link} 
              className="info-btn" 
              key={index}
              style={{ textDecoration: 'none' }}
            >
              <span className="info-btn-icon">{item.icon}</span>
              <span className="info-btn-text">{item.text}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default InfoButtons
