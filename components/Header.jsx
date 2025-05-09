"use client";
import gsap from "gsap";
import { useAuth } from "@/context/AuthContect";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { LuShoppingBasket } from "react-icons/lu";
import { useContent } from "@/context/ContentContext";
import { BsCart4 } from "react-icons/bs";

const Header = () => {
  const { onLogout, authStatus, setAuthStatus } = useAuth();
  const { basket } = useContent();

  useGSAP(() => {
    gsap.from(".nav-item", {
      opacity: 0,   
      y: -20,
      stagger: 0.2,
      duration: 1,
    });
  }, []);


  return (
    <header className="bg-blue-600 p-4">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="logo">
          <Link href="/" className="flex items-center space-x-2">
            <BsCart4 className="text-white text-3xl" />
            <span className="text-white text-2xl font-bold hidden sm:block">ReFresh</span>
          </Link>
        </div>
        <ul className="flex items-center space-x-4 sm:space-x-6">
          <li className="nav-item text-white text-lg">
            <Link href="/">Home</Link>
          </li>
          <li className="nav-item text-white text-lg">
            <Link href="/products">Products</Link>
          </li>
          {authStatus.type === "market" && (
            <li className="nav-item text-white text-lg">
              <Link href="/uploadProduct">Upload Product</Link>
            </li>
          )}
          {authStatus.type === "user" && (
            <li className="relative">
              <Link
                href="/basket"
                className="text-white text-2xl relative flex items-center"
              >
                <LuShoppingBasket className="hover:text-gray-300 transition duration-300" />
                {basket.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                    {basket.length}
                  </span>
                )}
              </Link>
            </li>
          )}
          {authStatus.authenticated ? (
            <li className="nav-item text-white text-lg">
              <Link
                href="/"
                onClick={() => {
                  onLogout();
                  setAuthStatus({ authenticated: false, type: null });
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
