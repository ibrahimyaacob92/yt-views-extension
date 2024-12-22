import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import { createRoot } from "react-dom/client"

import { ChannelInfo } from "./components/ChannelInfo"
import { useChannelData } from "./hooks/useChannelData"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"],
  all_frames: true
}

const YouTubeDataComponent = () => {
  const channelData = useChannelData()
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <ChannelInfo
      data={channelData}
      isExpanded={isExpanded}
      onToggle={toggleExpanded}
    />
  )
}

const mount = () => {
  const container = document.createElement("div")
  container.id = "youtube-data-extension"
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(<YouTubeDataComponent />)
}

mount()
