

import React, { useState, useEffect, useRef } from 'react';
import { Category, type ListItemData } from '../types';
import SortableListItem from './SortableListItem';
import { AddIcon, SparkleIcon, SortIcon, CheckIcon } from './icons';
import LoadingDots from './LoadingDots';

interface KFDBCardProps {
  category: Category;
  title: string;
  description: string;
  items: ListItemData[];
  onAddItem: (category: Category, text: string) => void;
  onDeleteItem: (category: Category, id: string) => void;
  onEditItem: (category: Category, id: string, newText: string) => void;
  onMoveItem: (category: Category, fromIndex: number, toIndex: number) => void;
  onGetIdeas: (category: Category) => void;
  accent: string;
  isThinking: boolean;
  isDisabled: boolean;
}

const accentColors: { [key: string]: { border: string; text: string; ring: string; } } = {
  cyan: { border: 'border-cyan-400', text: 'text-cyan-400', ring: 'focus:ring-cyan-400' },
  rose: { border: 'border-rose-400', text: 'text-rose-400', ring: 'focus:ring-rose-400' },
  amber: { border: 'border-amber-400', text: 'text-amber-400', ring: 'focus:ring-amber-400' },
  teal: { border: 'border-teal-400', text: 'text-teal-400', ring: 'focus:ring-teal-400' },
};

const accentButtonColors: { [key: string]: string } = {
  cyan: 'bg-cyan-800 hover:bg-cyan-700 text-white focus:ring-cyan-400',
  rose: 'bg-rose-700 hover:bg-rose-600 text-white focus:ring-rose-400',
  amber: 'bg-amber-600 hover:bg-amber-500 text-white focus:ring-amber-400',
  teal: 'bg-teal-800 hover:bg-teal-700 text-white focus:ring-teal-400',
};

const KFDBCard: React.FC<KFDBCardProps> = ({
  category,
  title,
  description,
  items,
  onAddItem,
  onDeleteItem,
  onEditItem,
  onMoveItem,
  onGetIdeas,
  accent,
  isThinking,
  isDisabled
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isSortMode, setIsSortMode] = useState(false);
  const [deletedItemIndex, setDeletedItemIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { border, text, ring } = accentColors[accent] || accentColors.cyan;
  const buttonAccentStyle = accentButtonColors[accent] || accentButtonColors.cyan;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem(category, inputValue);
    setInputValue('');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    onMoveItem(category, index, newIndex);
  };
  
  const handleItemDeletion = (id: string, index: number) => {
    setDeletedItemIndex(index);
    onDeleteItem(category, id);
  };

  useEffect(() => {
    if (deletedItemIndex === null) {
      return;
    }

    const remainingItemsCount = items.length;

    if (remainingItemsCount > 0) {
      // Focus another item's delete button
      const focusIndex = Math.min(deletedItemIndex, remainingItemsCount - 1);
      const listItem = listRef.current?.querySelectorAll('li')[focusIndex];
      const deleteButton = listItem?.querySelector<HTMLButtonElement>('[aria-label^="Delete item"]');
      deleteButton?.focus();
    } else {
      // No items left, focus the input field.
      inputRef.current?.focus();
    }
    
    setDeletedItemIndex(null);
  }, [items, deletedItemIndex]);


  const inputId = `${category.toLowerCase()}-input`;
  const headingId = `${category.toLowerCase()}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className={`flex flex-col bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-white/20`}
    >
      <div className={`p-4 border-b-2 ${border} flex justify-between items-center`}>
        <div>
          <h2 id={headingId} className={`text-xl font-bold text-white`}>{title}</h2>
          <p className={`text-sm text-gray-400`}>{description}</p>
        </div>
        {items.length > 1 && (
      <button
        onClick={() => setIsSortMode(!isSortMode)}
        aria-pressed={isSortMode}
        className={`p-2 rounded-md transition-colors ${isSortMode ? `bg-${accent}-400/20 ${text}` : 'text-gray-400 hover:bg-white/10'}`}
        aria-label={isSortMode ? "Done Sorting" : "Sort Items"}
      >
        {isSortMode ? <CheckIcon /> : <SortIcon />}
      </button>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow mb-4 min-h-[80px]">
          {items.length > 0 ? (
              <ul ref={listRef} aria-labelledby={headingId} className="space-y-2">
                {items.map((item, index) => (
                  <SortableListItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    category={category}
                    index={index}
                    isSortMode={isSortMode}
                    isFirst={index === 0}
                    isLast={index === items.length - 1}
                    onDelete={() => handleItemDeletion(item.id, index)}
                    onEdit={(newText: string) => onEditItem(category, item.id, newText)}
                    onMove={(dir) => handleMove(index, dir)}
                    onMoveItem={onMoveItem}
                  />
                ))}
              </ul>
          ) : (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm text-center italic">No items yet. Add one below!</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleAdd} className="mt-auto space-y-3">
            <div>
              <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">Add a "{title}" item</label>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  id={inputId}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a new item..."
                  className={`flex-grow w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md text-sm focus:ring-2 ${ring} focus:border-transparent placeholder:text-gray-400`}
                />
                <button
                  type="submit"
                  className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50"
                  disabled={!inputValue.trim()}
                  aria-label={`Add new "${title}" item`}
                >
                  <AddIcon />
                </button>
              </div>
            </div>
             <button
                type="button"
                onClick={() => onGetIdeas(category)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900/50 ${buttonAccentStyle} disabled:opacity-50 disabled:cursor-wait transition-colors`}
              >
                {isThinking ? (
                  <span className="flex items-center justify-center">
                    Thinking
                    <LoadingDots />
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <SparkleIcon />
                    Get Ideas
                  </span>
                )}
              </button>
        </form>
      </div>
    </section>
  );
};

export default KFDBCard;