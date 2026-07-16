import { useRef } from 'react';
import api from '../api/axiosConfig'

function ProductCard({ product }) {
  const cardRef = useRef(null);

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

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  };

  return (
    <div
      className="product-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease-out' }}
    >
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