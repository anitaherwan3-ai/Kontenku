import React from 'react';
import { AutoWatermarkConfig } from '../../types';
import { ShieldCheck, Check } from 'lucide-react';

interface WatermarkOverlayProps {
  config?: AutoWatermarkConfig;
  accountHandle?: string;
  brandName?: string;
  className?: string;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  config,
  accountHandle = '@glowluxe.official',
  brandName = 'GlowLuxe Official',
  className = '',
}) => {
  if (!config || !config.enabled) return null;

  const displayText =
    config.type === 'handle'
      ? accountHandle
      : config.type === 'brand_name'
      ? brandName
      : config.text || accountHandle;

  // Position classes
  const getPositionClasses = () => {
    switch (config.position) {
      case 'top-left':
        return 'top-4 left-4 items-start';
      case 'top-right':
        return 'top-4 right-4 items-end';
      case 'bottom-left':
        return 'bottom-16 left-4 items-start';
      case 'bottom-right':
        return 'bottom-16 right-4 items-end';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center';
      default:
        return 'top-4 right-4 items-end';
    }
  };

  // Style classes
  const getStyleClasses = () => {
    switch (config.style) {
      case 'pill_badge':
        return 'bg-black/60 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-full shadow-lg';
      case 'neon_glow':
        return 'bg-indigo-950/80 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.5)] px-2.5 py-1 rounded-lg';
      case 'minimal_white':
        return 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-semibold tracking-wider';
      case 'anti_theft_diagonal':
        return 'text-white/40 rotate-[-25deg] select-none font-bold uppercase tracking-widest text-xs pointer-events-none';
      case 'subtle_translucent':
      default:
        return 'bg-slate-900/40 backdrop-blur-xs text-white/90 border border-white/10 px-2 py-0.5 rounded-md';
    }
  };

  // If diagonal anti-theft mode is selected, repeat across video canvas
  if (config.style === 'anti_theft_diagonal') {
    return (
      <div
        className={`absolute inset-0 pointer-events-none z-20 overflow-hidden flex flex-col justify-around py-4 ${className}`}
        style={{ opacity: config.opacity || 0.6 }}
      >
        <div className="flex justify-around transform -rotate-12 select-none">
          <span className="text-[11px] font-black tracking-widest text-white/30 drop-shadow">
            🔒 {displayText} • OFFICIAL ORIGINAL
          </span>
          <span className="text-[11px] font-black tracking-widest text-white/30 drop-shadow">
            🔒 {displayText} • DO NOT REPOST
          </span>
        </div>
        <div className="flex justify-around transform -rotate-12 select-none">
          <span className="text-[11px] font-black tracking-widest text-white/30 drop-shadow">
            PROTECTED COPY • {displayText}
          </span>
          <span className="text-[11px] font-black tracking-widest text-white/30 drop-shadow">
            {displayText} • VERIFIED PIPPIN AI
          </span>
        </div>
      </div>
    );
  }

  const scaleMultiplier = (config.scale || 100) / 100;

  return (
    <div
      className={`absolute pointer-events-none z-20 flex flex-col ${getPositionClasses()} ${className}`}
      style={{
        opacity: config.opacity || 0.75,
        transform: `scale(${scaleMultiplier})`,
        transformOrigin:
          config.position === 'top-left'
            ? 'top left'
            : config.position === 'top-right'
            ? 'top right'
            : config.position === 'bottom-left'
            ? 'bottom left'
            : config.position === 'bottom-right'
            ? 'bottom right'
            : 'center',
      }}
    >
      <div className={`flex items-center gap-1.5 text-xs select-none ${getStyleClasses()}`}>
        {config.logoUrl ? (
          <img
            src={config.logoUrl}
            alt="Watermark Logo"
            className="w-4 h-4 object-contain rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        )}

        <span className="font-bold tracking-tight whitespace-nowrap text-[11px]">
          {displayText}
        </span>

        {config.showVerifiedIcon && (
          <span className="w-3 h-3 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[8px] font-bold shrink-0">
            ✓
          </span>
        )}
      </div>

      {config.showTimestamp && (
        <span className="text-[8px] font-mono text-white/70 px-1 mt-0.5 drop-shadow">
          REC • 2026-08-28 19:30 WIB
        </span>
      )}
    </div>
  );
};
