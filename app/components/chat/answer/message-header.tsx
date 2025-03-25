import React, { useState } from 'react';
import classNames from 'classnames';
import Button from '../../base/button';

// 定义 MessageHeader 类型
export type MessageHeader = {
    suggestion?: string; // 用于按钮的可选字段
    numberInput?: string; // 用于输入框的可选字段，表示输入框的标签或用途
    [key: string]: any; // 支持其他可能的字段
};

// 组件属性类型
interface MessageHeaderRendererProps {
    message_header: MessageHeader[];
    nextQuestionContent: string | null;
    isResponding: boolean;
    isLast: boolean;
    onSend: (content: string, files: any[]) => void;
}

const MessageHeaderRenderer = ({
    message_header,
    nextQuestionContent,
    isResponding,
    isLast,
    onSend,
}: MessageHeaderRendererProps) => {
    // 管理输入框的状态
    const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});

    // 处理输入框变化
    const handleInputChange = (index: number, value: string) => {
        // 只允许数字输入，且值必须大于1
        if (/^\d*$/.test(value)) {
            const numValue = parseInt(value, 10);
            if (isNaN(numValue) || numValue > 0) {
                setInputValues((prev) => ({ ...prev, [index]: value }));
            }
        }
    };

    // 处理输入框提交
    const handleInputSubmit = (index: number) => {
        const value = inputValues[index];
        console.log(value);
        if (value && parseInt(value, 10) > 0) {
            onSend(String(value), []);
            setInputValues((prev) => ({ ...prev, [index]: '' })); // 清空输入
        }
    };

    return (
        <>
            {/* 渲染 message_header */}
            {message_header && message_header.length > 0 && !isResponding && (
                <div className="space-x-2 mt-2">
                    {message_header
                        .filter((headerItem) => {
                            // 如果 nextQuestionContent 为空，则展示所有建议
                            if (!nextQuestionContent) return true;
                            // 否则只展示与 nextQuestionContent 匹配的建议（只对 suggestion 生效）
                            return headerItem.suggestion && nextQuestionContent === headerItem.suggestion;
                        })
                        .map((headerItem, index) => {
                            if (headerItem.numberInput) {
                                // 渲染输入框
                                const label = headerItem.numberInput;
                                return (
                                    <div key={index} className="inline-flex items-center space-x-2">
                                        <label>{label}:</label>
                                        <input
                                            type="text"
                                            value={inputValues[index] || ''}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            placeholder="请输入一个正数金额"
                                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary-500"
                                            disabled={!isLast}
                                        />
                                        <Button
                                            onClick={() => handleInputSubmit(index)}
                                            className="px-3 py-1 text-sm bg-primary-100  text-primary-600"
                                            disabled={!isLast || !inputValues[index]}
                                        >
                                            提交
                                        </Button>
                                    </div>
                                );
                            } else if (headerItem.suggestion) {
                                // 渲染按钮
                                const isHighlighted = nextQuestionContent === headerItem.suggestion;
                                return (
                                    <Button
                                        key={index}
                                        onClick={() => onSend(headerItem.suggestion!, [])} // 使用 ! 断言 suggestion 非空
                                        className={classNames(
                                            'inline-flex items-center px-3 py-1 text-sm',
                                            isHighlighted
                                                ? 'bg-primary-100 text-primary-600 border-primary-200'
                                                : 'bg-gray-100 text-gray-700 border-gray-200'
                                        )}
                                        disabled={!isLast}
                                    >
                                        {headerItem.suggestion}
                                    </Button>
                                );
                            }
                            return null;
                        })}
                </div>
            )}
        </>
    );
};

export default MessageHeaderRenderer;