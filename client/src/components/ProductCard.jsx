import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <img
        src={product.imageUrl || "/placeholder.png"}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₱{product.price.toFixed(2)}</p>
        <p className="product-stock">In Stock: {product.stock}</p>
        <span className="product-category">{product.category}</span>
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="add-to-cart-button"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
