"use client";
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { useContent } from "./ContentContext";

const host = "https://refreshapi.onrender.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { setSelectedMarketId } = useContent();
  const [userType, setUserType] = useState("");

  const [authStatus, setAuthStatus] = useState({
    authenticated: false,
    type: null,
  });

  // Register user function
  async function onRegister(data) {
    try {   
      const response = await fetch(host + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user");
      }

      const user = await response.json();

      // Store the JWT token in cookies
      Cookies.set(
        "user",
        JSON.stringify({
          id: user.newUser.id,
          token: user.token,
        }),
        { secure: true, sameSite: "None" }
      );

      setAuthStatus({
        authenticated: true,
        type: "user",
      });

      return user;
    } catch (error) {
      throw new Error(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  }

  // Login user function
  async function onLogin(data) {
    try {
      const response = await fetch(host + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to login user");
      }

      // Store the JWT token in cookies
      Cookies.set(
        "user",
        JSON.stringify({
          id: responseData.userId || responseData.id,
          token: responseData.token,
        }),
        { secure: true, sameSite: "None" }
      );

      setAuthStatus({
        authenticated: true,
        type: "user",
      });

      return responseData;
    } catch (error) {
      throw new Error(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  }

  // Market login function
  async function onMarketLogin(data) {
    const { marketCode, password } = data;

    const response = await fetch(`${host}/markets/${marketCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Market login failed");
      return;
    }

    const marketData = await response.json();
    console.log(marketData);
    if (marketData.password === password) {
      setSelectedMarketId(marketData.id);

      Cookies.set(
        "market",
        JSON.stringify({
          id: marketData.id,
        }),
        { secure: true, sameSite: "None" }
      );

      setAuthStatus({
        authenticated: true,
        type: "market",
      });
    } else {
      console.error("Invalid market credentials");
    }
  }

  // Logout function
  function onLogout() {
    Cookies.remove("user");
    Cookies.remove("market");
    setSelectedMarketId("");

    setAuthStatus({
      authenticated: false,
      type: null,
    });
  }

  // Check if the user is authenticated
  function isAuthenticated() {
    const userCookie = Cookies.get("user");
    const marketCookie = Cookies.get("market");

    try {
      if (userCookie) {
        const user = JSON.parse(userCookie);
        if (!user) {
          Cookies.remove("user");
          return { authenticated: false, type: null };
        }
        return { authenticated: !!user.token, type: "user" };
      }
      if (marketCookie) {
        const market = JSON.parse(marketCookie);
        if (!market || !market.id) {
          console.error('Invalid market cookie data:', market);
          // Clear invalid cookie
          Cookies.remove("market");
          return { authenticated: false, type: null };
        }
        return { authenticated: !!market.id, type: "market" };
      }
    } catch (error) {
      console.error("Error parsing authentication cookies:", error);
      // Clear invalid cookies
      Cookies.remove("user");
      Cookies.remove("market");
    }

    return { authenticated: false, type: null };
  }

  return (
    <AuthContext.Provider
      value={{
        onRegister,
        onLogin,
        onLogout,
        onMarketLogin,
        userType,
        setUserType,
        isAuthenticated,
        authStatus,
        setAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
