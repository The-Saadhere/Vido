"use client";
import { useEffect, useState } from "react";
import { IVideo } from "@/Models/Video";
import { apiClient } from "@/lib/api-client";
import { ImageKitProvider, Image, Video } from "@imagekit/next";
import { Play, X } from "lucide-react";

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_URL_ENDPOINT

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<IVideo | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <ImageKitProvider urlEndpoint={IMAGEKIT_URL}>
      <div className="min-h-screen bg-[#fafafa] pt-16">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12">

          <div className="mb-10">
            <p className="text-xs font-medium tracking-wide text-[#999] uppercase mb-3">
              Discover
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#111]">
              Videos
            </h1>
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-video rounded-2xl bg-[#eee] animate-pulse" />
                  <div className="h-3.5 w-3/4 rounded-full bg-[#eee] animate-pulse" />
                  <div className="h-3 w-1/2 rounded-full bg-[#eee] animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {!loading && videos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 rounded-3xl bg-white shadow-[0_0_0_1px_#e8e8e8]">
              <Play className="w-10 h-10 text-[#ccc] mb-4" />
              <p className="text-sm text-[#999]">No videos yet</p>
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video, i) => (
                <div
                  key={(video as any)._id ?? i}
                  className="group cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#f0f0f0] shadow-[0_0_0_1px_#e8e8e8] group-hover:shadow-[0_0_0_1px_#d0d0d0,0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title ?? "video"}
                        height={400}
                        width={700}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-[#ccc]" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 px-1">
                    <p className="text-sm font-medium text-[#111] truncate leading-snug">
                      {video.title ?? "Untitled"}
                    </p>
                    {video.description && (
                      <p className="text-xs text-[#999] mt-1 truncate">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl">
                {activeVideo.videoUrl ? (
                  <Video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                    No video source
                  </div>
                )}
              </div>

              <div className="mt-5">
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  {activeVideo.title ?? "Untitled"}
                </h2>
                {activeVideo.description && (
                  <p className="text-sm text-white/50 mt-1.5">
                    {activeVideo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
}
