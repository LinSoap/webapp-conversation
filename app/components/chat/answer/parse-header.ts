export type MessageHeader = {
  suggestion?: string;
  numberInput?: string; // 用于输入框的可选字段，表示输入框的标签或用途
  [key: string]: any; // 支持其他可能的字段
};

export const parseMessage = (rawContent: string) => {
  const headerRegexComplete = /<messageHeader>\s*([\s\S]*?)\s*<\/messageHeader>/;
  const headerRegexPartial = /<messageHeader>\s*([\s\S]*)$/; // 未闭合的 messageHeader
  const thinkRegexComplete = /<details[^>]*>\s*<summary>\s*([^<]*)<\/summary>([\s\S]*?)<\/details>/;
  const thinkRegexPartial = /<details[^>]*>\s*<summary>\s*([^<]*)<\/summary>([\s\S]*)$/; // 未闭合的 think
  const responseRegexComplete = /<response>([\s\S]*?)<\/response>/;
  const responseRegexPartial = /<response>([\s\S]*)$/; // 未闭合的 response

  let message_header: MessageHeader[] = [];
  let think: { summary: string; content: string; isComplete: boolean } | null = null;
  let displayContent = rawContent;

  // 解析 messageHeader
  const headerMatchComplete = rawContent.match(headerRegexComplete);
  if (headerMatchComplete) {
    // 完整闭合的 messageHeader
    const headerContent = headerMatchComplete[1].trim();
    try {
      message_header = JSON.parse(headerContent);
      if (!Array.isArray(message_header)) {
        throw new Error('Suggestions must be an array');
      }
      message_header.forEach((item) => {
        if (item.inputs && typeof item.inputs !== 'object') {
          throw new Error('Inputs must be an object');
        }
      });
    } catch (error) {
      console.error('Failed to parse messageHeader as JSON:', error);
      message_header = [];
    }
    // 移除完整闭合的 messageHeader 文本
    displayContent = displayContent.replace(headerRegexComplete, '').trim();
  } else {
    // 检查未闭合的 messageHeader
    const headerMatchPartial = rawContent.match(headerRegexPartial);
    if (headerMatchPartial) {
      // 未闭合时，移除从 <messageHeader> 开始的所有内容，避免展示
      displayContent = displayContent.replace(headerRegexPartial, '').trim();
      message_header = []; // 未闭合时不解析
    }
  }

  // 解析 think 部分
  const thinkMatchComplete = displayContent.match(thinkRegexComplete);
  if (thinkMatchComplete) {
    think = {
      summary: thinkMatchComplete[1].trim(),
      content: thinkMatchComplete[2].trim(),
      isComplete: true,
    };
    displayContent = displayContent.replace(thinkRegexComplete, '').trim();
  } else {
    const thinkMatchPartial = displayContent.match(thinkRegexPartial);
    if (thinkMatchPartial) {
      think = {
        summary: thinkMatchPartial[1].trim(),
        content: thinkMatchPartial[2].trim(),
        isComplete: false,
      };
      displayContent = displayContent.replace(thinkRegexPartial, '').trim();
    }
  }

  // 解析 response 并合并到 displayContent
  let responseContent = '';
  const responseMatchComplete = displayContent.match(responseRegexComplete);
  if (responseMatchComplete) {
    responseContent = responseMatchComplete[1].trim();
    displayContent = displayContent.replace(responseRegexComplete, responseContent).trim();
  } else {
    const responseMatchPartial = displayContent.match(responseRegexPartial);
    if (responseMatchPartial) {
      responseContent = responseMatchPartial[1].trim();
      displayContent = displayContent.replace(responseRegexPartial, responseContent).trim();
    }
  }

  return { displayContent: displayContent.trim(), message_header, think };
};