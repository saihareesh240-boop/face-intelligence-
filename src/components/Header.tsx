import React from "react";
import { Activity, ShieldCheck, Sparkles, Brain, BarChart3 } from "lucide-react";

interface HeaderProps {
  hasCameraActive: boolean;
  pipelineFps: number;
  onOpenAnalytics: () => void;
  primaryEmotion: string;
}

export const Header: React.FC<HeaderProps> = ({
  hasCameraActive,
  pipelineFps,
  onOpenAnalytics,
  primaryEmotion,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Concept */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                FACETELLIGENCE
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold tracking-wider">
                  Affective CV
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Emotion-Aware Chatbot · Real-time OpenCV & TensorFlow Facial Telemetry
            </p>
          </div>
        </div>

        {/* Real-time telemetry badges & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4 text-xs font-mono">
          {/* Live Pipeline Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                hasCameraActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="hidden md:inline text-slate-400">CV Pipeline:</span>
            <span className="text-slate-200 font-semibold">
              {hasCameraActive ? `Webcam ${pipelineFps} FPS` : "Preset Emulation"}
            </span>
          </div>

          {/* Current Perceived Emotion */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Affect:</span>
            <span className="text-cyan-300 font-bold uppercase tracking-wider">{primaryEmotion}</span>
          </div>

          {/* Analytics Modal Toggle */}
          <button
            onClick={onOpenAnalytics}
            id="open-affective-analytics-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 transition cursor-pointer active:scale-95"
            title="View Affective Analytics & Session Journey"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-sans font-medium text-xs">Affect Journey</span>
          </button>
        </div>
      </div>
    </header>
  );
};
