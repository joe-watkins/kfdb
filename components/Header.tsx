import React from 'react';
import { LogoIcon, DownloadIcon, OutlineIcon } from './icons';

interface HeaderProps {
    onExport: () => void;
    onCreateOutline: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onCreateOutline }) => {
    return (
        <header className="p-4 border-b border-white/10 sticky top-0 bg-[#0d1117]/80 backdrop-blur-sm z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold text-gray-50 bg-transparent">KFDB</h1>
                </div>
                <div className="flex gap-2">
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
            </div>
        </header>
    );
};

export default Header;