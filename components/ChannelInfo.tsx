import { BarChart2, Minimize } from "lucide-react"
import { Bar, BarChart, Cell, Tooltip, YAxis } from "recharts"

import { CHART_CONFIG } from "../constants"
import type { ChannelData } from "../types"
import { formatViewCount, parseViewCount } from "../utils/formatters"
import { VideoTooltip } from "./VideoTooltip"

interface Props {
  data: ChannelData
  isExpanded: boolean
  onToggle: () => void
}

export const ChannelInfo = ({ data, isExpanded, onToggle }: Props) => {
  if (!data.isChannel) return null

  const maxWidth = Math.max(
    CHART_CONFIG.MIN_WIDTH,
    window.innerWidth * CHART_CONFIG.WIDTH_RATIO
  )
  const chartWidth =
    maxWidth - CHART_CONFIG.PADDING.LEFT - CHART_CONFIG.PADDING.RIGHT

  const chartData = [...data.videos].reverse().map((video) => ({
    ...video,
    viewCount: parseViewCount(video.views)
  }))

  const maxViews = Math.max(...chartData.map((d) => d.viewCount))
  const avgViews = Math.round(
    chartData.reduce((sum, d) => sum + d.viewCount, 0) / chartData.length
  )
  const quarterViews = Math.round(maxViews / 4)

  const handleBarClick = (entry: any) => {
    console.log("clicked", entry)
    if (entry?.payload?.videoUrl) {
      window.open(entry.payload.videoUrl, "_blank")
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: isExpanded ? maxWidth : CHART_CONFIG.COLLAPSED_SIZE,
        height: isExpanded ? CHART_CONFIG.HEIGHT : CHART_CONFIG.COLLAPSED_SIZE,
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
            height={CHART_CONFIG.HEIGHT}
            data={chartData}
            barGap={2}
            margin={{
              top: CHART_CONFIG.PADDING.TOP,
              right: CHART_CONFIG.PADDING.RIGHT,
              bottom: CHART_CONFIG.PADDING.BOTTOM,
              left: CHART_CONFIG.PADDING.LEFT
            }}>
            <YAxis
              ticks={[0, quarterViews, avgViews, maxViews]}
              // @ts-ignore
              tickFormatter={formatViewCount}
              tick={{ fontSize: 10, fill: "#1a1a1a" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              content={VideoTooltip}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="viewCount" onClick={handleBarClick} cursor="pointer">
              {chartData.map((entry, index) => (
                <Cell key={index} fill="#1a73e8" opacity={0.85} />
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
