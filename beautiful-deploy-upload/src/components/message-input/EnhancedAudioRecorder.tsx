import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Trash, Send, Loader2 } from "lucide-react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

interface EnhancedAudioRecorderProps {
  isLoading: boolean;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  setSelectedFile: (file: File | null) => void;
  onSend?: (file: File) => Promise<void>;
}

export const EnhancedAudioRecorder: React.FC<EnhancedAudioRecorderProps> = ({
  isLoading,
  isRecording,
  setIsRecording,
  setSelectedFile,
  onSend
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  
  const { isMobile } = useDeviceDetection();

  // Timer for recording duration
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setAudioChunks([...chunks]);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Automatically create a file
        const audioFile = new File([blob], `voice-message-${new Date().toISOString()}.webm`, { 
          type: 'audio/webm' 
        });
        
        setSelectedFile(audioFile);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      setAudioChunks([]);
      setAudioBlob(null);
      
      // Request data every 1 second for better progress indication
      recorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Kunne ikke starte lydopptak. Sjekk at mikrofonen er tilgjengelig.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
    
    setIsRecording(false);
    setSelectedFile(null);
    setAudioBlob(null);
    setAudioChunks([]);
  };

  const sendAudio = async () => {
    if (!audioBlob || !onSend) return;
    
    try {
      setIsSending(true);
      
      const audioFile = new File([audioBlob], `voice-message-${new Date().toISOString()}.webm`, { 
        type: 'audio/webm' 
      });
      
      await onSend(audioFile);
      
      // Reset after sending
      setAudioBlob(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending audio:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If we have a recorded audio blob but no active recording
  if (audioBlob && !isRecording) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
          onClick={cancelRecording}
        >
          <Trash className="w-4 h-4" />
        </Button>
        
        {onSend && (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
            onClick={sendAudio}
            disabled={isSending}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <Send className="w-4 h-4 mr-1" />
            )}
            <span>Send lydmelding</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={`bg-cyberdark-800 border-cybergold-500/30 ${
          isRecording 
            ? 'text-red-500 hover:text-red-400 animate-pulse' 
            : 'text-cybergold-400 hover:text-cybergold-300'
        } hover:bg-cyberdark-700`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
      >
        <Mic className="w-4 h-4" />
      </Button>
      
      {isRecording && (
        <div className="ml-2 text-xs text-red-400 flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
          {formatTime(recordingTime)}
        </div>
      )}
    </div>
  );
};