import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon, DownloadIcon, OutlineIcon, DeleteIcon } from './icons';
import { loadFromLocalStorage } from '../services/localStorageService';

interface HeaderProps {
    onExport: () => void;
    onCreateOutline: () => void;
    onStartOver: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onCreateOutline, onStartOver }) => {
    const hasStartedKFDB = !!loadFromLocalStorage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isMenuOpen) {
            setIsMenuOpen(false);
            menuButtonRef.current?.focus();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen]);

    return (
        <header className="p-4 border-b border-white/10 sticky top-0 bg-[#0d1117]/80 backdrop-blur-sm z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold text-gray-50 bg-transparent">KFDB</h1>
                </div>
                {hasStartedKFDB && (
                    <>
                        <div className="hidden md:flex gap-2">
                            <button 
                                onClick={onStartOver}
                                className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors"
                                aria-label="Start over - clear all data"
                            >
                                <DeleteIcon />
                                <span className="text-sm font-medium">Start Over</span>
                            </button>
                            <button 
                                onClick={onCreateOutline}
                                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                aria-label="Create presentation outline"
                            >
                                <OutlineIcon />
                                <span className="text-sm font-medium">Create Outline</span>
                            </button>
                            <button 
                                onClick={onExport}
                                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                aria-label="Export session as Markdown"
                            >
                                <DownloadIcon />
                                <span className="text-sm font-medium">Export Markdown</span>
                            </button>
                        </div>
                        <button
                            id="menu-toggle"
                            aria-label="Menu"
                            aria-expanded={isMenuOpen}
                            aria-controls="menu"
                            onClick={toggleMenu}
                            ref={menuButtonRef}
                            className="md:hidden text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors px-3 py-2"
                        >
                            ☰
                        </button>
                    </>
                )}
            </div>
            {hasStartedKFDB && (
                <ul
                    id="menu"
                    className={`absolute top-16 right-4 bg-[#0d1117] shadow-md rounded-md p-4 md:hidden ${isMenuOpen ? '' : 'hidden'}`}
                >
                    <li>
                        <button 
                            onClick={onStartOver}
                            className="block w-full text-left text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md px-3 py-2"
                            aria-label="Start over - clear all data"
                        >
                            Start Over
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={onCreateOutline}
                            className="block w-full text-left text-gray-400 hover:text-white hover:bg-white/10 rounded-md px-3 py-2"
                            aria-label="Create presentation outline"
                        >
                            Create Outline
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={onExport}
                            className="block w-full text-left text-gray-400 hover:text-white hover:bg-white/10 rounded-md px-3 py-2"
                            aria-label="Export session as Markdown"
                        >
                            Export Markdown
                        </button>
                    </li>
                </ul>
            )}
        </header>
    );
};

export default Header;