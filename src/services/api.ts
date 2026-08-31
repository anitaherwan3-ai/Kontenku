import {
  ProductAnalysis,
  StoryboardScene,
  PromptChainStep,
  AIStrategyRecommendation,
  PlatformInsight,
  AnalyticsMetric,
  SmartCaptionSuggestion,
  SmartHashtagGroup
} from '../types';

export const analyzeProductApi = async (params: {
  url?: string;
  promptConcept?: string;
  productText?: string;
}): Promise<ProductAnalysis> => {
  const res = await fetch('/api/analyze-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal menganalisis produk');
  }
  const json = await res.json();
  return json.data;
};

export const generateStoryboardApi = async (params: {
  productAnalysis: ProductAnalysis | null;
  promptConcept: string;
  duration: string;
  tone: string;
  avatarName: string;
  language: string;
}): Promise<StoryboardScene[]> => {
  const res = await fetch('/api/generate-storyboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal menghasilkan storyboard');
  }
  const json = await res.json();
  return json.scenes;
};

export const seedanceRemixApi = async (params: {
  scene: StoryboardScene;
  editInstruction: string;
  productContext?: string;
}): Promise<{
  updatedVisualPrompt: string;
  updatedAvatarAction: string;
  updatedOnScreenText: string;
  updatedCameraMovement: string;
  seedanceEffectSummary: string;
  visualStyleTags: string[];
}> => {
  const res = await fetch('/api/seedance-remix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal melakukan Seedance remix');
  }
  const json = await res.json();
  return json.data;
};

export const promptChainStepApi = async (params: {
  category: string;
  currentText: string;
  productTitle: string;
  goal?: string;
}): Promise<{
  refinedPrompt: string;
  aiSuggestedImprovements: string[];
  predictedCtrLift: string;
}> => {
  const res = await fetch('/api/prompt-chain-step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal memproses prompt chain step');
  }
  const json = await res.json();
  return json.data;
};

export const generateSocialCopyApi = async (params: {
  productName: string;
  usps: string[];
  promo: string;
  platform: string;
}): Promise<{
  caption: string;
  hashtags: string[];
  recommendedPostTime: string;
  targetAudiencePreset: string;
}> => {
  const res = await fetch('/api/generate-social-copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal membuat copy media sosial');
  }
  const json = await res.json();
  return json.data;
};

export const generateSmartCaptionsApi = async (params: {
  productAnalysis: ProductAnalysis | null;
  storyboard: StoryboardScene[];
  platform: string;
  customFocus?: string;
}): Promise<{
  suggestions: SmartCaptionSuggestion[];
  hashtagGroups: SmartHashtagGroup[];
}> => {
  const res = await fetch('/api/generate-smart-captions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal menghasilkan smart captions & hashtags AI');
  }
  const json = await res.json();
  return json.data;
};

export const fetchAiStrategyInsightsApi = async (params: {
  analytics: {
    overall: AnalyticsMetric;
    byPlatform: PlatformInsight[];
    retentionCurve: any[];
  };
  productTitle: string;
}): Promise<AIStrategyRecommendation[]> => {
  const res = await fetch('/api/ai-strategy-insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil insight AI');
  }
  const json = await res.json();
  return json.recommendations;
};

export const generateHookVariantsApi = async (params: {
  productTitle: string;
  usps: string[];
  painPoints: string[];
  tone: string;
  language: string;
}): Promise<import('../types').HookVariant[]> => {
  const res = await fetch('/api/generate-hook-variants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal menghasilkan varian hook');
  }
  const json = await res.json();
  return json.hooks;
};

export const translateStoryboardApi = async (params: {
  scenes: StoryboardScene[];
  targetLanguage: string;
  targetRegion?: string;
}): Promise<StoryboardScene[]> => {
  const res = await fetch('/api/translate-storyboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal menerjemahkan storyboard');
  }
  const json = await res.json();
  return json.scenes;
};

export const removeBackgroundApi = async (params: {
  imageUrl: string;
  assetId?: string;
  backgroundPreset?: string;
}): Promise<{ cutOutUrl: string; transparentPngUrl: string; status: string }> => {
  const res = await fetch('/api/remove-background', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal menghapus background aset');
  }
  const json = await res.json();
  return json.data;
};

export const fetchSeoKeywordsApi = async (params: {
  productTitle?: string;
  category?: string;
  platform?: 'tiktok' | 'reels' | 'all';
  customNiche?: string;
}): Promise<import('../types').SEOKeywordItem[]> => {
  const res = await fetch('/api/seo-keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data tren kata kunci SEO');
  }
  const json = await res.json();
  return json.keywords;
};

export const optimizeScriptSeoApi = async (params: {
  scenes: StoryboardScene[];
  selectedKeywords: import('../types').SEOKeywordItem[];
  productTitle?: string;
  platform?: string;
}): Promise<StoryboardScene[]> => {
  const res = await fetch('/api/optimize-script-seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal mengoptimasi naskah dengan kata kunci SEO');
  }
  const json = await res.json();
  return json.scenes;
};

export const generate3ActScriptApi = async (params: {
  productTitle: string;
  category?: string;
  brandName?: string;
  keywords: string[];
  usps?: string[];
  painPoints?: string[];
  tone?: string;
  duration?: string;
  adGoal?: string;
  language?: string;
  strategyAngle?: string;
}): Promise<import('../types').ThreeActScriptData> => {
  const res = await fetch('/api/generate-3act-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal menghasilkan naskah video 3 babak AI');
  }
  const json = await res.json();
  return json.data;
};

export const magicRefineStoryboardApi = async (params: {
  scenes: StoryboardScene[];
  productAnalysis?: import('../types').ProductAnalysis;
  specificSceneId?: string;
  focus?: 'viral_hooks' | 'cinematic_prompts' | 'all';
}): Promise<{
  scenes: StoryboardScene[];
  refineSummary: string;
  viralHooksSuggested?: string[];
}> => {
  const res = await fetch('/api/storyboard/magic-refine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Gagal menyempurnakan storyboard dengan AI Magic Refine');
  }
  const json = await res.json();
  return json.data;
};



