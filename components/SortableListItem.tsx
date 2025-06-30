import React, { useRef } from 'react';
import { useDrag, useDrop, type DropTargetMonitor } from 'react-dnd';
import { type ListItemData, Category } from '../types';
import ListItem from './ListItem';

const ItemType = 'LIST_ITEM';

interface DragItem {
  id: string;
  index: number;
  category: Category;
}

interface SortableListItemProps {
    id: string;
    item: ListItemData;
    category: Category;
    index: number;
    onDelete: () => void;
    onMove: (direction: 'up' | 'down') => void;
    onMoveItem: (category: Category, dragIndex: number, hoverIndex: number) => void;
    isFirst: boolean;
    isLast: boolean;
    isSortMode: boolean;
}

const SortableListItem: React.FC<SortableListItemProps> = (props) => {
    const { id, category, index, onMoveItem, isSortMode } = props;
    const ref = useRef<HTMLLIElement>(null);

    const [, drop] = useDrop<DragItem>({
        accept: ItemType,
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            // Don't replace items with themselves or from other categories
            if (item.id === id || item.category !== category) {
                return;
            }
            
            const dragIndex = item.index;
            const hoverIndex = index;

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the item's height
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            
            onMoveItem(category, dragIndex, hoverIndex);
            
            // Note: we're mutating the monitor item here for performance
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: () => ({ id, index, category }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => isSortMode,
    });
  
    drag(drop(ref));

    return (
        <ListItem
            ref={ref}
            {...props}
            style={{
                opacity: isDragging ? 0.4 : 1,
            }}
        />
    );
};
export default SortableListItem;