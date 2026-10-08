// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import * as cartApi from "../api/cart";

const cartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the cart from the backend and store its items
  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await cartApi.getCart();
      const cart = data.cart || data; // adjust to your controller's response shape
      setItems(cart.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the cart when the user logs in, empty it on logout
  useEffect(() => {
    if (user) loadCart();
    else setItems([]);
  }, [user, loadCart]);

  // Run an API action, then refresh the cart
  const runAction = async (action) => {
    try {
      setError("");
      await action();
      await loadCart();
    } catch (err) {
      setError(err.response?.data?.message || "Cart action failed");
    }
  };

  const addItem = (productId, quantity = 1) =>
    runAction(() => cartApi.addToCart(productId, quantity));

  const updateItem = (productId, quantity) =>
    runAction(() => cartApi.updateCartItem(productId, quantity));

  const removeItem = (productId) =>
    runAction(() => cartApi.removeFromCart(productId));

  const clearAll = () => runAction(() => cartApi.clearCart());

  // Derived values, calculated from items
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <cartContext.Provider
      value={{ items, loading, error, addItem, updateItem, removeItem, clearAll, itemCount, total }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => useContext(cartContext);