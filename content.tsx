import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"],
  all_frames: true
}

interface ChannelData {
  name: string | null
  subscribers: string | null
  isChannel: boolean
  videos: Array<{
    title: string
    views: string
    uploadTime: string
  }>
}

const YouTubeDataComponent = () => {
  const [channelData, setChannelData] = useState<ChannelData>({
    name: null,
    subscribers: null,
    isChannel: false,
    videos: []
  })

  useEffect(() => {
    const getChannelData = () => {
      // Check if we're on a channel's videos page
      const isVideosPage = window.location.pathname.match(/@[^/]+\/videos$/)
      console.log("Current path:", window.location.pathname)
      console.log("Is videos page?", isVideosPage)

      if (!isVideosPage) {
        setChannelData((prev) => ({ ...prev, isChannel: false }))
        return
      }

      // Try these alternative selectors
      const channelNameElement = document.querySelector(
        "#channel-header-container #channel-name"
      )

      const subscriberElement = document.querySelector(
        "#channel-header ytd-subscription-notification-toggle-button-renderer #subscriber-count"
      )

      // For videos, try this broader selector
      const videoElements = document.querySelectorAll(
        "#contents > ytd-rich-item-renderer, #contents > ytd-grid-video-renderer"
      )

      const videos = Array.from(videoElements).map((video) => {
        // Try multiple possible selectors for title
        const titleElement =
          video.querySelector("h3 a#video-title") ||
          video.querySelector("#video-title")

        // Try multiple possible selectors for metadata
        const metadataElement =
          video.querySelector("#metadata-line") ||
          video.querySelector("#metadata")

        const allSpans = Array.from(
          metadataElement?.querySelectorAll("span") || []
        )

        // Log the spans we find for debugging
        console.log(
          "Metadata spans found:",
          allSpans.map((span) => span.textContent)
        )

        const data = {
          title: titleElement?.textContent?.trim() || "",
          views: allSpans[0]?.textContent?.trim() || "",
          uploadTime: allSpans[1]?.textContent?.trim() || ""
        }

        // Log each video's data for debugging
        console.log("Processing video:", data)
        return data
      })

      const newData = {
        name: channelNameElement?.textContent?.trim() || null,
        subscribers: subscriberElement?.textContent?.trim() || null,
        isChannel: true,
        videos
      }

      console.log("Setting channel data:", newData)
      setChannelData(newData)
    }

    const debugDOM = () => {
      console.log("=== DOM Debug Info ===")
      console.log(
        "All video containers:",
        document.querySelectorAll("#contents > *")
      )
      console.log("Channel header:", document.querySelector("#channel-header"))
      console.log(
        "Channel name containers:",
        document.querySelectorAll("[id*='channel-name']")
      )
      console.log(
        "All metadata lines:",
        document.querySelectorAll("[id*='metadata']")
      )
      console.log("==================")
    }

    const timeout = setTimeout(() => {
      debugDOM()
      getChannelData()

      // Set up observer for dynamic content
      const observer = new MutationObserver((mutations) => {
        const hasRelevantChanges = mutations.some((mutation) => {
          return Array.from(mutation.addedNodes).some((node) => {
            const element = node as Element
            return (
              element.querySelector?.("#contents") ||
              element.querySelector?.("#video-title") ||
              element.querySelector?.("#metadata-line")
            )
          })
        })

        if (hasRelevantChanges) {
          console.log("Relevant DOM changes detected, updating data...")
          getChannelData()
        }
      })

      observer.observe(document.body, {
        subtree: true,
        childList: true
      })

      return () => observer.disconnect()
    }, 5000) // Increased to 5 seconds for initial load

    return () => clearTimeout(timeout)
  }, [])

  // Add debugging for render cycle
  useEffect(() => {
    console.log("Component mounted")
    return () => console.log("Component unmounted")
  }, [])

  console.log("Rendering with data:", channelData)

  if (!channelData.isChannel) {
    console.log("Not a channel page, not rendering")
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "300px",
        height: "500px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
        padding: "16px",
        border: "1px solid #e5e5e5",
        overflowY: "auto"
      }}>
      <h2 style={{ margin: 0, fontSize: "16px", color: "#333" }}>
        Channel Information
      </h2>
      <div style={{ marginTop: "12px" }}>
        {channelData.name && (
          <div style={{ marginBottom: "8px" }}>
            <strong>Channel:</strong> {channelData.name}
          </div>
        )}
        {channelData.subscribers && (
          <div style={{ marginBottom: "16px" }}>
            <strong>Subscribers:</strong> {channelData.subscribers}
          </div>
        )}
        <div>
          <strong>Recent Videos:</strong>
          {channelData.videos.map((video, index) => (
            <div key={index} style={{ marginTop: "8px", fontSize: "14px" }}>
              <div>{video.title}</div>
              <div style={{ color: "#606060", fontSize: "12px" }}>
                {video.views} • {video.uploadTime}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Injection logic
const mount = () => {
  console.log("Mounting YouTube data extension...")

  const container = document.createElement("div")
  container.id = "youtube-data-extension"
  document.body.appendChild(container)

  console.log("Container created:", container)

  const root = createRoot(container)
  root.render(<YouTubeDataComponent />)
}

mount()
