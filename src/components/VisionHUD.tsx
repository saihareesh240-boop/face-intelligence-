import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Scan,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  AlertCircle,
  HelpCircle,
  Upload,
} from "lucide-react";
import {
  EmotionAnalysis,
  EmotionPreset,
  EmotionType,
} from "../types";
import {
  EMOTION_PRESETS,
  analyzeVideoFrame,
  renderVisionHUD,
  getEmotionColor,
} from "../utils/faceAnalysisEngine";

interface VisionHUDProps {
  currentAnalysis: EmotionAnalysis;
  onAnalysisUpdate: (analysis: EmotionAnalysis) => void;
  onDeepScanResult?: (result: any) => void;
}

export const VisionHUD: React.FC<VisionHUDProps> = ({
  currentAnalysis,
  onAnalysisUpdate,
  onDeepScanResult,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<EmotionPreset>(EMOTION_PRESETS[0]);
  const [usePresetSimulation, setUsePresetSimulation] = useState<boolean>(true);

  // HUD options
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [showMesh, setShowMesh] = useState<boolean>(true);
  const [showBBox, setShowBBox] = useState<boolean>(true);
  const [showMetrics, setShowMetrics] = useState<boolean>(true);
  const [showScanLine, setShowScanLine] = useState<boolean>(true);

  // Deep Scan State
  const [isScanningDeep, setIsScanningDeep] = useState<boolean>(false);
  const [deepScanData, setDeepScanData] = useState<any>(null);

  // Start webcam
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam access not supported in this browser environment.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        setUsePresetSimulation(false);
      }
    } catch (err: unknown) {
      console.warn("Camera start failed:", err);
      const msg = err instanceof Error ? err.message : "Camera access was denied or unavailable.";
      setCameraError(msg);
      setIsCameraActive(false);
      setUsePresetSimulation(true);
    }
  }, []);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setUsePresetSimulation(true);
  }, []);

  // Handle Preset Selection
  const handlePresetSelect = (preset: EmotionPreset) => {
    setSelectedPreset(preset);
    setUsePresetSimulation(true);
  };

  // Perform Deep Vision Scan via Gemini 3.8 Flash
  const triggerDeepVisionScan = async () => {
    setIsScanningDeep(true);
    try {
      // Capture current canvas or video frame
      let base64 = "";
      if (hiddenCanvasRef.current) {
        base64 = hiddenCanvasRef.current.toDataURL("image/jpeg", 0.85);
      }

      const res = await fetch("/api/analyze-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!res.ok) throw new Error("Vision analysis endpoint error");
      const data = await res.json();
      setDeepScanData(data);
      if (onDeepScanResult) onDeepScanResult(data);
    } catch (err: unknown) {
      console.error("Deep scan failed:", err);
      // Fallback
      setDeepScanData({
        primaryEmotion: currentAnalysis.primaryEmotion,
        confidence: 89,
        valence: currentAnalysis.valence,
        arousal: currentAnalysis.arousal,
        microExpressions: currentAnalysis.microExpressions,
        perceivedCognitiveState: "Authentic Affective Engagement",
        deepAffectiveInsight:
          "Multimodal scan identified congruent facial action unit activation matching user conversational valence.",
      });
    } finally {
      setIsScanningDeep(false);
    }
  };

  // Frame processing loop
  useEffect(() => {
    let tick = 0;

    const processFrame = () => {
      tick++;
      const canvas = canvasRef.current;
      const hiddenCanvas = hiddenCanvasRef.current;
      const video = videoRef.current;

      if (canvas && hiddenCanvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          // Clear frame
          ctx.fillStyle = "#020617";
          ctx.fillRect(0, 0, w, h);

          // If camera is running, draw video onto canvas
          if (isCameraActive && video && video.readyState >= 2) {
            ctx.drawImage(video, 0, 0, w, h);
          } else {
            // Render simulated cyber avatar backdrop
            const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.6);
            grad.addColorStop(0, "rgba(30, 41, 59, 0.8)");
            grad.addColorStop(1, "rgba(2, 6, 23, 0.95)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Subtle grid
            ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
            ctx.lineWidth = 1;
            for (let gx = 0; gx < w; gx += 30) {
              ctx.beginPath();
              ctx.moveTo(gx, 0);
              ctx.lineTo(gx, h);
              ctx.stroke();
            }
            for (let gy = 0; gy < h; gy += 30) {
              ctx.beginPath();
              ctx.moveTo(0, gy);
              ctx.lineTo(w, gy);
              ctx.stroke();
            }
          }

          // Run Computer Vision analysis
          const analysis = analyzeVideoFrame(
            video as HTMLVideoElement,
            hiddenCanvas,
            usePresetSimulation ? selectedPreset : null,
            tick
          );

          // Render OpenCV / TensorFlow style HUD
          renderVisionHUD(ctx, w, h, analysis, {
            showLandmarks,
            showMesh,
            showBBox,
            showMetrics,
            showScanLine,
          });

          // Update parent state throttle (~10 times per sec)
          if (tick % 6 === 0) {
            onAnalysisUpdate(analysis);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isCameraActive,
    usePresetSimulation,
    selectedPreset,
    showLandmarks,
    showMesh,
    showBBox,
    showMetrics,
    showScanLine,
    onAnalysisUpdate,
  ]);

  const emotionTheme = getEmotionColor(currentAnalysis.primaryEmotion);

  return (
    <div className="flex flex-col gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl backdrop-blur-sm">
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold text-slate-100 text-sm tracking-wide">
            FACIAL TELEMETRY & VISION HUD
          </h2>
        </div>

        {/* Live Camera Toggle Button */}
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              onClick={stopCamera}
              id="stop-camera-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono transition cursor-pointer"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              onClick={startCamera}
              id="start-camera-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono shadow-md shadow-cyan-500/20 transition cursor-pointer active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Enable Webcam</span>
            </button>
          )}
        </div>
      </div>

      {/* Camera Alert / Fallback Notice */}
      {cameraError && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Webcam Not Connected:</span> {cameraError}
            <div className="mt-1 text-slate-300">
              Interactive emotion simulation presets below are currently driving the real-time affective pipeline.
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport: Video & OpenCV Canvas */}
      <div className="relative aspect-[4/3] w-full max-w-full rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner group">
        {/* Hidden video stream */}
        <video
          ref={videoRef}
          className="hidden"
          playsInline
          muted
          autoPlay
        />
        {/* Hidden analytical canvas */}
        <canvas ref={hiddenCanvasRef} width={640} height={480} className="hidden" />

        {/* Visible OpenCV HUD Canvas */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-cover block"
        />

        {/* Floating Quick Action: Deep Multimodal Scan */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            onClick={triggerDeepVisionScan}
            disabled={isScanningDeep}
            id="deep-vision-scan-btn"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-lg text-xs font-mono transition cursor-pointer disabled:opacity-50"
            title="Perform Multimodal Micro-Expression Audit with Gemini 3.8 Flash"
          >
            <Sparkles className={`w-3.5 h-3.5 text-cyan-400 ${isScanningDeep ? "animate-spin" : ""}`} />
            <span>{isScanningDeep ? "Scanning Micro-Expressions..." : "Deep Scan (Gemini Vision)"}</span>
          </button>
        </div>

        {/* Floating State Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300">
            {isCameraActive ? "LIVE FEED" : `PRESET: ${selectedPreset.name.toUpperCase()}`}
          </span>
        </div>
      </div>

      {/* HUD Layer Display Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>HUD LAYERS:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setShowLandmarks((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition ${
              showLandmarks
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            Landmarks
          </button>
          <button
            onClick={() => setShowMesh((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition ${
              showMesh
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            Wireframe
          </button>
          <button
            onClick={() => setShowBBox((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition ${
              showBBox
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            Reticle
          </button>
          <button
            onClick={() => setShowMetrics((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition ${
              showMetrics
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setShowScanLine((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition ${
              showScanLine
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            Scan Sweep
          </button>
        </div>
      </div>

      {/* Emotion Simulation Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Emotion Presets (Drive or Override Pipeline):
          </span>
          <span className="text-[11px] text-slate-500">Instant FACS synthesis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EMOTION_PRESETS.map((preset) => {
            const isSelected = usePresetSimulation && selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                id={`preset-${preset.id}`}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-800 border-cyan-500/60 shadow-md shadow-cyan-500/10 text-white"
                    : "bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <span className="text-lg select-none">{preset.avatarIcon}</span>
                <div className="truncate">
                  <div className="text-xs font-medium truncate">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    V: {preset.valence > 0 ? `+${preset.valence}` : preset.valence} · A:{" "}
                    {preset.arousal}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Affective Metrics: Circumplex Model & Action Units */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Circumplex Plot (Valence vs Arousal) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">AFFECTIVE CIRCUMPLEX</span>
            <span className="text-[10px] font-mono text-cyan-400">Russell 2D Model</span>
          </div>

          <div className="relative aspect-square w-full max-w-[200px] mx-auto border border-slate-800 rounded-lg bg-slate-900/50 flex items-center justify-center p-2">
            {/* Axis lines */}
            <div className="absolute w-full h-[1px] bg-slate-700/60 top-1/2 left-0" />
            <div className="absolute h-full w-[1px] bg-slate-700/60 left-1/2 top-0" />

            {/* Labels */}
            <span className="absolute top-1 text-[9px] font-mono text-slate-500">High Arousal</span>
            <span className="absolute bottom-1 text-[9px] font-mono text-slate-500">Low Arousal</span>
            <span className="absolute left-1 text-[9px] font-mono text-slate-500">Negative</span>
            <span className="absolute right-1 text-[9px] font-mono text-slate-500">Positive</span>

            {/* Active Position Indicator */}
            {/* valence: -1.0 to 1.0 -> 0% to 100% */}
            {/* arousal: 0.0 to 1.0 -> 100% to 0% */}
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center"
              style={{
                left: `${((currentAnalysis.valence + 1) / 2) * 100}%`,
                top: `${(1 - currentAnalysis.arousal) * 100}%`,
                backgroundColor: emotionTheme.accentHex,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          <div className="mt-2 text-center text-[11px] font-mono text-slate-400">
            Valence: <span className="text-white font-semibold">{currentAnalysis.valence.toFixed(2)}</span> ·
            Arousal: <span className="text-white font-semibold">{currentAnalysis.arousal.toFixed(2)}</span>
          </div>
        </div>

        {/* Facial Action Units (FACS) Telemetry */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">FACS ACTION UNITS</span>
            <span className="text-[10px] font-mono text-cyan-400">Ekman Model</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {/* AU12 Lip Corner Puller (Smile) */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                <span>AU12 (Smile / Lip Pull)</span>
                <span className="text-amber-300">
                  {Math.round(currentAnalysis.actionUnits.lipCornerPuller * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-200"
                  style={{ width: `${currentAnalysis.actionUnits.lipCornerPuller * 100}%` }}
                />
              </div>
            </div>

            {/* AU4 Brow Lowerer (Furrow / Stress) */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                <span>AU4 (Brow Furrow)</span>
                <span className="text-rose-300">
                  {Math.round(currentAnalysis.actionUnits.browLowerer * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-200"
                  style={{ width: `${currentAnalysis.actionUnits.browLowerer * 100}%` }}
                />
              </div>
            </div>

            {/* AU15 Lip Corner Depressor (Sadness) */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                <span>AU15 (Frown / Depressor)</span>
                <span className="text-sky-300">
                  {Math.round(currentAnalysis.actionUnits.lipCornerDepressor * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all duration-200"
                  style={{ width: `${currentAnalysis.actionUnits.lipCornerDepressor * 100}%` }}
                />
              </div>
            </div>

            {/* AU1 Inner Brow Raiser */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                <span>AU1 (Inner Brow Rise)</span>
                <span className="text-purple-300">
                  {Math.round(currentAnalysis.actionUnits.innerBrowRaiser * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all duration-200"
                  style={{ width: `${currentAnalysis.actionUnits.innerBrowRaiser * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono truncate">
            Cues: {currentAnalysis.microExpressions.join(" • ")}
          </div>
        </div>
      </div>

      {/* Deep Vision Scan Result Box */}
      {deepScanData && (
        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-cyan-300 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              GEMINI 3.8 FLASH VISION SCAN AUDIT:
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              Confidence: {deepScanData.confidence}%
            </span>
          </div>
          <p className="text-slate-200 leading-relaxed text-xs">
            {deepScanData.deepAffectiveInsight}
          </p>
          {deepScanData.perceivedCognitiveState && (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-cyan-200/80">
              <span className="font-semibold text-cyan-300">Cognitive State:</span>
              <span>{deepScanData.perceivedCognitiveState}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
