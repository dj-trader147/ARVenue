const messages = [
  'CASH ON DELIVERY AVAILABLE',
  'FREE DELIVERY ON ORDERS ABOVE RS. 10,000',
  'EASY 7-DAY RETURNS AND EXCHANGE',
  'NEW ARRIVALS EVERY WEEK',
  'PREMIUM QUALITY GUARANTEED',
  'VISIT OUR SHAIKHUPURA OUTLET'
]

function Ticker() {
  const items = messages.map(function(msg, i) {
    return (
      <span className="ticker-item" key={i}>
        <span className="ticker-dot"></span>
        {msg}
      </span>
    )
  })

  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {items}
        {items}
      </div>
    </div>
  )
}

export default Ticker
