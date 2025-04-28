"use client";

import Filter from "@/components/Filter";
import ProductWrapper from "@/components/ProductWrapper";
import { useContent } from "@/context/ContentContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Products() {
  const { fetchMarkets, selectedMarketId, setSelectedMarketId } = useContent();

  useEffect(() => {
    const lastSelectedMarket = localStorage.getItem('lastSelectedMarket');
    if (lastSelectedMarket) {
      setSelectedMarketId(lastSelectedMarket);
    }
  }, [setSelectedMarketId]);


  useEffect(() => {
    if (selectedMarketId) {
      localStorage.setItem('lastSelectedMarket', selectedMarketId);
    }
  }, [selectedMarketId]);

  const {
    isLoading,
    isError,
    error,
    data: markets,
  } = useQuery({
    queryFn: fetchMarkets,
    queryKey: ["markets"],
  });

 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-600 mb-4">Error: {error.message}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!markets?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">No markets available</div>
      </div>
    );
  }

  return (
    <div className="flex bg-white w-full min-h-screen">
      <Filter />
      <div className="w-full p-4">
        <ProductWrapper />
      </div>
    </div>
  );
}
