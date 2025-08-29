
import React, { useState, useEffect, useRef } from 'react';
import { ClipboardCheckIcon, ClipboardIcon, DeleteIcon } from './icons';
import ReactMarkdown from 'react-markdown';
import './markdown-styles.css';
import LoadingDots from './LoadingDots';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, content }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showFormatted, setShowFormatted] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            triggerElementRef.current = document.activeElement as HTMLElement;
            // The close button is a good first focus target.
            const closeButton = modalRef.current?.querySelector<HTMLElement>('button[aria-label="Close modal"]');
            closeButton?.focus();

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                    return;
                }
                if (e.key === 'Tab' && modalRef.current) {
                    const focusableElements = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    ));
                    if(focusableElements.length === 0) return;
                    
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                triggerElementRef.current?.focus();
            };
        } else {
            // Reset copied state when modal is closed
            setTimeout(() => setIsCopied(false), 300); 
        }
    }, [isOpen, onClose]);

    const handleCopy = async () => {
        if (!content) return;
        try {
            await navigator.clipboard.writeText(content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            alert("Failed to copy text.");
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
            aria-describedby="export-modal-description"
        >
            <div 
                ref={modalRef}
                className="bg-gray-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
                    <div>
                        <h2 id="export-modal-title" className="text-xl font-bold text-white">Export as Markdown</h2>
                        <p id="export-modal-description" className="text-sm text-gray-400">The content below can be copied to your clipboard.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 text-gray-400 rounded-full hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <DeleteIcon />
                    </button> 
                </div>
                
                {/* View toggle buttons */}
                {content && (
                    <div className="px-4 pt-2 pb-1 border-b border-white/10 flex-shrink-0">
                        <div className="flex space-x-1 bg-gray-800 rounded-md p-0.5 w-fit">
                            <button
                                onClick={() => setShowFormatted(true)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                    showFormatted 
                                        ? 'bg-gray-600 text-white' 
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                Formatted
                            </button>
                            <button
                                onClick={() => setShowFormatted(false)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                    !showFormatted 
                                        ? 'bg-gray-600 text-white' 
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                Raw Markdown
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="p-4 flex-grow overflow-y-auto relative" tabIndex={0}>
                    {content ? (
                        showFormatted ? (
                            <div className="bg-gray-800 p-4 rounded-md text-gray-300 text-sm prose prose-invert max-w-none">
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </div>
                        ) : (
                            <pre className="bg-gray-800 p-4 rounded-md text-gray-300 text-sm whitespace-pre-wrap break-words scrollbar-hide h-full">
                                <code>{content}</code>
                            </pre>
                        )
                    ) : (
                        <div className="bg-gray-800 p-4 rounded-md text-gray-300 text-sm">
                            Nothing to export yet.
                        </div>
                    )}
                    
                    {content && (
                        <button 
                            onClick={handleCopy}
                            className="absolute top-6 right-6 p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
                            aria-label="Copy to clipboard"
                        >
                            {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                        </button>
                    )}
                </div>
                <div className="p-4 border-t border-white/10 flex justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={!content}
                        className="px-4 py-2 font-semibold bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
