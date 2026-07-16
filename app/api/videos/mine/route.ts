import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import Video from "@/Models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const videos = await Video.find({ email: session.user.email }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(videos || [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user's videos" }, { status: 500 });
  }
}
