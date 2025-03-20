'use client'
import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'
import type { AppInfo, PromptConfig } from '@/types/app'
import Button from '@/app/components/base/button'
import s from './style.module.css'

export const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.75 1C2.75 0.723858 2.52614 0.5 2.25 0.5C1.97386 0.5 1.75 0.723858 1.75 1V1.75H1C0.723858 1.75 0.5 1.97386 0.5 2.25C0.5 2.52614 0.723858 2.75 1 2.75H1.75V3.5C1.75 3.77614 1.97386 4 2.25 4C2.52614 4 2.75 3.77614 2.75 3.5V2.75H3.5C3.77614 2.75 4 2.52614 4 2.25C4 1.97386 3.77614 1.75 3.5 1.75H2.75V1Z" fill="#444CE7" />
    <path d="M2.75 8.5C2.75 8.22386 2.52614 8 2.25 8C1.97386 8 1.75 8.22386 1.75 8.5V9.25H1C0.723858 9.25 0.5 9.47386 0.5 9.75C0.5 10.0261 0.723858 10.25 1 10.25H1.75V11C1.75 11.2761 1.97386 11.5 2.25 11.5C2.52614 11.5 2.75 11.2761 2.75 11V10.25H3.5C3.77614 10.25 4 10.0261 4 9.75C4 9.47386 3.77614 9.25 3.5 9.25H2.75V8.5Z" fill="#444CE7" />
    <path d="M6.96667 1.32051C6.8924 1.12741 6.70689 1 6.5 1C6.29311 1 6.10759 1.12741 6.03333 1.32051L5.16624 3.57494C5.01604 3.96546 4.96884 4.078 4.90428 4.1688C4.8395 4.2599 4.7599 4.3395 4.6688 4.40428C4.578 4.46884 4.46546 4.51604 4.07494 4.66624L1.82051 5.53333C1.62741 5.60759 1.5 5.79311 1.5 6C1.5 6.20689 1.62741 6.39241 1.82051 6.46667L4.07494 7.33376C4.46546 7.48396 4.578 7.53116 4.6688 7.59572C4.7599 7.6605 4.8395 7.7401 4.90428 7.8312C4.96884 7.922 5.01604 8.03454 5.16624 8.42506L6.03333 10.6795C6.1076 10.8726 6.29311 11 6.5 11C6.70689 11 6.89241 10.8726 6.96667 10.6795L7.83376 8.42506C7.98396 8.03454 8.03116 7.922 8.09572 7.8312C8.1605 7.7401 8.2401 7.6605 8.3312 7.59572C8.422 7.53116 8.53454 7.48396 8.92506 7.33376L11.1795 6.46667C11.3726 6.39241 11.5 6.20689 11.5 6C11.5 5.79311 11.3726 5.60759 11.1795 5.53333L8.92506 4.66624C8.53454 4.51604 8.422 4.46884 8.3312 4.40428C8.2401 4.3395 8.1605 4.2599 8.09572 4.1688C8.03116 4.078 7.98396 3.96546 7.83376 3.57494L6.96667 1.32051Z" fill="#444CE7" />
  </svg>
)

export const ChatBtn: FC<{ onClick: () => void; className?: string }> = ({
  className,
  onClick,
}) => {
  return (
    <Button
      type='primary'
      className={cn(className, `space-x-2 flex items-center ${s.customBtn}`)}
      onClick={onClick}>
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M18 10.5C18 14.366 14.418 17.5 10 17.5C8.58005 17.506 7.17955 17.1698 5.917 16.52L2 17.5L3.338 14.377C2.493 13.267 2 11.934 2 10.5C2 6.634 5.582 3.5 10 3.5C14.418 3.5 18 6.634 18 10.5ZM7 9.5H5V11.5H7V9.5ZM15 9.5H13V11.5H15V9.5ZM9 9.5H11V11.5H9V9.5Z" fill="white" />
      </svg>
      {'开启对话'}
    </Button>
  )
}

export const AppInfoAndPrompt: FC<{ siteInfo: AppInfo; html: string }> = ({ siteInfo, html }) => {
  const greetingMessage = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)
      return `👋 早上好`;
    else if (hour >= 12 && hour < 18)
      return `👋 下午好`;
    else
      return `🌙 晚上好`;
  })();

  return (
    <div>
      <div className='flex items-center py-2 text-xl font-medium text-gray-700 rounded-md'>
        {greetingMessage},我是你的采购小助手
      </div>
    </div>
  )
}

export type IWelcomeProps = {
  conversationName: string
  hasSetInputs: boolean
  isPublicVersion: boolean
  siteInfo: AppInfo
  promptConfig: PromptConfig
  onStartChat: (inputs: Record<string, any>) => void
  canEditInputs: boolean
  savedInputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
}

const Welcome: FC<IWelcomeProps> = ({
  conversationName,
  hasSetInputs,
  isPublicVersion,
  siteInfo,
  promptConfig,
  onStartChat,
  canEditInputs,
  savedInputs,
  onInputsChange,
}) => {

  return (
    <div className="relative mobile:min-h-[48px] tablet:min-h-[64px] bg-gradient-to-br from-gray-50 to-blue">
      {hasSetInputs && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between mobile:h-12 tablet:h-16 px-8 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200">
          <div className="text-gray-800 text-xl font-semibold tracking-tight">
            {conversationName}
          </div>
        </div>
      )}

      {!hasSetInputs && (
        <div className="mx-auto min-h-screen  max-w-full mobile:w-full px-3.5 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="mobile:pt-[72px] tablet:pt-[128px] pc:pt-[200px] flex flex-col items-center animate-fade-in">
            <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl transition-all duration-300 hover:shadow-lg">
              <AppInfoAndPrompt siteInfo={siteInfo} html={promptConfig.prompt_template} />
            </div>
            <ChatBtn
              onClick={() => onStartChat([])}
              className="mt-4 w-full max-w-xs py-2.5 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-105"
            />
          </div>
        </div>

      )}
    </div>
  )
}

export default React.memo(Welcome)