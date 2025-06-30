import React from 'react';
import { Plus, X, WandSparkles, Sparkles, ArrowUpDown, GripVertical, ArrowUp, ArrowDown, Save, LogIn, LogOut, FolderOpen, FilePlus, Download, ClipboardCopy, ClipboardCheck, Pencil, Check } from 'lucide-react';

/**
 * An 'Add' icon from the Lucide icon library.
 */
export const AddIcon: React.FC = () => (
  <Plus className="h-5 w-5" strokeWidth={2.5} />
);

/**
 * A 'Delete' (or 'Close') icon from the Lucide icon library.
 */
export const DeleteIcon: React.FC = () => (
  <X className="h-5 w-5" strokeWidth={2} />
);

/**
 * An AI-themed 'Wand Sparkles' icon from the Lucide icon library, used for AI or magic features.
 * Accepts an optional className for custom styling.
 */
export const SparkleIcon: React.FC<{className?: string}> = ({className}) => (
    <WandSparkles className={`h-5 w-5 ${className || ''}`} />
);

/**
 * A 'Sparkles' icon from Lucide, for the AI Assistant panel.
 * Accepts an optional className for custom styling.
 */
export const AssistantIcon: React.FC<{className?: string}> = ({className}) => (
    <Sparkles className={`h-5 w-5 ${className || ''}`} />
);

/**
 * A 'Sort' icon from the Lucide icon library.
 */
export const SortIcon: React.FC = () => (
  <ArrowUpDown className="h-5 w-5" strokeWidth={2} />
);

/**
 * A 'Grip' icon for drag handles.
 */
export const GripVerticalIcon: React.FC = () => (
  <GripVertical className="h-5 w-5" strokeWidth={1.5} />
);

/**
 * An 'Up Arrow' icon for moving items.
 */
export const ArrowUpIcon: React.FC = () => (
    <ArrowUp className="h-4 w-4" strokeWidth={2} />
);

/**
 * A 'Down Arrow' icon for moving items.
 */
export const ArrowDownIcon: React.FC = () => (
    <ArrowDown className="h-4 w-4" strokeWidth={2} />
);


/**
 * A custom logo icon for the application.
 */
export const LogoIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
        K
    </div>
);

/**
 * A 'Save' icon for saving sessions.
 */
export const SaveIcon: React.FC<{className?: string}> = ({className}) => (
    <Save className={`h-5 w-5 ${className || ''}`} strokeWidth={2} />
);

/**
 * A 'Login' icon.
 */
export const LogInIcon: React.FC<{className?: string}> = ({className}) => (
    <LogIn className={`h-5 w-5 ${className || ''}`} strokeWidth={2} />
);

/**
 * A 'Logout' icon.
 */
export const LogOutIcon: React.FC<{className?: string}> = ({className}) => (
    <LogOut className={`h-5 w-5 ${className || ''}`} strokeWidth={2} />
);

/**
 * A 'Folder Open' icon for viewing sessions.
 */
export const FolderOpenIcon: React.FC<{className?: string}> = ({className}) => (
    <FolderOpen className={`h-5 w-5 ${className || ''}`} strokeWidth={2} />
);

/**
 * A 'New File' icon for starting a new session.
 */
export const NewSessionIcon: React.FC<{className?: string}> = ({className}) => (
    <FilePlus className={`h-5 w-5 ${className || ''}`} strokeWidth={2} />
);

/**
 * A 'Download' icon for exporting.
 */
export const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <Download className={`h-5 w-5 ${className || ''}`} strokeWidth={2} />
);

/**
 * A 'Clipboard' icon for copying.
 */
export const ClipboardIcon: React.FC<{className?: string}> = ({className}) => (
    <ClipboardCopy className={`h-5 w-5 ${className || ''}`} strokeWidth={2} />
);

/**
 * A 'Clipboard Check' icon for indicating a successful copy.
 */
export const ClipboardCheckIcon: React.FC<{className?: string}> = ({className}) => (
    <ClipboardCheck className={`h-5 w-5 ${className || ''}`} strokeWidth={2} />
);

/**
 * An 'Edit' icon from the Lucide icon library.
 */
export const EditIcon: React.FC = () => (
  <Pencil className="h-5 w-5" strokeWidth={2} />
);

/**
 * A 'Check' icon for confirming actions.
 */
export const CheckIcon: React.FC = () => (
  <Check className="h-5 w-5" strokeWidth={2.5} />
);