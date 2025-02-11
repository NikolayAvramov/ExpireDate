"use client";

import { useContent } from "@/context/ContentContext";
import React, { useEffect, useState } from "react";

const Filter = () => {
    const {
        allMarkets,
        allRegions,
        selectedRegion,
        selectedTown,
        selectedMarket,
        setSelectedRegion,
        setSelectedTown,
        setSelectedMarket,
    } = useContent();

    const [filteredTowns, setFilteredTowns] = useState([]);
    const [filteredMarkets, setFilteredMarkets] = useState([]);

    // When the region changes, filter the towns
    useEffect(() => {
        if (selectedRegion) {
            const townsInRegion = allMarkets.filter(market => market.region === selectedRegion).map(market => market.town);
            setFilteredTowns([...new Set(townsInRegion)]); // Remove duplicates
            setSelectedTown(""); // Reset town when region changes
        }
    }, [selectedRegion, allMarkets, setSelectedTown]);

    // When the town changes, filter the markets
    useEffect(() => {
        if (selectedTown) {
            const marketsInTown = allMarkets.filter(market => market.town === selectedTown);
            setFilteredMarkets(marketsInTown);
            setSelectedMarket(""); // Reset market when town changes
        }
    }, [selectedTown, allMarkets, setSelectedMarket]);

    return (
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold mb-6 text-green-600">Filter Options</h2>

            <div className="space-y-6 text-black">
                {/* Region Select */}
                <div>
                    <label htmlFor="region" className="block text-base font-medium text-gray-700 mb-1">
                        Select Region:
                    </label>
                    <select
                        id="region"
                        value={selectedRegion}
                        onChange={e => setSelectedRegion(e.target.value)}
                        className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400 text-sm p-2"
                    >
                        <option value="">-- Select Region --</option>
                        {allRegions &&
                            allRegions.map(region => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Town Select */}
                {selectedRegion && (
                    <div>
                        <label htmlFor="town" className="block text-base font-medium text-gray-700 mb-1">
                            Select Town:
                        </label>
                        <select
                            id="town"
                            value={selectedTown}
                            onChange={e => setSelectedTown(e.target.value)}
                            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400 text-sm p-2"
                        >
                            <option value="">-- Select Town --</option>
                            {filteredTowns &&
                                filteredTowns.map(town => (
                                    <option key={town} value={town}>
                                        {town}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}

                {/* Market Select */}
                {selectedTown && (
                    <div>
                        <label htmlFor="market" className="block text-base font-medium text-gray-700 mb-1">
                            Select Market:
                        </label>
                        <select
                            id="market"
                            value={selectedMarket}
                            onChange={e => setSelectedMarket(e.target.value)}
                            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400 text-sm p-2"
                        >
                            <option value="">-- Select Market --</option>
                            {filteredMarkets &&
                                filteredMarkets.map(market => (
                                    <option key={market.objectId} value={market.objectId}>
                                        {market.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filter;
