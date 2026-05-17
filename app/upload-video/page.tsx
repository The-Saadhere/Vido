"use client";
import FileUpload from "@/app/components/FileUpload";
import { useEffect, useState } from "react";
import { IVideo } from "@/Models/Video";
import { apiClient } from "@/lib/api-client";
import { Image, ImageKitProvider, Video } from "@imagekit/next";
import { signOut } from "next-auth/react";
import { Play, Clock, LogOut, X } from "lucide-react";

const url:string =process.env.NEXT_PUBLIC_URL_ENDPOINT!

export default function UploadVideo() {
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
    <ImageKitProvider urlEndpoint={url}>
      <div
        className="min-h-screen bg-[#0a0a0a] text-white pt-14"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {/* Subtle grid bg */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 py-10">

          {/* Page header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase mb-2">
                Studio
              </p>
              <h1
                className="text-3xl sm:text-4xl font-black tracking-tighter text-white"
                style={{ letterSpacing: "-0.04em" }}
              >
                Upload
              </h1>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-xs font-semibold text-white/30 hover:text-white/70 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* Videos grid — left */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Your videos
                </p>
                <span className="text-[11px] font-mono text-white/20">
                  {videos.length} total
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="aspect-video rounded-xl bg-white/[0.04] animate-pulse" />
                      <div className="h-3 w-3/4 rounded bg-white/[0.04] animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-white/[0.04] animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl">
                  <Play className="w-8 h-8 text-white/10 mb-3" />
                  <p className="text-sm text-white/20">No videos yet</p>
                  <p className="text-xs text-white/10 mt-1">Upload your first video →</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-200">
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="mt-2 px-0.5">
                        <p className="text-sm font-semibold text-white/90 truncate">
                          {video.title ?? "Untitled"}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {video.description && (
                            <p className="text-xs text-white/35 truncate font-mono">
                              {video.description}
                            </p>
                          )}
                          {video.createdAt && (
                            <span className="flex items-center gap-1 text-[10px] text-white/25 font-mono flex-shrink-0">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(video.createdAt as unknown as string).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload panel — right */}
            <div className="lg:sticky lg:top-20">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
                New upload
              </p>
              <FileUpload />
            </div>

          </div>
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
              {/* Close button */}
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

              {/* Video info */}
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
                {activeVideo.createdAt && (
                  <span className="flex items-center gap-1 text-[10px] text-white/20 font-mono mt-2">
                    <Clock className="w-3 h-3" />
                    {new Date(activeVideo.createdAt as unknown as string).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
}