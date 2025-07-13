
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface AudioRecorderProps {
  isLoading: boolean;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  setSelectedFile: (file: File | null) => void;
}

export const AudioRecorder = ({
  isLoading,
  isRecording,
  setIsRecording,
  setSelectedFile
}: AudioRecorderProps) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
        setSelectedFile(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };
      
      setAudioChunks([]);
      recorder.start();
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

  return (
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
  );
};
