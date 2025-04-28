"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { useAuth } from "@/context/AuthContect";

export default function CheckoutPage() {
  const { basket, clearCart, sendOrderEmail } = useContent();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const calculateTotal = () => {
    return basket.reduce((total, item) => {
      return total + item.salePrice * item.quantity;
    }, 0);
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // Prepare order data
      const orderData = {
        items: basket.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.salePrice
        })),
        totalAmount: calculateTotal(),
        shippingAddress: {
          street: data.street || "N/A",
          city: data.city || "N/A",
          state: data.state || "N/A",
          zipCode: data.zipCode || "N/A"
        }
      };

      // Send order email
      await sendOrderEmail(orderData);

      // Clear cart and redirect to success page
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (basket.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your basket is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Please add some products to your basket before checking out.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Checkout
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  {basket.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.salePrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-base font-medium text-gray-900">
                      Total
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Please enter a valid 10-digit phone number",
                        },
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
