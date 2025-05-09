import { NextResponse } from "next/server";
import { getDataFromFile } from "@/services/dataService";

export async function GET(request, { params }) {
  const { marketCode } = await  params;
  try{
     const markets = await getDataFromFile("market");
  const market = markets.find((market) => market.id == marketCode);
  if (!market) {
    return NextResponse.json({ message: "Market not found" }, { status: 404 });
  }
  return NextResponse.json(market)  
  }catch(error){
    return NextResponse.json({ message: "Error fetching market", error }, { status: 500 });
  }
 

}
