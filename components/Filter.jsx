"use client";
import { useContent } from "@/context/ContentContext";
import React, { useState, useEffect } from "react";

const Filter = () => {
  const { allMarkets, allRegions, selectedMarketId, setSelectedMarketId } =
    useContent();

  // 🔹 Default states for Region and Town (empty to make it initially open)
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedTownValue, setSelectedTownValue] = useState("");

  // 🔹 Reset the filter states to the initial state
  useEffect(() => {
    // Reset town and market whenever the region changes
    setSelectedTownValue(""); // Reset the selected town when the region changes
    setSelectedMarketId(""); // Reset selected market when town changes
  }, [selectedRegion, setSelectedMarketId]);

  // 🔹 Filter towns dynamically based on selected region
  const filteredTowns = selectedRegion
    ? [
        ...new Set(
          allMarkets
            .filter((m) => m.region === selectedRegion)
            .map((m) => m.town)
        ),
      ]
    : [];

  // 🔹 Filter markets dynamically based on selected town
  const filteredMarkets = selectedTownValue
    ? allMarkets.filter((m) => m.town === selectedTownValue)
    : [];

  return (
    <div className="w-24 md:w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0 ">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Filter Options</h2>

      <div className="space-y-6 text-black">
        {/* Region Select */}
        <select
          id="region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400 text-sm p-2"
        >
          <option value="">-- Select Region --</option>
          {allRegions &&
            allRegions.map((region, index) => (
              <option key={region + index} value={region}>
                {region}
              </option>
            ))}
        </select>

        {/* Town Select */}
        {selectedRegion && (
          <select
            id="town"
            value={selectedTownValue}
            onChange={(e) => {
              setSelectedTownValue(e.target.value);
              // setSelectedTown(e.target.value); // Update context when town is selected
            }}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400 text-sm p-2"
          >
            <option value="">-- Select Town --</option>
            {filteredTowns &&
              filteredTowns.map((town, index) => (
                <option key={town + index} value={town}>
                  {town}
                </option>
              ))}
          </select>
        )}

        {/* Market Select */}
        {selectedTownValue && (
          <select
            id="market"
            value={selectedMarketId || ""}
            onChange={(e) => setSelectedMarketId(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400 text-sm p-2"
          >
            <option value="">-- Select Market --</option>
            {filteredMarkets.map((market) => (
              <option key={market.id} value={market.id}>
                {market.marketName} {market.address}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default Filter;
