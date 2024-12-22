import { useEffect, useRef, useState } from "react"

import type { ChannelData } from "../types"
import { getChannelInfo, getVideoList } from "../utils/scrapers"

const INITIAL_STATE: ChannelData = {
  name: null,
  subscribers: null,
  isChannel: false,
  videos: []
}

export const useChannelData = () => {
  const [channelData, setChannelData] = useState<ChannelData>(INITIAL_STATE)
  const currentChannelPath = useRef<string | null>(null)
  const lastUrl = useRef(location.href)

  useEffect(() => {
    const getChannelData = () => {
      const isChannelVideoPage = /\/@[^/]+\/videos$/.test(
        window.location.pathname
      )

      // If URL changed, immediately reset the data
      if (location.href !== lastUrl.current) {
        lastUrl.current = location.href
        setChannelData(INITIAL_STATE)

        // If not a channel video page, don't proceed
        if (!isChannelVideoPage) {
          currentChannelPath.current = null
          return
        }
      }

      // Get current channel path
      const channelPath = window.location.pathname.split("/videos")[0]

      // If channel changed or no current channel, reset and update
      if (channelPath !== currentChannelPath.current) {
        currentChannelPath.current = channelPath

        // Only fetch new data if we're on a channel video page
        if (isChannelVideoPage) {
          const channelInfo = getChannelInfo()
          const videos = getVideoList()

          setChannelData({
            ...channelInfo,
            isChannel: true,
            videos
          })
        }
      }
    }

    // Initial check and setup
    getChannelData()

    // Track URL changes
    const handleUrlChange = () => {
      getChannelData()
    }

    // Use both popstate and URL observer for better coverage
    window.addEventListener("popstate", handleUrlChange)

    const observer = new MutationObserver((mutations) => {
      // Check for URL changes first
      if (location.href !== lastUrl.current) {
        handleUrlChange()
        return
      }

      const hasRelevantChanges = mutations.some((mutation) => {
        if (mutation.type === "characterData") {
          return true
        }

        if (mutation.type === "childList") {
          return Array.from(mutation.addedNodes).some((node) => {
            const element = node as Element
            return (
              element.querySelector?.("#contents") ||
              element.querySelector?.("#video-title") ||
              element.querySelector?.("#metadata-line")
            )
          })
        }

        return false
      })

      if (hasRelevantChanges) {
        getChannelData()
      }
    })

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      characterDataOldValue: true
    })

    return () => {
      window.removeEventListener("popstate", handleUrlChange)
      observer.disconnect()
    }
  }, [])

  return channelData
}
