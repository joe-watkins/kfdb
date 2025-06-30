import React from 'react';

const LoadingDots: React.FC = () => {
    return (
        <span className="animate-blink inline-flex items-center align-middle ml-2">
            <span className="h-2 w-2 bg-current rounded-full"></span>
            <span className="h-2 w-2 bg-current rounded-full ml-1"></span>
            <span className="h-2 w-2 bg-current rounded-full ml-1"></span>
        </span>
    );
};

export default LoadingDots;
