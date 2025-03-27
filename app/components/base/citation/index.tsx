import { useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import type { CitationItem } from '../../chat/type'

export type Resources = {
  documentId: string
  documentName: string
  dataSourceType: string
  sources: CitationItem[]
}

type CitationProps = {
  data: CitationItem[]
  showHitInfo?: boolean
  containerClassName?: string
}
const Citation: FC<CitationProps> = ({
  data,
  showHitInfo = false,
  containerClassName = 'chat-answer-container',
}) => {
  // 使用 Set 管理展开状态，允许多个项同时展开
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // 计算资源分组
  const resources = useMemo(() => {
    return data.reduce((prev: Resources[], next) => {
      const documentId = next.document_id
      const documentName = next.document_name
      const dataSourceType = next.data_source_type
      const documentIndex = prev.findIndex(i => i.documentId === documentId)

      if (documentIndex > -1) {
        prev[documentIndex].sources.push(next)
      } else {
        prev.push({
          documentId,
          documentName,
          dataSourceType,
          sources: [next],
        })
      }
      return prev
    }, [])
  }, [data])

  // 切换展开状态
  const toggleExpand = (documentId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(documentId)) {
        newSet.delete(documentId)
      } else {
        newSet.add(documentId)
      }
      return newSet
    })
  }

  return (
    <div className={`${containerClassName} mt-6`}>
      {/* 标题和分隔线 */}
      <div className="mb-4 flex items-center">
        <span className="text-sm font-semibold text-gray-600 tracking-wide uppercase">
          引用文件
        </span>
        <div className="ml-3 h-[1px] flex-1 bg-gray-200" />
      </div>

      {/* 文件列表 */}
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <div key={resource.documentId} className="group">
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200 shadow-sm"
              onClick={() => toggleExpand(resource.documentId)}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {index + 1}. {resource.documentName}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                {expandedItems.has(resource.documentId) ? '收起' : '展开'}
              </span>
            </div>

            {/* 展开内容  */}
            {expandedItems.has(resource.documentId) && (
              <div className="mt-3 ml-6 p-4 bg-white rounded-xl border border-gray-100 shadow-md animate-fade-in">
                {resource.sources.map((source, idx) => (
                  <div
                    key={source.segment_id}
                    className="mb-4 last:mb-0 border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                  >
                    {/* 片段标题和信息 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-base font-semibold text-gray-900 tracking-tight">
                          引用 {idx + 1}
                        </span>
                      </div>
                      {/* 可选：添加复制按钮 */}
                      <button
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => navigator.clipboard.writeText(source.content)}
                      >
                        复制
                      </button>
                    </div>

                    {/* 正文内容 */}
                    <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {source.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Citation