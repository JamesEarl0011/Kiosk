import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({
  showCategories,
  setShowCategories,
  isAdmin,
  setShowAdminLogin,
  setShowProductForm,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminType");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    localStorage.removeItem("selectedStoreType");
    navigate("/");
  };

  const isLoggedIn = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleChangeStore = () => {
    localStorage.removeItem("selectedStoreType");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="toggle-categories"
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? "Hide Categories" : "Show Categories"}
        </button>
      </div>

      <div className="header-center">
        <button className="change-store-button" onClick={handleChangeStore}>
          Change Store
        </button>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <div className="user-info">
            <span>Welcome, {username}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            {isAdmin && (
              <button
                className="add-product-button"
                onClick={() => setShowProductForm(true)}
              >
                Add Product
              </button>
            )}
            {!isAdmin && (
              <button
                className="admin-login-button"
                onClick={() => setShowAdminLogin(true)}
              >
                Admin Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
