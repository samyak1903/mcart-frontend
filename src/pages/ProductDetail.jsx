// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import axios from 'axios';
import ImageZoom from '../components/ImageZoom';

const ProductDetail = () => {
  const { id } = useParams(); // Gets the ID from the URL (e.g., /product/1)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Calling your Spring Boot Product Microservice
        const productApiUrl = process.env.REACT_APP_PRODUCT_URL || 'http://localhost:8081';
        const response = await axios.get(`${productApiUrl}/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Could not load product details. Is your app server running?");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    alert(`Added ${quantity} of ${product.name} to cart!`);
    // Later, this will call your Cart Microservice
  };

  if (loading) return <div className="pdp-message">Loading...</div>;
  if (error) return <div className="pdp-message error-msg">{error}</div>;
  if (!product) return <div className="pdp-message">Product not found.</div>;

  return (
    <div className="pdp-wrapper">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/">Shop</Link> / <span>{product.category}</span> / <span>{product.name}</span>
      </div>

      <div className="pdp-container">
        {/* Left Column: S3 Image */}
        <div className="pdp-image-section">
          <ImageZoom 
            imageUrl={product.imageUrl} 
            altText={product.name} 
          />
        </div>

        {/* Right Column: Details */}
        <div className="pdp-info-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price">${product.price.toFixed(2)}</div>
          
          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {/* Add to Cart Actions */}
          <div className="cart-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            
            <button className="btn-theme-pink btn-add-to-cart" onClick={handleAddToCart}>
              ADD TO CART
            </button>
          </div>

          <div className="product-meta">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>SKU:</strong> PRD-{product.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;