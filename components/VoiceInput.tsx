import React, { useState } from 'react';
import { BsMic, BsStopCircle } from 'react-icons/bs';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ value, onChange, placeholder }) => {
  const [isRecording, setIsRecording] = useState(false);

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
};

export default VoiceInput;
