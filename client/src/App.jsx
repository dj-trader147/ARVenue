import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HeroVideo from './components/home/HeroVideo'
import InfoButtons from './components/home/InfoButtons'
import BrandInfo from './components/home/BrandInfo'
import ShopCollections from './components/shop/ShopCollections'
import DepartmentPage from './components/shop/DepartmentPage'
import CategoryPage from './components/category/CategoryPage'
import ProductPage from './components/product/ProductPage'
import CartPage from './components/cart/CartPage'
import CheckoutPage from './components/checkout/CheckoutPage'
import './components/home/home.css'

/* Naye Static Pages Imports */
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import { Terms, Privacy, RefundPolicy, Shipping } from './pages/PolicyPages'

function Placeholder(props) { return (<div className="page-placeholder"><h1>{props.title}</h1><p>Coming soon</p></div>) }
function Home() { return ( <><HeroVideo /><InfoButtons /><BrandInfo /></> ) }

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        
        <Route path="/shop" element={<ShopCollections />} />
        <Route path="/shop/:department" element={<DepartmentPage />} />
        <Route path="/shop/:department/:category" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Real Static Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping" element={<Shipping />} />
        
        <Route path="/search" element={<Placeholder title="Search" />} />
        <Route path="*" element={<Placeholder title="404 - Page Not Found" />} />
      </Route>
    </Routes>
  )
}

export default App
