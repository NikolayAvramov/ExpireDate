"use client";
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const host = "https://parseapi.back4app.com";
const apiKey = "wmNzTAwfnvjXEhlKm7YYkxzHZFFtozx4nwp30sgy";
const appId = "52CoxAbfqOllkJMTMM6q7AZbGhB0vVP5lqt2eJdP";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userType, setUserType] = useState("");
    const [products, setProducts] = useState("");

    async function onRegister(data) {
        const response = await fetch(host + "/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": appId,
                "X-Parse-REST-API-Key": apiKey,
                "X-Parse-Revocable-Session": 1,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to register user");
        }

        const user = await response.json();
        setUserType("user");
        Cookies.set(
            "user",
            JSON.stringify({
                id: user.objectId,
                token: user.sessionToken,
            }),
            { secure: true, sameSite: "None" }
        );

        return user;
    }

    async function onLogin(data) {
        const response = await fetch(host + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": appId,
                "X-Parse-REST-API-Key": apiKey,
                "X-Parse-Revocable-Session": 1,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to login user");
        }

        const user = await response.json();
        setUserType("user");
        Cookies.set(
            "user",
            JSON.stringify({
                id: user.objectId,
                token: user.sessionToken,
            }),
            { secure: true, sameSite: "None" }
        );
        setProducts([1, 2, 3, 5]);
        return user;
    }

    async function onMarketLogin(data) {
        const id = data.marketCode;
        const pass = Number(data.password);

        try {
            const response = await fetch(`${host}/classes/markets`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": appId,
                    "X-Parse-REST-API-Key": apiKey,
                    "X-Parse-Revocable-Session": "1",
                },
            });

            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                return;
            }

            const result = await response.json();
            let finded = result.results.filter(market => {
                return market.objectId === id && market.password === pass;
            });

            if (finded.length === 1) {
                setUserType("market");
                Cookies.set(
                    "market",
                    JSON.stringify({
                        id: finded[0].objectId,
                    }),
                    { secure: true, sameSite: "None" }
                );
            }

            console.log("Market data:", finded);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    function onLogout() {
        Cookies.remove("user");
        Cookies.remove("market");
        setUserType(""); // Reset the userType
    }

    return (
        <AuthContext.Provider value={{ products, onRegister, onLogin, onLogout, onMarketLogin, userType, setUserType }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
