import './staticpages.css'

function FAQ() {
  var faqs = [
    { q: "Do you offer Cash on Delivery (COD)?", a: "Yes, we offer Cash on Delivery across all cities in Pakistan." },
    { q: "How long does delivery take?", a: "Standard delivery takes 3-5 working days. Rural areas may take up to 7 working days." },
    { q: "Is delivery free?", a: "We offer FREE delivery on all orders above Rs. 10,000. For orders below this amount, standard shipping rates apply." },
    { q: "Can I visit your store?", a: "Absolutely! Our flagship showroom is located in Shaikhupura. You can visit us to experience our premium collection in person." },
    { q: "What is your return policy?", a: "We have an easy 7-day return and exchange policy. The item must be unused, unwashed, and in its original packaging." }
  ]

  return (
    <div className="static-page">
      <h1>Frequently Asked Questions</h1>
      <div className="static-content">
        {faqs.map(function(item, i) {
          return (
            <div className="faq-item" key={i}>
              <div className="faq-q">{item.q}</div>
              <div className="faq-a">{item.a}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default FAQ
