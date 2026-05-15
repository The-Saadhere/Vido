import { IVideo } from "@/Models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions ={
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    headers?: Record<string, string>;
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {}} = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        }
      const response = await fetch(`/api${endpoint}`,{
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: defaultHeaders
        } )
        if(!response.ok) {
            throw new Error (await response.text())
        }
        return await response.json();

    }

    async getVideos() {
        return this.fetch<IVideo[]>("/videos")
    }
    async getVideoById(id: string) {
        return this.fetch<IVideo>(`/videos/${id}`)
    }
    async createVideo(videoData: VideoFormData) {
        return this.fetch<IVideo>("/videos", {
            method: "POST",
            body: videoData
        })
    }
 
}

export const apiClient = new ApiClient();