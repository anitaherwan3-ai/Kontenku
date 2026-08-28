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
  angleType: 'curiosity_gap' | 'problem_agitation' | 'price_shock' | 'social_proof' | 'skeptical_reverse' | 'asmr_unboxing';
  angleTitle: string;
  voiceoverText: string;
  onScreenText: string;
  visualPrompt: string;
  visualUrl?: string;
  predictedRetention3s: number;
  predictedCtrLift: string;
  psychologicalTrigger: string;
  tags?: string[];
  isWinningVariant?: boolean;
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

export interface ParsedCaptionWord {
  id: string;
  word: string;
  cleanWord: string;
  startTime: number;
  endTime: number;
  duration: number;
  isKeyword: boolean;
  keywordCategory?: 'urgency' | 'benefit' | 'price' | 'social_proof' | 'cta';
  emojiTag?: string;
  emphasisScale?: number;
}

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

export type CaptionPresetType =
  | 'hormozi_bold'
  | 'mrbeast_impact'
  | 'tiktok_viral_yellow'
  | 'cyber_neon'
  | 'clean_minimal_pill'
  | 'luxury_serif'
  | 'karaoke_bounce';

export interface CaptionStyle {
  presetType?: CaptionPresetType;
  fontFamily: 'Inter' | 'Montserrat' | 'Impact' | 'Playfair' | 'Bebas Neue' | 'Plus Jakarta Sans';
  fontSize: number;
  textColor: string;
  highlightColor: string;
  secondaryHighlightColor?: string;
  backgroundColor?: string;
  strokeColor: string;
  strokeWidth: number;
  positionY: number; // 0 (top) to 100 (bottom), default ~75
  animation: 'karaoke_glow' | 'bounce' | 'slide_up' | 'simple_fade' | 'word_pop' | 'hormozi_pulse';
  uppercase: boolean;
  showEmojiHighlights?: boolean;
  showEmojiBadges?: boolean;
  boxBackground?: boolean | string;
  boxBgColor?: string;
  boxPadding?: number;
  wordPopScale?: number; // e.g. 1.25 for explosive word pop
  shadowIntensity?: 'none' | 'subtle' | 'heavy' | 'neon_glow';
  timingOffset?: number; // -0.5s to +0.5s offset for perfect voice sync
  syncOffsetMs?: number; // millisecond voiceover sync offset (-500 to +500)
  wordsPerChunk?: number; // 3 to 6 words displayed at once
  autoKeywordHighlight?: boolean;
  autoKeywordsHighlight?: boolean;
  activeWordGlow?: boolean;
}

export type DynamicStickerType =
  | 'countdown_timer'
  | 'flash_discount'
  | 'yellow_cart_arrow'
  | 'guarantee_badge'
  | 'free_shipping_cod'
  | 'rating_social_proof'
  | 'stock_urgency'
  | 'custom_text_badge';

export interface DynamicSticker {
  id: string;
  type: DynamicStickerType;
  title: string;
  subTitle?: string;
  discountPercent?: number;
  countdownMinutes?: number; // For live ticking flash sale (e.g. 90 mins)
  positionX: number; // 0-100% horizontal
  positionY: number; // 0-100% vertical
  scale: number; // 50 - 150%
  animation: 'pulse' | 'bounce' | 'shake' | 'flash_glow' | 'floating';
  colorTheme: 'urgent_red' | 'tiktok_yellow' | 'emerald_trust' | 'purple_vip' | 'neon_cyan';
  visibleScenes: 'all' | 'hook_only' | 'cta_only' | 'custom_range';
  startSec?: number;
  endSec?: number;
  enabled: boolean;
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
  scheduledTime: string; // e.g. "2026-08-28 19:30 WIB"
  scheduledDate?: string; // "2026-08-28"
  scheduledTimeOnly?: string; // "19:30"
  caption: string;
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published';
  targetAudienceName: string;
  thumbnailUrl: string;
  accountId?: string;
  accountHandle?: string;
  primeTimeTag?: string; // e.g. "TikTok Prime-Time 19:30 WIB"
  autoPublishEnabled?: boolean;
  videoVariant?: string;
}

export interface UploadHistoryItem {
  id: string;
  projectId: string;
  postTitle: string;
  platform: AdPlatform;
  accountId: string;
  accountName: string;
  accountHandle: string;
  avatarUrl: string;
  timestamp: string; // Formatted date string
  status: 'success' | 'failed' | 'scheduled' | 'processing';
  postUrl?: string; // Live post link
  videoVariant: string; // e.g. "9:16 Vertical 1080p (MP4)"
  captionPreview: string;
  hashtags?: string[];
  shopTagActive?: boolean;
  errorCode?: string; // e.g. "ERR_TOKEN_EXPIRED", "ERR_RATE_LIMIT"
  errorMessage?: string; // Indonesian detailed description
  retryCount?: number;
  stats?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    cartClicks: number;
  };
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

export interface SmartCaptionSuggestion {
  id: string;
  angle: 'hard_selling' | 'ugc_storytelling' | 'aesthetic_soft' | 'fomo_viral' | 'short_punchy';
  angleLabel: string;
  hookLine: string;
  bodyText: string;
  callToAction: string;
  fullCaption: string;
  hashtags: string[];
  estimatedEngagementLift: string;
  targetVibe: string;
}

export interface SmartHashtagGroup {
  category: 'Trending Niche' | 'High Buying Intent' | 'Algorithmic FYP' | 'Product USPs';
  tags: { tag: string; searchVolume: string; intent: string }[];
}

export interface AutoWatermarkConfig {
  enabled: boolean;
  type: 'handle' | 'brand_name' | 'logo' | 'custom_text';
  text: string;
  logoUrl?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number; // 0.1 to 1.0 (e.g. 0.7)
  scale: number; // 50 to 150 (percentage)
  style: 'subtle_translucent' | 'pill_badge' | 'neon_glow' | 'minimal_white' | 'anti_theft_diagonal';
  showTimestamp: boolean;
  showVerifiedIcon: boolean;
}

export interface EngagementMilestoneAlert {
  id: string;
  type: 'views' | 'cart_clicks' | 'shares' | 'roas' | 'viral_rank';
  title: string;
  message: string;
  metricLabel: string;
  metricValue: string;
  platform: AdPlatform;
  accountHandle: string;
  postTitle: string;
  timestamp: string;
  isRead: boolean;
  badgeColor: string;
  iconType: 'trophy' | 'flame' | 'shopping' | 'trending' | 'zap';
}

export interface ConnectedSocialAccount {
  id: string;
  platform: AdPlatform;
  accountName: string;
  accountHandle: string;
  avatarUrl: string;
  accountType: 'business' | 'creator' | 'personal';
  followersCount: string;
  status: 'connected' | 'expired' | 'connecting';
  shopLinked?: boolean;
  pageName?: string; // for Facebook Page or Shop handle
  tokenExpiresAt: string;
  category: string;
  brandTag?: string; // e.g. "Brand Official", "Affiliate Team 1", "Backup Store"
  productCatalogLinked?: string;
  autoSyncOrders?: boolean;
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
  uploadHistory?: UploadHistoryItem[];
  connectedAccounts?: ConnectedSocialAccount[];
  watermarkConfig?: AutoWatermarkConfig;
  engagementAlerts?: EngagementMilestoneAlert[];
  dynamicStickers?: DynamicSticker[];
  hookVariants?: HookVariant[];
  selectedHookId?: string;
  analytics: {
    overall: AnalyticsMetric;
    byPlatform: PlatformInsight[];
    retentionCurve: RetentionDataPoint[];
    recommendations: AIStrategyRecommendation[];
  };
}

// Background Processing Queue Types
export type RenderFormat = 'mp4' | 'mov' | 'gif' | 'srt' | 'audio_pack';
export type RenderTaskStatus = 'queued' | 'rendering' | 'assembling' | 'completed' | 'failed' | 'paused';

export interface RenderTask {
  id: string;
  batchId: string;
  projectId: string;
  projectTitle: string;
  format: RenderFormat;
  aspectRatio: AspectRatio;
  resolution: '720p_lite' | '1080p' | '4k';
  fps: 30 | 60;
  includeCaptions: boolean;
  includeAudio: boolean;
  status: RenderTaskStatus;
  progress: number; // 0-100%
  currentChunk: number;
  totalChunks: number;
  renderStepLabel: string;
  fileSizeMb: number;
  outputFilename: string;
  downloadUrl?: string;
  error?: string;
  startedAt?: number;
  completedAt?: number;
  estimatedSecondsRemaining?: number;
  fpsProcessed?: number;
}

export interface BulkRenderBatch {
  id: string;
  title: string;
  createdAt: number;
  status: 'running' | 'paused' | 'completed' | 'cancelled';
  tasks: RenderTask[];
  totalTasks: number;
  completedTasks: number;
  overallProgress: number;
}

