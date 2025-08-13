import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Download } from 'lucide-react';

interface VoiceMessagePlayerProps {
  audioUrl: string;
  duration: number;
  waveformData: number[];
  isFromSelf?: boolean;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({
  audioUrl,
  duration,
  waveformData,
  isFromSelf = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const current = audio.currentTime;
      const total = audio.duration || duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `voice-message-${Date.now()}.wav`;
    link.click();
  };

  return (
    <motion.div
      className={`max-w-xs p-4 rounded-2xl ${
        isFromSelf 
          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 ml-auto' 
          : 'bg-slate-800/50 border border-gray-600/30'
      }`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center space-x-3">
        {/* Play/Pause Button */}
        <motion.button
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isFromSelf 
              ? 'bg-blue-500/30 hover:bg-blue-500/40' 
              : 'bg-gray-600/30 hover:bg-gray-600/40'
          } transition-colors`}
          onClick={togglePlayPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </motion.button>

        {/* Waveform and Progress */}
        <div className="flex-1">
          <div className="flex items-center space-x-1 h-8 mb-1">
            {waveformData.map((value, index) => {
              const isActive = (index / waveformData.length) * 100 <= progress;
              return (
                <div
                  key={index}
                  className={`w-0.5 rounded-full transition-colors duration-150 ${
                    isActive 
                      ? isFromSelf 
                        ? 'bg-blue-400' 
                        : 'bg-purple-400'
                      : 'bg-gray-500/50'
                  }`}
                  style={{ height: `${Math.max(4, value * 24)}px` }}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Download Button */}
        <motion.button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-600/20 hover:bg-gray-600/30 transition-colors"
          onClick={downloadAudio}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-3 h-3 text-gray-400" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VoiceMessagePlayer;
