import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { BsMic, BsStopCircle } from 'react-icons/bs';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export interface VoiceInputHandle {
  focus: () => void;
}

const VoiceInput = forwardRef<VoiceInputHandle, VoiceInputProps>(({ value, onChange, placeholder, autoFocus = false }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Function to position cursor at end of content
  const positionCursorAtEnd = () => {
    if (!contentRef.current) return;
    
    const element = contentRef.current;
    element.focus();
    
    // Position cursor at the end
    const range = document.createRange();
    const selection = window.getSelection();
    
    if (element.childNodes.length > 0) {
      // If there are child nodes, position at the end of the last text node
      const lastNode = element.childNodes[element.childNodes.length - 1];
      if (lastNode.nodeType === Node.TEXT_NODE) {
        range.setStart(lastNode, lastNode.textContent?.length || 0);
      } else {
        range.setStartAfter(lastNode);
      }
    } else {
      // If no child nodes, position at the start of the element
      range.setStart(element, 0);
    }
    
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  // Expose focus method to parent components
  useImperativeHandle(ref, () => ({
    focus: positionCursorAtEnd
  }), []);

  // Set initial content and sync when value prop changes
  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== value) {
      contentRef.current.textContent = value;
    }
  }, [value]);

  // Auto focus on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus) {
      // Small delay to ensure the element is rendered and ready
      const timer = setTimeout(positionCursorAtEnd, 10);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <div style={{ position: 'relative', flexGrow: 1 }}>
        <div
          ref={contentRef}
          contentEditable
          role="textbox"
          aria-label={placeholder}
          onInput={(e) => onChange(e.currentTarget.textContent || "")}
          className="w-full px-4 py-2 pr-10 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-400"
          style={{ minHeight: '2rem' }}
        ></div>
        <button
          type="button"
          onClick={handleVoiceInput}
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
            padding: '0.4rem',
          }}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? (
            <BsStopCircle className="text-red-400 hover:text-red-200 h-4 w-4" />
          ) : (
            <BsMic className="text-gray-400 hover:text-gray-200 h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
});

VoiceInput.displayName = 'VoiceInput';

export default VoiceInput;
