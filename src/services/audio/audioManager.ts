type SfxKind =
  | "ui_select"
  | "ui_confirm"
  | "move"
  | "attack"
  | "hit"
  | "ability_heal"
  | "ability_hack"
  | "ability_heavy"
  | "ability_shield"
  | "victory"
  | "defeat"
  | "destroy";

const STORAGE_KEY = "overclock.audio.v1";

interface AudioSettings {
  masterVolume: number;
  muted: boolean;
  sfxEnabled: boolean;
  musicEnabled: boolean;
}

const DEFAULTS: AudioSettings = {
  masterVolume: 0.7,
  muted: false,
  sfxEnabled: true,
  musicEnabled: true,
};

/**
 * Audio Manager — Web Audio synthesizer (no asset pipeline required).
 * Menu music = soft drone; SFX = short tones. Safe no-op if AudioContext blocked.
 */
class AudioManagerImpl {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings = { ...DEFAULTS };
  private musicNodes: { osc: OscillatorNode; gain: GainNode } | null = null;

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AudioSettings>;
      this.settings = { ...DEFAULTS, ...parsed };
    } catch {
      /* ignore */
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      /* ignore */
    }
  }

  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  setMasterVolume(volume: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume));
    this.save();
    if (this.musicNodes) {
      this.musicNodes.gain.gain.value =
        this.settings.masterVolume * 0.04 * (this.settings.musicEnabled ? 1 : 0);
    }
  }

  setMuted(muted: boolean): void {
    this.settings.muted = muted;
    this.save();
    this.syncMusicGain();
  }

  setSfxEnabled(enabled: boolean): void {
    this.settings.sfxEnabled = enabled;
    this.save();
  }

  setMusicEnabled(enabled: boolean): void {
    this.settings.musicEnabled = enabled;
    this.save();
    if (enabled) {
      void this.startMenuMusic();
    } else {
      this.stopMenuMusic();
    }
  }

  private async ensureCtx(): Promise<AudioContext | null> {
    if (typeof window === "undefined") {
      return null;
    }
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) {
        return null;
      }
      this.ctx = new Ctx();
    }
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  private syncMusicGain(): void {
    if (!this.musicNodes) return;
    const on =
      this.settings.musicEnabled && !this.settings.muted;
    this.musicNodes.gain.gain.value = on
      ? this.settings.masterVolume * 0.04
      : 0;
  }

  async startMenuMusic(): Promise<void> {
    if (!this.settings.musicEnabled || this.settings.muted) {
      return;
    }
    const ctx = await this.ensureCtx();
    if (!ctx || this.musicNodes) {
      return;
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 55;
    gain.gain.value = this.settings.masterVolume * 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    this.musicNodes = { osc, gain };
  }

  stopMenuMusic(): void {
    if (!this.musicNodes) return;
    try {
      this.musicNodes.osc.stop();
    } catch {
      /* ignore */
    }
    this.musicNodes = null;
  }

  play(kind: SfxKind): void {
    if (this.settings.muted || !this.settings.sfxEnabled) {
      return;
    }
    void this.playTone(kind);
  }

  private async playTone(kind: SfxKind): Promise<void> {
    const ctx = await this.ensureCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const vol = this.settings.masterVolume;

    const beep = (
      freq: number,
      duration: number,
      type: OscillatorType = "square",
      peak = 0.12,
    ) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak * vol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    };

    switch (kind) {
      case "ui_select":
        beep(660, 0.06, "triangle", 0.08);
        break;
      case "ui_confirm":
        beep(520, 0.05, "square", 0.1);
        beep(780, 0.08, "square", 0.08);
        break;
      case "move":
        beep(240, 0.07, "triangle", 0.07);
        break;
      case "attack":
        beep(140, 0.09, "sawtooth", 0.14);
        break;
      case "hit":
        beep(90, 0.12, "square", 0.16);
        break;
      case "destroy":
        beep(60, 0.22, "sawtooth", 0.18);
        break;
      case "ability_heal":
        beep(520, 0.1, "sine", 0.1);
        beep(780, 0.14, "sine", 0.08);
        break;
      case "ability_hack":
        beep(880, 0.05, "square", 0.1);
        beep(440, 0.1, "square", 0.08);
        break;
      case "ability_heavy":
        beep(70, 0.18, "sawtooth", 0.2);
        break;
      case "ability_shield":
        beep(330, 0.12, "triangle", 0.1);
        break;
      case "victory":
        beep(523, 0.12, "triangle", 0.12);
        beep(659, 0.14, "triangle", 0.1);
        beep(784, 0.2, "triangle", 0.1);
        break;
      case "defeat":
        beep(200, 0.2, "sawtooth", 0.12);
        beep(120, 0.28, "sawtooth", 0.1);
        break;
      default:
        beep(440, 0.06, "triangle", 0.08);
    }
  }
}

export const AudioManager = new AudioManagerImpl();
export type { SfxKind, AudioSettings };
