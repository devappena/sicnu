import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  XMarkIcon,
  SparklesIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { FadeIn } from './Animations';
import { findBestMatches, getPageSuggestions, type KnowledgeItem } from '../utils/knowledgeBase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
  knowledgeItem?: KnowledgeItem;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Messages d'accueil
const welcomeMessages = [
  "Bonjour ! Je suis l'assistant IA du Portail RH ENA. Comment puis-je vous aider aujourd'hui ?",
  "Salut ! Besoin d'aide avec les ressources humaines ? Je suis là pour vous !",
  "Bonjour ! Votre assistant RH virtuel ENA à votre service !"
];

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Message d'accueil initial
      const welcomeMessage: Message = {
        id: 'welcome',
        text: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const findBestResponse = (userText: string) => {
    // Utilise la nouvelle base de connaissances
    const matches = findBestMatches(userText, 1);
    
    if (matches.length > 0) {
      const bestMatch = matches[0];
      return {
        response: bestMatch.answer,
        actions: bestMatch.actions || [],
        knowledgeItem: bestMatch
      };
    }

    // Réponse par défaut si aucune correspondance
    const defaultResponses = [
      "Je peux vous aider avec les congés, formations, paie, horaires, évaluations. Posez-moi votre question !",
      "Pour une assistance personnalisée, contactez les RH au 01.44.41.85.85 ou rh@ena.gouv.fr",
      "Consultez aussi notre FAQ dans l'aide en ligne ou le guide utilisateur du portail."
    ];
    
    return {
      response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      actions: [
        { text: "Contacter les RH", url: "tel:0144418585", type: "external" as const },
        { text: "Voir l'aide", url: "/help", type: "navigation" as const }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Message utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulation délai de réponse IA
    setTimeout(() => {
      const { response, actions, knowledgeItem } = findBestResponse(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        knowledgeItem
      };

      setMessages(prev => [...prev, botMessage]);

      // Ajouter des suggestions d'actions si disponibles
      if (actions && actions.length > 0) {
        const actionMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: JSON.stringify(actions),
          sender: 'bot',
          timestamp: new Date(),
          type: 'action'
        };
        setMessages(prev => [...prev, actionMessage]);
      }

      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Délai réaliste 1-2s
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = getPageSuggestions(window.location.pathname);

  if (!isOpen) return null;

  return (
    <FadeIn>
      <div className="fixed bottom-20 right-20 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Assistant IA ENA</h3>
              <p className="text-xs opacity-90">Ressources Humaines</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'bot' && (
                    <ComputerDesktopIcon className="h-4 w-4 mt-1 flex-shrink-0 text-blue-600" />
                  )}
                  {message.sender === 'user' && (
                    <UserIcon className="h-4 w-4 mt-1 flex-shrink-0 text-white" />
                  )}
                  <div className="flex-1">
                    {message.type === 'action' ? (
                      <div className="space-y-2">
                        {JSON.parse(message.text).map((action: { text: string; url: string; type: string }, idx: number) => (
                          <a
                            key={idx}
                            href={action.url}
                            className="block bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm transition-colors"
                            target={action.type === 'external' ? '_blank' : '_self'}
                            rel={action.type === 'external' ? 'noopener noreferrer' : undefined}
                          >
                            → {action.text}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-xl p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <ComputerDesktopIcon className="h-4 w-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions rapides */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Suggestions :</p>
            <div className="space-y-1">
              {quickSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(suggestion)}
                  className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default ChatBot;
