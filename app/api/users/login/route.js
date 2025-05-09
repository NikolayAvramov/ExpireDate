import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDataFromFile } from "@/services/dataService";

const JWT_SECRET = process.env.JWT_SECRET;


// задължително трябва да експортираш POST функция
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    let users = await getDataFromFile("user");

    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    return NextResponse.json({ token, userId: user.id }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
