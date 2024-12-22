export const parseViewCount = (viewString: string): number => {
  const cleanString = viewString.toLowerCase().trim().replace(/\s+/g, "")
  const match = cleanString.match(/([\d.]+)([kmb])?views?/)
  if (!match) return 0

  const [, numStr, unit] = match
  const num = parseFloat(numStr)

  switch (unit) {
    case "k":
      return num * 1000
    case "m":
      return num * 1000000
    case "b":
      return num * 1000000000
    default:
      return num
  }
}

export const formatViewCount = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}
