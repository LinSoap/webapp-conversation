
export type MessageHeader = {
  suggestion: string
  [key: string]: any // 支持其他可能的字段
}

export const parseMessage = (rawContent: string) => {
  const headerRegex = /<messageHeader>\s*([\s\S]*?)\s*<\/messageHeader>/
  const thinkRegexComplete = /<details[^>]*>\s*<summary>\s*([^<]*)<\/summary>([\s\S]*?)<\/details>/
  const thinkRegexPartial = /<details[^>]*>\s*<summary>\s*([^<]*)<\/summary>([\s\S]*)$/ // 未闭合的 think

  let message_header: MessageHeader[] = []
  let think: { summary: string; content: string; isComplete: boolean } | null = null
  let displayContent = rawContent

  // 解析 messageHeader
  const headerMatch = rawContent.match(headerRegex)
  if (headerMatch) {
    const headerContent = headerMatch[1].trim()
    try {
      message_header = JSON.parse(headerContent)
      if (!Array.isArray(message_header)) {
        throw new Error('Suggestions must be an array')
      }
      message_header.forEach((item) => {
        if (!item.suggestion) {
          throw new Error('Each suggestion must have a "suggestion" field')
        }
        if (item.inputs && typeof item.inputs !== 'object') {
          throw new Error('Inputs must be an object')
        }
      })
    } catch (error) {
      console.error('Failed to parse messageHeader as JSON:', error)
      message_header = []
    }
    displayContent = displayContent.replace(headerRegex, '').trim()
  }

  // 首先尝试匹配完整的 think
  const thinkMatchComplete = rawContent.match(thinkRegexComplete)
  if (thinkMatchComplete) {
    think = {
      summary: thinkMatchComplete[1].trim(),
      content: thinkMatchComplete[2].trim(),
      isComplete: true
    }
    displayContent = displayContent.replace(thinkRegexComplete, '').trim()
  } else {
    // 如果没有完整的 think，尝试匹配未闭合的 think
    const thinkMatchPartial = rawContent.match(thinkRegexPartial)
    if (thinkMatchPartial) {
      think = {
        summary: thinkMatchPartial[1].trim(),
        content: thinkMatchPartial[2].trim(),
        isComplete: false
      }
      displayContent = displayContent.replace(thinkRegexPartial, '').trim()
    }
  }

  return { displayContent, message_header, think }
}