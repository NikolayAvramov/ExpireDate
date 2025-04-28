import { useContent } from "@/context/ContentContext";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";

export default function ProductWrapper() {
  const { getOneMarket, selectedMarketId } = useContent();
  const {
    isLoading,
    isError,
    error,
    data: selectedMarket,
  } = useQuery({
    queryKey: ["selectedMarket", selectedMarketId], // queryKey as part of the object
    queryFn: () => getOneMarket(selectedMarketId), // queryFn as part of the object
    enabled: !!selectedMarketId, // Query will only run when selectedMarketId is available
  });

  if (isLoading) {
    return (
      <section className="flex flex-col items-center p-8 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900">
        <div className="w-full bg-white p-8 rounded-lg shadow-lg min-h-96">
          <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
            Loading Market...
          </h2>
          <p className="text-center text-gray-700">
            Please wait while we fetch the selected market.
          </p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col items-center p-8 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900">
        <div className="w-full bg-white p-8 rounded-lg shadow-lg min-h-96">
          <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">
            Error
          </h2>
          <p className="text-center text-gray-700">
            There was an error fetching the market: {error.message}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center p-8 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900">
      <div className="w-full bg-white p-8 rounded-lg shadow-lg min-h-96">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          Selected Market
        </h2>
        {selectedMarket ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-9">
              You have selected:{" "}
              <span className="font-semibold">{`${selectedMarket.marketName}, ${selectedMarket.town}, ${selectedMarket.address}`}</span>
            </p>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-center">
              {selectedMarket.products && selectedMarket.products.length > 0 ? (
                selectedMarket.products.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    className="flex justify-center items-center"
                  />
                ))
              ) : (
                <p className="text-lg text-gray-700">
                  No products available for this market.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            Please select a region, town, and market.
          </p>
        )}
      </div>
    </section>
  );
}
