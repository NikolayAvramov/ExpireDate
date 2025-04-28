"use client";
import Image from "next/image";
import { useContent } from "@/context/ContentContext";

const ProductCard = ({ product }) => {
  const { addToBasket } = useContent();
  const { id, name, quantity, expiryDate, image, normalPrice, salePrice } =
    product;

  // 🔹 Dynamically construct the image path based on product name
  const generateImagePath = (productName) => {
    const imageName = productName
      .toLowerCase()
      .replace(/[^a-zа-я0-9]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, ""); // Remove spaces

    return `/assets/${imageName}.jpeg`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 w-full">
      {/* 🔹 Product Image */}
      <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
        <Image
          src={generateImagePath(name)}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          unoptimized
          onError={() => console.log(`Image not found for ${name}`)} // Log missing images
        />
      </div>

      {/* 🔹 Product Info */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>

      {/* 🔹 Prices */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {salePrice < normalPrice ? (
          <>
            <span className="text-xl font-bold text-red-600">${salePrice}</span>
            <span className="text-gray-500 line-through">${normalPrice}</span>
          </>
        ) : (
          <span className="text-xl font-bold text-gray-800">
            ${normalPrice}
          </span>
        )}
      </div>

      {/* 🔹 Quantity */}
      <p className="text-gray-600">
        Quantity: <span className="font-medium">{quantity}</span>
      </p>
      <p className="text-gray-600">
        Expiry Date: <span className="font-medium">{expiryDate}</span>
      </p>

      {/* 🔹 Add to Basket Button */}
      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
        onClick={() => addToBasket(product)}
        disabled={quantity === 0}
      >
        {quantity > 0 ? "Add to Bag" : "Out of Stock"}
      </button>
    </div>
  );
};

export default ProductCard;
