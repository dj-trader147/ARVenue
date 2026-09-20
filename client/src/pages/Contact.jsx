import { useState } from 'react'
import './staticpages.css'

function Contact() {
  var [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    // 100% Safe array join for layout spacing - avoids literal newline encoding issues
    var lines = [
      "💬 *NEW CONTACT INQUIRY - AR VENUE*",
      "----------------------------------------",
      "",
      "👤 *Name:* " + formData.name,
      "📧 *Email:* " + formData.email,
      "📌 *Subject:* " + formData.subject,
      "",
      "📝 *Message:*",
      formData.message,
      "",
      "----------------------------------------"
    ];

    var formattedText = lines.join("\n");
    var encodedText = encodeURIComponent(formattedText);
    var whatsappUrl = "https://wa.me/923057192862?text=" + encodedText;

    // Automatically redirects to WhatsApp Web or App
    window.open(whatsappUrl, '_blank');
  }

  return (
    <div className="static-page" style={{maxWidth: '1000px'}}>
      <h1>Contact Us</h1>
      <p style={{textAlign: 'center', color: '#666', marginBottom: '40px'}}>
        We would love to hear from you. Reach out for styling advice, order queries, or feedback.
      </p>
      
      <div className="contact-grid">
        <div className="contact-info-box">
          <h3>Store & Business Details</h3>
          
          <div className="contact-detail">
            <strong>Business Owner</strong>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: '#111' }}>Ahsan Rajpoot</p>
          </div>

          <div className="contact-detail">
            <strong>Physical Store Address</strong>
            <p style={{ lineHeight: '1.6', color: '#333' }}>
              Near Faysal Bank, Opposite Side Bank of Punjab,<br/>
              Farooqabad, District Sheikhupura, Punjab, Pakistan
            </p>
          </div>

          <div className="contact-detail">
            <strong>Phone & Direct WhatsApp</strong>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111', margin: '4px 0 8px' }}>
              0305-7192862
            </p>
            <a 
              href="https://wa.me/923057192862" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#25D366',
                color: '#FFF',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="contact-detail" style={{ marginBottom: 0 }}>
            <strong>Official Email</strong>
            <p style={{ color: '#333' }}>Arvenue0300@gmail.com</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            required 
            value={formData.name}
            onChange={handleChange}
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
          <input 
            type="text" 
            name="subject" 
            placeholder="Subject" 
            required 
            value={formData.subject}
            onChange={handleChange}
          />
          <textarea 
            name="message" 
            rows="6" 
            placeholder="Your Message..." 
            required 
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button type="submit" className="contact-btn">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact;