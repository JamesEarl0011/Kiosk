const API_URL = "http://localhost:5000/api";

// Add this helper function
const getToken = () => {
  return localStorage.getItem("token");
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        adminType: credentials.adminType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data);
      throw new Error(data.error || "Login failed");
    }

    // Validate token before storing
    if (!data.token) {
      console.error("No token received from server");
      throw new Error("Invalid server response: No token received");
    }

    // Store token without 'Bearer ' prefix
    const token = data.token.startsWith("Bearer ")
      ? data.token.slice(7)
      : data.token;
    localStorage.setItem("token", token);

    // Store user info
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("adminType", data.adminType);
    localStorage.setItem("username", data.username);
    localStorage.setItem("fullName", data.fullName);

    console.log("Login successful, token stored");
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.message || "Network error occurred");
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        items: orderData.items.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        storeType: orderData.storeType,
        totalPrice: orderData.totalPrice,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Order creation failed:", error);
      throw new Error(error.message || "Failed to create order");
    }

    const data = await response.json();
    console.log("Order created successfully:", data);

    return data;
  } catch (error) {
    console.error("Order creation error:", error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch products");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message || "Failed to fetch products");
  }
};

// Get products by store type
export const getProductsByStore = async (storeType) => {
  try {
    const response = await fetch(`${API_URL}/products?storeType=${storeType}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch products");
  }
};

//! RETAIL ADMIN DASHBOARD METHODS

// Get retail orders
export const getRetailOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders?storeType=retail`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch retail orders");
    }

    // Filter orders with storeType "retail"
    const orders = await response.json();
    return orders.filter((order) => order.storeType === "retail");
  } catch (error) {
    console.error("Error fetching retail orders:", error);
    throw new Error(error.message || "Failed to fetch retail orders");
  }
};

// Create new retail product
export const createRetailProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("401 Unauthorized");

    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...productData,
        storeType: "retail",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating retail product:", error);
    throw error;
  }
};

// Update retail product
export const updateRetailProduct = async (productId, productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("401 Unauthorized");

    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...productData,
        storeType: "retail",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating retail product:", error);
    throw error;
  }
};

// Delete retail product
export const deleteRetailProduct = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("401 Unauthorized");

    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete product");
    }

    return true; // Success
  } catch (error) {
    console.error("Error deleting retail product:", error);
    throw error;
  }
};

//! FAST FOOD ADMIN DASHBOARD METHODS

// Get fast-food orders
export const getFastFoodOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders?storeType=fast-food`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch fast-food orders");
    }

    // Filter orders with storeType "fast-food"
    const orders = await response.json();
    return orders.filter((order) => order.storeType === "fast-food");
  } catch (error) {
    console.error("Error fetching fast-food orders:", error);
    throw new Error(error.message || "Failed to fetch fast-food orders");
  }
};

// Create new fast-food product
export const createFastFoodProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("401 Unauthorized");

    const response = await fetch(`${API_URL}/products/fast-food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...productData,
        storeType: "fast-food",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating fast-food product:", error);
    throw error;
  }
};

// Update fast-food product
export const updateFastFoodProduct = async (productId, productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("401 Unauthorized");

    const response = await fetch(`${API_URL}/products/fast-food/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...productData,
        storeType: "fast-food",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating fast-food product:", error);
    throw error;
  }
};

// Delete fast-food product
export const deleteFastFoodProduct = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("401 Unauthorized");

    const response = await fetch(`${API_URL}/products/fast-food/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete product");
    }

    return true; // Success
  } catch (error) {
    console.error("Error deleting fast-food product:", error);
    throw error;
  }
};
