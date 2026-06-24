import api from '../api/axiosConfig'

function ProductCard({ product }) {

  const addToCart = async () => {
    try {
      await api.post('/api/cart', {
        productId: product.id,
        quantity: 1
      })
      alert(`${product.name} added to cart!`)
    } catch (err) {
      alert('Please login first!')
    }
  }

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <span className="price">₹{product.price}</span>
          <button onClick={addToCart} className="add-btn">Add +</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard