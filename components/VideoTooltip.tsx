import type { VideoData } from "../types"

interface Props {
  active?: boolean
  payload?: Array<{ value: number; payload: VideoData }>
}

export const VideoTooltip = ({ active, payload }: Props) => {
  if (!active || !payload?.length) return null

  const video = payload[0].payload
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: "8px",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        borderRadius: "8px",
        fontSize: "12px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
        width: "320px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start"
      }}>
      <VideoThumbnail src={video.thumbnail} alt={video.title} />
      <VideoInfo
        title={video.title}
        views={video.views}
        uploadTime={video.uploadTime}
      />
    </div>
  )
}

const VideoThumbnail = ({ src, alt }: { src: string; alt: string }) => (
  <div
    style={{
      width: "120px",
      flexShrink: 0,
      borderRadius: "6px",
      overflow: "hidden",
      aspectRatio: "16/9",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.2)"
    }}>
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block"
      }}
    />
  </div>
)

const VideoInfo = ({
  title,
  views,
  uploadTime
}: Pick<VideoData, "title" | "views" | "uploadTime">) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div
      style={{
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.87)",
        marginBottom: "4px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        lineHeight: "1.2"
      }}>
      {title}
    </div>
    <div style={{ color: "rgba(0, 0, 0, 0.6)" }}>
      {views} • {uploadTime}
    </div>
  </div>
)
