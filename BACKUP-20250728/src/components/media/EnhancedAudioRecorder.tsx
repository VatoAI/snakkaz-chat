import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Stop, Loader2, Play, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatDuration } from '@/utils/formatting/time';

interface EnhancedAudioRecorderProps {
  onUpload: (file: File) => Promise<void>;
}

export function EnhancedAudioRecorder({ onUpload }: EnhancedAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number>(0);
  const { toast } = useToast();
  
  // Function to start recording
  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setMediaRecorder(recorder);
      setAudioChunks([]);
      setAudioURL(null);
      setIsRecording(true);
      setIsPlaying(false);
      setRecordedDuration(0);
      
      recorder.ondataavailable = (event) => {
        setAudioChunks(prev => [...prev, event.data]);
      };
      
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setIsProcessing(true);
        clearInterval(timerRef.current);
        
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setIsProcessing(false);
      };
      
      recorder.start();
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordedDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Kunne ikke starte opptak",
        description: "Vennligst sjekk mikrofontillatelsene dine.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  }, [toast, setMediaRecorder, setAudioChunks, setIsRecording, setAudioURL, setIsProcessing, setRecordedDuration]);
  
  // Function to stop recording
  const handleStopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  }, [mediaRecorder]);
  
  // Function to toggle playback
  const handleTogglePlayback = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(prev => !prev);
    }
  }, [isPlaying]);
  
  // Function to handle audio upload
  const handleUpload = useCallback(async () => {
    if (!audioURL) {
      toast({
        title: "Ingen lyd å laste opp",
        description: "Vennligst ta opp lyd først.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();
      const file = new File([blob], "audio.webm", { type: "audio/webm" });
      
      await onUpload(file);
      setAudioURL(null);
      setAudioChunks([]);
      setIsPlaying(false);
      setRecordedDuration(0);
      
      toast({
        title: "Lyd lastet opp",
        description: "Lydklippet er lastet opp.",
      });
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast({
        title: "Kunne ikke laste opp lyd",
        description: "En feil oppstod under opplastingen.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [audioURL, onUpload, toast]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-sm text-cybergold-400">
        {isRecording
          ? `Recording... ${formatDuration(recordedDuration)}`
          : audioURL
            ? `Recorded: ${formatDuration(recordedDuration)}`
            : "Press the mic to start recording"}
      </div>
      
      <div className="flex space-x-4">
        {!audioURL ? (
          <Button
            onClick={handleStartRecording}
            variant="default" // Changed from "primary" to "default"
            disabled={isRecording || isProcessing}
          >
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={handleTogglePlayback}
            variant="outline"
            disabled={isProcessing}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play
              </>
            )}
          </Button>
        )}
        
        {isRecording ? (
          <Button
            onClick={handleStopRecording}
            variant="destructive"
            disabled={isProcessing}
          >
            <Stop className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        ) : (
          audioURL && (
            <Button
              onClick={handleUpload}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Audio"
              )}
            </Button>
          )
        )}
      </div>
      
      {audioURL && (
        <audio ref={audioRef} src={audioURL} controls className="w-full" />
      )}
    </div>
  );
}
