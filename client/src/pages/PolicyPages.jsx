import './staticpages.css'

export function Terms() {
  return (
    <div className="static-page">
      <h1>Terms & Conditions</h1>
      <div className="static-content">
        <p>Welcome to AR VENUE. By accessing and using our website, you agree to comply with our terms.</p>
        <h2>1. Product Accuracy</h2>
        <p>We strive to display colors and details as accurately as possible. However, actual colors may vary slightly due to device screen settings.</p>
        <h2>2. Pricing & Orders</h2>
        <p>All prices are in Pakistani Rupees (Rs.). We reserve the right to cancel any order in case of pricing errors or stock issues.</p>
        <h2>3. Intellectual Property</h2>
        <p>All content, logos, and designs on this website are the property of AR VENUE and cannot be used without permission.</p>
      </div>
    </div>
  )
}

export function Privacy() {
  return (
    <div className="static-page">
      <h1>Privacy Policy</h1>
      <div className="static-content">
        <p>Your privacy is important to AR VENUE. This policy outlines how we protect your data.</p>
        <h2>Data Collection</h2>
        <p>We collect necessary information (name, address, phone number) solely for processing your orders and improving your shopping experience.</p>
        <h2>Data Security</h2>
        <p>Your information is kept secure and confidential. We never sell your personal data to third parties.</p>
      </div>
    </div>
  )
}

export function RefundPolicy() {
  return (
    <div className="static-page">
      <h1>Refund & Exchange Policy</h1>
      <div className="static-content">
        <p>At AR VENUE, we want you to be completely satisfied with your purchase.</p>
        <h2>7-Day Exchange</h2>
        <p>If you are not satisfied with your purchase, you can request an exchange within 7 days of delivery.</p>
        <h2>Conditions</h2>
        <ul>
          <li>The item must be unworn, unwashed, and in its original condition.</li>
          <li>All original tags and packaging must be intact.</li>
          <li>Sale or discounted items cannot be returned or exchanged.</li>
        </ul>
        <p>To initiate a return, please contact us on our WhatsApp number.</p>
      </div>
    </div>
  )
}

export function Shipping() {
  return (
    <div className="static-page">
      <h1>Shipping Information</h1>
      <div className="static-content">
        <h2>Delivery Timeline</h2>
        <p>Orders are dispatched within 24 hours. Estimated delivery times are:</p>
        <ul>
          <li>Major Cities: 2-3 Working Days</li>
          <li>Other Cities & Towns: 3-5 Working Days</li>
        </ul>
        <h2>Shipping Charges</h2>
        <p>We offer FREE shipping on all orders over Rs. 10,000. For orders below this amount, a standard flat shipping fee applies.</p>
      </div>
    </div>
  )
}
