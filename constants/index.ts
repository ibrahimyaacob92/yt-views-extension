export const SELECTORS = {
  CHANNEL: {
    NAME: "#channel-header-container #channel-name",
    SUBSCRIBERS:
      "#channel-header ytd-subscription-notification-toggle-button-renderer #subscriber-count"
  },
  VIDEO: {
    CONTAINER:
      "#contents > ytd-rich-item-renderer, #contents > ytd-grid-video-renderer",
    TITLE: "#video-title",
    TITLE_LINK: "h3 a#video-title",
    METADATA: "#metadata-line",
    METADATA_ALT: "#metadata",
    THUMBNAIL: "img"
  }
} as const

export const CHART_CONFIG = {
  MIN_WIDTH: 380,
  WIDTH_RATIO: 0.5,
  HEIGHT: 160,
  COLLAPSED_SIZE: 48,
  PADDING: {
    TOP: 0,
    RIGHT: 24,
    BOTTOM: 0,
    LEFT: 28
  }
} as const
