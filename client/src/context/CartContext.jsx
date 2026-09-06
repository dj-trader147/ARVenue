import { createContext, useState, useContext } from 'react'

var CartContext = createContext()

export function CartProvider(props) {
  var [cartItems, setCartItems] = useState([])

  function addToCart(product, selectedSize, selectedColor) {
    setCartItems(function(prev) {
      var existing = prev.find(function(item) {
        return item.slug === product.slug && item.size === selectedSize && item.color === selectedColor
      })
      
      if (existing) {
        return prev.map(function(item) {
          if (item.slug === product.slug && item.size === selectedSize && item.color === selectedColor) {
            return { ...item, quantity: item.quantity + 1 }
          }
          return item
        })
      }
      
      return [...prev, { 
        slug: product.slug, 
        name: product.name, 
        price: product.price, 
        image: product.media ? product.media[0].url : '', 
        size: selectedSize, 
        color: selectedColor, 
        quantity: 1 
      }]
    })
  }

  function removeFromCart(slug, size, color) {
    setCartItems(function(prev) {
      return prev.filter(function(item) {
        return !(item.slug === slug && item.size === size && item.color === color)
      })
    })
  }

  function updateQuantity(slug, size, color, newQuantity) {
    if (newQuantity < 1) return
    setCartItems(function(prev) {
      return prev.map(function(item) {
        if (item.slug === slug && item.size === size && item.color === color) {
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    })
  }

  function clearCart() {
    setCartItems([])
  }

  var cartTotal = cartItems.reduce(function(total, item) {
    return total + (item.price * item.quantity)
  }, 0)

  var cartCount = cartItems.reduce(function(count, item) {
    return count + item.quantity
  }, 0)

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount
    }}>
      {props.children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
