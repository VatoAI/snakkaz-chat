import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Mic, Square, Trash, Send } from "lucide-react";
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
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
        
        // Stop all tracks in the stream
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
    }
  };

  const handleCancelAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    onCancel();
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
            className="rounded-full h-12 w-12 flex items-center justify-center"
          >
            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleCancelAudio}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Trash className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-md">
            <span className="text-sm">Lydopptak ({formatTime(recordingTime)})</span>
          </div>
          <Button
            type="button"
            onClick={handleSendAudio}
            variant="primary"
            size="icon"
            className="rounded-full"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};