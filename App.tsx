import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Category, type KFDBCategories, type ListItemData, type AssistantMessage, type Suggestion } from './types';
import KFDBCard from './components/KFDBCard';
import AssistantPanel from './components/AssistantPanel';
import Header from './components/Header';
import ExportModal from './components/ExportModal';
import OutlineModal from './components/OutlineModal';
import { getInitialSuggestions, getIdeasForCategory, generateOutline } from './services/geminiService';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './services/localStorageService';
import LoadingDots from './components/LoadingDots';
import { SparkleIcon, EditIcon, CheckIcon, DeleteIcon } from './components/icons';
import LiveRegion from './components/LiveRegion';

const initialItems: KFDBCategories = {
  [Category.Know]: [],
  [Category.Feel]: [],
  [Category.Do]: [],
  [Category.Be]: [],
};

const initialMessages: AssistantMessage[] = [
  { id: 'initial', role: 'system', content: 'Welcome! Define a topic and I can help generate ideas for what your audience should Know, Feel, Do, and Be.' }
];

const loadingContent = (
    <div className="flex items-center justify-center">
        <span>Thinking</span>
        <LoadingDots />
    </div>
);

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  const [item] = newArray.splice(from, 1);
  newArray.splice(to, 0, item);
  return newArray;
}

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [items, setItems] = useState<KFDBCategories>(initialItems);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>(initialMessages);
  
  const [isGeneratingInitial, setIsGeneratingInitial] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState<Category | null>(null);
  const isAiBusy = isGeneratingInitial || loadingCategory !== null;

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportContent, setExportContent] = useState('');
  
  // State for outline modal
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [outlineContent, setOutlineContent] = useState('');
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [lastOutlineContent, setLastOutlineContent] = useState(''); // Keep track of the content that was used to generate the last outline
  
  // State for screen reader announcements
  const [announcement, setAnnouncement] = useState('');
  const announcementTimeoutRef = useRef<number | null>(null);

  // State for title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  // Refs for focus management
  const titleInputRef = useRef<HTMLInputElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  
  // Announce messages to screen readers
  const announce = useCallback((message: string, duration: number = 4000) => {
    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }
    setAnnouncement(message);
    announcementTimeoutRef.current = window.setTimeout(() => {
      setAnnouncement('');
    }, duration);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const storedData = loadFromLocalStorage();
    if (storedData) {
      setTopic(storedData.topic);
      setSessionTitle(storedData.sessionTitle);
      setItems(storedData.items);
      setHasLoadedFromStorage(true);
      announce('Session restored from browser storage.');
    }
  }, [announce]);

  // Save to localStorage whenever data changes (after initial load)
  useEffect(() => {
    if (!hasLoadedFromStorage) return; // Don't save initial empty state
    
    const hasContent = topic.trim() || sessionTitle.trim() || 
      Object.values(items).some(categoryItems => categoryItems.length > 0);
    
    if (hasContent) {
      saveToLocalStorage({
        topic,
        sessionTitle,
        items,
      });
    }
  }, [topic, sessionTitle, items, hasLoadedFromStorage]);

  // Cleanup announcement timeout on unmount
  useEffect(() => {
    return () => {
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }
    };
  }, []);


  // Effect to focus input on edit start
  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleAddItem = (category: Category, text: string) => {
    if (!text.trim()) return;
    const newItem: ListItemData = { id: crypto.randomUUID(), text };
    setItems(prev => ({ ...prev, [category]: [...prev[category], newItem] }));
    if (!hasLoadedFromStorage) setHasLoadedFromStorage(true);
  };

  const handleDeleteItem = (category: Category, id: string) => {
    setItems(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id),
    }));
  };
  
  const handleAddSuggestedItem = (messageId: string, suggestionId: string) => {
    let suggestionToAdd: Suggestion | undefined;

    setAssistantMessages(prevMessages => {
      const newMessages = prevMessages.map(msg => {
        if (msg.id === messageId && msg.suggestions) {
          suggestionToAdd = msg.suggestions.find(s => s.id === suggestionId);
          return {
            ...msg,
            suggestions: msg.suggestions.filter(s => s.id !== suggestionId),
          };
        }
        return msg;
      });

      if (suggestionToAdd) {
        handleAddItem(suggestionToAdd.category, suggestionToAdd.text);
      }
      
      return newMessages;
    });
  };

  const handleMoveItem = useCallback((category: Category, fromIndex: number, toIndex: number) => {
    setItems(prev => {
        if (toIndex < 0 || toIndex >= prev[category].length) {
            return prev;
        }
        const reorderedItems = arrayMove(prev[category], fromIndex, toIndex);
        return { ...prev, [category]: reorderedItems };
    });
  }, []);

  const handleStartOver = useCallback(() => {
    setTopic('');
    setSessionTitle('');
    setItems(initialItems);
    setAssistantMessages(initialMessages);
    clearLocalStorage();
    announce('Session cleared. Ready to start a new session.');
  }, [announce]);

  const fetchInitialSuggestions = useCallback(async () => {
    if (!topic.trim() || isAiBusy) return;

    setIsGeneratingInitial(true);
    announce('Generating initial ideas. Please wait.');
    setItems(initialItems);
    setSessionTitle('');

    const userMessage: AssistantMessage = { id: crypto.randomUUID(), role: 'user', content: `Generate ideas for the topic: "${topic}"` };
    const loadingMessage: AssistantMessage = { id: 'loading', role: 'system', content: loadingContent };
    setAssistantMessages([initialMessages[0], userMessage, loadingMessage]);

    try {
      const suggestions = await getInitialSuggestions(topic);
      setSessionTitle(suggestions.title);
      
      const newItems = {
        [Category.Know]: suggestions.know.map(text => ({ id: crypto.randomUUID(), text })),
        [Category.Feel]: suggestions.feel.map(text => ({ id: crypto.randomUUID(), text })),
        [Category.Do]: suggestions.do.map(text => ({ id: crypto.randomUUID(), text })),
        [Category.Be]: suggestions.be.map(text => ({ id: crypto.randomUUID(), text })),
      };
      
      setItems(newItems);

       setAssistantMessages(prev => [
           ...prev.filter(m => m.id !== 'loading'), 
           { id: crypto.randomUUID(), role: 'assistant', content: 'I\'ve populated your lists with some starting ideas. Feel free to refine them!' }
       ]);
       
       // Save to localStorage immediately after AI generation
       saveToLocalStorage({
         topic,
         sessionTitle: suggestions.title,
         items: newItems,
       });
       setHasLoadedFromStorage(true);
       
       announce('Ideas generated and populated successfully.');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      announce(`Sorry, there was an error generating ideas: ${errorMessage}`);
      setAssistantMessages(prev => [
        ...prev.filter(m => m.id !== 'loading'), 
        { id: crypto.randomUUID(), role: 'system', content: `Sorry, I hit a snag: ${errorMessage}` }
      ]);
    } finally {
      setIsGeneratingInitial(false);
    }
  }, [topic, isAiBusy, announce]);

  const handleTopicSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchInitialSuggestions();
  };

  const fetchCategoryIdeas = useCallback(async (category: Category) => {
    if (!topic.trim() || isAiBusy) {
        if (!topic.trim()) {
            setAssistantMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'system', content: 'Please set a topic first before asking for ideas.' }]);
        }
        return;
    };
    setLoadingCategory(category);
    announce(`Getting more ideas for ${category}. Please wait.`);
    setAssistantMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: `Give me more ideas for "${category}"` }, { id: 'loading', role: 'system', content: loadingContent }]);

    try {
        const existingItems = items[category].map(item => item.text);
        const ideas = await getIdeasForCategory(topic, category, existingItems);
        const newSuggestions: Suggestion[] = ideas.map(ideaText => ({
            id: crypto.randomUUID(),
            text: ideaText,
            category: category
        }));

        const suggestionContent = ( <p>Here are a few more ideas for <strong>{category}</strong>. Click to add them:</p> );
        
        setAssistantMessages(prev => [...prev.filter(m => m.id !== 'loading'), { 
            id: crypto.randomUUID(), 
            role: 'assistant', 
            content: suggestionContent,
            suggestions: newSuggestions,
            suggestionCategory: category,
        }]);
        announce('New ideas are available in the assistant panel.');
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        announce(`Sorry, there was an error getting ideas: ${errorMessage}`);
        setAssistantMessages(prev => [...prev.filter(m => m.id !== 'loading'), { id: crypto.randomUUID(), role: 'system', content: `Sorry, I hit a snag: ${errorMessage}` }]);
    } finally {
        setLoadingCategory(null);
    }
  }, [topic, isAiBusy, items, announce]);
  
  const handleStartEditingTitle = () => {
    setEditedTitle(sessionTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      setSessionTitle(editedTitle.trim());
      announce('Session title updated.');
    }
    setIsEditingTitle(false);
    requestAnimationFrame(() => {
      editButtonRef.current?.focus();
    });
  };

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    requestAnimationFrame(() => {
      editButtonRef.current?.focus();
    });
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEditTitle();
    }
  };


  const categoryCards = useMemo(() => [
    { category: Category.Know, title: "Know", description: "What should they know?", accent: "cyan" },
    { category: Category.Feel, title: "Feel", description: "How should they feel?", accent: "rose" },
    { category: Category.Do, title: "Do", description: "What should they be able to do?", accent: "amber" },
    { category: Category.Be, title: "Be", description: "Who should they become?", accent: "teal" },
  ], []);

  const generateMarkdownContent = useCallback(() => {
    let markdown = '';
    
    if (sessionTitle) {
        markdown += `# ${sessionTitle}\n\n`;
    } else if (topic) {
        markdown += `# Topic: ${topic}\n\n`;
    }

    const categories: Category[] = [Category.Know, Category.Feel, Category.Do, Category.Be];

    for (const category of categories) {
        const listItems = items[category];
        if (listItems.length > 0) {
            markdown += `## ${category}\n`;
            listItems.forEach(item => {
                markdown += `- ${item.text}\n`;
            });
            markdown += `\n`;
        }
    }
    
    return markdown.trim();
  }, [items, sessionTitle, topic]);

  const handleExport = useCallback(() => {
      const content = generateMarkdownContent();
      setExportContent(content);
      setIsExportModalOpen(true);
  }, [generateMarkdownContent]);
  
  // Function to handle creating an outline
  const handleCreateOutline = useCallback(async () => {
      try {
          // Always open the modal first for better UX
          setIsOutlineModalOpen(true);
          
          // Generate the current content
          const currentContent = generateMarkdownContent();
          if (!currentContent) {
              announce("Cannot create outline. No content available.");
              return;
          }
          
          // Check if the content has changed since the last generation
          if (currentContent === lastOutlineContent && outlineContent) {
              // Content hasn't changed, reuse the existing outline
              announce("Showing existing outline.");
              return;
          }
          
          // Content has changed or no previous outline exists, generate a new one
          setOutlineContent("");
          setIsGeneratingOutline(true);
          
          // Generate the outline using Gemini
          const outline = await generateOutline(sessionTitle || topic || "Untitled", currentContent);
          
          // Update the modal with the response and save the content that generated it
          setOutlineContent(outline);
          setLastOutlineContent(currentContent);
          announce("Outline generated successfully.");
      } catch (error) {
          console.error("Error creating outline:", error);
          setOutlineContent("Failed to generate outline. Please try again.");
          announce("Failed to generate outline. Please try again.");
      } finally {
          setIsGeneratingOutline(false);
      }
  }, [generateMarkdownContent, sessionTitle, topic, announce, lastOutlineContent, outlineContent]);

  return (
    <DndProvider backend={HTML5Backend}>
      <LiveRegion announcement={announcement} />
      <div className="min-h-screen flex flex-col">
        <Header onExport={handleExport} onCreateOutline={handleCreateOutline} onStartOver={handleStartOver} />
        
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <div className="text-center lg:text-left p-6 rounded-xl mb-8">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Know, Feel, Do, Be</h2>
                  <p className="text-lg text-gray-400 mb-6">Start by defining the theme for your lesson, workshop, or meeting.</p>
                  <form onSubmit={handleTopicSubmit} className="flex flex-col sm:flex-row sm:items-end gap-3">
                      <div className="flex-grow text-left">
                          <label htmlFor="topic-input" className="block text-sm font-medium text-gray-300 mb-2">Session Topic</label>
                          <input
                              id="topic-input"
                              type="text"
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              placeholder="e.g., Q3 Leadership Summit"
                              className="w-full px-4 py-3 bg-[#0d1117] text-white border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder:text-gray-400"
                          />
                      </div>
                      <button 
                          type="submit"
                          disabled={!topic.trim() || isAiBusy}
                          className="px-6 py-3 bg-green-700 text-white font-bold rounded-lg shadow-lg shadow-green-700/20 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1117] focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                         {isGeneratingInitial ? (
                           <span className="flex items-center justify-center">
                             Generating
                             <LoadingDots />
                           </span>
                         ) : (
                           <span className="flex items-center justify-center gap-2">
                             <SparkleIcon />
                             AI Start
                           </span>
                         )}
                      </button>
                  </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessionTitle && (
                  <div className="md:col-span-2">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg">
                      {!isEditingTitle ? (
                        <div className="relative text-center">
                          <p id="session-title-label" className="text-sm font-semibold text-cyan-400 mb-1 tracking-wide uppercase">
                            Session Title
                          </p>
                          <h2 aria-labelledby="session-title-label" className="text-2xl font-bold text-white tracking-tight px-12">{sessionTitle}</h2>
                          <button
                            ref={editButtonRef}
                            onClick={handleStartEditingTitle}
                            className="absolute top-1/2 -translate-y-1/2 right-2 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Edit session title"
                          >
                            <EditIcon />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <label htmlFor="session-title-input" className="block text-sm font-semibold text-cyan-400 mb-2">
                            Edit Session Title
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              ref={titleInputRef}
                              id="session-title-input"
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              onKeyDown={handleTitleKeyDown}
                              className="flex-grow w-full text-2xl font-bold tracking-tight bg-gray-800 text-white border-2 border-cyan-400 rounded-lg p-2 focus:ring-2 focus:ring-cyan-300 focus:outline-none transition-all"
                            />
                            <button
                              onClick={handleSaveTitle}
                              className="p-2 bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors"
                              aria-label="Save title"
                            >
                              <CheckIcon />
                            </button>
                            <button
                              onClick={handleCancelEditTitle}
                              className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                              aria-label="Cancel edit"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {categoryCards.map(({ category, title, description, accent }) => (
                  <KFDBCard
                    key={category}
                    category={category}
                    title={title}
                    description={description}
                    items={items[category]}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                    onMoveItem={handleMoveItem}
                    onGetIdeas={() => fetchCategoryIdeas(category)}
                    accent={accent}
                    isThinking={loadingCategory === category}
                    isDisabled={isAiBusy}
                  />
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <AssistantPanel messages={assistantMessages} isLoading={isAiBusy} onAddSuggestedItem={handleAddSuggestedItem} />
            </div>
          </div>
        </main>
      </div>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        content={exportContent}
      />
      <OutlineModal
        isOpen={isOutlineModalOpen}
        onClose={() => setIsOutlineModalOpen(false)}
        content={outlineContent}
        isLoading={isGeneratingOutline}
      />
    </DndProvider>
  );
};

export default App;