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
        const text = await response.text();
        let data: any = undefined;
        try { data = text ? JSON.parse(text) : undefined; } catch { data = text }
        if (!response.ok) {
            throw data || { error: response.statusText };
        }
        return data as T;

    }

    async getVideos() {
        return this.fetch<IVideo[]>("/videos")
    }
    async getMyVideos() {
        return this.fetch<IVideo[]>("/videos/mine")
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