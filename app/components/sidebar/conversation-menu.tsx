import React, { FC, useEffect } from 'react'

const ConversationMenu: FC<{ itemId: string; onDelete: (id: string) => void }> = ({ itemId, onDelete }) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.querySelector('.conversation-menu')
            if (menu && !menu.contains(event.target as Node)) {
                menu.classList.add('hidden')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="conversation-menu hidden absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
                <button
                    onClick={() => console.log('Rename', itemId)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    重命名
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(itemId)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                    删除
                </button>
            </div>
        </div>
    )
}

export default ConversationMenu
