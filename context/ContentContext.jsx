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

  // Send order details to backend
  const sendOrderEmail = useCallback(async (orderData) => {
    try {
      // Get JWT token from cookies
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        console.error('No user cookie found');
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let userData;
      let token;
      try {
        userData = JSON.parse(userCookie);
        console.log('Parsed user data:', { 
          id: userData.id, 
          hasToken: !!userData.token,
          tokenLength: userData.token ? userData.token.length : 0,
          tokenStart: userData.token ? userData.token.substring(0, 10) : 'none'
        });
        
        if (!userData || !userData.token) {
          console.error('Invalid user data structure:', userData);
          throw new Error('Invalid user data. Please log in again.');
        }
        token = userData.token;

        // Validate token format
        if (!token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
          console.error('Token format appears invalid:', token.substring(0, 10) + '...');
          throw new Error('Invalid token format. Please log in again.');
        }
      } catch (parseError) {
        console.error('Error parsing user cookie:', parseError);
        console.error('Raw cookie value:', userCookie);
        throw new Error('Invalid authentication data. Please log in again.');
      }

      // Validate order data structure
      if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      // Calculate total amount to ensure accuracy
      const calculatedTotal = orderData.items.reduce((sum, item) => 
        sum + (item.quantity * item.price), 0
      );

      // Prepare the request body according to API specifications
      const requestBody = {
        items: orderData.items.map(item => ({
          name: item.name,
          quantity: parseInt(item.quantity, 10),
          price: parseFloat(item.price)
        })),
        totalAmount: calculatedTotal,
        shippingAddress: {
          street: orderData.shippingAddress.street || '',
          city: orderData.shippingAddress.city || '',
          state: orderData.shippingAddress.state || '',
          zipCode: orderData.shippingAddress.zipCode || ''
        }
      };

      // Log full request details for debugging
      const requestDetails = {
        url: `${host}/orders`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.substring(0, 10)}...`,
          'Content-Type': 'application/json'
        },
        body: requestBody
      };
      console.log('Making order request:', requestDetails);

      const response = await fetch(`${host}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          error: parseError
        });
        throw new Error('Invalid response from server');
      }
      
      // Log response details
      console.log('Order response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        // Log the full error details
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          error: data.error,
          message: data.message,
          data: data,
          requestDetails: {
            ...requestDetails,
            headers: {
              ...requestDetails.headers,
              'Authorization': 'Bearer [REDACTED]'
            }
          }
        };
        console.error('Order request failed:', errorDetails);
        
        // Check for specific error types
        if (response.status === 401) {
          console.log('Attempting to refresh authentication...');
          throw new Error('Authentication failed. Please log in again to refresh your session.');
        } else if (response.status === 400) {
          throw new Error(`Bad request: ${data.message || 'Invalid order data'}`);
        } else {
          throw new Error(data.message || `Error ${response.status}: ${data.error || 'Unknown error'}`);
        }
      }

      return data;
    } catch (error) {
      console.error('Error in sendOrderEmail:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }, []);

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
