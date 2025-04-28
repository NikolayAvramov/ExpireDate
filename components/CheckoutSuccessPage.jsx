import React from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/context/ContentContext";

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const { clearCart } = useContent();

  React.useEffect(() => {
    // Clear the cart when the success page loads
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Thank You for Your Purchase!</h2>
        <p className="mt-2 text-lg text-gray-600">
          Your order has been successfully processed.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage; 