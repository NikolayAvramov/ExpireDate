import { NextResponse } from "next/server";
import { getDataFromFile, saveDataToFile } from "@/services/dataService";
import idGenerator from "@/services/idGenerator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // don't forget to define this in your .env file

export async function POST(request) {
  const { username, firstName, lastName, email, password } = await request.json();

  try {
    let users = await getDataFromFile("user");

    if (!Array.isArray(users)) {
      users = [];
    }

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = idGenerator();

    const newUser = {
      id,
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    users.push(newUser);
    await saveDataToFile("user", users);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return NextResponse.json({
        message: "User registered successfully",
        token,
        newUser: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      }, { status: 201 });
      
    
    
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
