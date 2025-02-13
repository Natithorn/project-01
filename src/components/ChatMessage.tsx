import React from 'react';
import { UserCircle, Bot, FileText, Download } from 'lucide-react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.isUser;
  
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {isUser ? (
          <UserCircle className="w-8 h-8 text-blue-500" />
        ) : (
          <Bot className="w-8 h-8 text-green-500" />
        )}
      </div>
      <div
        className={`flex-1 px-4 py-2 rounded-lg ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        } max-w-[80%]`}
      >
        {message.image && (
          <div className="mb-2">
            <img 
              src={message.image} 
              alt="Uploaded content"
              className="rounded-lg max-w-full max-h-[300px] object-contain"
            />
          </div>
        )}
        {message.file && (
          <div className={`mb-2 p-3 rounded-md ${isUser ? 'bg-blue-600' : 'bg-white'}`}>
            <div className="flex items-center gap-2">
              <FileText className={`w-5 h-5 ${isUser ? 'text-white' : 'text-blue-500'}`} />
              <span className="flex-1 truncate">{message.file.name}</span>
              <a
                href={message.file.url}
                download={message.file.name}
                className={`p-1 rounded-full hover:bg-opacity-10 ${
                  isUser ? 'hover:bg-white' : 'hover:bg-blue-500'
                }`}
              >
                <Download className={`w-4 h-4 ${isUser ? 'text-white' : 'text-blue-500'}`} />
              </a>
            </div>
            <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
              {(message.file.size / 1024 / 1024).toFixed(2)} MB • {message.file.type}
            </div>
          </div>
        )}
        <p className="text-sm">{message.text}</p>
        <span className="text-xs opacity-70 block mt-1">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};