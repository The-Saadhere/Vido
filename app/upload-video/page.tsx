"use client";
import FileUpload from "@/app/components/FileUpload";
import { useEffect, useState } from "react";
import { IVideo } from "@/Models/Video";
import { apiClient } from "@/lib/api-client";
import { Image } from '@imagekit/next';
import { signOut } from "next-auth/react";
import { Play, Clock, Eye, LogOut } from "lucide-react";

export default function UploadVideo() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

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
                  <div
                    key={i}
                    className="aspect-video rounded-xl bg-white/[0.04] animate-pulse"
                  />
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
                    className="group relative aspect-video rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
                  >
                    {video.videoUrl ? (
                      <Image
                        path={video.videoUrl}
                        alt={video.title ?? "video"}
                        transformation={[{ height: "300", width: "530" }]}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white/20" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                      <p className="text-xs font-semibold text-white truncate">
                        {video.title ?? "Untitled"}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {video.createdAt && (
                          <span className="flex items-center gap-1 text-[10px] text-white/50 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(video.createdAt as string).toLocaleDateString()}
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
    </div>
  );
}