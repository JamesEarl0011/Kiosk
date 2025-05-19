import { useState } from 'react';

const useCart = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    // Log the product being added
    console.log("Adding product to cart:", product);

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return currentCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = cart.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};

export default useCart;