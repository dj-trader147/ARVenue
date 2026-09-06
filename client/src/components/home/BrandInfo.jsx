import { Link } from 'react-router-dom'

function BrandInfo() {
  return (
    <section className="brand-info-section">
      <div className="brand-info-inner">
        <div className="brand-info-block">
          <h3>Our Flagship Store</h3>
          <p>
            <strong>AR VENUE</strong> proudly presents its main physical outlet located in 
            <strong> Farooqabad, District Sheikhupura</strong> (Near Faysal Bank, Opposite Side Bank of Punjab).
            Our showroom offers a complete luxury fashion experience where you can explore and try our entire collection in person.
          </p>
          <p>
            Every article undergoes strict quality control before reaching our shelves, ensuring you receive nothing but the finest. 
            Our dedicated team led by <strong>Ahsan Rajpoot</strong> is always available to assist you in creating your perfect wardrobe.
          </p>
          <Link to="/contact" className="brand-info-highlight">Visit Us in Farooqabad</Link>
        </div>

        <div className="brand-info-block">
          <h3>Our Craftsmanship & Values</h3>
          <p>
            Our manufacturing facility in <strong>Sheikhupura</strong> houses skilled artisans who craft every product with exceptional attention to detail. 
            From premium raw materials to the final stitch, quality is prioritized at every stage.
          </p>
          <p>
            We combine locally sourced premium fabrics with imported accessories to ensure each piece meets international standards. 
            Our direct-to-consumer model allows us to deliver luxury quality at genuinely fair prices.
          </p>
          <Link to="/shop" className="brand-info-highlight">Explore Our Collections</Link>
        </div>
      </div>
    </section>
  )
}

export default BrandInfo
