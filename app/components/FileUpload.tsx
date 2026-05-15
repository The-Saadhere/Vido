"use client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState, useCallback } from "react";
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
        thumbnailUrl: `${uploadResponse.url}/ik-thumbnail.jpg`
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
        fileName: selectedFile.name
        ,
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
    <div className="font-sans p-8 max-w-lg mx-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Upload video
          </h2>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono">
            mp4 · webm · mov · avi — max 100mb
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a title"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (optional)"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition"
            />
          </div>

          {/* Drop Zone */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
              File
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`
                relative cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 flex flex-col items-center gap-2 text-center transition-all
                ${selectedFile
                  ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30"
                  : isDragging
                  ? "border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }
              `}
            >
              {selectedFile ? (
                <FileCheck className="w-7 h-7 text-emerald-500" />
              ) : (
                <UploadCloud className={`w-7 h-7 ${isDragging ? "text-blue-500" : "text-zinc-400"}`} />
              )}
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {selectedFile ? "File selected" : "Drop video here or click to browse"}
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
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

            {/* File badge */}
            {selectedFile && (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2">
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 font-mono truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-zinc-400 font-mono flex-shrink-0 ml-2">
                  {formatSize(selectedFile.size)}
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          {isUploading && (
            <div>
              <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  uploading…
                </span>
                <span className="text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                  {progress.toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400 font-mono">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">Upload complete — file sent to backend.</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              disabled={isUploading || !selectedFile}
              onClick={handleUpload}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold py-2.5 px-4 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.98]"
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
              className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 text-sm font-semibold py-2.5 px-4 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FileUpload;