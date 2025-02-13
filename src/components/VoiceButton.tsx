import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isRecording,
  isProcessing,
  onStart,
  onStop,
}) => {
  return (
    <button
      onMouseDown={onStart}
      onMouseUp={onStop}
      onMouseLeave={onStop}
      onTouchStart={onStart}
      onTouchEnd={onStop}
      disabled={isProcessing}
      className={`p-3 rounded-full transition-all ${
        isRecording
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-500 hover:bg-blue-600'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isRecording ? (
        <MicOff className="w-6 h-6 text-white" />
      ) : (
        <Mic className="w-6 h-6 text-white" />
      )}
    </button>
  );
};