"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { useContent } from "@/context/ContentContext";

export default function ProductWrapper() {
    const { selectedMarket } = useContent();
    const products = [
        { name: "Сирене Саяна", quantity: 5, expiryDate: "27.12.2024" },
        { name: "Кашкавал Балкан", quantity: 10, expiryDate: "15.01.2025" },
        { name: "Масло President", quantity: 3, expiryDate: "10.03.2025" },
    ];

    return (
        <section className="flex flex-col md:flex-row p-8 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900">
            <div className="w-full md:w-2/3 lg:w-3/4 bg-white p-8 rounded-lg shadow-lg min-h-96">
                <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Selected Market</h2>
                {selectedMarket ? (
                    <div className="">
                        <p className="text-lg text-gray-700 text-center mb-9">
                            You have selected: <span className="font-semibold">{selectedMarket}</span>
                        </p>
                        <div className="flex gap-2">
                            {products &&
                                products.map((product, index) => {
                                    return <ProductCard key={index} product={product} />;
                                })}
                        </div>
                    </div>
                ) : (
                    <p className="text-lg text-gray-700">Please select a region, town, and market.</p>
                )}
            </div>
        </section>
    );
}
