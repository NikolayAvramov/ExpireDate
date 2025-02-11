"use client";

import Filter from "@/components/Filter";
import ProductWrapper from "@/components/ProductWrapper";
import { useContent } from "@/context/ContentContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Products() {
    const { getMarkets, setInitialRegions, allMarkets } = useContent(); // Access allMarkets here

    const {
        data: markets,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryFn: getMarkets,
        queryKey: ["markets"],
    });

    // Ensure that we only set regions once the markets are fetched
    useEffect(() => {
        if (markets && markets.length > 0 && allMarkets.length === 0) {
            setInitialRegions(markets); // Set regions once the data is available
        }
    }, [markets, allMarkets, setInitialRegions]);

    // Handle loading state
    if (isLoading) {
        return <div>Loading markets...</div>;
    }

    // Handle error state
    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    // Handle when allMarkets is undefined or empty
    if (!allMarkets || allMarkets.length === 0) {
        return <div>No markets available</div>;
    }

    return (
        <div className="flex bg-white">
            <Filter />
            <div className="w-[100%]">
                <ProductWrapper />
            </div>
        </div>
    );
}
