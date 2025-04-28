"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const OrderSuccessPage = () => {
    const iconRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        // Animation for the icon
        gsap.fromTo(iconRef.current, { scale: 0, rotation: 0 }, { scale: 1, rotation: 360, duration: 1, ease: "back.out(1.7)" });

        // Animation for the text
        gsap.fromTo(textRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 0.5 });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="max-w-lg bg-white shadow-xl rounded-lg p-8 text-center">
                {/* Animated Icon */}
                <div ref={iconRef} className="mb-6">
                    <img src="/assets/celebration.png" alt="Success Icon" className="w-24 h-24 mx-auto" />
                </div>

                {/* Success Text */}
                <div ref={textRef}>
                    <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
                    <p className="text-gray-800 text-lg mb-4">
                        Your products are ready and waiting for you at your selected store.
                    </p>
                    <p className="text-gray-600 mb-6">
                        We’ve sent the details of your order to your email. Please check it for more information.
                    </p>
                </div>

                {/* Button */}
                <button
                    onClick={() => (window.location.href = "/")}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
