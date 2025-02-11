"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";

import { useAuth } from "@/context/AuthContect";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

const Header = () => {
    const { onLogout, userType, setUserType } = useAuth();

    useGSAP(() => {
        gsap.from(".nav-item", {
            opacity: 0,
            y: -20,
            stagger: 0.2,
            duration: 1,
        });
    }, []);

    return (
        <header className="bg-blue-600 p-4 ">
            <nav className="flex justify-between items-center">
                <div className="logo text-white text-2xl font-bold">
                    <Link href="#">MyLogo</Link>
                </div>
                <ul className="flex space-x-6">
                    <li className="nav-item text-white text-lg">
                        <Link href="/">Home</Link>
                    </li>
                    <li className="nav-item text-white text-lg">
                        <Link href="/products">Products</Link>
                    </li>
                    {userType === "market" && (
                        <li className="nav-item text-white text-lg">
                            <Link href="/uploadProduct">Upload Product</Link>
                        </li>
                    )}
                    {userType === "user" && (
                        <li className="nav-item text-white text-lg">
                            <Link href="/basket">Basket</Link>
                        </li>
                    )}

                    {userType ? (
                        <li className="nav-item text-white text-lg">
                            <Link
                                href="/"
                                onClick={() => {
                                    onLogout();
                                    setUserType("");
                                }}
                            >
                                Logout
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li className="nav-item text-white text-lg">
                                <Link href="/login">Sign In</Link>
                            </li>
                            <li className="nav-item text-white text-lg">
                                <Link href="/signup">Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
