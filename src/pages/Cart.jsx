import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const [cart, setCart] = useState(null)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart')
      setCart(res.data)
    } catch (err) {
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const res = await api.put(`/cart/${cartItemId}?quantity=${quantity}`)
      setCart(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`)
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  const placeOrder = async () => {
    if (!address.trim()) {
      alert('Please enter delivery address!')
      return
    }

    setOrdering(true)

    try {
      // Step 1 — create Razorpay order from backend
      const orderRes = await api.post('/payment/create-order', {
        amount: cart.grandTotal
      })

      const { orderId, amount, currency, keyId } = orderRes.data

      // Step 2 — open Razorpay payment popup
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Telangana Special',
        description: 'Food Order Payment',
        order_id: orderId,
        image: '🌶️',

        // Step 3 — after payment success
        handler: async function (response) {
          try {
            // verify payment on backend
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })

            // place the actual order
            await api.post('/orders', { deliveryAddress: address })

            alert('Payment successful! Order placed 🎉')
            navigate('/orders')

          } catch (err) {
            alert('Payment verification failed!')
            setOrdering(false)
          }
        },

        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').name || '',
          email: JSON.parse(localStorage.getItem('user') || '{}').email || ''
        },

        theme: {
          color: '#ff4500'
        },

        modal: {
          ondismiss: function () {
            alert('Payment cancelled!')
            setOrdering(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      console.error(err)
      alert('Failed to initiate payment!')
      setOrdering(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
        <h2>Your cart is empty!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Add some delicious items to your cart!
        </p>
        <button onClick={() => navigate('/products')}>
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div className="cart-container">

      {/* Header */}
      <div className="cart-header">
        <h2>Your Cart 🛒</h2>
        <span className="orders-count">{cart.totalItems} items</span>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">

            {/* Product Image */}
            {item.productImage ? (
              <img src={item.productImage} alt={item.productName} />
            ) : (
              <div className="cart-item-emoji">🍘</div>
            )}

            {/* Product Info */}
            <div className="cart-item-info">
              <h4>{item.productName}</h4>
              <span>₹{item.price} per item</span>
            </div>

            {/* Quantity Control */}
            <div className="quantity-control">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            {/* Item Total */}
            <div className="item-total">₹{item.totalPrice}</div>

            {/* Remove Button */}
            <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>

          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="cart-summary">
        <div className="summary-title">Order Summary</div>

        <div className="summary-row">
          <span>Items ({cart.totalItems})</span>
          <span>₹{cart.grandTotal}</span>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <span style={{ color: 'var(--success)' }}>FREE</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row summary-total">
          <span>Grand Total</span>
          <strong>₹{cart.grandTotal}</strong>
        </div>

        <input
          type="text"
          placeholder="📍 Enter delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          className="order-btn"
          onClick={placeOrder}
          disabled={ordering}
        >
          {ordering ? '⏳ Processing...' : `💳 Pay ₹${cart.grandTotal}`}
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginTop: '10px'
        }}>
          🔒 Secured by Razorpay
        </p>
      </div>

    </div>
  )
}

export default Cart