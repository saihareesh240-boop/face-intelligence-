import React, { useState, useCallback, useRef } from "react";
import { Header } from "./components/Header";
import { VisionHUD } from "./components/VisionHUD";
import { ChatInterface } from "./components/ChatInterface";
import { AffectiveAnalyticsModal } from "./components/AffectiveAnalyticsModal";
import { ChatMessage, EmotionAnalysis, SessionTimelinePoint } from "./types";
import { EMOTION_PRESETS, computeLandmarkMesh } from "./utils/faceAnalysisEngine";

const INITIAL_PRESET = EMOTION_PRESETS[0]; // Joy preset

const initialBbox = { x: 120, y: 50, width: 400, height: 380 };
const initialAnalysis: EmotionAnalysis = {
  primaryEmotion: "joy",
  confidence: 88,
  distribution: {
    joy: 88,
    sadness: 3,
    anger: 2,
    surprise: 6,
    fear: 1,
    neutral: 10,
    disgust: 1,
    curious: 12,
    contemplative: 8,
  },
  valence: 0.82,
  arousal: 0.68,
  attentionScore: 94,
  actionUnits: INITIAL_PRESET.actionUnits,
  gaze: { x: 0, y: 0, direction: "direct" },
  headPose: { pitch: 0.5, yaw: 0, roll: 0 },
  microExpressions: INITIAL_PRESET.microExpressions,
  faceDetected: true,
  boundingBox: initialBbox,
  landmarks: computeLandmarkMesh(initialBbox, INITIAL_PRESET.actionUnits, 0),
  timestamp: Date.now(),
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Welcome to FACETELLIGENCE. I am your emotion-aware conversational companion.\n\nI combine real-time computer vision (OpenCV facial landmark tracking & TensorFlow affective classification) with empathetic conversation. You can enable your webcam or select emotion presets on the left—my tone and empathy will dynamically adapt to how you feel.",
    timestamp: "Just now",
    botEmpathyStrategy: {
      strategy: "Affective Calibration",
      tone: "Warm, perceptive, attentive",
      detectedMood: "RECEPTIVE & OPEN",
      facialCueObservation: "Facial telemetry calibrated. Ready for live human–AI interaction.",
      suggestedAction: "Say hello or describe how your day has been feeling.",
      suggestedQuickReplies: [
        "I'm feeling great today!",
        "I've had a really stressful day at work",
        "How do you read my facial expressions?",
      ],
    },
  },
];

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<EmotionAnalysis>(initialAnalysis);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);

  // Timeline of affective milestones
  const [timeline, setTimeline] = useState<SessionTimelinePoint[]>([
    {
      id: "init-1",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      emotion: "joy",
      valence: 0.82,
      arousal: 0.68,
      triggerEvent: "Session initialized · Facial baseline established",
    },
  ]);

  // Keep ref to latest analysis for atomic access inside callbacks
  const analysisRef = useRef<EmotionAnalysis>(currentAnalysis);
  analysisRef.current = currentAnalysis;

  const handleAnalysisUpdate = useCallback((analysis: EmotionAnalysis) => {
    setCurrentAnalysis(analysis);
  }, []);

  // Send message handler
  const handleSendMessage = async (text: string) => {
    const activeEmotion = analysisRef.current;
    const userTimestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: userTimestamp,
      emotionSnapshot: {
        primaryEmotion: activeEmotion.primaryEmotion,
        confidence: activeEmotion.confidence,
        valence: activeEmotion.valence,
        arousal: activeEmotion.arousal,
        actionUnitsSummary: `AU12: ${(activeEmotion.actionUnits.lipCornerPuller * 100).toFixed(0)}%, AU4: ${(activeEmotion.actionUnits.browLowerer * 100).toFixed(0)}%`,
      },
    };

    // Update session timeline
    setTimeline((prev) => [
      ...prev,
      {
        id: `event-${Date.now()}`,
        time: userTimestamp,
        emotion: activeEmotion.primaryEmotion,
        valence: activeEmotion.valence,
        arousal: activeEmotion.arousal,
        triggerEvent: `User prompt: "${text.slice(0, 32)}${text.length > 32 ? "..." : ""}"`,
      },
    ]);

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const payload = {
        message: text,
        history: messages.slice(-8).map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
        currentEmotion: {
          primaryEmotion: activeEmotion.primaryEmotion,
          confidence: activeEmotion.confidence,
          valence: activeEmotion.valence,
          arousal: activeEmotion.arousal,
          attentionScore: activeEmotion.attentionScore,
          actionUnits: activeEmotion.actionUnits,
          microExpressions: activeEmotion.microExpressions,
        },
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply || "I'm listening closely to you.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        botEmpathyStrategy: {
          strategy: data.empathyStrategy || "Adaptive Empathy",
          tone: data.tone || "Empathetic & Attentive",
          detectedMood: data.detectedMood || activeEmotion.primaryEmotion,
          facialCueObservation:
            data.facialCueObservation ||
            `Integrated ${activeEmotion.primaryEmotion} expression telemetry.`,
          suggestedAction: data.suggestedAction,
          suggestedQuickReplies: data.suggestedQuickReplies,
        },
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      console.error("Chat error:", err);
      // Friendly fallback
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: `I'm staying present with you. I observe your ${activeEmotion.primaryEmotion} expression right now with a valence of ${activeEmotion.valence.toFixed(2)}. Even during technical hiccups, your thoughts and feelings are the priority. What would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        botEmpathyStrategy: {
          strategy: "Resilient Presence",
          tone: "Steady, reassuring, warm",
          detectedMood: activeEmotion.primaryEmotion.toUpperCase(),
          facialCueObservation: `Telemetry registered: ${activeEmotion.primaryEmotion} (${Math.round(activeEmotion.confidence)}% confidence).`,
          suggestedQuickReplies: [
            "Tell me more about how you adjust to my face",
            "I want to change my emotion preset",
            "Let's try another topic",
          ],
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGES[0]]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Global Application Header */}
      <Header
        hasCameraActive={currentAnalysis.faceDetected}
        pipelineFps={30}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        primaryEmotion={currentAnalysis.primaryEmotion}
      />

      {/* Main Dual-Column Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Vision HUD, Video/Canvas, Action Units, Emotion Presets */}
          <section className="lg:col-span-6 xl:col-span-5 w-full">
            <VisionHUD
              currentAnalysis={currentAnalysis}
              onAnalysisUpdate={handleAnalysisUpdate}
            />
          </section>

          {/* Right Column: Emotion-Aware Chat Interface */}
          <section className="lg:col-span-6 xl:col-span-7 w-full">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              currentEmotion={currentAnalysis}
              isLoading={isLoading}
              onClearChat={handleClearChat}
            />
          </section>
        </div>
      </main>

      {/* Affective Analytics Modal */}
      <AffectiveAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        timeline={timeline}
        interactionCount={messages.filter((m) => m.sender === "user").length}
      />
    </div>
  );
}
