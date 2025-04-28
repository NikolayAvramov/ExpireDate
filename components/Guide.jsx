"use client";

import { motion } from "framer-motion";
import { FaStore, FaShoppingCart, FaCashRegister, FaBoxOpen, FaSmile } from "react-icons/fa";

export default function Guide() {
    const steps = [
        {
            icon: <FaStore size={40} className="text-blue-600" />,
            title: "Select Your Store",
            description: "Browse and choose the store where you'd like to shop. Pick the location most convenient for you.",
        },
        {
            icon: <FaShoppingCart size={40} className="text-green-500" />,
            title: "Add Products to Basket",
            description: "Browse our product selection and add your favorite items to your basket.",
        },
        {
            icon: <FaCashRegister size={40} className="text-yellow-500" />,
            title: "Proceed to Checkout",
            description: "Review your basket and proceed to the checkout to confirm your order.",
        },
        {
            icon: <FaBoxOpen size={40} className="text-purple-500" />,
            title: "Pickup at the Store",
            description: "Once your order is ready, pick it up at the store you selected. Payment will be made at the store.",
        },
        {
            icon: <FaSmile size={40} className="text-pink-500" />,
            title: "Thank You!",
            description: "Thank you for choosing us! We look forward to serving you again.",
        },
    ];

    return (
        <div className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A simple and straightforward process to get your favorite products
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="h-full bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                            </div>
                            
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 right-0 w-4 h-0.5 bg-gray-200 transform -translate-y-1/2 translate-x-full">
                                    <motion.div
                                        className="h-full bg-blue-500"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                        viewport={{ once: true }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
