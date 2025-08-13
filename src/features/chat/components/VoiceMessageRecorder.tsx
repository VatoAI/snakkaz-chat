import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, X, Play, Pause } from 'lucide-react';

interface VoiceMessageRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob, duration: number, waveformData: number[]) => void;
  onClose: () => void;
}

const VoiceMessageRecorder: React.FC<VoiceMessageRecorderProps> = ({
  onSendVoiceMessage,
  onClose
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Setup audio analysis for waveform
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start duration timer and waveform analysis
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 0.1);
        
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setWaveformData(prev => [...prev.slice(-50), average / 255]);
        }
      }, 100);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const playPause = () => {
    if (!audioElementRef.current || !audioUrl) return;

    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const sendVoiceMessage = () => {
    if (audioUrl && audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      onSendVoiceMessage(audioBlob, duration, waveformData);
      onClose();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div 
          className="glass-card p-8 max-w-md w-full"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              {isRecording ? 'Recording...' : audioUrl ? 'Voice Message Ready' : 'Record Voice Message'}
            </h3>
            <p className="text-gray-400 text-sm">
              {formatDuration(duration)}
            </p>
          </div>

          {/* Waveform Visualization */}
          <div className="mb-6 h-16 bg-slate-800/50 rounded-lg p-2 flex items-center justify-center">
            <div className="flex items-end space-x-1 h-full">
              {waveformData.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-t from-blue-500 to-purple-500 w-1 rounded-full"
                  style={{ height: `${Math.max(2, value * 100)}%` }}
                  animate={{ height: `${Math.max(2, value * 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Audio Element for Playback */}
          {audioUrl && (
            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            {!audioUrl ? (
              <motion.button
                className={`glass-button p-4 rounded-full ${
                  isRecording ? 'bg-red-500/20 border-red-500' : 'primary'
                }`}
                onClick={isRecording ? stopRecording : startRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRecording ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </motion.button>
            ) : (
              <motion.button
                className="glass-button p-4 rounded-full primary"
                onClick={playPause}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </motion.button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.button
              className="glass-button flex-1 py-3"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </motion.button>
            
            {audioUrl && (
              <motion.button
                className="glass-button primary flex-1 py-3"
                onClick={sendVoiceMessage}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceMessageRecorder;
