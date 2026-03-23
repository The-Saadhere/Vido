import { NextRequest,NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/Models/User";
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
try {
    const { email, password } = await request.json();
    if(!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword });
await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
} catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "An error occurred while registering the user" }, { status: 500 });
}
}
