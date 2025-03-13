
export type MessageHeader = {
  suggestion: string
  [key: string]: any // 支持其他可能的字段
}


// 解析 <messageHeader> 和内容
export const parseMessage = (rawContent: string) => {
  const headerRegex = /<messageHeader>\s*([\s\S]*?)\s*<\/messageHeader>/
  const match = rawContent.match(headerRegex)

  let message_header: MessageHeader[] = []
  let displayContent = rawContent

  if (match) {
    const headerContent = match[1].trim()
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
    displayContent = rawContent.replace(headerRegex, '').trim()
  }

  return { displayContent, message_header }
}
