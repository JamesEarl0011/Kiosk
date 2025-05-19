import React, { useState, useEffect } from "react";
import {
  getProductsByStore,
  createRetailProduct,
  updateRetailProduct,
  deleteRetailProduct,
} from "../../../services/api";
import ProductFormModal from "./ProductFormModal";
import "./ProductManagement.css";

const ProductsManagement = () => {
  // State for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsByStore("retail");
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteRetailProduct(productId);
        await fetchProducts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateRetailProduct(editingProduct._id, formData);
      } else {
        await createRetailProduct(formData);
      }
      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-management">
      <header className="section-header">
        <h2>Product Management</h2>
        <button className="add-button" onClick={handleAddProduct}>
          Add New Product
        </button>
      </header>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>#{product._id.slice(-6)}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>
                <span
                  className={`status ${product.stock <= 10 ? "low" : "ok"}`}
                >
                  {product.stock <= 10 ? "Low Stock" : "In Stock"}
                </span>
              </td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        editProduct={editingProduct}
      />
    </div>
  );
};

export default ProductsManagement;
