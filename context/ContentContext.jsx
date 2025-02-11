"use client";

import { createContext, useContext, useState } from "react";

const host = "https://parseapi.back4app.com";
const apiKey = "wmNzTAwfnvjXEhlKm7YYkxzHZFFtozx4nwp30sgy";
const appId = "52CoxAbfqOllkJMTMM6q7AZbGhB0vVP5lqt2eJdP";

const ContentContext = createContext();

export function ContentProvider({ children }) {
    const [allRegions, setAllRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [allTowns, setAllTowns] = useState([]);
    const [selectedTown, setSelectedTown] = useState("");
    const [allMarkets, setAllMarkets] = useState([]); // Initialize allMarkets as an empty array
    const [selectedMarket, setSelectedMarket] = useState("");

    function setInitialRegions(data) {
        const regions = [];
        data.map(market => regions.push(market.region));
        const uniqRegions = Array.from(new Set(regions)); // Use Array.from for uniqueness
        setAllRegions(uniqRegions);

        // Set allMarkets if needed
        setAllMarkets(data); // Populate allMarkets with fetched market data
    }

    async function getMarkets() {
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
                return [];
            }

            const result = await response.json();
            return result.results; // Return the list of markets
        } catch (error) {
            console.error("Fetch error:", error);
            return [];
        }
    }

    return (
        <ContentContext.Provider
            value={{
                allRegions,
                allMarkets, // Provide allMarkets here
                selectedRegion,
                setSelectedRegion,
                selectedTown,
                setSelectedTown,
                selectedMarket,
                setSelectedMarket,
                getMarkets,
                setInitialRegions,
            }}
        >
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    return useContext(ContentContext);
}
