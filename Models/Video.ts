import mongoose from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1280,
    height: 720
} as const;

export interface IVideo {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformations?: {
        height: number;
        width: number;
        quality?: number;
    };
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const videoSchema = new mongoose.Schema<IVideo>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformations: {
        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        quality: { type: Number, default: 80, min: 1, max: 100 }
    }
}, { timestamps: true });

const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', videoSchema);

export default Video;