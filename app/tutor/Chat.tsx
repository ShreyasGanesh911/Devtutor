'use client'
import React, { useEffect, useRef, useState } from 'react'
import { createEventMessage, gpt_script, welcomeMessage} from './functions';
import MessageBubble from './components/MessageBubble';
import SessionControls from './components/SessionControls';
import MicButton from './components/MicButton';
import { Message, EventMessage } from '../types';

function Chat() {

  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>('');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([{ text: welcomeMessage, isUser: false, timestamp: new Date() }]);
  // Audio recording state
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  
  const enableMicrophone = async (e: React.MouseEvent | React.TouchEvent) => {
    if (!peerConnection.current || !mediaStream.current) return;
    try {
      // Start recording
      audioChunks.current = [];
      mediaRecorder.current = new MediaRecorder(mediaStream.current);
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
      mediaRecorder.current.start();
      mediaStream.current.getTracks().forEach(track => {
        track.enabled = true;
      });
      setIsMicActive(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const disableMicrophone = async (e: React.MouseEvent | React.TouchEvent) => {
    if (!peerConnection.current || !mediaStream.current || !mediaRecorder.current) return;
    try {
      mediaRecorder.current.stop();
      mediaStream.current.getTracks().forEach(track => {
        track.enabled = false;
      });
      setIsMicActive(false);
      // Wait for the recording to be complete
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        // Only proceed if we have audio data
        if (audioBlob.size === 0) {
          console.error('No audio data recorded');
          return;
        }
        // sendTextMessage("🎤 Audio message sent")
        // const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
        // try {
        //   const formData = new FormData();
        //   formData.append('file', audioFile);
        //   formData.append('model', 'whisper-1');
        //   const response = await fetch("api/session",{
        //     method:"POST",
        //     body:formData
        //   })
        //   const data = await response.json()
        //   console.log("Transcription Data",data)
        //   const transcribedText = data.text;
        //   if (transcribedText) {
        //     sendTextMessage(transcribedText);
        //   }
        // } catch (error) {
        //   console.error('Error getting transcription', error);
        // }
      };
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  async function startSession() {
    try {
    const tokenResponse = await fetch("api/session");
    if (!tokenResponse.ok) {
      console.error("Failed to fetch token:", tokenResponse.statusText);
      return;
    }
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;
    const pc = new RTCPeerConnection();
    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    pc.ontrack = (e) => {
      if (audioElement.current) audioElement.current.srcObject = e.streams[0];
      
    };
    const ms = await navigator.mediaDevices.getUserMedia({audio: true});
    // Start with microphone disabled
    ms.getTracks().forEach(track => {
      track.enabled = false;
    });
    mediaStream.current = ms;
    pc.addTrack(ms.getTracks()[0]);
    // Set up data channel for sending and receiving events
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);
    // Start the session using the Session Description Protocol (SDP)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2024-12-17";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
    });

    const answer: RTCSessionDescriptionInit = {
      type: 'answer',
      sdp: await sdpResponse.text(),
    };
    await pc.setRemoteDescription(answer);

    peerConnection.current = pc;
    setIsSessionActive(true);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }
  
  function stopSession() {
    // successToast("Assessment Ended")
    if (dataChannel) {
      dataChannel.close();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStream.current = null;
    }
    // Close the peer connection
    if (peerConnection.current) peerConnection.current.close();
    setIsSessionActive(false);
    setIsMicActive(false);
    setDataChannel(null);
    peerConnection.current = null;
    // Clean up audio element
    if (audioElement.current) audioElement.current.srcObject = null;
  }

  function sendClientEvent(message: EventMessage) {
    if (dataChannel) {
      const timestamp = new Date().toLocaleTimeString();
      message.event_id = message.event_id || crypto.randomUUID();
      dataChannel.send(JSON.stringify(message));
      if (!message.timestamp) message.timestamp = timestamp;
      setEvents((prev) => [message, ...prev]);
    } else  console.error("Failed to send message - no data channel available",message);
    
  }
  function sendTextMessage(message: string) {
    setMessages([...messages, { isUser: true, text: message, timestamp: new Date() }]);
    const event = createEventMessage("message","user","input_text",message)
    sendClientEvent(event);
    sendClientEvent({ type: "response.create" });
  }

  const messageHandler = (e: MessageEvent) => {
    const eventData = JSON.parse(e.data);
    let transcript = eventData.response?.output[0]?.content[0]?.transcript; 
    if(transcript) 
      console.log("Transcription", transcript);
    if (eventData.type === "input_audio_buffer.committed") {
      setMessages(prev => [...prev, { 
        id: eventData.event_id,
        isUser: true, 
        text: "🎤 Audio message sent", 
        timestamp: new Date() 
      }]);
    }
    if(eventData.type === "response.audio_transcript.delta") {
      const deltaText = eventData.delta;
      console.log("Delta Text", deltaText);
      if (typeof deltaText === "string") {
        setMessages(prev => {
          // Check if we have a previous message from assistant
          const lastMessage = prev[prev.length - 1];
          // If no messages or last message is from user, create new one
          if (!lastMessage || lastMessage.isUser) {
            const newId = Date.now().toString();
            setCurrentMessageId(newId);
            setCurrentText(deltaText);
            return [...prev, { 
              id: newId,
              isUser: false, 
              text: deltaText, 
              timestamp: new Date() 
            }];
          }
          // Otherwise update the last message
          setCurrentText(prev => prev + deltaText);
          return prev.map((msg, index) => {
            if (index === prev.length - 1) {
              return { ...msg, text: msg.text + deltaText };
            }
            return msg;
          });
        });
      }
    }
    if (eventData.type === "response.done") {
      setCurrentMessageId(null);
      setCurrentText('');
    }
  };
  useEffect(() => {
    if (dataChannel) {
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
        // Send the sales script once the channel is open
        const systemEvent = createEventMessage("message","system","input_text",gpt_script)
        sendClientEvent(systemEvent);

        setMessages([...messages, { isUser: true, text: "Starting assessment", timestamp: new Date() }]);
        sendClientEvent({ type: "response.create" });
      });
      dataChannel.addEventListener("message", messageHandler);
      return () => {
        dataChannel.removeEventListener("message", messageHandler);
      };
    }
  }, [dataChannel]);
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <>
      <div className="flex w-1/2 justify-center items-start min-h-screen bg-gray-800 p-4">
        <div className="w-full  relative h-[95vh] bg-gray-900 rounded-2xl shadow-lg">
        <div ref={chatContainerRef} className="h-full overflow-y-auto pb-40 px-6 pt-6">
          {messages.map((message, index) => (
            <MessageBubble  key={message.id || index} index={index}  message={message}
              currentText={message.id === currentMessageId ? currentText : message.text}/>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="absolute bottom-0.5 w-full left-0  rounded-2xl right-0 px-6 bg-gray-900 mr-5">
            <SessionControls   startSession={startSession} stopSession={stopSession}
              sendClientEvent={sendClientEvent} sendTextMessage={sendTextMessage}
              serverEvents={events} isSessionActive={isSessionActive} />
            {isSessionActive && <MicButton disableMicrophone={disableMicrophone} enableMicrophone={enableMicrophone} isMicActive={isMicActive}/> }
        </div>
        </div>
    </div> 
    </>
  )
}

export default Chat
