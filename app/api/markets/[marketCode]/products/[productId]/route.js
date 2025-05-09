import { NextResponse } from "next/server";
import { getDataFromFile, saveDataToFile } from "@/services/dataService";

export async function DELETE(request, { params }) {
  try {
    const { marketCode, productId } = params;

    let markets = await getDataFromFile("market");
    const market = markets.find((market) => market.id == marketCode);

    if (!market) {
      return NextResponse.json(
        { message: "Market not found" },
        { status: 404 }
      );
    }

    const productIndex = market.products.findIndex(
      (product) => product.id == productId
    );

    if (productIndex === -1) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    market.products.splice(productIndex, 1);
    await saveDataToFile("market", markets);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting product", error: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  try {
    const { marketCode, productId } = await params;
    const { name, quantity, expireDate, normalPrice, salePrice, image } =
      await request.json();

    console.log(name, quantity, expireDate, normalPrice, salePrice);
    let markets = await getDataFromFile("market");
    const market = markets.find((market) => market.id == marketCode);

    if (!market) {
      return NextResponse.json(
        { message: "Market not found" },
        { status: 404 }
      );
    }
    const product = market.products.find((p) => p.id == productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (name) product.name = name;
    if (quantity) product.quantity = quantity;
    if (expireDate) product.expireDate = expireDate;
    if (normalPrice) product.normalPrice = normalPrice;
    if (salePrice) product.salePrice = salePrice;
    if (image) product.image = image;

    console.log(product);
    await saveDataToFile("market", markets);
    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating product", err },
      { status: 500 }
    );
  }
}
