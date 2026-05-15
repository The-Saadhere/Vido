"use client";
import FileUpload from "./components/FileUpload";
import { useEffect, useState } from "react";
import { IVideo } from "@/Models/Video";
import { apiClient } from "@/lib/api-client";
import { Image } from "@imagekit/next";
import { signOut } from "next-auth/react";

export default function Home() {

const [videos, setVideos] = useState<IVideo[]>([])

useEffect(()=>{
  const fetchVideos = async () =>{
    try {
      const data = await apiClient.getVideos()
      setVideos(data)
      console.log(data)
    } catch (error) {
 console.error("Error fetching videos:", error) }
  }

  fetchVideos()
},[])

  return (
   <>
    <div className="w-full flex-col h-[90vh] flex items-center justify-center">
      {videos.map((i)=>{
        return(
          <>
          <p>{i.title}</p>
          <p>{i.thumbnailUrl}</p>
          <p>{i.videoUrl}</p>
          <p>{i.description}</p>
          </>
        )
      })}
    </div>
   </>
  );
}
