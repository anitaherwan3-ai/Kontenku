export type AspectRatio = '9:16' | '16:9' | '1:1';
export type AdDuration = '15s' | '30s' | '60s';
export type AdPlatform = 'tiktok' | 'instagram' | 'facebook' | 'youtube_shorts';

export interface ProductAnalysis {
  productName: string;
  category: string;
  brandName?: string;
  pricePoint: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  painPointsSolved: string[];
  recommendedHook: string;
  toneOfVoice: string;
  visualAesthetic: string;
  confidenceScore: number;
}

export interface UploadedAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'logo' | 'sop_document';
  url: string;
  size?: string;
  duration?: number; // for video in seconds
  processed?: boolean;
  bgRemovedUrl?: string;
  tags?: string[];
  aspectRatio?: string;
  assignedSceneId?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Skincare & Beauty' | 'Tech & Gadgets' | 'Food & Beverage' | 'Fashion & Apparel' | 'Home & Living' | 'Fitness & Health';
  badge: string;
  icon: string;
  hookHeadline: string;
  promptText: string;
  recommendedGoal: 'conversion' | 'brand_awareness' | 'traffic' | 'viral_ugc';
  recommendedTone: 'excited_ugc' | 'aesthetic_lifestyle' | 'problem_solution' | 'humorous_skit' | 'luxury_review';
  recommendedDuration: AdDuration;
}

export interface InputLayerData {
  productUrl: string;
  productAnalysis: ProductAnalysis | null;
  uploadedAssets: UploadedAsset[];
  promptConcept: string;
  adGoal: 'conversion' | 'brand_awareness' | 'traffic' | 'viral_ugc';
  aspectRatio: AspectRatio;
  duration: AdDuration;
  targetLanguage: 'id' | 'en' | 'id-jv' | 'id-su' | 'ms';
  selectedTone: 'excited_ugc' | 'aesthetic_lifestyle' | 'problem_solution' | 'humorous_skit' | 'luxury_review';
}

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  sceneType: 'hook' | 'problem' | 'solution' | 'demo' | 'social_proof' | 'cta';
  durationSeconds: number;
  voiceoverText: string;
  avatarAction: string;
  visualPrompt: string; // Used for Seedance AI image/video generation
  visualUrl?: string;
  onScreenText: string;
  cameraMovement: 'zoom_in' | 'pan_right' | 'static' | 'dynamic_shake' | 'orbit';
  transition: 'cut' | 'fade' | 'swipe_left' | 'zoom_blur' | 'glitch';
  bgSoundEffect?: string;
}

export interface DigitalAvatar {
  id: string;
  name: string;
  role: string;
  gender: 'female' | 'male';
  avatarImage: string;
  previewVideoUrl?: string;
  accent: string;
  supportedLanguages: string[];
  defaultVoice: string;
  tags: string[];
}

export interface HookVariant {
  id: string;
  angleType: 'curiosity_gap' | 'problem_agitation' | 'price_shock' | 'social_proof';
  angleTitle: string;
  voiceoverText: string;
  onScreenText: string;
  visualPrompt: string;
  predictedRetention3s: number;
  predictedCtrLift: string;
  psychologicalTrigger: string;
}

export interface SoundEffectItem {
  id: string;
  name: string;
  category: 'Impact' | 'Cash & Sale' | 'Meme & TikTok' | 'Whoosh' | 'ASMR';
  iconName: string;
  synthType: 'chaching' | 'whoosh' | 'thock' | 'bell' | 'scratch' | 'airhorn' | 'pop';
  durationSec: number;
}

export interface TTSSettings {
  voiceId: string;
  language: string;
  speed: number; // 0.8 to 1.4
  pitch: number; // 0.8 to 1.2
  emotion: 'natural' | 'excited' | 'convincing' | 'calm' | 'authoritative';
  generatedAudioUrl?: string;
  isGenerating?: boolean;
}

export interface PromptChainStep {
  id: string;
  stepNumber: number;
  title: string;
  category: 'hook' | 'visual_seedance' | 'avatar_speech' | 'cta_offer' | 'sound_design';
  originalPrompt: string;
  refinedPrompt: string;
  aiSuggestedImprovements: string[];
  status: 'pending' | 'applied' | 'skipped';
}

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

export interface CaptionStyle {
  fontFamily: 'Inter' | 'Montserrat' | 'Impact' | 'Playfair' | 'Bebas Neue' | 'Plus Jakarta Sans';
  fontSize: number;
  textColor: string;
  highlightColor: string;
  backgroundColor?: string;
  strokeColor: string;
  strokeWidth: number;
  positionY: number; // 0 (top) to 100 (bottom), default ~75
  animation: 'karaoke_glow' | 'bounce' | 'slide_up' | 'simple_fade' | 'word_pop';
  uppercase: boolean;
}

export interface BackgroundMusicTrack {
  id: string;
  title: string;
  genre: 'TikTok Viral Beat' | 'Commerce Upbeat' | 'Lo-Fi Chill' | 'Cinematic Drama' | 'Electronic Energy';
  bpm: number;
  duration: string;
  audioUrl: string;
}

export interface ScheduledPost {
  id: string;
  platform: AdPlatform;
  scheduledTime: string; // ISO date string or formatted
  caption: string;
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published';
  targetAudienceName: string;
  thumbnailUrl: string;
}

export interface AnalyticsMetric {
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
  conversions: number;
  engagementRate: number;
  retention3s: number;
  retention15s: number;
  shares: number;
  comments: number;
  estimatedRoas: number;
}

export interface PlatformInsight {
  platform: AdPlatform;
  impressions: number;
  views: number;
  engagementRate: number;
  costPerClick: number;
  conversions: number;
  roas: number;
}

export interface RetentionDataPoint {
  second: number;
  retentionPercentage: number;
  benchmarkPercentage: number;
  dropoffNote?: string;
}

export interface AIStrategyRecommendation {
  id: string;
  type: 'hook_optimization' | 'pacing' | 'cta_boost' | 'budget_scale' | 'creative_fatigue';
  title: string;
  insight: string;
  actionableStep: string;
  potentialImpact: string;
}

export interface SEOKeywordItem {
  id: string;
  keyword: string;
  category: string;
  platform: 'tiktok' | 'reels' | 'all';
  intent: 'high_buying_intent' | 'viral_hook' | 'problem_solution' | 'unboxing_review' | 'promo_discount' | 'curiosity_gap' | 'demo' | 'social_proof';
  searchVolume: string; // e.g. "1.8M / bln"
  growthPercent: number; // e.g. +145%
  competition: 'Low' | 'Medium' | 'High';
  ctrLift: string; // e.g. "+38% CTR"
  recommendedSceneType: 'hook' | 'problem' | 'solution' | 'demo' | 'social_proof' | 'cta';
  sampleUsage: string;
}

export interface SEOScriptAnalysis {
  overallScore: number; // 0 - 100
  matchedKeywords: string[];
  missingHighImpactKeywords: string[];
  hookSEOStrength: 'weak' | 'good' | 'viral_optimized';
  keywordDensityPercent: number;
  recommendations: string[];
  suggestedHashtags: string[];
}

export interface PippitProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  inputData: InputLayerData;
  storyboard: StoryboardScene[];
  selectedAvatar: DigitalAvatar;
  ttsSettings: TTSSettings;
  promptChainSteps: PromptChainStep[];
  captionStyle: CaptionStyle;
  selectedBgm: BackgroundMusicTrack;
  bgmVolume: number;
  voiceVolume: number;
  scheduledPosts: ScheduledPost[];
  analytics: {
    overall: AnalyticsMetric;
    byPlatform: PlatformInsight[];
    retentionCurve: RetentionDataPoint[];
    recommendations: AIStrategyRecommendation[];
  };
}
