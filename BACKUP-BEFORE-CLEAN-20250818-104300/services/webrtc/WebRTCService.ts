import adapter from "webrtc-adapter";

export interface CallConfig {
  video: boolean;
  audio: boolean;
  screen?: boolean;
}

export interface CallState {
  isActive: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isScreenSharing: boolean;
  participants: string[];
  duration: number;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private localVideoElement: HTMLVideoElement | null = null;
  private remoteVideoElement: HTMLVideoElement | null = null;
  private onStateChange?: (state: CallState) => void;
  private callStartTime: number = 0;

  // ICE Servers configuration
  private readonly iceServers: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  };

  constructor() {
    console.log("WebRTC Adapter version:", adapter.browserDetails);
  }

  // Initialize call state callback
  setStateChangeCallback(callback: (state: CallState) => void) {
    this.onStateChange = callback;
  }

  // Get user media (camera/microphone)
  async getUserMedia(config: CallConfig): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: config.video
          ? {
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              frameRate: { ideal: 30, max: 60 },
            }
          : false,
        audio: config.audio
          ? {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error("Error getting user media:", error);
      throw new Error("Kunne ikke få tilgang til kamera/mikrofon");
    }
  }

  // Get screen sharing stream
  async getScreenShare(): Promise<MediaStream> {
    try {
      // @ts-ignore - getDisplayMedia may not be in all type definitions
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 30, max: 60 },
        },
        audio: true,
      });

      return screenStream;
    } catch (error) {
      console.error("Error getting screen share:", error);
      throw new Error("Kunne ikke dele skjermen");
    }
  }

  // Initialize peer connection
  async initializePeerConnection(): Promise<RTCPeerConnection> {
    this.peerConnection = new RTCPeerConnection(this.iceServers);

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log("Received remote stream");
      this.remoteStream = event.streams[0];
      if (this.remoteVideoElement) {
        this.remoteVideoElement.srcObject = this.remoteStream;
      }
      this.updateCallState();
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
        // TODO: Send candidate to remote peer via signaling server
        this.sendSignalingMessage({
          type: "ice-candidate",
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", this.peerConnection?.connectionState);
      this.updateCallState();
    };

    return this.peerConnection;
  }

  // Start a call
  async startCall(config: CallConfig, remoteUserId: string): Promise<void> {
    try {
      // Get user media
      await this.getUserMedia(config);

      // Initialize peer connection
      await this.initializePeerConnection();

      // Add local stream to peer connection
      if (this.localStream && this.peerConnection) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream!);
        });
      }

      // Create offer
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);

      // Send offer to remote peer
      this.sendSignalingMessage({
        type: "offer",
        offer: offer,
        targetUserId: remoteUserId,
      });

      this.callStartTime = Date.now();
      this.updateCallState();
    } catch (error) {
      console.error("Error starting call:", error);
      throw error;
    }
  }

  // Answer a call
  async answerCall(
    offer: RTCSessionDescriptionInit,
    config: CallConfig
  ): Promise<void> {
    try {
      // Get user media
      await this.getUserMedia(config);

      // Initialize peer connection
      await this.initializePeerConnection();

      // Add local stream to peer connection
      if (this.localStream && this.peerConnection) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream!);
        });
      }

      // Set remote description
      await this.peerConnection!.setRemoteDescription(offer);

      // Create answer
      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);

      // Send answer to remote peer
      this.sendSignalingMessage({
        type: "answer",
        answer: answer,
      });

      this.callStartTime = Date.now();
      this.updateCallState();
    } catch (error) {
      console.error("Error answering call:", error);
      throw error;
    }
  }

  // Handle received answer
  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  }

  // Handle received ICE candidate
  async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    try {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
    }
  }

  // Toggle video
  toggleVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.updateCallState();
        return videoTrack.enabled;
      }
    }
    return false;
  }

  // Toggle audio
  toggleAudio(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.updateCallState();
        return audioTrack.enabled;
      }
    }
    return false;
  }

  // Start screen sharing
  async startScreenShare(): Promise<void> {
    try {
      const screenStream = await this.getScreenShare();

      if (this.peerConnection && this.localStream) {
        // Replace video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = this.peerConnection
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");

        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }

        // Update local video element
        if (this.localVideoElement) {
          this.localVideoElement.srcObject = screenStream;
        }

        // Handle screen share end
        videoTrack.onended = () => {
          this.stopScreenShare();
        };

        this.updateCallState();
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
      throw error;
    }
  }

  // Stop screen sharing
  async stopScreenShare(): Promise<void> {
    try {
      if (this.peerConnection && this.localStream) {
        // Replace screen share with camera
        const videoTrack = this.localStream.getVideoTracks()[0];
        const sender = this.peerConnection
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");

        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }

        // Update local video element
        if (this.localVideoElement) {
          this.localVideoElement.srcObject = this.localStream;
        }

        this.updateCallState();
      }
    } catch (error) {
      console.error("Error stopping screen share:", error);
    }
  }

  // End call
  endCall(): void {
    // Stop all tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Clear video elements
    if (this.localVideoElement) {
      this.localVideoElement.srcObject = null;
    }
    if (this.remoteVideoElement) {
      this.remoteVideoElement.srcObject = null;
    }

    this.callStartTime = 0;
    this.updateCallState();

    // Notify remote peer
    this.sendSignalingMessage({
      type: "end-call",
    });
  }

  // Set video elements
  setVideoElements(local: HTMLVideoElement, remote: HTMLVideoElement): void {
    this.localVideoElement = local;
    this.remoteVideoElement = remote;

    // Set current streams if available
    if (this.localStream) {
      local.srcObject = this.localStream;
    }
    if (this.remoteStream) {
      remote.srcObject = this.remoteStream;
    }
  }

  // Get current call state
  getCallState(): CallState {
    const isActive = this.peerConnection?.connectionState === "connected";
    const videoTrack = this.localStream?.getVideoTracks()[0];
    const audioTrack = this.localStream?.getAudioTracks()[0];

    return {
      isActive,
      isVideo: videoTrack?.enabled || false,
      isAudio: audioTrack?.enabled || false,
      isScreenSharing: false, // TODO: Track screen sharing state
      participants: isActive ? ["local", "remote"] : [],
      duration: this.callStartTime
        ? Math.floor((Date.now() - this.callStartTime) / 1000)
        : 0,
    };
  }

  // Update call state and notify callback
  private updateCallState(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getCallState());
    }
  }

  // Send signaling message (to be implemented with actual signaling server)
  private sendSignalingMessage(message: any): void {
    console.log("Sending signaling message:", message);
    // TODO: Implement actual signaling via WebSocket/Socket.io
    // This could integrate with Supabase real-time or custom WebSocket server
  }

  // Check browser compatibility
  static isSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.RTCPeerConnection &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    );
  }

  // Get available devices
  static async getDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices;
    } catch (error) {
      console.error("Error getting devices:", error);
      return [];
    }
  }
}

export default WebRTCService;
