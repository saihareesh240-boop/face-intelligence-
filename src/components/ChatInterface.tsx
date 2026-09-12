import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Brain,
  Smile,
  HeartHandshake,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { ChatMessage, EmotionAnalysis } from "../types";
import { getEmotionColor } from "../utils/faceAnalysisEngine";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  currentEmotion: EmotionAnalysis;
  isLoading: boolean;
  onClearChat: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  currentEmotion,
  isLoading,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Speech Recognition (STT) setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };

  // Text to Speech (TTS) using Web Speech API
  const speakText = (text: string, msgId: string) => {
    if (!window.speechSynthesis) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const textToSend = inputText.trim();
    setInputText("");
    await onSendMessage(textToSend);
  };

  const handleQuickReply = async (reply: string) => {
    if (isLoading) return;
    await onSendMessage(reply);
  };

  const emotionColor = getEmotionColor(currentEmotion.primaryEmotion);

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl backdrop-blur-sm">
      {/* Chat Header with Adaptive Empathy Mode Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <HeartHandshake className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-slate-100">Facetelligence Companion</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Adaptive Empathy Mode:</span>
              <span className="text-cyan-300 font-mono font-medium">
                {currentEmotion.primaryEmotion === "joy"
                  ? "Celebratory & Resonant"
                  : currentEmotion.primaryEmotion === "anger"
                  ? "Calming Grounding & Validation"
                  : currentEmotion.primaryEmotion === "sadness"
                  ? "Gentle Comfort & Safe Space"
                  : currentEmotion.primaryEmotion === "surprise"
                  ? "Dynamic Curiosity"
                  : "Reflective Attentiveness"}
              </span>
            </div>
          </div>
        </div>

        {/* Clear Chat */}
        <button
          onClick={onClearChat}
          id="clear-chat-history-btn"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 min-h-[340px] max-h-[520px]">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 shadow-md ${
                  isUser
                    ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none"
                    : "bg-slate-950/90 border border-slate-800/90 text-slate-100 rounded-tl-none"
                }`}
              >
                {/* Header: Sender tag & snapshot */}
                <div className="flex items-center justify-between gap-3 mb-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    {isUser ? (
                      <>
                        <User className="w-3.5 h-3.5 opacity-80" />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-300 font-semibold">Facetelligence</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                </div>

                {/* User Message: Observed Facial Context snapshot badge */}
                {isUser && msg.emotionSnapshot && (
                  <div className="mb-2 px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] font-mono flex items-center gap-1.5">
                    <Smile className="w-3 h-3 text-cyan-200" />
                    <span>
                      Facial Telemetry:{" "}
                      <span className="font-bold uppercase tracking-wider">
                        {msg.emotionSnapshot.primaryEmotion}
                      </span>{" "}
                      ({Math.round(msg.emotionSnapshot.confidence)}% conf) · V:{" "}
                      {msg.emotionSnapshot.valence >= 0
                        ? `+${msg.emotionSnapshot.valence.toFixed(2)}`
                        : msg.emotionSnapshot.valence.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Bot Message: Observed Facial Cue & Empathy Strategy */}
                {!isUser && msg.botEmpathyStrategy && (
                  <div className="mb-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
                    {msg.botEmpathyStrategy.facialCueObservation && (
                      <div className="flex items-start gap-1.5 text-slate-300">
                        <Smile className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-cyan-300">Perceived Facial Cue:</strong>{" "}
                          {msg.botEmpathyStrategy.facialCueObservation}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        Strategy: {msg.botEmpathyStrategy.strategy}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        Tone: {msg.botEmpathyStrategy.tone}
                      </span>
                    </div>
                  </div>
                )}

                {/* Primary Message Content */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Bot Message: Suggested Micro-Action */}
                {!isUser && msg.botEmpathyStrategy?.suggestedAction && (
                  <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      <strong>Suggested Micro-Step:</strong>{" "}
                      {msg.botEmpathyStrategy.suggestedAction}
                    </span>
                  </div>
                )}

                {/* Bot Message TTS audio button */}
                {!isUser && (
                  <div className="mt-2.5 flex justify-end">
                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                      title="Read aloud with emotional voice"
                    >
                      {speakingMessageId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Voice Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Bot Suggested Quick Replies */}
              {!isUser &&
                msg.botEmpathyStrategy?.suggestedQuickReplies &&
                msg.botEmpathyStrategy.suggestedQuickReplies.length > 0 &&
                messages[messages.length - 1].id === msg.id && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.botEmpathyStrategy.suggestedQuickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(qr)}
                        disabled={isLoading}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-300 flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Analyzing facial telemetry & synthesizing empathetic response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Real-time Facial Context Banner above Input */}
      <div className="mt-3 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-400 truncate">
            Current Facial Cue:{" "}
            <span className={`font-semibold uppercase ${emotionColor.text}`}>
              {currentEmotion.primaryEmotion}
            </span>{" "}
            ({Math.round(currentEmotion.confidence)}%) · AU12:{" "}
            {(currentEmotion.actionUnits.lipCornerPuller * 100).toFixed(0)}% · AU4:{" "}
            {(currentEmotion.actionUnits.browLowerer * 100).toFixed(0)}%
          </span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">Active Telemetry</span>
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleFormSubmit} className="mt-2 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type how you feel, or what's on your mind..."
            disabled={isLoading}
            id="chat-user-input"
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition pr-10"
          />
          {/* Speech-to-Text Microphone Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            id="voice-dictation-btn"
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition cursor-pointer ${
              isListening
                ? "bg-rose-500/20 text-rose-400 animate-pulse"
                : "text-slate-400 hover:text-cyan-300"
            }`}
            title={isListening ? "Listening... click to stop" : "Speak your message (STT)"}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          id="chat-send-btn"
          className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95"
          title="Send message with real-time facial telemetry"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
