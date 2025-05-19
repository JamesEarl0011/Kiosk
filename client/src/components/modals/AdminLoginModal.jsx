import React, { useState } from "react";
import "./AdminLoginModal.css";

const AdminLoginModal = ({
  showAdminLogin,
  setShowAdminLogin,
  handleAdminLogin,
}) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    adminType: "retail",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await handleAdminLogin(credentials);
    } catch (err) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAdminLogin) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Admin Login</h2>
          <button
            className="close-button"
            onClick={() => setShowAdminLogin(false)}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <p className="redirect-message">
              Redirecting to store selection...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminType">Admin Type:</label>
            <select
              id="adminType"
              value={credentials.adminType}
              onChange={(e) =>
                setCredentials({ ...credentials, adminType: e.target.value })
              }
              disabled={isLoading}
            >
              <option value="retail">Retail</option>
              <option value="fast-food">Fast Food</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowAdminLogin(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
