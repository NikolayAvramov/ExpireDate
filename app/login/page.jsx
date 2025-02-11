"use client";
import { useState } from "react";

import MarketLogin from "@/components/MarketLogin";
import UserLogin from "@/components/UserLogin";

export default function LoginPage() {
    const [loginType, setLoginType] = useState("user"); // "user" or "market"

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-center text-blue-600">Welcome Back</h1>
                <p className="text-center text-gray-600">Please login to your account</p>

                {/* Login Type Toggle */}
                <div className="flex justify-center space-x-4">
                    <button
                        className={`px-4 py-2 font-medium rounded-full shadow-md transition-all ${
                            loginType === "user"
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => setLoginType("user")}
                    >
                        User
                    </button>
                    <button
                        className={`px-4 py-2 font-medium rounded-full shadow-md transition-all ${
                            loginType === "market"
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => setLoginType("market")}
                    >
                        Market
                    </button>
                </div>

                <div>
                    {loginType === "user" && <UserLogin />}

                    {loginType === "market" && <MarketLogin />}
                </div>
            </div>
        </div>
    );
}
