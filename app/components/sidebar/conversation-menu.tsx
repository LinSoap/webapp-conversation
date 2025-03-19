import React, { FC, useEffect } from 'react'

interface ConversationMenuProps {
    itemId: string
    onDelete: (id: string) => void
    onRename: (id: string) => void
}

const ConversationMenu: FC<ConversationMenuProps> = ({ itemId, onDelete, onRename }) => {
    const menuRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                menuRef.current.classList.add('hidden')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            ref={menuRef}
            className="conversation-menu hidden absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
        >
            <div className="py-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onRename(itemId)
                        menuRef.current?.classList.add('hidden')
                    }}
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