import React from 'react';
import { useNavigate } from 'react-router-dom';

const StoreTypeSelection = () => {
  const navigate = useNavigate();

  const handleStoreTypeSelect = (storeType) => {
    // Store the selection in localStorage
    localStorage.setItem('selectedStoreType', storeType);
    // Navigate to the main app
    navigate('/app');
  };

  return (
    <div className="store-selection-container">
      <div className="store-selection-content">
        <h1>Welcome to Our Kiosk</h1>
        <p>Please select your store type to continue</p>
        
        <div className="store-options">
          <div 
            className="store-option retail"
            onClick={() => handleStoreTypeSelect('retail')}
          >
            <div className="store-icon">🛍️</div>
            <h2>Retail Store</h2>
            <p>Browse our wide selection of retail products</p>
          </div>

          <div 
            className="store-option fast-food"
            onClick={() => handleStoreTypeSelect('fast-food')}
          >
            <div className="store-icon">🍔</div>
            <h2>Fast Food</h2>
            <p>Order delicious meals and combos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreTypeSelection; 