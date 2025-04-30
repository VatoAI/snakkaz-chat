import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Mic, Square, Trash, Send, Pause, Play } from "lucide-react";
import { cn } from "../lib/utils";

interface EnhancedAudioRecorderProps {
  onAudioReady: (audioBlob: Blob) => void;
  onCancel: () => void;
  className?: string;
}

export const EnhancedAudioRecorder: React.FC<EnhancedAudioRecorderProps> = ({
  onAudioReady,
  onCancel,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Opprett en forhåndsvisningslenke for avspilling
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        
        // Stopp alle spor i strømmen
        stream.getTracks().forEach(track => track.stop());
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Kunne ikke få tilgang til mikrofonen. Vennligst gi tillatelse og prøv igjen.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendAudio = () => {
    if (audioBlob) {
      onAudioReady(audioBlob);
      setAudioBlob(null);
      setRecordingTime(0);
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    }
  };

  const handleCancelAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    onCancel();
  };

  const togglePlayAudio = () => {
    if (!audioUrlRef.current) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrlRef.current);
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!audioBlob ? (
        <>
          <Button 
            type="button"
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "secondary"}
            size="icon"
            className={cn(
              "rounded-full transition-all duration-200 flex items-center justify-center",
              isRecording ? "h-12 w-12 bg-red-500 hover:bg-red-600" : "h-12 w-12"
            )}
          >
            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          {isRecording && (
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2 w-full">
          <Button
            type="button"
            onClick={togglePlayAudio}
            variant="secondary"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 px-3 py-1.5 bg-muted/50 rounded-full text-sm">
            <div className="flex items-center justify-between">
              <span>Lydopptak</span>
              <span>{formatTime(recordingTime)}</span>
            </div>
          </div>
          
          <Button
            type="button"
            onClick={handleCancelAudio}
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            onClick={handleSendAudio}
            variant="primary"
            size="icon"
            className="rounded-full h-10 w-10 bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};