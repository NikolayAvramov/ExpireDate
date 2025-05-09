"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useContent } from "./ContentContext";

const AuthContext = createContext();

const COOKIE_USER = "user";
const COOKIE_MARKET = "market";

function getUserFromCookie() {
  const cookie = Cookies.get(COOKIE_USER);
  if (!cookie) return null;

  try {
    return JSON.parse(cookie);
  } catch {
    Cookies.remove(COOKIE_USER);
    return null;
  }
}

function getMarketFromCookie() {
  const cookie = Cookies.get(COOKIE_MARKET);
  if (!cookie) return null;

  try {
    return JSON.parse(cookie);
  } catch {
    Cookies.remove(COOKIE_MARKET);
    return null;
  }
}

export function AuthProvider({ children }) {
  const { setSelectedMarketId } = useContent();
  const [userType, setUserType] = useState("");
  const [authStatus, setAuthStatus] = useState({
    authenticated: false,
    type: null,
  });

  // 🧠 Initial auth check from cookies
  useEffect(() => {
    const user = getUserFromCookie();
    const market = getMarketFromCookie();

    if (user?.token) {
      setAuthStatus({ authenticated: true, type: "user" });
    } else if (market?.id) {
      setAuthStatus({ authenticated: true, type: "market" });
      setSelectedMarketId(market.id);
    }
  }, [setSelectedMarketId]);

  const onRegister = async (data) => {
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration failed");

      Cookies.set(
        COOKIE_USER,
        JSON.stringify({ id: result.newUser.id, token: result.token }),
        {
          secure: true,
          sameSite: "None",
        }
      );

      setAuthStatus({ authenticated: true, type: "user" });
      return result;
    } catch (err) {
      throw new Error(err.message || "Registration error");
    }
  };

  const onLogin = async (data) => {
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");

      Cookies.set(
        COOKIE_USER,
        JSON.stringify({ id: result.userId || result.id, token: result.token }),
        {
          secure: true,
          sameSite: "None",
        }
      );

      setAuthStatus({ authenticated: true, type: "user" });
      return result;
    } catch (err) {
      throw new Error(err.message || "Login error");
    }
  };

  const onMarketLogin = async ({ marketCode, password }) => {
    try {
      const res = await fetch(`api/markets/${marketCode}`);
      if (!res.ok) throw new Error("Invalid market code");
      const market = await res.json();
      if (market.password !== password)
        throw new Error("Invalid market credentials");

      Cookies.set(COOKIE_MARKET, JSON.stringify({ id: market.id }), {
        secure: true,
        sameSite: "None",
      });

      setSelectedMarketId(market.id);
      setAuthStatus({ authenticated: true, type: "market" });
    } catch (err) {
      console.error("Market login failed:", err.message);
      throw err;
    }
  };

  const onLogout = () => {
    Cookies.remove(COOKIE_USER);
    Cookies.remove(COOKIE_MARKET);
    setSelectedMarketId("");
    setAuthStatus({ authenticated: false, type: null });
  };

  return (
    <AuthContext.Provider
      value={{
        onRegister,
        onLogin,
        onLogout,
        onMarketLogin,
        userType,
        setUserType,
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
