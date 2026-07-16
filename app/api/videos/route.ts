import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import Video, { IVideo } from "@/Models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
try {
    await connectToDatabase();
  const videos = await Video.find({}).sort({createdAt: -1}).lean()
    if (!videos || videos.length === 0){
        return NextResponse.json([], { status: 200 }) 
       }
       return NextResponse.json(videos, { status: 200 });
} catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
}
}

export async function POST(request: Request){
    try {
       const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const body: IVideo = await request.json();
        if(!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl || !body.email){
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }const videoData: IVideo ={
            ...body,
            controls: body.controls ?? true,
            transformations: {
                height: 720,
                width: 1280,
                quality: body.transformations?.quality ?? 100
            }
        }
      const newVideo = await Video.create(videoData);
      return NextResponse.json(newVideo, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
    }
}