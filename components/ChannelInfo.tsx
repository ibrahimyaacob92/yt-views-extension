import { BarChart2, Minimize } from "lucide-react"
import { Bar, BarChart, Cell, Tooltip, YAxis } from "recharts"

import type { ChannelData, VideoData } from "../types"

interface Props {
  data: ChannelData
  isExpanded: boolean
  onToggle: () => void
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: VideoData }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null

  const video = payload[0].payload
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "8px",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        borderRadius: "4px",
        fontSize: "12px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px -1px rgba(0, 0, 0, 0.1)"
      }}>
      <div style={{ fontWeight: "bold", color: "#1a1a1a" }}>{video.title}</div>
      <div style={{ color: "#333" }}>
        {video.views} • {video.uploadTime}
      </div>
    </div>
  )
}

export const ChannelInfo = ({ data, isExpanded, onToggle }: Props) => {
  if (!data.isChannel) return null

  const maxWidth = Math.max(380, window.innerWidth * 0.5)
  const chartWidth = maxWidth - 16

  const chartData = [...data.videos].reverse().map((video) => ({
    ...video,
    viewCount: parseInt(
      video.views
        .toLowerCase()
        .replace("k views", "000")
        .replace("m views", "000000")
        .replace(/[^0-9]/g, "")
    )
  }))

  const maxViews = Math.max(...chartData.map((d) => d.viewCount))
  const avgViews = Math.round(
    chartData.reduce((sum, d) => sum + d.viewCount, 0) / chartData.length
  )

  const formatViewCount = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value
  }

  const handleBarClick = (data: VideoData) => {
    const videoId = data.videoUrl
    if (videoId) {
      window.open(videoId, "_blank")
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: isExpanded ? maxWidth : "48px",
        height: isExpanded ? "160px" : "48px",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderRadius: isExpanded ? "8px" : "24px",
        boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        zIndex: 9999,
        padding: isExpanded ? "8px 4px 0 0" : "0",
        transition: "all 0.3s ease-in-out",
        cursor: isExpanded ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
      onClick={!isExpanded ? onToggle : undefined}>
      {isExpanded ? (
        <>
          <button
            onClick={onToggle}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              padding: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
              transition: "opacity 0.2s ease-in-out",
              zIndex: 1,
              color: "#1a1a1a"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.6"
            }}>
            <Minimize size={16} />
          </button>
          <BarChart
            width={chartWidth}
            height={152}
            data={chartData}
            barGap={2}
            margin={{ top: 0, right: 24, bottom: 0, left: 28 }}>
            <YAxis
              ticks={[0, avgViews, maxViews]}
              // @ts-ignore
              tickFormatter={(value) => formatViewCount(value)}
              tick={{ fontSize: 10, fill: "#1a1a1a" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              content={CustomTooltip}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="viewCount" onClick={handleBarClick}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill="#1a73e8"
                  style={{ cursor: "pointer" }}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </>
      ) : (
        <BarChart2 size={24} color="#1a73e8" style={{ opacity: 0.85 }} />
      )}
    </div>
  )
}
