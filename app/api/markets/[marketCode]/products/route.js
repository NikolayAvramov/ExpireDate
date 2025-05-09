import { NextResponse } from "next/server";
import { getDataFromFile, saveDataToFile } from "@/services/dataService";
import idGenerator from "@/services/idGenerator";

export async function POST(request, { params }) {
  try {
    // Read the products array from the request body
    const products = await request.json(); 

    // Validate the products array
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: "Invalid product data" }, { status: 400 });
    }

    // Extract marketCode from params
    const {marketCode}  = await params;

    // Fetch markets data
    const markets = await getDataFromFile("market");

    // Find the market corresponding to the provided marketCode
    const market = markets.find((m) => m.id == marketCode);
console.log(market,marketCode)
    if (!market) {
      return NextResponse.json({ message: "Market not found" }, { status: 404 });
    }

    // Process the incoming products
    const processedProducts = products.map((newProduct) => {
      const existingProduct = market.products.find(
        (product) =>
          product.name.toLowerCase() === newProduct["Product Name"].toLowerCase()
      );

      if (existingProduct) {
        // If the product exists, update its quantity
        existingProduct.quantity += newProduct.Quantity;
        return existingProduct;
      } else {
        // If the product doesn't exist, create a new product
        const newProductData = {
          id: idGenerator(),
          name: newProduct["Product Name"],
          quantity: newProduct["Quantity"],
          expireDate: newProduct["Expiry Date"],
          normalPrice: newProduct["Regular Price"],
          salePrice: newProduct["Sale Price"],
          placeAtStore: newProduct["Place at Store"],
        };

        // Add the new product to the market
        market.products.push(newProductData);
        return newProductData;
      }
    });

    // Save the updated market data to the file
    await saveDataToFile("market", markets);

    // Return the response
    return NextResponse.json(
      {
        message: "Products added/updated successfully",
        products: processedProducts,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding products:", error);
    return NextResponse.json({ message: "Error adding products", error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const {marketCode} = await params
    const markets = await getDataFromFile("market");
    const market = markets.find((market) => market.id == marketCode);

    if (!market) {
      return NextResponse.json({ message: "Market not found" }, { status: 404 });
    }

    return NextResponse.json(market.products || []);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching market", error: error.message }, { status: 500 });
  }
}