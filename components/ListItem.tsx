import React from 'react';
import { type ListItemData } from '../types';
import { DeleteIcon, GripVerticalIcon, ArrowUpIcon, ArrowDownIcon } from './icons';

interface ListItemProps {
  item: ListItemData;
  onDelete: () => void;
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
  isSortMode,
  isFirst,
  isLast,
  onMove,
  style
}, ref) => {
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
      <p className="text-gray-300 flex-1 break-words">{item.text}</p>
      
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