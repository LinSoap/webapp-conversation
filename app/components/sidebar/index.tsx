import React, { FC, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENGTH = 20

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  handleDelete: (id: string) => void
  handleRename: (id: string, name: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  handleDelete,
  handleRename,
  list,
}) => {
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState<string>('')
  const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      menuRefs.current.forEach((menu) => {
        if (menu && !menu.contains(event.target as Node)) {
          menu.classList.add('hidden')
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEditStart = (id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
    menuRefs.current.get(id)?.classList.add('hidden')
  }

  const handleEditSubmit = (id: string) => {
    if (editName.trim()) {
      handleRename(id, editName.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="shrink-0 bg-gray-100 flex flex-col overflow-y-auto pc:w-[244px] tablet:w-[192px] mobile:w-[240px] border-r border-gray-200 tablet:h-screen mobile:h-screen">
      <p className='flex w-full text-xl items-center pl-5 pt-5'>历史对话记录</p>
      <div className="flex flex-shrink-0 p-4 !pb-0">
        <Button
          onClick={() => onCurrentIdChange('-1')}
          className="group block w-full flex-shrink-0 !justify-start !h-9 text-gray-800 bg-gray-200 items-center hover:bg-blue-200  "
        >
          <PencilSquareIcon className="mr-2 h-4 w-4" /> <p className=''>{'开启新对话'}</p>
        </Button>
      </div>

      <nav className="mt-4 flex-1 space-y-1 p-4 !pt-0">
        {list.slice(0, MAX_CONVERSATION_LENGTH).map((item) => {
          const isCurrent = item.id === currentId
          const isEditing = item.id === editingId
          const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon

          return (
            <div
              onClick={() => !isEditing && onCurrentIdChange(item.id)}
              key={item.id}
              className={classNames(
                isCurrent ? 'bg-blue-200 text-primary-600' : 'text-gray-700 hover:bg-blue-200 hover:text-gray-700',
                'group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium cursor-pointer'
              )}
            >
              <div className="flex items-center flex-1">
                <ItemIcon
                  className={classNames(
                    isCurrent ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.key === 'Enter' && handleEditSubmit(item.id)}
                    className="flex-1 w-10 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                ) : (
                  <span className="truncate" title={item.name}>
                    {item.name.length > 9 ? item.name.substring(0, 9) + '...' : item.name}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {isEditing && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditSubmit(item.id)
                    }}
                    className="ml-2 w-2 !h-7 text-sm bg-white"
                  >
                    ✔
                  </Button>
                )}
                {item.id !== '-1' && !isEditing && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const menu = e.currentTarget.nextElementSibling as HTMLDivElement
                        menu?.classList.toggle('hidden')
                      }}
                      className="text-gray-400 hover:text-gray-500 p-1"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <div
                      ref={(el) => el && menuRefs.current.set(item.id, el)}
                      className="hidden absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                    >
                      <div className="py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditStart(item.id, item.name)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          重命名
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </nav>
      <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        <div className="text-gray-400 font-normal text-xs">
          © {copyRight} {(new Date()).getFullYear()}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)