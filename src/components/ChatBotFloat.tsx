import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import ChatBot from './ChatBot';

const ChatBotFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-20 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
        title="Assistant IA ENA"
      >
        {isOpen ? (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        ) : (
          <div className="relative">
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            <SparklesIcon className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
            {/* Petit badge "Nouveau" */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Badge informatif supprimé pour une interface plus épurée */}

      {/* Composant ChatBot */}
      <ChatBot isOpen={isOpen} onToggle={toggleChat} />
    </>
  );
};

export default ChatBotFloat;
