import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate, Link } from 'react-router-dom'
import { buildWhatsAppLink, whatsAppCartMessage } from '../utils/whatsapp'

function Cart() {
  const [cart, setCart] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
    fetchAddresses()
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

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses')
      setAddresses(res.data)
      const defaultAddr = res.data.find(a => a.isDefault) || res.data[0]
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
    } catch (err) {
      console.error('Error fetching addresses:', err)
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
    if (!selectedAddressId) {
      alert('Please select or add a delivery address!')
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
            await api.post('/orders', { addressId: selectedAddressId })

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

  const orderOnWhatsApp = () => {
    const link = buildWhatsAppLink(whatsAppCartMessage(cart))
    window.open(link, '_blank', 'noopener,noreferrer')
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

        <div className="address-picker">
          <span className="address-picker-label">📍 Deliver to</span>

          {addresses.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              No saved address yet.{' '}
              <Link to="/profile" className="address-picker-add-link">
                Add one in your profile
              </Link>
            </p>
          ) : (
            <>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`address-picker-option ${selectedAddressId === addr.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <span className="address-picker-option-text">
                    {addr.label} {addr.isDefault && '· Default'}
                    <span>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</span>
                  </span>
                </label>
              ))}
              <Link to="/profile" className="address-picker-add-link">
                + Add a new address
              </Link>
            </>
          )}
        </div>

        <button
          className="order-btn"
          onClick={placeOrder}
          disabled={ordering}
        >
          {ordering ? '⏳ Processing...' : `💳 Pay ₹${cart.grandTotal}`}
        </button>

        <button
          onClick={orderOnWhatsApp}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '10px',
            padding: '13px 0',
            background: '#25D366',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.09 1.67.79 1.96.93.29.14.48.21.55.33.07.12.07.68-.17 1.36z"/>
          </svg>
          Order via WhatsApp instead
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