import { useState } from "react";
import { CloudLightning, CloudOff} from "react-feather";
import Button from "./Button";

// import { successToast } from "../Toasts/toast";

type SessionStoppedProps = {
  startSession: () => void;
};

function SessionStopped({ startSession }: SessionStoppedProps) {
  const [isActivating, setIsActivating] = useState(false);

  function handleStartSession() {
    // successToast("Starting Assessment ")
    if (isActivating) return;

    setIsActivating(true);
    startSession();
  }

  return (
    <div className="flex items-center justify-center pb-2 w-full h-full mt-2">
      <Button
        onClick={handleStartSession}
        className={isActivating ? "bg-blue-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}
        icon={<CloudLightning height={18} />}
      >
        {isActivating ? "Starting Assessment..." : "Start Assessment"}
      </Button>
    </div>
  );
}

type SessionActiveProps = {
  stopSession: () => void;
  sendTextMessage: (message: string) => void;
};

function SessionActive({ stopSession, sendTextMessage }: SessionActiveProps) {
  const [message, setMessage] = useState("");

  function handleSendClientEvent() {
    sendTextMessage(message);
    setMessage("");
  }

  return (
    <div className="flex items-center justify-center w-full h-full gap-4 bg-gray-900 ">
      <div className="absolute bottom-1 left-0 right-0 rounded mb-[-6px] bg-gray-900 mx-2 pb-4 flex items-center justify-center">
        <div className="flex items-center sm:gap-2 gap-1 p-1 w-full bg-gray-700 rounded-full shadow-lg border border-gray-600 sm:pr-4 pr-2">
          <input 
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim()) {
                handleSendClientEvent();
              }
            }}
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-4 bg-transparent rounded-full text-gray-200 placeholder-gray-400 outline-none"
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
          />

          <button 
            disabled={!message.trim()}
            onClick={() => {
              if (message.trim()) {
                handleSendClientEvent();
              }
            }}
            className="sm:p-1 p-1 text-blue-400 hover:text-blue-300 transition-colors hover:cursor-pointer duration-200 disabled:text-gray-500"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 transform rotate-90" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
          <button 
            onClick={stopSession} 
            className="text-red-400 hover:text-red-300 hover:cursor-pointer pr-2 transition-colors duration-200"
          >
            <CloudOff height={19} />
          </button>
        </div>
      </div>
    </div>
  );
}

type SessionControlsProps = {
  startSession: () => void;
  stopSession: () => void;
  sendClientEvent?: (event: any) => void; 
  sendTextMessage: (message: string) => void;
  serverEvents?: any; 
  isSessionActive: boolean;
};

export default function SessionControls({
  startSession,
  stopSession,
  sendTextMessage,
  isSessionActive,
}: SessionControlsProps) {
  return (
    <div className="flex gap-4 border-gray-700 h-full rounded-md">
      {isSessionActive ? (
        <SessionActive
          stopSession={stopSession}
          sendTextMessage={sendTextMessage}
        />
      ) : (
        <SessionStopped startSession={startSession} />
      )}
    </div>
  );
}