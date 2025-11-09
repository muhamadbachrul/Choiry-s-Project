
export interface Outline {
  hook: string;
  mainPoint: string;
  cta: string;
}

export interface ViralPackage {
  viralTopic: string;
  title: string;
  description: string;
  primaryHashtags: string[];
  engagementHashtags: string[];
  outline: Outline;
}

export interface StrategicReport {
  topSuccessPattern: string;
  coreWeakness: string;
  actionPlan: string[];
}
