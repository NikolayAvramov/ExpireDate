"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ContentContext = createContext();

// const cache = {
//   markets: null,
//   products: {},
//   marketDetails: {},
// };

export function ContentProvider({ children }) {
  const [allMarkets, setAllMarkets] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState("");
  const [basket, setBasket] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔹 Инициализация на клиентски данни след mount
  useEffect(() => {
    const storedMarketId = localStorage.getItem("selectedMarketId");
    const storedBasket = localStorage.getItem("basket");

    if (storedMarketId) setSelectedMarketId(storedMarketId);
    if (storedBasket) setBasket(JSON.parse(storedBasket));

    setIsInitialized(true);
  }, []);

  // 🔄 Съхранение на промени
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("basket", JSON.stringify(basket));
    }
  }, [basket, isInitialized]);

  useEffect(() => {
    if (isInitialized && selectedMarketId) {
      localStorage.setItem("selectedMarketId", selectedMarketId);
    }
  }, [selectedMarketId, isInitialized]);

  // 🔹 Fetch пазари (с кеширане)
  const fetchMarkets = async () => {
    try {
      const response = await fetch(`api/markets`);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();

      setAllMarkets(data);
      return data;
    } catch (error) {
      console.error("Fetch markets error:", error);
      throw error;
    }
  };

  // 🔹 Взимане на всички региони
  const allRegions = [...new Set(allMarkets.map((m) => m.region))];

  // 🔹 Взимане на конкретен пазар
  const getOneMarket = async (id) => {
    try {
      const response = await fetch(`api/markets/${id}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Get market error:", error);
      return null;
    }
  };

  // 🔹 Добавяне на продукти
  const addProducts = async (products) => {
    try {
      const response = await fetch(`api/markets/${selectedMarketId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });
      console.log(response);
      if (!response.ok) throw Error(`Error ${response.status}`);

      const data = await response.json();
      console.log(data);

      return data;
    } catch (err) {
      console.error("Add products error:", err);
      throw err;
    }
  };

  // 🔹 Взимане на продукти
  const getProducts = async () => {
    if (!selectedMarketId) return [];

    try {
      const response = await fetch(`api/markets/${selectedMarketId}/products`);

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Get products error:", error);
      return [];
    }
  };

  // 🔹 Актуализиране на продукт
  const updateProduct = async (productId, updatedProduct) => {
    try {
      const response = await fetch(
        `api/markets/${selectedMarketId}/products/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  };

  // 🔹 Изтриване на продукт
  const delProduct = async (productId) => {
    try {
      const response = await fetch(
        `api/markets/${selectedMarketId}/products/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error(`Error ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  };

  // 🛒 Добавяне към кошницата
  const addToBasket = (product) => {
    if (product.quantity <= 0) {
      alert("This product is out of stock!");
      return;
    }

    setBasket((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  // 🛒 Премахване от кошницата
  const removeFromBasket = (productId) => {
    setBasket((prev) => prev.filter((item) => item.id !== productId));
  };

  // 🛒 Актуализиране на количество
  const updateBasket = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromBasket(productId);
      return;
    }

    setBasket((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 🛒 Изчистване на кошницата
  const clearCart = () => {
    setBasket([]);
    if (isInitialized) {
      localStorage.removeItem("basket");
    }
  };

  return (
    <ContentContext.Provider
      value={{
        addProducts,
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
        getProducts,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
