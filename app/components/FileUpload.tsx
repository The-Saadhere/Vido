"use client" 
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";


const FileUpload = () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const abortController = new AbortController();

    /**
   
     * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} 
     * @throws {Error} 
     */
    const authenticator = async () => {
        try {
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };


    const validateFile = (file: File) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "image/webp", "image/avif", "image/jpg"];
        const maxSizeInBytes = 100 * 1024 * 1024; // 100MB
        if (!allowedTypes.includes(file.type)) {
            setError("Invalid file type. Only JPEG, PNG, GIF, MP4, WEBP, AVIF, and JPG are allowed.");
            throw new Error("Invalid file type. Only JPEG, PNG, GIF, MP4, WEBP, AVIF, and JPG are allowed.");
        }
        if (file.size > maxSizeInBytes) {
            setError("File size exceeds the 100MB limit.");
            throw new Error("File size exceeds the 100MB limit.");
        }
    }

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        
        
        if (!fileInput || !fileInput.files || fileInput.files.length === 0 ) {
            alert("Please select a file to upload");
            return;
        }
    

        const file = fileInput.files[0];

        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        try {
            setIsUploading(true);
            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortController.signal,
            });
            console.log("Upload response:", uploadResponse);
            setIsUploading(false);
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                setIsUploading(false);
                setError("Upload was aborted by the user.");
            } else if (error instanceof ImageKitInvalidRequestError) {
                setIsUploading(false);
                setError("Invalid request.");
            } else if (error instanceof ImageKitUploadNetworkError) {
                setIsUploading(false);
                setError("Network error.");
            } else if (error instanceof ImageKitServerError) {
                setError("Server error.");
                setIsUploading(false);
            } else {
                setError("An unexpected error occurred during upload.");
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="space-y-3">
            <input type="file" className="px-3 py-2 bg-blue-400" ref={fileInputRef} />
            <button className="px-3 py-2 rounded-xl bg-blue-400" disabled={isUploading} type="button" onClick={
                () => {
                    try {
                        const file = fileInputRef?.current?.files?.[0];
                        if (!file) {
                            setError("Please select a file to upload");
                            return;
                        }
                        validateFile(file);
                        handleUpload();
                    } catch (error) {
                        console.error("Validation error:", error);
                    }
                }}>
                Upload file
            </button>
            <button className="px-3 py-2 rounded-xl bg-red-400" type="button" onClick={() => abortController.abort()} disabled={!isUploading}>
                Cancel Upload
            </button>
            <br />
            {isUploading && (
                <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin" />
                    <span>Uploading... {progress.toFixed(2)}%</span>
                </div>
            )}
            {error && <div className="text-red-500">{error}</div>
            }

        </div>
    );
};

export default FileUpload;