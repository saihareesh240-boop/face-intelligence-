import { EmotionAnalysis, EmotionType, FacialActionUnits, LandmarkPoint, EmotionPreset } from "../types";

export const EMOTION_PRESETS: EmotionPreset[] = [
  {
    id: "joy",
    name: "Radiant & Delighted",
    emotion: "joy",
    description: "Broad smile, elevated cheeks, eye-crinkle (AU6 + AU12)",
    valence: 0.82,
    arousal: 0.68,
    avatarIcon: "😊",
    actionUnits: {
      innerBrowRaiser: 0.15,
      browLowerer: 0.05,
      cheekRaiser: 0.85,
      lipCornerPuller: 0.92,
      lipCornerDepressor: 0.02,
      lipsPart: 0.55,
      eyeWiden: 0.2,
      blinkRate: 14,
    },
    microExpressions: ["Duchenne eye crinkles", "Zygomatic major lift", "Open jaw relaxation"],
  },
  {
    id: "stress",
    name: "Stressed / Frustrated",
    emotion: "anger",
    description: "Deep brow furrow, tightened lips, high tension (AU4 + AU15)",
    valence: -0.65,
    arousal: 0.78,
    avatarIcon: "😤",
    actionUnits: {
      innerBrowRaiser: 0.1,
      browLowerer: 0.88,
      cheekRaiser: 0.2,
      lipCornerPuller: 0.05,
      lipCornerDepressor: 0.72,
      lipsPart: 0.1,
      eyeWiden: 0.35,
      blinkRate: 26,
    },
    microExpressions: ["Corrugator supercilii contraction", "Lip compression", "Jaw muscle clench"],
  },
  {
    id: "pensive",
    name: "Melancholic / Fatigued",
    emotion: "sadness",
    description: "Inner brow raised, drooping mouth corners, low gaze (AU1 + AU15)",
    valence: -0.58,
    arousal: 0.25,
    avatarIcon: "😔",
    actionUnits: {
      innerBrowRaiser: 0.75,
      browLowerer: 0.6,
      cheekRaiser: 0.05,
      lipCornerPuller: 0.02,
      lipCornerDepressor: 0.8,
      lipsPart: 0.08,
      eyeWiden: 0.1,
      blinkRate: 9,
    },
    microExpressions: ["Inner eyebrow apex rise", "Nasolabial fold deepening", "Slow blink duration"],
  },
  {
    id: "curious",
    name: "Curious & Inquisitive",
    emotion: "curious",
    description: "Asymmetric brow raise, focused gaze, forward head tilt",
    valence: 0.35,
    arousal: 0.55,
    avatarIcon: "🧐",
    actionUnits: {
      innerBrowRaiser: 0.7,
      browLowerer: 0.15,
      cheekRaiser: 0.3,
      lipCornerPuller: 0.35,
      lipCornerDepressor: 0.05,
      lipsPart: 0.2,
      eyeWiden: 0.45,
      blinkRate: 15,
    },
    microExpressions: ["Frontalis unilateral lift", "Pupillary fixation", "Micro head-tilt"],
  },
  {
    id: "surprise",
    name: "Astonished / Surprised",
    emotion: "surprise",
    description: "Wide eyes, high brows, dropped jaw (AU1 + AU2 + AU5 + AU26)",
    valence: 0.2,
    arousal: 0.9,
    avatarIcon: "😲",
    actionUnits: {
      innerBrowRaiser: 0.92,
      browLowerer: 0.05,
      cheekRaiser: 0.2,
      lipCornerPuller: 0.2,
      lipCornerDepressor: 0.05,
      lipsPart: 0.88,
      eyeWiden: 0.95,
      blinkRate: 6,
    },
    microExpressions: ["Maximal palpebral fissure exposure", "Horizontal forehead wrinkles", "Inspiratory gasp"],
  },
  {
    id: "neutral",
    name: "Calm / Composed",
    emotion: "neutral",
    description: "Equilibrated facial tone, steady gaze, resting musculature",
    valence: 0.05,
    arousal: 0.18,
    avatarIcon: "😐",
    actionUnits: {
      innerBrowRaiser: 0.1,
      browLowerer: 0.08,
      cheekRaiser: 0.1,
      lipCornerPuller: 0.12,
      lipCornerDepressor: 0.08,
      lipsPart: 0.05,
      eyeWiden: 0.15,
      blinkRate: 16,
    },
    microExpressions: ["Bilateral facial symmetry", "Smooth orbicularis oris", "Stable saccadic pacing"],
  },
];

export function getEmotionColor(emotion: EmotionType): {
  bg: string;
  border: string;
  text: string;
  badge: string;
  accentHex: string;
} {
  switch (emotion) {
    case "joy":
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/40",
        text: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        accentHex: "#f59e0b",
      };
    case "sadness":
      return {
        bg: "bg-sky-500/10",
        border: "border-sky-500/40",
        text: "text-sky-400",
        badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
        accentHex: "#38bdf8",
      };
    case "anger":
      return {
        bg: "bg-rose-500/10",
        border: "border-rose-500/40",
        text: "text-rose-400",
        badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        accentHex: "#f43f5e",
      };
    case "surprise":
      return {
        bg: "bg-purple-500/10",
        border: "border-purple-500/40",
        text: "text-purple-400",
        badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        accentHex: "#a855f7",
      };
    case "fear":
      return {
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/40",
        text: "text-indigo-400",
        badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        accentHex: "#6366f1",
      };
    case "curious":
    case "contemplative":
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/40",
        text: "text-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        accentHex: "#10b981",
      };
    case "disgust":
      return {
        bg: "bg-orange-500/10",
        border: "border-orange-500/40",
        text: "text-orange-400",
        badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        accentHex: "#f97316",
      };
    case "neutral":
    default:
      return {
        bg: "bg-slate-500/10",
        border: "border-slate-500/40",
        text: "text-slate-300",
        badge: "bg-slate-500/20 text-slate-200 border-slate-500/30",
        accentHex: "#94a3b8",
      };
  }
}

// Generate 36 standard facial landmark points relative to bounding box and action units
export function computeLandmarkMesh(
  bbox: { x: number; y: number; width: number; height: number },
  aus: FacialActionUnits,
  phase: number = 0
): LandmarkPoint[] {
  const { x, y, width: w, height: h } = bbox;
  const points: LandmarkPoint[] = [];

  // Head micro-movements
  const breathOffset = Math.sin(phase) * 1.5;

  // 1-9: Jawline
  for (let i = 0; i < 9; i++) {
    const t = i / 8; // 0 to 1
    const angle = Math.PI * (0.85 - t * 0.7);
    const px = x + w * 0.5 + Math.cos(angle) * (w * 0.44);
    const py = y + h * 0.48 + Math.sin(angle) * (h * 0.48) + breathOffset;
    points.push({ x: px, y: py });
  }

  // 10-14: Left Eyebrow
  const browRaiseLeft = (aus.innerBrowRaiser * 0.12 - aus.browLowerer * 0.08) * h;
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const px = x + w * 0.22 + t * (w * 0.2);
    const arch = Math.sin(t * Math.PI) * (h * 0.04);
    const py = y + h * 0.3 - browRaiseLeft - arch;
    points.push({ x: px, y: py });
  }

  // 15-19: Right Eyebrow
  const browRaiseRight = (aus.innerBrowRaiser * 0.12 - aus.browLowerer * 0.08) * h;
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const px = x + w * 0.58 + t * (w * 0.2);
    const arch = Math.sin(t * Math.PI) * (h * 0.04);
    const py = y + h * 0.3 - browRaiseRight - arch;
    points.push({ x: px, y: py });
  }

  // 20-23: Left Eye
  const eyeWidenDelta = aus.eyeWiden * 0.04 * h;
  const eyeLeftCenter = { x: x + w * 0.32, y: y + h * 0.42 };
  points.push({ x: eyeLeftCenter.x - w * 0.08, y: eyeLeftCenter.y });
  points.push({ x: eyeLeftCenter.x, y: eyeLeftCenter.y - h * 0.03 - eyeWidenDelta });
  points.push({ x: eyeLeftCenter.x + w * 0.08, y: eyeLeftCenter.y });
  points.push({ x: eyeLeftCenter.x, y: eyeLeftCenter.y + h * 0.03 + eyeWidenDelta });

  // 24-27: Right Eye
  const eyeRightCenter = { x: x + w * 0.68, y: y + h * 0.42 };
  points.push({ x: eyeRightCenter.x - w * 0.08, y: eyeRightCenter.y });
  points.push({ x: eyeRightCenter.x, y: eyeRightCenter.y - h * 0.03 - eyeWidenDelta });
  points.push({ x: eyeRightCenter.x + w * 0.08, y: eyeRightCenter.y });
  points.push({ x: eyeRightCenter.x, y: eyeRightCenter.y + h * 0.03 + eyeWidenDelta });

  // 28-30: Nose Bridge & Tip
  points.push({ x: x + w * 0.5, y: y + h * 0.42 });
  points.push({ x: x + w * 0.5, y: y + h * 0.52 });
  points.push({ x: x + w * 0.5, y: y + h * 0.58 });

  // 31-36: Mouth (AU12 smile lifts corners; AU15 drops corners; AU25 opens lips)
  const smileLift = aus.lipCornerPuller * 0.08 * h;
  const frownDrop = aus.lipCornerDepressor * 0.06 * h;
  const mouthOpen = aus.lipsPart * 0.08 * h;
  const mouthY = y + h * 0.72;

  // Left corner
  points.push({
    x: x + w * 0.34 - aus.lipCornerPuller * 0.02 * w,
    y: mouthY - smileLift + frownDrop,
  });
  // Top center lip
  points.push({ x: x + w * 0.5, y: mouthY - h * 0.02 - mouthOpen * 0.3 });
  // Right corner
  points.push({
    x: x + w * 0.66 + aus.lipCornerPuller * 0.02 * w,
    y: mouthY - smileLift + frownDrop,
  });
  // Bottom center lip
  points.push({ x: x + w * 0.5, y: mouthY + h * 0.03 + mouthOpen * 0.7 });
  // Inner left
  points.push({ x: x + w * 0.42, y: mouthY });
  // Inner right
  points.push({ x: x + w * 0.58, y: mouthY });

  return points;
}

// Draw OpenCV / TensorFlow computer vision style HUD on canvas
export function renderVisionHUD(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  analysis: EmotionAnalysis,
  options: {
    showLandmarks: boolean;
    showMesh: boolean;
    showBBox: boolean;
    showMetrics: boolean;
    showScanLine: boolean;
  }
) {
  ctx.save();

  const color = getEmotionColor(analysis.primaryEmotion);
  const bbox = analysis.boundingBox || {
    x: width * 0.2,
    y: height * 0.12,
    width: width * 0.6,
    height: height * 0.76,
  };

  // Draw HUD Scan lines (Computer Vision sweep effect)
  if (options.showScanLine) {
    const scanY = ((Date.now() / 15) % height);
    const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
    grad.addColorStop(0, "rgba(56, 189, 248, 0)");
    grad.addColorStop(0.5, "rgba(56, 189, 248, 0.2)");
    grad.addColorStop(1, "rgba(56, 189, 248, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 20, width, 40);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(width, scanY);
    ctx.stroke();
  }

  // Draw Face Bounding Box with Cyber/OpenCV corner brackets
  if (options.showBBox && analysis.faceDetected) {
    const { x, y, width: bw, height: bh } = bbox;
    const bracketLen = Math.min(bw, bh) * 0.2;

    ctx.strokeStyle = color.accentHex;
    ctx.lineWidth = 2;
    ctx.shadowColor = color.accentHex;
    ctx.shadowBlur = 8;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(x, y + bracketLen);
    ctx.lineTo(x, y);
    ctx.lineTo(x + bracketLen, y);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(x + bw - bracketLen, y);
    ctx.lineTo(x + bw, y);
    ctx.lineTo(x + bw, y + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(x, y + bh - bracketLen);
    ctx.lineTo(x, y + bh);
    ctx.lineTo(x + bracketLen, y + bh);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(x + bw - bracketLen, y + bh);
    ctx.lineTo(x + bw, y + bh);
    ctx.lineTo(x + bw, y + bh - bracketLen);
    ctx.stroke();

    // Center Crosshair / Target Reticle
    const cx = x + bw / 2;
    const cy = y + bh / 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy);
    ctx.lineTo(cx + 12, cy);
    ctx.moveTo(cx, cy - 12);
    ctx.lineTo(cx, cy + 12);
    ctx.stroke();

    // Bounding Box Label Tag
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(x, y - 26, 170, 22);
    ctx.strokeStyle = color.accentHex;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y - 26, 170, 22);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 11px 'JetBrains Mono', monospace";
    ctx.fillText(
      `FACE: ${analysis.primaryEmotion.toUpperCase()} [${Math.round(analysis.confidence)}%]`,
      x + 8,
      y - 11
    );
  }

  // Draw Facial Landmarks & Mesh Connections
  if (analysis.landmarks && analysis.landmarks.length > 0) {
    // Mesh connections
    if (options.showMesh) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Eyebrow curves
      for (let i = 9; i < 13; i++) {
        ctx.moveTo(analysis.landmarks[i].x, analysis.landmarks[i].y);
        ctx.lineTo(analysis.landmarks[i + 1].x, analysis.landmarks[i + 1].y);
      }
      for (let i = 14; i < 18; i++) {
        ctx.moveTo(analysis.landmarks[i].x, analysis.landmarks[i].y);
        ctx.lineTo(analysis.landmarks[i + 1].x, analysis.landmarks[i + 1].y);
      }
      // Eyes
      ctx.moveTo(analysis.landmarks[19].x, analysis.landmarks[19].y);
      ctx.lineTo(analysis.landmarks[20].x, analysis.landmarks[20].y);
      ctx.lineTo(analysis.landmarks[21].x, analysis.landmarks[21].y);
      ctx.lineTo(analysis.landmarks[22].x, analysis.landmarks[22].y);
      ctx.closePath();

      ctx.moveTo(analysis.landmarks[23].x, analysis.landmarks[23].y);
      ctx.lineTo(analysis.landmarks[24].x, analysis.landmarks[24].y);
      ctx.lineTo(analysis.landmarks[25].x, analysis.landmarks[25].y);
      ctx.lineTo(analysis.landmarks[26].x, analysis.landmarks[26].y);
      ctx.closePath();

      // Mouth
      ctx.moveTo(analysis.landmarks[30].x, analysis.landmarks[30].y);
      ctx.lineTo(analysis.landmarks[31].x, analysis.landmarks[31].y);
      ctx.lineTo(analysis.landmarks[32].x, analysis.landmarks[32].y);
      ctx.lineTo(analysis.landmarks[33].x, analysis.landmarks[33].y);
      ctx.closePath();

      ctx.stroke();
    }

    // Landmark Dots
    if (options.showLandmarks) {
      ctx.shadowBlur = 4;
      ctx.shadowColor = color.accentHex;
      ctx.fillStyle = color.accentHex;

      for (let i = 0; i < analysis.landmarks.length; i++) {
        const pt = analysis.landmarks[i];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, i >= 30 ? 2.5 : 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Draw Diagnostic Telemetry Overlay (Top & Bottom stats)
  if (options.showMetrics) {
    ctx.shadowBlur = 0;
    // Top-Right Diagnostic Text
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(width - 195, 12, 183, 76);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.strokeRect(width - 195, 12, 183, 76);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "600 10px 'JetBrains Mono', monospace";
    ctx.fillText("CV PIPELINE: ACTIVE", width - 185, 28);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "400 10px 'JetBrains Mono', monospace";
    ctx.fillText(`VALENCE : ${analysis.valence >= 0 ? "+" : ""}${analysis.valence.toFixed(2)}`, width - 185, 44);
    ctx.fillText(`AROUSAL : ${analysis.arousal.toFixed(2)}`, width - 185, 58);
    ctx.fillText(`ATTENTION: ${Math.round(analysis.attentionScore)}%`, width - 185, 72);

    // Bottom-Left FACS Action Units badge
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(12, height - 46, 210, 34);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.strokeRect(12, height - 46, 210, 34);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 10px 'JetBrains Mono', monospace";
    ctx.fillText(
      `AU12: ${(analysis.actionUnits.lipCornerPuller * 100).toFixed(0)}%  AU4: ${(analysis.actionUnits.browLowerer * 100).toFixed(0)}%`,
      20,
      height - 30
    );
    ctx.fillText(
      `AU1:  ${(analysis.actionUnits.innerBrowRaiser * 100).toFixed(0)}%  AU15: ${(analysis.actionUnits.lipCornerDepressor * 100).toFixed(0)}%`,
      20,
      height - 18
    );
  }

  ctx.restore();
}

// Analyze a video frame or canvas using computer vision heuristics
export function analyzeVideoFrame(
  video: HTMLVideoElement,
  hiddenCanvas: HTMLCanvasElement,
  fallbackPreset: EmotionPreset | null,
  tick: number
): EmotionAnalysis {
  const ctx = hiddenCanvas.getContext("2d", { willReadFrequently: true });
  const w = hiddenCanvas.width;
  const h = hiddenCanvas.height;

  if (!ctx || video.readyState < 2) {
    // Return fallback preset analysis if video not ready
    const p = fallbackPreset || EMOTION_PRESETS[0];
    const bbox = {
      x: w * 0.22,
      y: h * 0.12,
      width: w * 0.56,
      height: h * 0.72,
    };
    const landmarks = computeLandmarkMesh(bbox, p.actionUnits, tick * 0.05);

    const dist: Record<EmotionType, number> = {
      joy: p.emotion === "joy" ? 85 : 4,
      sadness: p.emotion === "sadness" ? 82 : 3,
      anger: p.emotion === "anger" ? 80 : 3,
      surprise: p.emotion === "surprise" ? 86 : 5,
      fear: p.emotion === "fear" ? 75 : 2,
      neutral: p.emotion === "neutral" ? 90 : 12,
      disgust: p.emotion === "disgust" ? 78 : 2,
      curious: p.emotion === "curious" ? 80 : 8,
      contemplative: p.emotion === "contemplative" ? 76 : 5,
    };

    return {
      primaryEmotion: p.emotion,
      confidence: 86 + Math.sin(tick * 0.1) * 4,
      distribution: dist,
      valence: p.valence,
      arousal: p.arousal,
      attentionScore: 92,
      actionUnits: p.actionUnits,
      gaze: { x: 0, y: 0, direction: "direct" },
      headPose: { pitch: 1, yaw: 0, roll: 0 },
      microExpressions: p.microExpressions,
      faceDetected: true,
      boundingBox: bbox,
      landmarks,
      timestamp: Date.now(),
    };
  }

  // Draw current video frame to hidden canvas for pixel inspection
  ctx.drawImage(video, 0, 0, w, h);
  const frameData = ctx.getImageData(0, 0, w, h);
  const data = frameData.data;

  // 1. Skin tone & face centroid calculation using Cr-Cb color thresholding
  let skinPixels = 0;
  let sumX = 0;
  let sumY = 0;
  let minX = w,
    maxX = 0,
    minY = h,
    maxY = 0;

  // Sample every 4th pixel for high-performance 60fps analysis
  const step = 4;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Standard YCbCr skin tone heuristic
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173 && r > g && g > b) {
        skinPixels++;
        sumX += x;
        sumY += y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const faceDetected = skinPixels > (w * h) / (step * step * 25);

  let bbox = {
    x: w * 0.22,
    y: h * 0.12,
    width: w * 0.56,
    height: h * 0.72,
  };

  if (faceDetected && maxX > minX && maxY > minY) {
    const rawW = maxX - minX;
    const rawH = maxY - minY;
    // Smooth bounding box
    bbox = {
      x: Math.max(10, minX - rawW * 0.1),
      y: Math.max(10, minY - rawH * 0.15),
      width: Math.min(w - 20, rawW * 1.2),
      height: Math.min(h - 20, rawH * 1.3),
    };
  }

  // 2. Feature analysis across facial zones (mouth smile vs frown, eyebrow furrow, eyes)
  const mouthZoneY = Math.floor(bbox.y + bbox.height * 0.65);
  const mouthZoneH = Math.floor(bbox.height * 0.25);
  const mouthZoneX = Math.floor(bbox.x + bbox.width * 0.2);
  const mouthZoneW = Math.floor(bbox.width * 0.6);

  // Measure mouth corner curvature and luminance gradients
  let mouthIntensityVariation = 0;
  let count = 0;
  for (let y = mouthZoneY; y < mouthZoneY + mouthZoneH && y < h; y += step) {
    for (let x = mouthZoneX; x < mouthZoneX + mouthZoneW && x < w; x += step) {
      const idx = (y * w + x) * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      mouthIntensityVariation += Math.abs(lum - 128);
      count++;
    }
  }
  const mouthEnergy = count > 0 ? mouthIntensityVariation / count : 30;

  // Eyebrow furrow detection (brow zone dark intensity clustering)
  const browZoneY = Math.floor(bbox.y + bbox.height * 0.2);
  const browZoneH = Math.floor(bbox.height * 0.15);
  const browZoneX = Math.floor(bbox.x + bbox.width * 0.3);
  const browZoneW = Math.floor(bbox.width * 0.4);

  let browDarkness = 0;
  let browCount = 0;
  for (let y = browZoneY; y < browZoneY + browZoneH && y < h; y += step) {
    for (let x = browZoneX; x < browZoneX + browZoneW && x < w; x += step) {
      const idx = (y * w + x) * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 70) browDarkness++;
      browCount++;
    }
  }
  const browFurrowRatio = browCount > 0 ? browDarkness / browCount : 0.1;

  // Compute live Action Units
  const smileAU12 = Math.min(1.0, Math.max(0.05, (mouthEnergy - 25) / 50));
  const browLowerAU4 = Math.min(1.0, Math.max(0.05, browFurrowRatio * 3.5));
  const innerBrowAU1 = Math.min(1.0, Math.max(0.08, 0.4 - browLowerAU4 * 0.3));
  const cheekRaiserAU6 = smileAU12 * 0.85;
  const lipDepressorAU15 = Math.min(1.0, Math.max(0.02, (browLowerAU4 * 0.6) - (smileAU12 * 0.5)));
  const eyeWidenAU5 = Math.min(1.0, Math.max(0.1, 0.2 + (smileAU12 > 0.6 ? 0.3 : 0.05)));

  const actionUnits: FacialActionUnits = {
    innerBrowRaiser: innerBrowAU1,
    browLowerer: browLowerAU4,
    cheekRaiser: cheekRaiserAU6,
    lipCornerPuller: smileAU12,
    lipCornerDepressor: lipDepressorAU15,
    lipsPart: Math.min(1.0, smileAU12 * 0.7),
    eyeWiden: eyeWidenAU5,
    blinkRate: 15 + Math.sin(tick * 0.05) * 4,
  };

  // Compute Valence and Arousal
  const valence = Math.max(-1.0, Math.min(1.0, (smileAU12 * 1.2) - (browLowerAU4 * 0.9) - (lipDepressorAU15 * 0.7)));
  const arousal = Math.max(0.05, Math.min(0.95, 0.3 + (smileAU12 * 0.35) + (browLowerAU4 * 0.35) + (eyeWidenAU5 * 0.2)));

  // Emotion Classification logic
  let primaryEmotion: EmotionType = "neutral";
  let confidence = 75;

  if (smileAU12 > 0.45 && valence > 0.25) {
    primaryEmotion = "joy";
    confidence = Math.min(96, 70 + smileAU12 * 28);
  } else if (browLowerAU4 > 0.55 && valence < -0.2) {
    primaryEmotion = "anger";
    confidence = Math.min(94, 68 + browLowerAU4 * 28);
  } else if (lipDepressorAU15 > 0.45 && valence < -0.25) {
    primaryEmotion = "sadness";
    confidence = Math.min(92, 65 + lipDepressorAU15 * 30);
  } else if (eyeWidenAU5 > 0.65 && arousal > 0.7) {
    primaryEmotion = "surprise";
    confidence = 88;
  } else if (innerBrowAU1 > 0.4 && smileAU12 < 0.2 && browLowerAU4 < 0.3) {
    primaryEmotion = "curious";
    confidence = 82;
  } else {
    primaryEmotion = "neutral";
    confidence = 84;
  }

  // Distribution calculation
  const distribution: Record<EmotionType, number> = {
    joy: Math.round((primaryEmotion as string) === "joy" ? confidence : Math.max(2, smileAU12 * 40)),
    sadness: Math.round((primaryEmotion as string) === "sadness" ? confidence : Math.max(2, lipDepressorAU15 * 35)),
    anger: Math.round((primaryEmotion as string) === "anger" ? confidence : Math.max(2, browLowerAU4 * 35)),
    surprise: Math.round((primaryEmotion as string) === "surprise" ? confidence : Math.max(2, eyeWidenAU5 * 30)),
    fear: Math.round((primaryEmotion as string) === "fear" ? confidence : 4),
    neutral: Math.round((primaryEmotion as string) === "neutral" ? confidence : Math.max(5, (1 - Math.abs(valence)) * 30)),
    disgust: Math.round((primaryEmotion as string) === "disgust" ? confidence : 3),
    curious: Math.round((primaryEmotion as string) === "curious" ? confidence : 12),
    contemplative: Math.round((primaryEmotion as string) === "contemplative" ? confidence : 10),
  };

  const microExpressions: string[] = [];
  if (smileAU12 > 0.4) microExpressions.push("Zygomatic corner pull (AU12)");
  if (cheekRaiserAU6 > 0.35) microExpressions.push("Orbicularis cheek elevation (AU6)");
  if (browLowerAU4 > 0.4) microExpressions.push("Corrugator supercilii tension (AU4)");
  if (lipDepressorAU15 > 0.3) microExpressions.push("Depressor anguli oris activation (AU15)");
  if (microExpressions.length === 0) microExpressions.push("Bilateral baseline equilibrium");

  const landmarks = computeLandmarkMesh(bbox, actionUnits, tick * 0.05);

  return {
    primaryEmotion,
    confidence,
    distribution,
    valence,
    arousal,
    attentionScore: faceDetected ? 94 : 45,
    actionUnits,
    gaze: { x: 0, y: 0, direction: "direct" },
    headPose: { pitch: 0.5, yaw: 0.2, roll: 0 },
    microExpressions,
    faceDetected,
    boundingBox: bbox,
    landmarks,
    timestamp: Date.now(),
  };
}
