"use client";
import { useContent } from "@/context/ContentContext";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

const Basket = () => {
  const { basket, updateBasket, removeFromBasket } = useContent();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stockError, setStockError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [originalStockData, setOriginalStockData] = useState({});

  // Calculate prices - keep this useMemo as it's computationally expensive
  const { subtotal, discount, total } = useMemo(() => {
    const subtotal = basket.reduce(
      (sum, item) => sum + item.salePrice * item.quantity,
      0
    );
    const discount = basket.reduce(
      (sum, item) =>
        (item.salePrice < item.regularPrice
          ? (item.regularPrice - item.salePrice) * item.quantity
          : 0) + sum,
      0
    );
    return { subtotal, discount, total: subtotal };
  }, [basket]);

  // Initialize original stock data when basket changes
  useEffect(() => {
    console.log('Initializing stock data with basket:', basket);
    const stockData = {};
    basket.forEach(item => {
      console.log('Processing item:', item);
      // Set a default stock value of 3 for testing
      const stockValue = 3;
      console.log('Using stock value:', stockValue);
      if (!stockData[item.id]) {
        stockData[item.id] = Number(stockValue);
      }
    });
    console.log('Final stock data:', stockData);
    setOriginalStockData(stockData);
  }, [basket]);

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      setIsLoading(true);
      setError(null);
      setStockError(null);
      
      const item = basket.find(item => item.id === id);
      console.log('Updating quantity for item:', item);
      console.log('Original stock data:', originalStockData);
      
      if (!item) {
        console.log('Item not found in basket');
        setError("Item not found in basket");
        return;
      }

      const quantity = Number(newQuantity);
      const originalStock = originalStockData[id] || 3; // Default to 3 if not found
      console.log(`Quantity update: current=${item.quantity}, new=${quantity}, original stock=${originalStock}`);

      if (originalStock === 0) {
        console.log(`Item ${item.name} is out of stock in the market`);
        setStockError(`${item.name} is currently out of stock in the market`);
        return;
      }

      if (quantity > originalStock) {
        console.log(`Market stock exceeded for ${item.name}: quantity=${quantity}, original stock=${originalStock}`);
        setStockError(`Cannot add more than ${originalStock} items of ${item.name} - only ${originalStock} available in the market`);
        return;
      }

      if (quantity < 1) {
        console.log('Quantity less than 1');
        setError("Quantity cannot be less than 1");
        return;
      }
      
      console.log('Updating basket with new quantity');
      await updateBasket(id, quantity);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError("Failed to update quantity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await removeFromBasket(id);
    } catch (err) {
      setError("Failed to remove item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasStockIssues = useMemo(() => {
    console.log('Checking stock issues for basket:', basket);
    const hasIssues = basket.some(item => {
      const quantity = Number(item.quantity);
      const originalStock = originalStockData[item.id] || 0;
      console.log(`Item ${item.name}: quantity=${quantity}, original stock=${originalStock}`);
      return originalStock === 0 || quantity > originalStock;
    });
    console.log('Has stock issues:', hasIssues);
    return hasIssues;
  }, [basket, originalStockData]);

  const handleCheckout = () => {
    console.log('Checkout initiated');
    const outOfStockItems = basket.filter(item => {
      const originalStock = originalStockData[item.id] || 0;
      return originalStock === 0;
    });
    
    if (outOfStockItems.length > 0) {
      const itemNames = outOfStockItems.map(item => item.name).join(", ");
      setStockError(`Cannot proceed to checkout. The following items are out of stock: ${itemNames}`);
      return;
    }

    const itemsWithStockIssues = basket.filter(item => {
      const quantity = Number(item.quantity);
      const originalStock = originalStockData[item.id] || 0;
      console.log(`Checking item ${item.name}: quantity=${quantity}, original stock=${originalStock}`);
      return quantity > originalStock;
    });
    
    console.log('Items with stock issues:', itemsWithStockIssues);
    
    if (itemsWithStockIssues.length > 0) {
      const itemNames = itemsWithStockIssues.map(item => 
        `${item.name} (Quantity: ${item.quantity}, Available in market: ${originalStockData[item.id]})`
      ).join(", ");
      console.log('Setting stock error with items:', itemNames);
      setStockError(`Cannot proceed to checkout. Stock issues with: ${itemNames}`);
      return;
    }
    console.log('No stock issues, proceeding to checkout');
    window.location.href = '/checkout';
  };

  return (
    <div className="bg-blue-100 flex justify-center min-h-screen">
      <div className="m-6 min-h-[500px] bg-white text-black p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🛒 Your Basket
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {stockError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {stockError}
          </div>
        )}

        {checkoutMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {checkoutMessage}
          </div>
        )}

        {basket.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Your basket is empty</p>
            <Link 
              href="/products"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-300">
              {basket.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.salePrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isLoading}
                      aria-label="Decrease quantity"
                    >
                      ➖
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock || isLoading}
                      aria-label="Increase quantity"
                      title={item.quantity >= item.stock ? `Only ${item.stock} items of ${item.name} available` : "Increase quantity"}
                    >
                      ➕
                    </button>
                    <button
                      className="ml-2 text-red-500 disabled:opacity-50"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isLoading}
                      aria-label="Remove item"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-4">
              <p className="text-lg">
                Subtotal:{" "}
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </p>
              {discount > 0 && (
                <p className="text-sm text-green-600">
                  You saved:{" "}
                  <span className="font-semibold">${discount.toFixed(2)}</span>{" "}
                  🎉
                </p>
              )}
              <p className="text-lg font-bold mt-2">
                Total:{" "}
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </p>
              <button
                onClick={handleCheckout}
                disabled={isLoading || hasStockIssues}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Basket;
