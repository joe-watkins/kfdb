
import React from 'react';
import { type AssistantMessage } from '../types';
import { AssistantIcon } from './icons';

interface AssistantPanelProps {
  messages: AssistantMessage[];
  isLoading: boolean;
  onAddSuggestedItem: (messageId: string, suggestionId: string) => void;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ messages, onAddSuggestedItem }) => {
  const panelTitleId = "assistant-panel-title";

  const getMessageBubble = (message: AssistantMessage) => {
    if (!message.content) return null;
    
    switch(message.role) {
      case 'user':
        return <div className="bg-indigo-500 text-white p-3 rounded-lg self-end max-w-xs break-words shadow-lg">{message.content}</div>;
      case 'assistant':
         return <div className="bg-gray-700 text-gray-200 p-3 rounded-lg self-start max-w-xs break-words shadow-lg">{message.content}</div>;
      case 'system':
        return <div className="text-gray-400 text-sm p-3 rounded-lg self-center text-center max-w-xs break-words italic">{message.content}</div>
      default:
        return null;
    }
  }

  return (
    <aside aria-labelledby={panelTitleId} className="sticky top-24">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg flex flex-col h-[calc(100vh-8rem)] max-h-[700px]">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <AssistantIcon className="text-cyan-400" />
          <h3 id={panelTitleId} className="text-lg font-bold text-white">AI Assistant</h3>
        </div>
        <div 
            className="flex-grow p-4 overflow-y-auto scrollbar-hide"
            role="log"
            aria-live="polite"
            tabIndex={0}
        >
          <div className="flex flex-col gap-4">
            {messages.map(message => (
              <div key={message.id} className="flex flex-col">
                {getMessageBubble(message)}
                {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                   <div className="mt-2 self-start max-w-xs w-full">
                      <div className="flex flex-col gap-2">
                        {message.suggestions.map(suggestion => (
                           <button
                              key={suggestion.id}
                              onClick={() => onAddSuggestedItem(message.id, suggestion.id)}
                              className="w-full text-left p-2.5 bg-gray-700/50 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors text-sm border border-gray-600/50 hover:border-gray-600"
                           >
                              <span className="text-cyan-400 font-bold">+</span> {suggestion.text}
                           </button>
                        ))}
                      </div>
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AssistantPanel;