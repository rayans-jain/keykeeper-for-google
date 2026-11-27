export type Verdict = "VALUABLE" | "WASTE" | "UNCLEAR";

export interface Step1Result {
  item_name: string;
  category: string;
  materials: string[];
  condition: string;
  verdict: Verdict;
  confidence: number;
  reason: string;
}

export interface DiyIdea {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time_minutes: number;
  youtube_search_query: string;
}

export interface YoutubeVideo {
  videoId: string;
  videoTitle: string;
  channelTitle: string;
  thumbnail: string;
}

export interface DiyIdeaWithVideo extends DiyIdea {
  video?: YoutubeVideo;
}

export interface Step2Result {
  material_type: string;
  composition_notes: string;
  recyclability_score: number;
  reusability_score: number;
  eco_safety_score: number;
  recyclability_level: "Easily recyclable" | "Conditionally recyclable" | "Not recyclable";
  bin_recommendation: string;
  prep_steps: string[];
  contamination_warnings: string[];
  environmental_impact: string;
  diy_ideas: DiyIdeaWithVideo[];
  pro_tip: string;
}

export interface ScanRecord {
  id: string;
  timestamp: number;
  thumbnail: string;
  step1: Step1Result;
  step2?: Step2Result;
}

export type PipelineStage =
  | "idle"
  | "preparing"
  | "identifying"
  | "analyzing"
  | "videos"
  | "done";