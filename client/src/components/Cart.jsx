import React, { useState } from 'react';

const Cart = ({ cart, updateQuantity, removeFromCart, handleCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <button 
        className="cart-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="cart-icon">🛒</span>
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      {isOpen && (
        <div className="cart-overlay">
          <div className="cart-section">
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
            </div>
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <span>{item.name}</span>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(index)}>Remove</button>
                  </div>
                ))}
                <div className="cart-total">
                  <h3>Total: ${totalPrice.toFixed(2)}</h3>
                  <button 
                    className="checkout-button"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart; 