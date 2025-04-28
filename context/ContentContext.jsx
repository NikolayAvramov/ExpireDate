"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

const host = "https://refreshapi.onrender.com";
const ContentContext = createContext();

// Cache for API responses
const cache = {
  markets: null,
  products: {},
  marketDetails: {},
};

export function ContentProvider({ children }) {
  const [allMarkets, setAllMarkets] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedMarketId') || "";
    }
    return "";
  });
  const [basket, setBasket] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize basket from localStorage on mount
  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      setBasket(JSON.parse(savedBasket));
    }
    setIsInitialized(true);
  }, []);

  // Update localStorage whenever basket changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('basket', JSON.stringify(basket));
    }
  }, [basket, isInitialized]);

  // Update localStorage when selected market changes
  useEffect(() => {
    if (isInitialized && selectedMarketId) {
      localStorage.setItem('selectedMarketId', selectedMarketId);
    }
  }, [selectedMarketId, isInitialized]);

  // 🔹 Fetch Markets Initially with caching
  const fetchMarkets = useCallback(async () => {
    try {
      // Return cached data if available
      if (cache.markets) {
        setAllMarkets(cache.markets);
        return cache.markets;
      }

      const response = await fetch(`${host}/markets`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const result = await response.json();
      
      // Cache the result
      cache.markets = result;
      setAllMarkets(result);
      return result;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }, []);

  // 🔹 Compute Regions from allMarkets
  const allRegions = [...new Set(allMarkets.map((m) => m.region))];

  // 🔹 Fetch Selected Market Details Only When Needed with caching
  const getOneMarket = useCallback(async (id) => {
    try {
      // Return cached data if available
      if (cache.marketDetails[id]) {
        return cache.marketDetails[id];
      }

      const response = await fetch(`${host}/markets/${id}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      
      // Cache the result
      cache.marketDetails[id] = data;
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }, []);

  // 🔹 Fetch Products for Selected Market with caching
  const getProducts = useCallback(async () => {
    if (!selectedMarketId) return [];
    try {
      // Return cached data if available
      if (cache.products[selectedMarketId]) {
        return cache.products[selectedMarketId];
      }

      const response = await fetch(
        `${host}/markets/${selectedMarketId}/products`
      );
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      
      // Cache the result
      cache.products[selectedMarketId] = data;
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  }, [selectedMarketId]);

  // 🔹 Update a Product
  const updateProduct = useCallback(async (productId, updatedProduct) => {
    if (!selectedMarketId) {
      throw new Error("No market selected");
    }
    try {
      const response = await fetch(
        `${host}/markets/${selectedMarketId}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      
      // Update cache
      if (cache.products[selectedMarketId]) {
        cache.products[selectedMarketId] = cache.products[selectedMarketId].map(p => 
          p.id === productId ? data : p
        );
      }
      return data;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  }, [selectedMarketId]);

  // 🔹 Delete a Product
  const delProduct = useCallback(async (productId) => {
    if (!selectedMarketId) {
      throw new Error("No market selected");
    }
    try {
      const response = await fetch(
        `${host}/markets/${selectedMarketId}/products/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error(`Error ${response.status}`);
      
      // Update cache
      if (cache.products[selectedMarketId]) {
        cache.products[selectedMarketId] = cache.products[selectedMarketId].filter(
          p => p.id !== productId
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }, [selectedMarketId]);

  // 🛒 **Add Product to Basket & Reduce Quantity**
  const addToBasket = useCallback((product) => {
    if (product.quantity <= 0) {
      alert("This product is out of stock!");
      return;
    }

    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === product.id);
      if (existingItem) {
        return prevBasket.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevBasket, { ...product, quantity: 1 }];
      }
    });

    // 🔹 Reduce the product quantity in stock
    setAllMarkets((prevMarkets) =>
      prevMarkets.map((market) =>
        market.id === selectedMarketId
          ? {
              ...market,
              products: market.products.map((p) =>
                p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
              ),
            }
          : market
      )
    );
  }, [selectedMarketId]);

  // 🛒 **Remove Product from Basket & Restore Quantity**
  const removeFromBasket = useCallback((productId) => {
    setBasket((prevBasket) =>
      prevBasket.filter((product) => product.id !== productId)
    );

    // 🔹 Restore product quantity in stock
    setAllMarkets((prevMarkets) =>
      prevMarkets.map((market) =>
        market.id === selectedMarketId
          ? {
              ...market,
              products: market.products.map((p) =>
                p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
              ),
            }
          : market
      )
    );
  }, [selectedMarketId]);

  // 🛒 **Update Product Quantity in Basket**
  const updateBasket = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromBasket(productId);
      return;
    }

    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === productId);
      if (!existingItem) return prevBasket;

      const quantityDiff = newQuantity - existingItem.quantity;
      
      // Update basket
      const updatedBasket = prevBasket.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );

      // Update stock quantity
      setAllMarkets((prevMarkets) =>
        prevMarkets.map((market) =>
          market.id === selectedMarketId
            ? {
                ...market,
                products: market.products.map((p) =>
                  p.id === productId
                    ? { ...p, quantity: p.quantity - quantityDiff }
                    : p
                ),
              }
            : market
        )
      );

      return updatedBasket;
    });
  }, [removeFromBasket, selectedMarketId]);

  // Add clearCart function
  const clearCart = useCallback(() => {
    setBasket([]);
    if (isInitialized) {
      localStorage.removeItem('basket');
    }
  }, [isInitialized]);
  

  return (
    <ContentContext.Provider
      value={{
        allMarkets,
        allRegions,
        selectedMarketId,
        setSelectedMarketId,
        getOneMarket,
        getProducts,
        delProduct,
        updateProduct,
        fetchMarkets,
        basket,
        addToBasket,
        removeFromBasket,
        updateBasket,
        clearCart,
        sendOrderEmail,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
