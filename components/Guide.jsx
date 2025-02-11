"use client";

import { motion } from "framer-motion";
import { FaStore, FaShoppingCart, FaCashRegister, FaBoxOpen, FaSmile } from "react-icons/fa";

export default function Guide() {
    const steps = [
        {
            icon: <FaStore size={48} className="text-blue-600" />,
            title: "Select Your Store",
            description: "Browse and choose the store where you'd like to shop. Pick the location most convenient for you.",
        },
        {
            icon: <FaShoppingCart size={48} className="text-green-500" />,
            title: "Add Products to Basket",
            description: "Browse our product selection and add your favorite items to your basket.",
        },
        {
            icon: <FaCashRegister size={48} className="text-yellow-500" />,
            title: "Proceed to Checkout",
            description: "Review your basket and proceed to the checkout to confirm your order.",
        },
        {
            icon: <FaBoxOpen size={48} className="text-purple-500" />,
            title: "Pickup at the Store",
            description: "Once your order is ready, pick it up at the store you selected. Payment will be made at the store.",
        },
        {
            icon: <FaSmile size={48} className="text-pink-500" />,
            title: "Thank You!",
            description: "Thank you for choosing us! We look forward to serving you again.",
        },
    ];

    return (
        <div className="py-12 bg-gray-100">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="mb-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
