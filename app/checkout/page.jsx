"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        cardNumber: "",
    });

    const router = useRouter(); // Initialize the router hook

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        // Validate the form and process the payment
        if (formData.name && formData.email && formData.address && formData.cardNumber) {
            router.push("/success"); // Navigate to the success page
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="cardNumber" className="block font-medium text-gray-700">
                        Card Number
                    </label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Confirm Order
                </button>
            </form>
        </div>
    );
};

export default CheckoutPage;
