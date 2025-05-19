import React, { useState, useEffect } from "react";
import { getFastFoodOrders } from "../../../services/api";

const SalesAnalytics = () => {
  // State for orders and time period
  const [orders, setOrders] = useState([]);
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getFastFoodOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Simple function to calculate sales for different periods
  const calculateSales = () => {
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;

    // Filter orders based on time period
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const diffDays = (now - orderDate) / dayInMs;

      switch (timePeriod) {
        case "daily":
          return diffDays <= 1;
        case "weekly":
          return diffDays <= 7;
        case "monthly":
          return diffDays <= 30;
        default:
          return true;
      }
    });

    // Calculate total sales
    const totalSales = filteredOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    return { totalSales, orderCount: filteredOrders.length };
  };

  // Calculate top products
  const getTopProducts = () => {
    const productCounts = {};

    // Count quantities for each product
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product._id;
        if (!productCounts[productId]) {
          productCounts[productId] = {
            name: item.product.name,
            quantity: 0,
          };
        }
        productCounts[productId].quantity += item.quantity;
      });
    });

    // Convert to array and sort
    return Object.values(productCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const { totalSales, orderCount } = calculateSales();
  const topProducts = getTopProducts();

  return (
    <div className="sales-analytics">
      <header className="section-header">
        <h2>Sales Analytics</h2>
        <div className="period-selector">
          <button
            className={timePeriod === "daily" ? "active" : ""}
            onClick={() => setTimePeriod("daily")}
          >
            Daily
          </button>
          <button
            className={timePeriod === "weekly" ? "active" : ""}
            onClick={() => setTimePeriod("weekly")}
          >
            Weekly
          </button>
          <button
            className={timePeriod === "monthly" ? "active" : ""}
            onClick={() => setTimePeriod("monthly")}
          >
            Monthly
          </button>
        </div>
      </header>

      <div className="sales-summary">
        <div className="summary-card">
          <h3>Total Sales</h3>
          <p>${totalSales.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Orders</h3>
          <p>{orderCount}</p>
        </div>
      </div>

      <div className="top-products">
        <h3>Top 10 Products</h3>
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesAnalytics;
