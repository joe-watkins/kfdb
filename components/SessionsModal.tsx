
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getUserSessions, deleteSession } from '../services/firestoreService';
import { type Session } from '../types';
import { DeleteIcon } from './icons';

interface SessionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadSession: (session: Session) => void;
    userId: string;
}

const SessionsModal: React.FC<SessionsModalProps> = ({ isOpen, onClose, onLoadSession, userId }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerElementRef = useRef<HTMLElement | null>(null);

    const fetchSessions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userSessions = await getUserSessions(userId);
            setSessions(userSessions);
        } catch (err) {
            console.error("Error fetching sessions:", err);
            setError("Failed to load sessions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (isOpen && userId) {
            fetchSessions();
        }
    }, [isOpen, userId, fetchSessions]);
    
    useEffect(() => {
        if (isOpen) {
            triggerElementRef.current = document.activeElement as HTMLElement;
            // Focus the close button as a default
            const closeButton = modalRef.current?.querySelector<HTMLElement>('button:not([aria-label^="Delete session"])');
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
        }
    }, [isOpen, onClose]);

    const handleDelete = async (sessionId: string) => {
        if (window.confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
            try {
                await deleteSession(sessionId);
                setSessions(prev => prev.filter(s => s.id !== sessionId));
            } catch (err) {
                console.error("Error deleting session:", err);
                alert("Failed to delete session. Please try again.");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sessions-modal-title"
            aria-describedby="sessions-modal-description"
        >
            <div 
                ref={modalRef}
                className="bg-gray-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-white/10">
                    <h2 id="sessions-modal-title" className="text-xl font-bold text-white">My Sessions</h2>
                    <p id="sessions-modal-description" className="text-sm text-gray-400">Select a session to load or delete.</p>
                </div>
                <div className="p-4 overflow-y-auto flex-grow">
                    {isLoading && <p className="text-center text-gray-400">Loading sessions...</p>}
                    {error && <p className="text-center text-red-400">{error}</p>}
                    {!isLoading && !error && sessions.length === 0 && (
                        <p className="text-center text-gray-400 italic">You have no saved sessions.</p>
                    )}
                    {!isLoading && !error && sessions.length > 0 && (
                        <ul className="space-y-3">
                            {sessions.map(session => (
                                <li key={session.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between gap-4 group">
                                    <div>
                                        <p className="font-semibold text-white">{session.title}</p>
                                        <p className="text-sm text-gray-400">Topic: {session.topic}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Last updated: {new Date(session.updatedAt?.toDate()).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => onLoadSession(session)}
                                            className="px-4 py-2 text-sm font-bold bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors"
                                        >
                                            Load
                                        </button>
                                        <button
                                            onClick={() => handleDelete(session.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                            aria-label={`Delete session: ${session.title}`}
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="p-4 border-t border-white/10 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionsModal;
