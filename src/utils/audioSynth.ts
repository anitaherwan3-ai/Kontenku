// Web Audio API Synthesizer for Interactive Commerce Sound Effects
// Works without any external MP3/audio files, ultra-low latency & 100% reliable across browsers.

class SoundSynthEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Cash Register Cha-Ching / Coins
  playChaChing() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Bell chime 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(1900, now + 0.1);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Bell chime 2 (higher harmonic)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(2600, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(3200, now + 0.35);
      gain2.gain.setValueAtTime(0.35, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  // 2. Whoosh / Swipe Transition
  playWhoosh() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  // 3. Keyboard Thock / ASMR Click
  playThock() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.07);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  // 4. Sparkle Bell / Notification Ding
  playBellDing() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7 arpeggio
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, noteStart);

        gain.gain.setValueAtTime(0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.45);
      });
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  // 5. Record Scratch / Dramatic Stop
  playRecordScratch() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  // 6. Pop Bubble / UI Click
  playPop() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  // 7. Airhorn / Hype Horn
  playAirHorn() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const pitches = [466.16, 466.16, 622.25]; // Bb4, Bb4, Eb5
      pitches.forEach((p, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(p, start);

        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.17);
      });
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  playSound(synthType: string) {
    switch (synthType) {
      case 'chaching':
        this.playChaChing();
        break;
      case 'whoosh':
        this.playWhoosh();
        break;
      case 'thock':
        this.playThock();
        break;
      case 'bell':
        this.playBellDing();
        break;
      case 'scratch':
        this.playRecordScratch();
        break;
      case 'pop':
        this.playPop();
        break;
      case 'airhorn':
        this.playAirHorn();
        break;
      default:
        this.playPop();
    }
  }
}

export const soundSynth = new SoundSynthEngine();
