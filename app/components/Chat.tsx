'use client'

import React, { useState } from 'react';
import ChatForm from './ChatForm';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Array<HumanMessage | AIMessage>>([]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gray-100 p-4 rounded-lg mb-4 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message._getType() === 'human' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message._getType() === 'human' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              {message.content.toString()}
            </span>
          </div>
        ))}
      </div>
      <ChatForm messages={messages} setMessages={setMessages}/>
    </div>
  );
};

export default Chat;
