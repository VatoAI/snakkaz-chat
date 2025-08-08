import React, { useState, useRef, useEffect } from 'react';
import {
    IconPhone, IconPhoneOff, IconVideo, IconVideoOff,
    IconMicrophone, IconMicrophoneOff, IconScreenShare,
    IconScreenShareOff, IconMaximize, IconMinimize,
    IconX, IconUsers
} from '@tabler/icons-react';
import WebRTCService, { CallConfig, CallState } from '../../services/webrtc/WebRTCService';

interface VideoCallProps {
    isOpen: boolean;
    onClose: () => void;
    targetUserId?: string;
    incomingCall?: {
        from: string;
        offer: RTCSessionDescriptionInit;
    };
}

const VideoCall: React.FC<VideoCallProps> = ({
    isOpen,
    onClose,
    targetUserId,
    incomingCall
}) => {
    // State management
    const [callState, setCallState] = useState<CallState>({
        isActive: false,
        isVideo: true,
        isAudio: true,
        isScreenSharing: false,
        participants: [],
        duration: 0
    });
    const [isMinimized, setIsMinimized] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for video elements
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const webrtcService = useRef<WebRTCService | null>(null);

    // Initialize WebRTC service
    useEffect(() => {
        if (isOpen && !webrtcService.current) {
            webrtcService.current = new WebRTCService();
            webrtcService.current.setStateChangeCallback(setCallState);

            // Set video elements when available
            if (localVideoRef.current && remoteVideoRef.current) {
                webrtcService.current.setVideoElements(
                    localVideoRef.current,
                    remoteVideoRef.current
                );
            }
        }

        return () => {
            if (webrtcService.current && !isOpen) {
                webrtcService.current.endCall();
                webrtcService.current = null;
            }
        };
    }, [isOpen]);

    // Handle incoming call
    useEffect(() => {
        if (incomingCall && webrtcService.current) {
            handleIncomingCall();
        }
    }, [incomingCall]);

    // Start outgoing call
    const startCall = async (video: boolean = true) => {
        if (!webrtcService.current || !targetUserId) return;

        try {
            setIsConnecting(true);
            setError(null);

            const config: CallConfig = {
                video,
                audio: true
            };

            await webrtcService.current.startCall(config, targetUserId);
        } catch (error) {
            console.error('Error starting call:', error);
            setError(error instanceof Error ? error.message : 'Kunne ikke starte samtalen');
            setIsConnecting(false);
        }
    };

    // Handle incoming call
    const handleIncomingCall = async () => {
        if (!webrtcService.current || !incomingCall) return;

        try {
            setIsConnecting(true);
            setError(null);

            const config: CallConfig = {
                video: true,
                audio: true
            };

            await webrtcService.current.answerCall(incomingCall.offer, config);
            setIsConnecting(false);
        } catch (error) {
            console.error('Error answering call:', error);
            setError(error instanceof Error ? error.message : 'Kunne ikke svare på samtalen');
            setIsConnecting(false);
        }
    };

    // End call
    const endCall = () => {
        if (webrtcService.current) {
            webrtcService.current.endCall();
        }
        onClose();
    };

    // Toggle video
    const toggleVideo = () => {
        if (webrtcService.current) {
            webrtcService.current.toggleVideo();
        }
    };

    // Toggle audio
    const toggleAudio = () => {
        if (webrtcService.current) {
            webrtcService.current.toggleAudio();
        }
    };

    // Toggle screen sharing
    const toggleScreenShare = async () => {
        if (!webrtcService.current) return;

        try {
            if (callState.isScreenSharing) {
                await webrtcService.current.stopScreenShare();
            } else {
                await webrtcService.current.startScreenShare();
            }
        } catch (error) {
            console.error('Error toggling screen share:', error);
            setError('Kunne ikke dele skjermen');
        }
    };

    // Format call duration
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed ${isMinimized ? 'bottom-4 right-4 w-80 h-48' : 'inset-0'} bg-black bg-opacity-90 flex items-center justify-center z-50`}>
            <div className={`bg-gray-900 rounded-lg overflow-hidden ${isMinimized ? 'w-full h-full' : 'w-full max-w-4xl h-full max-h-[90vh]'} flex flex-col`}>
                {/* Header */}
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <IconVideo className="w-5 h-5 text-blue-400" />
                        <div>
                            <h3 className="text-white font-medium">
                                {incomingCall ? `Innkommende fra ${incomingCall.from}` :
                                    targetUserId ? `Ring til ${targetUserId}` : 'Video Call'}
                            </h3>
                            {callState.isActive && (
                                <p className="text-gray-400 text-sm">
                                    {formatDuration(callState.duration)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            {isMinimized ? <IconMaximize className="w-4 h-4" /> : <IconMinimize className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <IconX className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Video Area */}
                <div className="flex-1 relative bg-gray-900">
                    {error && (
                        <div className="absolute top-4 left-4 right-4 bg-red-600 text-white p-3 rounded-lg z-10">
                            {error}
                        </div>
                    )}

                    {isConnecting && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                            <div className="text-white text-center">
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p>Kobler til...</p>
                            </div>
                        </div>
                    )}

                    {/* Remote Video (Main) */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover bg-gray-800"
                    />

                    {/* Local Video (Picture-in-Picture) */}
                    <div className={`absolute ${isMinimized ? 'bottom-2 right-2 w-20 h-15' : 'top-4 right-4 w-48 h-36'} bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600`}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {!callState.isVideo && (
                            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                                <IconVideoOff className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Participants Info */}
                    {callState.participants.length > 0 && !isMinimized && (
                        <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <IconUsers className="w-4 h-4" />
                                <span className="text-sm">{callState.participants.length} deltagere</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-gray-800 px-4 py-4">
                    <div className="flex items-center justify-center space-x-4">
                        {/* Audio Toggle */}
                        <button
                            onClick={toggleAudio}
                            className={`p-3 rounded-full transition-colors ${callState.isAudio
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            title={callState.isAudio ? 'Skru av lyd' : 'Skru på lyd'}
                        >
                            {callState.isAudio ? (
                                <IconMicrophone className="w-5 h-5" />
                            ) : (
                                <IconMicrophoneOff className="w-5 h-5" />
                            )}
                        </button>

                        {/* Video Toggle */}
                        <button
                            onClick={toggleVideo}
                            className={`p-3 rounded-full transition-colors ${callState.isVideo
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            title={callState.isVideo ? 'Skru av video' : 'Skru på video'}
                        >
                            {callState.isVideo ? (
                                <IconVideo className="w-5 h-5" />
                            ) : (
                                <IconVideoOff className="w-5 h-5" />
                            )}
                        </button>

                        {/* Screen Share Toggle */}
                        <button
                            onClick={toggleScreenShare}
                            className={`p-3 rounded-full transition-colors ${callState.isScreenSharing
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                            title={callState.isScreenSharing ? 'Stopp skjermdeling' : 'Del skjerm'}
                        >
                            {callState.isScreenSharing ? (
                                <IconScreenShareOff className="w-5 h-5" />
                            ) : (
                                <IconScreenShare className="w-5 h-5" />
                            )}
                        </button>

                        {/* End Call */}
                        <button
                            onClick={endCall}
                            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title="Avslutt samtale"
                        >
                            <IconPhoneOff className="w-5 h-5" />
                        </button>

                        {/* Start Call (if not active) */}
                        {!callState.isActive && !isConnecting && (
                            <>
                                <button
                                    onClick={() => startCall(true)}
                                    className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                                    title="Start videosamtale"
                                >
                                    <IconVideo className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => startCall(false)}
                                    className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                    title="Start lydsamtale"
                                >
                                    <IconPhone className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
