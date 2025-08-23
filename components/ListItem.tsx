import React, { useState, useRef, useEffect } from 'react';
import { type ListItemData } from '../types';
import { DeleteIcon, GripVerticalIcon, ArrowUpIcon, ArrowDownIcon, EditIcon, CheckIcon } from './icons';

interface ListItemProps {
  item: ListItemData;
  onDelete: () => void;
  onEdit: (newText: string) => void;
  // Sort mode props
  isSortMode: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: 'up' | 'down') => void;
  style?: React.CSSProperties;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(({
  item,
  onDelete,
  onEdit,
  isSortMode,
  isFirst,
  isLast,
  onMove,
  style
}, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditText(item.text);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEdit(editText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };
  return (
    <li
      ref={ref}
      style={style}
      className={`flex items-center gap-2 p-2.5 bg-white/5 rounded-lg group transition-all duration-200 ${isSortMode ? 'bg-white/10 ring-1 ring-white/10 cursor-grab active:cursor-grabbing' : ''}`}
    >
      {isSortMode && (
        <span
          className="p-1 text-gray-400"
          aria-hidden="true"
        >
          <GripVerticalIcon />
        </span>
      )}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveEdit}
          className="text-gray-300 flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          aria-label={`Edit item: ${item.text}`}
        />
      ) : (
        <p className="text-gray-300 flex-1 break-words">{item.text}</p>
      )}
      
      <div className="flex items-center gap-2 ml-auto">
        {isSortMode && (
          <div className="flex items-center border border-white/10 rounded-md">
            <button
              onClick={(e) => { e.stopPropagation(); onMove('up'); }}
              disabled={isFirst}
              className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              aria-label="Move item up"
            >
              <ArrowUpIcon />
            </button>
            <div className="w-px h-4 bg-white/10"></div>
            <button
              onClick={(e) => { e.stopPropagation(); onMove('down'); }}
              disabled={isLast}
              className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              aria-label="Move item down"
            >
              <ArrowDownIcon />
            </button>
          </div>
        )}
        {!isEditing && (
          <button
            onClick={(e) => { e.stopPropagation(); handleStartEdit(); }}
            className={`p-1 text-gray-500 hover:text-blue-400 transition-all focus:opacity-100 rounded-full hover:bg-blue-400/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800
              ${isSortMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            aria-label={`Edit item: ${item.text}`}
          >
            <EditIcon />
          </button>
        )}
        {isEditing && (
          <button
            onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
            className="p-1 text-gray-500 hover:text-green-400 transition-all focus:opacity-100 rounded-full hover:bg-green-400/10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 opacity-100"
            aria-label="Save changes"
          >
            <CheckIcon />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className={`p-1 text-gray-500 hover:text-red-500 transition-all focus:opacity-100 rounded-full hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800
            ${isSortMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          aria-label={`Delete item: ${item.text}`}
        >
          <DeleteIcon />
        </button>
      </div>
    </li>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;