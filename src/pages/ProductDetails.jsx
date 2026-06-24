import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>

      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>

      <p>
        <strong>Status:</strong>{" "}
        {product.available === true
          ? "Available"
          : product.available === false
          ? "Out of Stock"
          : "Not Specified"}
      </p>
    </div>
  );
}

export default ProductDetails;