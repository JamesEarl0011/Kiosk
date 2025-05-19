import React from "react";

const CategorySidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedStoreType,
}) => {
  // Map categories to their corresponding icons
  const getCategoryIcon = (category) => {
    const iconMap = {
      all: "/icons/all.png", // Using food icon as default for "All Items"
      // Retail store icons
      "Food & Groceries": "/icons/retail/food.png",
      "Home & Kitchen": "/icons/retail/kitchen.png",
      Health: "/icons/retail/health.png",
      "Baby Care": "/icons/retail/baby-care.png",
      "Pet Supplies": "/icons/retail/pets.png",
      "Personal Care": "/icons/retail/personal.png",
      "Cleaning Supplies": "/icons/retail/cleaning.png",

      // Fast-food store icons
      "Main Course": "/icons/fast-food/main.png",
      "Side Dishes": "/icons/fast-food/side.png",
      Desserts: "/icons/fast-food/dessert.png",
      Beverages: "/icons/fast-food/beverage.png",
    };

    return iconMap[category] || "/icons/retail/food.png"; // Default to food icon if category not found
  };

  return (
    <div className="category-sidebar">
      <h3>Categories</h3>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            <div className="category-content">
              <img
                src={getCategoryIcon(category)}
                alt={category}
                className="category-icon"
              />
              <span className="category-text">
                {category === "all" ? "All Items" : category}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
