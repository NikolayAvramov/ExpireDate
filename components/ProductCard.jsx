"use client";
import Image from "next/image";

const ProductCard = ({ product }) => {
    const { name, quantity, expiryDate } = product;

    // Dynamically construct the image path based on product name
    const imagePath = `/assets/${name?.toLowerCase().replace(/\s+/g, "")}.jpeg`;
    console.log(imagePath);
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 w-72">
            {/* Product Image */}
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                <Image
                    src={imagePath}
                    alt={name || "placeholder"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    onError={e => (e.target.src = "/assets/placeholder.jpg")} // Fallback for missing images
                    unoptimized
                />
            </div>

            {/* Product Details */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
            <p className="text-gray-600">
                Quantity: <span className="font-medium">{quantity}</span>
            </p>
            <p className="text-gray-600">
                Expiry Date: <span className="font-medium">{expiryDate}</span>
            </p>

            {/* Add to Bag Button */}
            <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
                Add to Bag
            </button>
        </div>
    );
};

export default ProductCard;
