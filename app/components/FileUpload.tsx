"use client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Loader2, UploadCloud, FileCheck, X, AlertCircle, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const FileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { data: session } = useSession();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = useRef(new AbortController());

  const authenticator = async () => {
    const response = await fetch("/api/upload-auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  };

  const uploadToBackend = async (uploadResponse: any) => {
    const videoData = await apiClient.createVideo({
      title: title,
      description: description,
      videoUrl: uploadResponse.url,
      thumbnailUrl: `${uploadResponse.url}/ik-thumbnail.jpg`,
      email: session?.user?.email || "",
    })

    console.log("Data:", uploadResponse);
  };

  const allowedTypes = [
    "video/mp4", "video/webm", "video/ogg", "video/avi",
    "video/mpeg", "video/quicktime", "video/x-ms-wmv", "video/x-flv",
  ];
  const maxSizeInBytes = 100 * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) return "Invalid file type. Only video files are allowed.";
    if (file.size > maxSizeInBytes) return "File size exceeds the 100MB limit.";
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    setSuccess(false);
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile) { setError("Please select a file to upload."); return; }
    if (!session?.user?.email) { setError("You must be signed in to upload."); return; }
    setError(null);
    setSuccess(false);

    let authParams;
    try {
      authParams = await authenticator();
    } catch {
      setError("Authentication failed. Please try again.");
      return;
    }

    const { signature, expire, token, publicKey } = authParams;
    abortController.current = new AbortController();

    try {
      setIsUploading(true);
      setProgress(0);
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file: selectedFile,
        fileName: selectedFile.name,
        onProgress: (event) => setProgress((event.loaded / event.total) * 100),
        abortSignal: abortController.current.signal,
      });
      if (uploadResponse) {
        await uploadToBackend(uploadResponse);
        setSuccess(true);
        setProgress(100);
      }
    } catch (err) {
      if (err instanceof ImageKitAbortError) setError("Upload was cancelled.");
      else if (err instanceof ImageKitInvalidRequestError) setError("Invalid request. Please try again.");
      else if (err instanceof ImageKitUploadNetworkError) setError("Network error. Check your connection.");
      else if (err instanceof ImageKitServerError) setError("Server error. Please try again later.");
      else setError("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_0_0_1px_#e8e8e8,0_2px_8px_rgba(0,0,0,0.04)]">

      <div className="px-7 py-5 border-b border-[#f0f0f0]">
        <h2 className="text-base font-semibold text-[#111] tracking-tight">
          Upload video
        </h2>
        <p className="text-xs text-[#bbb] mt-1">
          mp4 · webm · mov · avi — max 100mb
        </p>
      </div>

      <div className="px-7 py-6 flex flex-col gap-5">

        <div>
          <label className="block text-xs font-medium text-[#666] mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your video a title"
            className="w-full rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#999] focus:bg-white transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#666] mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            className="w-full rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#999] focus:bg-white transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#666] mb-2">
            File
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 flex flex-col items-center gap-3 text-center transition-all duration-200
              ${selectedFile
                ? "border-[#111]/20 bg-[#111]/[0.02]"
                : isDragging
                ? "border-[#111]/30 bg-[#111]/[0.03]"
                : "border-[#e8e8e8] hover:border-[#ccc] hover:bg-[#fafafa]"
              }
            `}
          >
            {selectedFile ? (
              <FileCheck className="w-8 h-8 text-[#111]" />
            ) : (
              <UploadCloud className={`w-8 h-8 ${isDragging ? "text-[#111]" : "text-[#ccc]"}`} />
            )}
            <p className="text-sm font-medium text-[#666]">
              {selectedFile ? "File selected" : "Drop video here or click to browse"}
            </p>
            <p className="text-xs text-[#bbb]">
              {selectedFile ? "click to change" : "supported: mp4 · webm · mov · avi · mpeg"}
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />

          {selectedFile && (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-4 py-2.5">
              <span className="text-xs font-medium text-[#666] truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <span className="text-xs text-[#bbb] flex-shrink-0 ml-2">
                {formatSize(selectedFile.size)}
              </span>
            </div>
          )}
        </div>

        {isUploading && (
          <div>
            <div className="h-1 bg-[#f0f0f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#111] rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-[#999] flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                uploading…
              </span>
              <span className="text-xs font-medium text-[#666]">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-4 py-3">
            <CheckCircle className="w-4 h-4 text-[#111] flex-shrink-0" />
            <p className="text-xs text-[#666]">Upload complete — file sent to backend.</p>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            disabled={isUploading || !selectedFile}
            onClick={handleUpload}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#111] text-white text-sm font-medium py-3 px-4 hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
          >
            {isUploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
            ) : (
              <><UploadCloud className="w-4 h-4" /> Upload file</>
            )}
          </button>
          <button
            type="button"
            disabled={!isUploading}
            onClick={() => abortController.current.abort()}
            className="flex items-center gap-1.5 rounded-xl border border-[#e8e8e8] text-[#666] text-sm font-medium py-3 px-4 hover:bg-[#fafafa] hover:text-[#111] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default FileUpload;
