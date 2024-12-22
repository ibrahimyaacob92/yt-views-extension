export interface VideoData {
  title: string
  views: string
  uploadTime: string
  videoUrl: string
  thumbnail: string
}

export interface ChannelData {
  name: string | null
  subscribers: string | null
  isChannel: boolean
  videos: VideoData[]
}
