export type EmotionType =
  | "joy"
  | "sadness"
  | "anger"
  | "surprise"
  | "fear"
  | "neutral"
  | "disgust"
  | "curious"
  | "contemplative";

export interface FacialActionUnits {
  innerBrowRaiser: number; // AU1
  browLowerer: number; // AU4
  cheekRaiser: number; // AU6
  lipCornerPuller: number; // AU12 (smile)
  lipCornerDepressor: number; // AU15 (frown)
  lipsPart: number; // AU25
  eyeWiden: number; // AU5
  blinkRate: number; // blinks/min
}

export interface LandmarkPoint {
  x: number;
  y: number;
}

export interface EmotionAnalysis {
  primaryEmotion: EmotionType;
  confidence: number; // 0 - 100%
  distribution: Record<EmotionType, number>; // 0 - 100%
  valence: number; // -1.0 to 1.0 (unpleasant to pleasant)
  arousal: number; // 0.0 to 1.0 (calm to agitated/excited)
  attentionScore: number; // 0 - 100%
  actionUnits: FacialActionUnits;
  gaze: {
    x: number;
    y: number;
    direction: "direct" | "left" | "right" | "up" | "down" | "averted";
  };
  headPose: {
    pitch: number;
    yaw: number;
    roll: number;
  };
  microExpressions: string[];
  faceDetected: boolean;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: LandmarkPoint[];
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  emotionSnapshot?: {
    primaryEmotion: EmotionType;
    confidence: number;
    valence: number;
    arousal: number;
    actionUnitsSummary: string;
  };
  botEmpathyStrategy?: {
    strategy: string;
    tone: string;
    detectedMood: string;
    facialCueObservation: string;
    suggestedAction?: string;
    suggestedQuickReplies?: string[];
  };
}

export interface SessionTimelinePoint {
  id: string;
  time: string;
  emotion: EmotionType;
  valence: number;
  arousal: number;
  triggerEvent: string;
}

export interface EmotionPreset {
  id: string;
  name: string;
  emotion: EmotionType;
  description: string;
  valence: number;
  arousal: number;
  actionUnits: FacialActionUnits;
  microExpressions: string[];
  avatarIcon: string;
}
