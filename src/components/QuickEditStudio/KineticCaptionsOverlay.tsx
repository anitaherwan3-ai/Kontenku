import React, { useMemo } from 'react';
import { CaptionStyle, StoryboardScene } from '../../types';
import { parseStoryboardToKineticWords, getActiveWordIndexAtTime } from '../../utils/kineticCaptionParser';

interface KineticCaptionsOverlayProps {
  scene: StoryboardScene;
  currentTime: number;
  sceneStartTime: number;
  captionStyle: CaptionStyle;
}

export const KineticCaptionsOverlay: React.FC<KineticCaptionsOverlayProps> = ({
  scene,
  currentTime,
  sceneStartTime,
  captionStyle,
}) => {
  if (!scene) return null;

  const timingOffset = captionStyle.timingOffset || 0;
  const wordsPerChunk = captionStyle.wordsPerChunk || 4;

  // Parse voiceover into timed words
  const { words } = useMemo(() => {
    return parseStoryboardToKineticWords([scene], timingOffset);
  }, [scene, timingOffset]);

  const sceneDuration = scene.durationSeconds || 3;
  const elapsedInScene = Math.max(0, currentTime - sceneStartTime);
  
  // Find current active word
  const activeWordIdx = useMemo(() => {
    return getActiveWordIndexAtTime(words, elapsedInScene);
  }, [words, elapsedInScene]);

  if (words.length === 0) return null;

  const preset = captionStyle.presetType || 'hormozi_bold';

  // Preset Visual & Motion Configuration
  const getPresetConfig = () => {
    switch (preset) {
      case 'hormozi_bold':
        return {
          font: captionStyle.fontFamily || 'Montserrat',
          highlight: captionStyle.highlightColor || '#FACC15', // Neon Yellow
          secondaryHighlight: '#4ADE80', // Bright Green
          keywordHighlight: '#F43F5E', // Rose/Red for big discounts
          textColor: '#FFFFFF',
          strokeColor: captionStyle.strokeColor || '#000000',
          strokeWidth: captionStyle.strokeWidth !== undefined ? captionStyle.strokeWidth : 4,
          boxBg: captionStyle.boxBackground !== false ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
          scaleEffect: captionStyle.wordPopScale || 1.32,
          shadow: '0 8px 24px rgba(0,0,0,0.8), 0 0 16px rgba(250,204,21,0.5)',
          animationType: 'pop_pulse',
        };
      case 'mrbeast_impact':
        return {
          font: 'Impact',
          highlight: '#EF4444', // Warning Red
          secondaryHighlight: '#FACC15', // Yellow
          keywordHighlight: '#F97316', // Orange
          textColor: '#FFFFFF',
          strokeColor: '#000000',
          strokeWidth: 5,
          boxBg: 'transparent',
          scaleEffect: 1.38,
          shadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 12px 28px rgba(0,0,0,0.9)',
          animationType: 'jump_bounce',
        };
      case 'cyber_neon':
        return {
          font: 'Bebas Neue',
          highlight: '#22D3EE', // Cyan Neon
          secondaryHighlight: '#F43F5E', // Magenta
          keywordHighlight: '#A855F7', // Purple
          textColor: '#FFFFFF',
          strokeColor: '#0F172A',
          strokeWidth: 3,
          boxBg: 'rgba(15, 23, 42, 0.85)',
          scaleEffect: 1.22,
          shadow: '0 0 20px rgba(34, 211, 238, 0.9), 0 0 35px rgba(244, 63, 94, 0.6)',
          animationType: 'neon_glow',
        };
      case 'clean_minimal_pill':
        return {
          font: 'Plus Jakarta Sans',
          highlight: '#10B981', // Emerald
          secondaryHighlight: '#6366F1', // Indigo
          keywordHighlight: '#065F46',
          textColor: '#FFFFFF',
          strokeColor: 'transparent',
          strokeWidth: 0,
          boxBg: 'rgba(15, 23, 42, 0.78)',
          scaleEffect: 1.12,
          shadow: '0 8px 30px rgba(0,0,0,0.6)',
          animationType: 'smooth_slide',
        };
      case 'luxury_serif':
        return {
          font: 'Playfair',
          highlight: '#F59E0B', // Gold
          secondaryHighlight: '#FDE68A',
          keywordHighlight: '#D97706',
          textColor: '#FFFFFF',
          strokeColor: '#000000',
          strokeWidth: 2,
          boxBg: 'rgba(0, 0, 0, 0.65)',
          scaleEffect: 1.18,
          shadow: '0 6px 20px rgba(0,0,0,0.7), 0 0 12px rgba(245,158,11,0.4)',
          animationType: 'editorial_shimmer',
        };
      case 'karaoke_bounce':
        return {
          font: 'Montserrat',
          highlight: '#38BDF8', // Sky Blue
          secondaryHighlight: '#FACC15',
          keywordHighlight: '#EC4899',
          textColor: '#FFFFFF',
          strokeColor: '#000000',
          strokeWidth: 3,
          boxBg: 'rgba(0, 0, 0, 0.55)',
          scaleEffect: 1.3,
          shadow: '0 8px 24px rgba(0,0,0,0.75)',
          animationType: 'jump_bounce',
        };
      case 'tiktok_viral_yellow':
      default:
        return {
          font: captionStyle.fontFamily || 'Montserrat',
          highlight: captionStyle.highlightColor || '#FACC15',
          secondaryHighlight: '#38BDF8',
          keywordHighlight: '#F43F5E',
          textColor: captionStyle.textColor || '#FFFFFF',
          strokeColor: captionStyle.strokeColor || '#000000',
          strokeWidth: captionStyle.strokeWidth || 3,
          boxBg: captionStyle.backgroundColor || 'rgba(0, 0, 0, 0.65)',
          scaleEffect: 1.25,
          shadow: '0 6px 22px rgba(0,0,0,0.75)',
          animationType: 'karaoke_glow',
        };
    }
  };

  const config = getPresetConfig();

  // Active word chunk window
  const safeActiveIdx = Math.max(0, activeWordIdx);
  const chunkIndex = Math.floor(safeActiveIdx / wordsPerChunk);
  const currentChunkWords = words.slice(
    chunkIndex * wordsPerChunk,
    (chunkIndex + 1) * wordsPerChunk
  );
  const relativeActiveIndex = safeActiveIdx % wordsPerChunk;

  return (
    <div
      className="absolute inset-x-2 sm:inset-x-4 text-center pointer-events-none z-30 transition-all duration-150"
      style={{ top: `${captionStyle.positionY || 74}%` }}
    >
      <div
        className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:py-2.5 rounded-2xl transition-all duration-200 max-w-[94%] border border-white/10"
        style={{
          backgroundColor: config.boxBg,
          backdropFilter: config.boxBg !== 'transparent' ? 'blur(10px)' : 'none',
          boxShadow: config.shadow,
        }}
      >
        {currentChunkWords.map((wordItem, idx) => {
          const isActive = idx === relativeActiveIndex;
          const isPassed = idx < relativeActiveIndex;
          const isKeyword = wordItem.isKeyword;

          let wordColor = config.textColor;
          if (isActive) {
            wordColor = isKeyword ? config.keywordHighlight || config.highlight : config.highlight;
          } else if (isPassed) {
            wordColor = '#CBD5E1';
          } else if (isKeyword && captionStyle.autoKeywordHighlight) {
            wordColor = config.secondaryHighlight;
          }

          const displayText = captionStyle.uppercase
            ? wordItem.word.toUpperCase()
            : wordItem.word;

          return (
            <span
              key={`${chunkIndex}-${idx}-${wordItem.id}`}
              className="relative inline-flex items-center gap-1 font-black tracking-wide transition-all duration-150"
              style={{
                fontFamily: config.font,
                fontSize: `${(captionStyle.fontSize || 22) * (isActive ? 1.08 : 0.95)}px`,
                color: wordColor,
                transform: isActive
                  ? `scale(${config.scaleEffect}) translateY(-3px)`
                  : 'scale(1)',
                WebkitTextStroke:
                  config.strokeWidth > 0
                    ? `${config.strokeWidth * 0.55}px ${config.strokeColor}`
                    : 'none',
                textShadow: isActive
                  ? `0 0 16px ${wordColor}bb, 0 4px 12px rgba(0,0,0,0.9)`
                  : '0 2px 8px rgba(0,0,0,0.85)',
                filter: isActive ? 'brightness(1.2)' : 'none',
              }}
            >
              {/* Optional Auto-Emoji Sticker on active trigger words */}
              {captionStyle.showEmojiHighlights !== false && isKeyword && isActive && wordItem.emojiTag && (
                <span className="inline-block text-base animate-bounce drop-shadow-md mr-0.5">
                  {wordItem.emojiTag}
                </span>
              )}

              <span>{displayText}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
