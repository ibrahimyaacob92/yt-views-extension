import { useEffect, useState } from "react"

import type { ChannelData } from "../types"
import { getChannelInfo, getVideoList } from "../utils/scrapers"

export const useChannelData = () => {
  const [channelData, setChannelData] = useState<ChannelData>({
    name: null,
    subscribers: null,
    isChannel: false,
    videos: []
  })

  useEffect(() => {
    const getChannelData = () => {
      const isVideosPage = window.location.pathname.match(/@[^/]+\/videos/)

      if (!isVideosPage) {
        setChannelData((prev) => ({ ...prev, isChannel: false }))
        return
      }

      const channelInfo = getChannelInfo()
      const videos = getVideoList()

      setChannelData({
        ...channelInfo,
        isChannel: true,
        videos
      })
    }

    // Track URL changes for sort parameter
    let lastUrl = location.href

    const timeout = setTimeout(() => {
      getChannelData()

      const observer = new MutationObserver((mutations) => {
        // Check for URL changes (sorting changes trigger URL updates)
        if (location.href !== lastUrl) {
          lastUrl = location.href
          getChannelData()
          return
        }

        const hasRelevantChanges = mutations.some((mutation) => {
          // Check for text content changes
          if (mutation.type === "characterData") {
            return true
          }

          // Check for added/removed nodes
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
          console.log("Content changes detected, updating data...")
          getChannelData()
        }
      })

      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true, // Watch for text content changes
        characterDataOldValue: true // Track old values of text content
      })

      return () => observer.disconnect()
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  return channelData
}
