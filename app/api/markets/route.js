import { getDataFromFile } from "@/services/dataService";
import { NextResponse } from "next/server";

export async function GET() {
        try {
          const markets = await getDataFromFile("market");
          return NextResponse.json(markets);
        } catch (error) {
            return NextResponse.json({ error: "Error fetching markets"});
        }
}

