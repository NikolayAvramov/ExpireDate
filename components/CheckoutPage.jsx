import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { useAuth } from "@/context/AuthContect";

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, clearCart } = useContent();
  const { authStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Log cart items for debugging
  useEffect(() => {
    console.log("Cart items:", cart);
  }, [cart]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const onSubmit = async (data) => {
    if (!authStatus.authenticated) {
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // Here you would typically send the order data to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Clear the cart after successful checkout
      clearCart();
      
      // Redirect to success page
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Order</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Total</h3>
              <p className="text-lg font-bold">${calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid phone number",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Confirm Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 