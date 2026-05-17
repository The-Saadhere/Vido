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
      <div
        className="min-h-screen bg-[#0a0a0a] text-white pt-14"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {/* Grid bg */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 py-10">

          {/* Page header */}
          <div className="mb-8">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase mb-2">
              Discover
            </p>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tighter text-white"
              style={{ letterSpacing: "-0.04em" }}
            >
              Videos
            </h1>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="aspect-video rounded-xl bg-white/[0.04] animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-white/[0.04] animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-white/[0.04] animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && videos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-2xl">
              <Play className="w-10 h-10 text-white/10 mb-4" />
              <p className="text-sm text-white/20">No videos yet</p>
            </div>
          )}

          {/* Video grid */}
          {!loading && videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video, i) => (
                <div
                  key={(video as any)._id ?? i}
                  className="group cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06] group-hover:border-white/20 transition-all">
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title ?? "video"}
                        height={400}
                        width={700}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white/15" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-200">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-2.5 px-0.5">
                    <p className="text-sm font-semibold text-white/90 truncate leading-snug">
                      {video.title ?? "Untitled"}
                    </p>
                    {video.description && (
                      <p className="text-xs text-white/35 mt-0.5 truncate font-mono">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-10 right-0 flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" /> Close
              </button>

              {/* Video player */}
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-black aspect-video">
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

              {/* Info */}
              <div className="mt-4">
                <h2
                  className="text-xl font-black text-white tracking-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {activeVideo.title ?? "Untitled"}
                </h2>
                {activeVideo.description && (
                  <p className="text-sm text-white/40 mt-1 font-mono">
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