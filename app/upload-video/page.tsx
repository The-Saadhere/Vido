"use client";
import FileUpload from "@/app/components/FileUpload";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { IVideo } from "@/Models/Video";
import { apiClient } from "@/lib/api-client";
import { Image, ImageKitProvider, Video } from "@imagekit/next";
import { signOut } from "next-auth/react";
import { Play, Clock, LogOut, X } from "lucide-react";

const url: string = process.env.NEXT_PUBLIC_URL_ENDPOINT!

export default function UploadVideo() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<IVideo | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      signIn();
      return;
    }

    const fetchVideos = async () => {
      try {
        const data = await apiClient.getMyVideos();
        setVideos(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") fetchVideos();
  }, [status]);

  return (
    <ImageKitProvider urlEndpoint={url}>
      <div className="min-h-screen bg-[#fafafa] pt-16">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#999] uppercase mb-3">
                Studio
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#111]">
                Upload
              </h1>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm font-medium text-[#999] hover:text-[#111] transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">

            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-medium uppercase tracking-wider text-[#999]">
                  Your videos
                </p>
                <span className="text-xs text-[#ccc]">
                  {videos.length} total
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="aspect-video rounded-2xl bg-[#eee] animate-pulse" />
                      <div className="h-3.5 w-3/4 rounded-full bg-[#eee] animate-pulse" />
                      <div className="h-3 w-1/2 rounded-full bg-[#eee] animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-3xl bg-white shadow-[0_0_0_1px_#e8e8e8]">
                  <Play className="w-8 h-8 text-[#ccc] mb-3" />
                  <p className="text-sm text-[#999]">No videos yet</p>
                  <p className="text-xs text-[#ccc] mt-1">Upload your first video</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                        <p className="text-sm font-medium text-[#111] truncate">
                          {video.title ?? "Untitled"}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {video.description && (
                            <p className="text-xs text-[#999] truncate">
                              {video.description}
                            </p>
                          )}
                          {video.createdAt && (
                            <span className="flex items-center gap-1 text-[11px] text-[#ccc] flex-shrink-0">
                              <Clock className="w-3 h-3" />
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

            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-medium uppercase tracking-wider text-[#999] mb-5">
                New upload
              </p>
              <FileUpload />
            </div>

          </div>
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
                {activeVideo.createdAt && (
                  <span className="flex items-center gap-1 text-xs text-white/30 mt-2">
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
