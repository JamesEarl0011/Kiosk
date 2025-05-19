import React, { useState, useEffect, useCallback } from "react";
import { getProductsByStore, getRetailOrders } from "../../services/api";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import ProductsManagement from "./retail/ProductManagement";
import SalesAnalytics from "./retail/SalesAnalytics";
import "./RetailDashboard.css";

const RetailDashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [productData, orderData] = await Promise.all([
        getProductsByStore("retail"),
        getRetailOrders(),
      ]);

      setProducts(productData || []);
      setOrders(orderData || []);
    } catch (error) {
      console.error("Data fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateStats = () => {
    if (!products || !orders) return null;

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.totalPrice;
    }, 0);

    // Get products with low stock (less than 10)
    const lowStock = products.filter((product) => product.quantity < 10);

    return {
      totalRevenue,
      lowStockCount: lowStock.length,
      totalOrders: orders.length,
      totalProducts: products.length,
    };
  };

  const stats = calculateStats();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="retail-dashboard">
      {/* Header with navigation */}
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Retail Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="dashboard-stats">
          <div className="stat-item">
            <h3>Total Revenue</h3>
            <p>${stats?.totalRevenue?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="stat-item">
            <h3>Total Orders</h3>
            <p>{stats?.totalOrders || 0}</p>
          </div>
          <div className="stat-item">
            <h3>Total Products</h3>
            <p>{stats?.totalProducts || 0}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="dashboard-nav">
          <NavLink
            to="/admin/retail/products"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/retail/sales"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Sales
          </NavLink>
        </nav>

        {/* Logout Button */}
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </header>{" "}
      {/* Main Content Area */}
      <main className="dashboard-content">
        <Routes>
          <Route
            index
            element={
              <ProductsManagement
                products={products}
                onProductsChange={fetchData}
              />
            }
          />
          <Route
            path="products"
            element={
              <ProductsManagement
                products={products}
                onProductsChange={fetchData}
              />
            }
          />
          <Route path="sales" element={<SalesAnalytics orders={orders} />} />
        </Routes>
      </main>
    </div>
  );
};

export default RetailDashboard;
