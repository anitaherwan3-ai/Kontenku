import { ParsedCaptionWord, StoryboardScene, CaptionStyle } from '../types';

// High-conversion trigger keywords for E-Commerce video ads in Indonesian & English
const URGENCY_WORDS = new Set([
  'sekarang', 'terbatas', 'habis', 'buruan', 'segera', 'langka', 'cepetan', 'flash', 'sale',
  'limited', 'hurry', 'now', 'today', 'hari ini', 'detik', 'menit', 'jangan sampai kehabisan',
  'stok', 'sold out', 'exclusive', 'eksklusif'
]);

const BENEFIT_WORDS = new Set([
  'glowing', 'cerah', 'halus', 'ampuh', 'terbukti', 'rahasia', 'solusi', 'terbaik',
  'mulus', 'kinclong', 'ajaib', 'lembab', 'awet', 'tahan lama', 'premium', 'viral',
  'magic', 'flawless', 'upgrade', 'nyaman', 'estetik', 'cantik', 'bersih', 'kinclong'
]);

const PRICE_WORDS = new Set([
  'diskon', 'gratis', 'ongkir', 'hemat', 'promo', 'murah', 'potongan', 'cashback',
  'voucher', 'harga', 'rp', 'free', 'discount', 'save', 'off', 'bonus', 'beli 1 gratis 1'
]);

const SOCIAL_PROOF_WORDS = new Set([
  'viral', 'fyp', 'review', 'jujur', 'testimoni', 'artis', 'bpom', 'dokter', 'approved',
  'terlaris', 'no.1', 'ribuan', 'bintang 5', 'recommended', 'wajib punya', 'racun'
]);

const CTA_WORDS = new Set([
  'checkout', 'keranjang', 'kuning', 'klik', 'beli', 'pesan', 'order', 'bio', 'link',
  'bawah', 'tap', 'shop now', 'ambil', 'klaim'
]);

// Map keywords to animated emoji tags
const EMOJI_MAP: Record<string, string> = {
  urgency: '🔥',
  benefit: '✨',
  price: '💸',
  social_proof: '⭐',
  cta: '🛍️',
};

/**
 * Parses storyboard voiceover text and assigns synchronized timestamps per word
 */
export function parseStoryboardToKineticWords(
  scenes: StoryboardScene[],
  timingOffsetSec = 0
): { words: ParsedCaptionWord[]; sceneWordRanges: { sceneIndex: number; startIndex: number; endIndex: number }[] } {
  const allWords: ParsedCaptionWord[] = [];
  const sceneWordRanges: { sceneIndex: number; startIndex: number; endIndex: number }[] = [];

  let currentGlobalTime = 0;

  scenes.forEach((scene, sceneIndex) => {
    const rawText = scene.voiceoverText || scene.onScreenText || '';
    const rawWords = rawText.trim().split(/\s+/).filter(Boolean);
    const sceneDuration = scene.durationSeconds || 3;
    const startIndex = allWords.length;

    if (rawWords.length === 0) {
      currentGlobalTime += sceneDuration;
      sceneWordRanges.push({ sceneIndex, startIndex, endIndex: startIndex });
      return;
    }

    // Distribute time based on word length / character weight so longer words get more time
    const totalChars = rawWords.reduce((acc, w) => acc + Math.max(2, w.length), 0);
    let sceneRunningTime = 0;

    rawWords.forEach((word, wordIdx) => {
      const cleanWord = word.replace(/[^\w\d%]/gi, '').toLowerCase();
      const weight = Math.max(2, word.length) / totalChars;
      const wordDuration = Math.max(0.18, weight * sceneDuration);
      
      const wordStartTime = currentGlobalTime + sceneRunningTime + timingOffsetSec;
      const wordEndTime = wordStartTime + wordDuration;

      // Identify keyword categories
      let isKeyword = false;
      let keywordCategory: 'urgency' | 'benefit' | 'price' | 'social_proof' | 'cta' | undefined;
      let emojiTag: string | undefined;

      if (URGENCY_WORDS.has(cleanWord)) {
        isKeyword = true;
        keywordCategory = 'urgency';
        emojiTag = EMOJI_MAP.urgency;
      } else if (BENEFIT_WORDS.has(cleanWord)) {
        isKeyword = true;
        keywordCategory = 'benefit';
        emojiTag = EMOJI_MAP.benefit;
      } else if (PRICE_WORDS.has(cleanWord) || /^\d+%?$/.test(cleanWord) || cleanWord.includes('k')) {
        isKeyword = true;
        keywordCategory = 'price';
        emojiTag = EMOJI_MAP.price;
      } else if (SOCIAL_PROOF_WORDS.has(cleanWord)) {
        isKeyword = true;
        keywordCategory = 'social_proof';
        emojiTag = EMOJI_MAP.social_proof;
      } else if (CTA_WORDS.has(cleanWord)) {
        isKeyword = true;
        keywordCategory = 'cta';
        emojiTag = EMOJI_MAP.cta;
      }

      // Check if uppercase in original or ends with exclamation
      const hasExclamation = word.includes('!');
      if (hasExclamation && !isKeyword) {
        isKeyword = true;
        emojiTag = '⚡';
      }

      allWords.push({
        id: `word-${sceneIndex}-${wordIdx}-${cleanWord}`,
        word,
        cleanWord,
        startTime: Math.max(0, wordStartTime),
        endTime: wordEndTime,
        duration: wordDuration,
        isKeyword,
        keywordCategory,
        emojiTag,
        emphasisScale: isKeyword ? 1.25 : 1.0,
      });

      sceneRunningTime += wordDuration;
    });

    currentGlobalTime += sceneDuration;
    sceneWordRanges.push({ sceneIndex, startIndex, endIndex: allWords.length });
  });

  return { words: allWords, sceneWordRanges };
}

/**
 * Finds current active word index given current playback time
 */
export function getActiveWordIndexAtTime(
  words: ParsedCaptionWord[],
  currentTime: number
): number {
  if (words.length === 0) return -1;

  for (let i = 0; i < words.length; i++) {
    if (currentTime >= words[i].startTime && currentTime <= words[i].endTime) {
      return i;
    }
  }

  // If before first word
  if (currentTime < words[0].startTime) return 0;
  // If after last word
  return words.length - 1;
}

/**
 * Exports words to standardized SubRip (.srt) subtitle format
 */
export function generateSrtContent(words: ParsedCaptionWord[], wordsPerChunk = 4): string {
  if (words.length === 0) return '';

  let srt = '';
  let chunkIdx = 1;

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk);
    const startSec = chunk[0].startTime;
    const endSec = chunk[chunk.length - 1].endTime;
    const text = chunk.map((w) => w.word).join(' ');

    const formatTime = (sec: number) => {
      const h = Math.floor(sec / 3600).toString().padStart(2, '0');
      const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      const ms = Math.floor((sec % 1) * 1000).toString().padStart(3, '0');
      return `${h}:${m}:${s},${ms}`;
    };

    srt += `${chunkIdx}\n${formatTime(startSec)} --> ${formatTime(endSec)}\n${text}\n\n`;
    chunkIdx++;
  }

  return srt;
}
