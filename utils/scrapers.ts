export const getChannelInfo = () => {
  const channelNameElement = document.querySelector(
    "#channel-header-container #channel-name"
  )

  const subscriberElement = document.querySelector(
    "#channel-header ytd-subscription-notification-toggle-button-renderer #subscriber-count"
  )

  return {
    name: channelNameElement?.textContent?.trim() || null,
    subscribers: subscriberElement?.textContent?.trim() || null
  }
}

export const getVideoList = () => {
  const videoElements = document.querySelectorAll(
    "#contents > ytd-rich-item-renderer, #contents > ytd-grid-video-renderer"
  )

  return Array.from(videoElements).map((video) => {
    const titleElement =
      video.querySelector("h3 a#video-title") ||
      video.querySelector("#video-title")

    const metadataElement =
      video.querySelector("#metadata-line") || video.querySelector("#metadata")

    const allSpans = Array.from(metadataElement?.querySelectorAll("span") || [])

    const videoUrl = titleElement?.getAttribute("href")
      ? `https://www.youtube.com${titleElement.getAttribute("href")}`
      : null

    return {
      title: titleElement?.textContent?.trim() || "",
      views: allSpans[0]?.textContent?.trim() || "",
      uploadTime: allSpans[1]?.textContent?.trim() || "",
      videoUrl
    }
  })
}
