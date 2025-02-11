"use client";

import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation"; // To navigate to checkout page

const BasketPage = () => {
    const router = useRouter();

    const [basketItems, setBasketItems] = useState([
        {
            id: 1,
            name: "Product 1",
            quantity: 2,
            price: 20,
            image: "/images/product1.jpg", // Replace with actual product image paths
        },
        {
            id: 2,
            name: "Product 2",
            quantity: 1,
            price: 35,
            image: "/images/product2.jpg",
        },
    ]);

    const handleRemoveItem = id => {
        setBasketItems(basketItems.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id, quantity) => {
        if (quantity < 1) return; // Prevent setting quantity less than 1
        setBasketItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, quantity } : item)));
    };

    const handleCheckout = () => {
        router.push("/checkout");
    };

    const getTotalPrice = () => {
        return basketItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 text-gray-700">
            <h2 className="text-3xl font-bold text-center mb-8">Your Shopping Basket</h2>

            {basketItems.length === 0 ? (
                <div className="text-center text-xl text-gray-600">
                    <p>Your basket is empty. Start shopping!</p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Product</th>
                                    <th className="px-4 py-2 text-left">Quantity</th>
                                    <th className="px-4 py-2 text-left">Price</th>
                                    <th className="px-4 py-2 text-left">Total</th>
                                    <th className="px-4 py-2">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {basketItems.map(item => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2 flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md mr-4"
                                            />
                                            <span>{item.name}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                                                onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                            />
                                        </td>
                                        <td className="px-4 py-2">${item.price}</td>
                                        <td className="px-4 py-2">${item.price * item.quantity}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-700 transition-all duration-300"
                                            >
                                                <FaTrashAlt size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <div className="text-xl font-semibold">Total: ${getTotalPrice()}</div>
                        <div>
                            <button
                                onClick={handleCheckout}
                                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 text-center">
                <button onClick={() => router.push("/")} className="text-blue-600 hover:underline transition-all duration-200">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default BasketPage;
