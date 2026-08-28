import React, { useState, useEffect } from 'react';
import { DynamicSticker, StoryboardScene } from '../../types';
import {
  Flame,
  Clock,
  Tag,
  ShieldCheck,
  Truck,
  Star,
  Sparkles,
  ArrowDownRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface DynamicStickersOverlayProps {
  stickers: DynamicSticker[];
  activeScene: StoryboardScene;
  currentTime: number;
}

export const DynamicStickersOverlay: React.FC<DynamicStickersOverlayProps> = ({
  stickers,
  activeScene,
  currentTime,
}) => {
  // Live ticking countdown timer state (hours:minutes:seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5640); // ~1h 34m

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 5400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeStickers = stickers.filter((sticker) => {
    if (!sticker.enabled) return false;
    if (sticker.visibleScenes === 'hook_only') {
      return activeScene?.sceneNumber === 1 || activeScene?.sceneType === 'hook';
    }
    if (sticker.visibleScenes === 'cta_only') {
      return (
        activeScene?.sceneType === 'cta' ||
        activeScene?.sceneNumber === 5 ||
        activeScene?.onScreenText?.toLowerCase().includes('keranjang')
      );
    }
    return true; // 'all'
  });

  if (activeStickers.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
      {activeStickers.map((sticker) => {
        const posX = sticker.positionX ?? 50;
        const posY = sticker.positionY ?? 50;
        const scaleVal = (sticker.scale || 100) / 100;

        // Theme colors
        let themeClasses = 'bg-rose-600 text-white border-rose-400';
        let badgeBg = 'bg-rose-950/80';
        if (sticker.colorTheme === 'tiktok_yellow') {
          themeClasses = 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-amber-500/50';
          badgeBg = 'bg-amber-100 text-slate-950';
        } else if (sticker.colorTheme === 'emerald_trust') {
          themeClasses = 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/40';
          badgeBg = 'bg-emerald-950/80';
        } else if (sticker.colorTheme === 'purple_vip') {
          themeClasses = 'bg-purple-600 text-white border-purple-400 shadow-purple-500/40';
          badgeBg = 'bg-purple-950/80';
        } else if (sticker.colorTheme === 'neon_cyan') {
          themeClasses = 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-cyan-500/50';
          badgeBg = 'bg-cyan-100 text-slate-950';
        }

        // Animation classes
        let animClass = '';
        if (sticker.animation === 'pulse') animClass = 'animate-pulse';
        if (sticker.animation === 'bounce') animClass = 'animate-bounce';
        if (sticker.animation === 'floating') animClass = 'animate-[bounce_2s_infinite]';

        return (
          <div
            key={sticker.id}
            className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              transform: `translate(-50%, -50%) scale(${scaleVal})`,
            }}
          >
            {/* TYPE 1: Countdown Flash Sale Timer */}
            {sticker.type === 'countdown_timer' && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-md ${themeClasses} ${animClass}`}
              >
                <div className="flex items-center gap-1.5 font-black text-[10px] sm:text-xs uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse fill-amber-300" />
                  <span>{sticker.title}</span>
                </div>
                <div className="bg-black/90 text-amber-400 font-mono font-bold text-[11px] sm:text-xs px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1 tracking-wider shadow-inner">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{formatCountdown(secondsRemaining)}</span>
                </div>
              </div>
            )}

            {/* TYPE 2: Flash Discount Badge */}
            {sticker.type === 'flash_discount' && (
              <div
                className={`relative px-3 py-1.5 rounded-2xl border-2 shadow-2xl flex items-center gap-2 ${themeClasses} ${animClass}`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                  %
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm leading-tight tracking-tight uppercase">
                    {sticker.title}
                  </div>
                  {sticker.subTitle && (
                    <div className="text-[9px] opacity-90 font-medium">
                      {sticker.subTitle}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TYPE 3: Yellow Cart Animated Pointer Arrow */}
            {sticker.type === 'yellow_cart_arrow' && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 bg-amber-400 text-slate-950 border-amber-200 shadow-2xl font-black text-xs ${animClass}`}
              >
                <span className="text-base animate-bounce">🛍️</span>
                <div>
                  <div className="text-xs uppercase tracking-wide flex items-center gap-1">
                    <span>{sticker.title}</span>
                  </div>
                  {sticker.subTitle && (
                    <div className="text-[9px] text-slate-800 font-semibold">
                      {sticker.subTitle}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TYPE 4: Guarantee & BPOM / Original Seal */}
            {sticker.type === 'guarantee_badge' && (
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border shadow-lg backdrop-blur-md ${themeClasses} ${animClass}`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <div className="text-left">
                  <div className="font-bold text-[10px] uppercase leading-tight">
                    {sticker.title}
                  </div>
                  {sticker.subTitle && (
                    <div className="text-[8px] opacity-80">{sticker.subTitle}</div>
                  )}
                </div>
              </div>
            )}

            {/* TYPE 5: Free Shipping & COD */}
            {sticker.type === 'free_shipping_cod' && (
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border shadow-lg backdrop-blur-md ${themeClasses} ${animClass}`}
              >
                <Truck className="w-4 h-4 text-cyan-200 shrink-0" />
                <div className="text-left">
                  <div className="font-bold text-[10px] uppercase leading-tight">
                    {sticker.title}
                  </div>
                  {sticker.subTitle && (
                    <div className="text-[8px] opacity-80">{sticker.subTitle}</div>
                  )}
                </div>
              </div>
            )}

            {/* TYPE 6: Social Proof & Star Ratings */}
            {sticker.type === 'rating_social_proof' && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-md ${themeClasses} ${animClass}`}
              >
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <div className="text-left">
                  <div className="font-extrabold text-[10px] uppercase leading-tight">
                    {sticker.title}
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 7: Custom Text Badge */}
            {sticker.type === 'custom_text_badge' && (
              <div
                className={`px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md ${themeClasses} ${animClass}`}
              >
                <div className="font-bold text-xs leading-tight">{sticker.title}</div>
                {sticker.subTitle && (
                  <div className="text-[9px] opacity-80">{sticker.subTitle}</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
