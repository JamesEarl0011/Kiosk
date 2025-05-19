import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import AdminLoginModal from "./components/modals/AdminLoginModal";
import StoreTypeSelection from "./components/StoreTypeSelection";
import RetailDashboard from "./components/admin/RetailDashboard";
import FastFoodDashboard from "./components/admin/FastFoodDashboard";
import useProducts from "./hooks/useProducts";
import useCart from "./hooks/useCart";
import { login, createOrder } from "./services/api";
import { generateReceiptHTML } from "./utils/receiptTemplate";

function KioskApp() {
  const {
    products,
    loading,
    error: productsError,
    fetchProducts,
  } = useProducts();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    storeType: "retail",
  });
  const [productError, setProductError] = useState("");
  const [error, setError] = useState("");
  const [showComboManagement, setShowComboManagement] = useState(false);
  const [selectedStoreType] = useState(
    localStorage.getItem("selectedStoreType")
  );

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetchProducts();
        // Check if user is admin on load
        const userRole = localStorage.getItem("userRole");
        const adminType = localStorage.getItem("adminType");
        setIsAdmin(userRole === "admin" && adminType);

        // Set combo management for fast-food admins
        if (userRole === "admin" && adminType === "fast-food") {
          setShowComboManagement(true);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize application. Please refresh the page.");
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Extract unique categories from products matching the selected store type
    const uniqueCategories = [
      "all",
      ...new Set(
        products
          .filter((product) => product.storeType === selectedStoreType)
          .map((product) => product.category)
      ),
    ];
    setCategories(uniqueCategories);
  }, [products, selectedStoreType]);

  const handleAdminLogin = async (credentials) => {
    try {
      const data = await login(credentials);
      setIsAdmin(true);
      setShowAdminLogin(false);
      setError("");

      // Store admin data
      localStorage.setItem(
        "adminData",
        JSON.stringify({
          adminType: data.adminType,
          username: data.username,
        })
      );

      // Show combo management for fast-food admins
      if (data.adminType === "fast-food") {
        setShowComboManagement(true);
      }

      // Redirect based on admin type
      if (data.adminType === "retail") {
        window.location.href = "/admin/retail";
      } else if (data.adminType === "fast-food") {
        window.location.href = "/admin/fastfood";
      } else {
        throw new Error("Invalid admin type");
      }
    } catch (err) {
      setError(err.message || "Failed to login as admin");
      // Clear any existing admin data
      localStorage.removeItem("adminData");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("adminType");
      localStorage.removeItem("username");

      // Redirect to store selection after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000); // 2 second delay to show error message

      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleCheckout = async () => {
    try {
      if (cart.length === 0) {
        setError("Cart is empty");
        return;
      }

      // Log the cart items to verify the data
      console.log("Cart items before checkout:", cart);

      // Create and print receipt from cart data
      const receiptHTML = generateReceiptHTML({
        items: cart,
        totalPrice: cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        storeType: selectedStoreType,
        receiptNumber: `TEMP-${Date.now()}`,
        orderDate: new Date(),
      });

      const printWindow = window.open(
        "",
        "Print Receipt",
        "height=600,width=800"
      );
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();

      const orderData = {
        items: cart.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        storeType: selectedStoreType,
      };

      const data = await createOrder(orderData);
      setOrderNumber(data.receiptNumber);
      clearCart();
      setError("");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to process checkout");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductError("");

    try {
      await createProduct(newProduct);
      fetchProducts();
      setShowProductForm(false);
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        storeType: selectedStoreType,
      });
    } catch (err) {
      setProductError(err.message);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStoreType = product.storeType === selectedStoreType;
    return matchesSearch && matchesCategory && matchesStoreType;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error Loading Products</h2>
          <p>{productsError}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Application Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="kiosk-container">
      <Header
        showCategories={showCategories}
        setShowCategories={setShowCategories}
        isAdmin={isAdmin}
        setShowAdminLogin={setShowAdminLogin}
        setShowProductForm={setShowProductForm}
        selectedStoreType={selectedStoreType}
      />

      <div className="main-content">
        {showCategories && (
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStoreType={selectedStoreType}
          />
        )}

        <div className="content-area">
          <div className="welcome-message">
            <h1>
              Welcome to our{" "}
              {selectedStoreType === "retail" ? "Retail" : "Fast Food"} Store!
            </h1>
            <p>Browse our products and enjoy your shopping experience.</p>
          </div>
          <div className="search-filter-section">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {showComboManagement ? (
            <ComboList />
          ) : (
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))
              ) : (
                <div className="no-products">
                  <p>No products found matching your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          handleCheckout={handleCheckout}
        />
      </div>

      <AdminLoginModal
        showAdminLogin={showAdminLogin}
        setShowAdminLogin={setShowAdminLogin}
        handleAdminLogin={handleAdminLogin}
      />

      {showOrderModal && (
        <OrderModal
          orderNumber={orderNumber}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      {showProductForm && (
        <ProductFormModal
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleProductSubmit={handleProductSubmit}
          productError={productError}
        />
      )}
    </div>
  );
}

const ProtectedRoute = ({ children, adminType }) => {
  const adminData = localStorage.getItem("adminData");

  if (!adminData) {
    return <Navigate to="/" replace />;
  }

  const { adminType: storedAdminType } = JSON.parse(adminData);

  if (storedAdminType !== adminType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminData");
  localStorage.removeItem("adminType");
  localStorage.removeItem("username");
  window.location.href = "/";
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoreTypeSelection />} />
        <Route path="/app" element={<KioskApp />} />
        <Route
          path="/admin/retail/*"
          element={
            <ProtectedRoute adminType="retail">
              <RetailDashboard
                adminInfo={JSON.parse(
                  localStorage.getItem("adminData") || "{}"
                )}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fastfood/*"
          element={
            <ProtectedRoute adminType="fast-food">
              <FastFoodDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
