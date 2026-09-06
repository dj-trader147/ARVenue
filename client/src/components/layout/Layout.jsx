import { Outlet } from 'react-router-dom'
import Header from './Header'
import Ticker from './Ticker'
import Footer from './Footer'
import './layout.css'
import './footer.css'

function Layout() {
  return (
    <>
      <Header />
      <Ticker />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
