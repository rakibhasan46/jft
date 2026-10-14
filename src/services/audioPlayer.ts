/**
 * Audio service supporting Web Speech Synthesis for natural Japanese voice (ja-JP)
 * and optional external audio URL playback.
 */

type AudioCallback = (state: { isPlaying: boolean; error?: string }) => void;

class AudioPlayerService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private subscribers: Set<AudioCallback> = new Set();
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoice();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer natural Japanese voices
    const jaVoice =
      voices.find((v) => v.lang.startsWith('ja') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Kyoko'))) ||
      voices.find((v) => v.lang.startsWith('ja')) ||
      voices[0];
    this.voice = jaVoice || null;
  }

  public subscribe(cb: AudioCallback) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  private notify(isPlaying: boolean, error?: string) {
    this.isPlaying = isPlaying;
    this.subscribers.forEach((cb) => cb({ isPlaying, error }));
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    this.currentUtterance = null;
    this.notify(false);
  }

  public play(textOrUrl: string, options?: { rate?: number; isUrl?: boolean }): Promise<void> {
    this.stop();

    const rate = options?.rate ?? 0.95; // Slightly clear and natural pacing for learners

    if (options?.isUrl || textOrUrl.startsWith('http://') || textOrUrl.startsWith('https://')) {
      return new Promise((resolve, reject) => {
        try {
          const audio = new Audio(textOrUrl);
          this.currentAudioElement = audio;
          audio.playbackRate = rate;

          audio.onplay = () => this.notify(true);
          audio.onended = () => {
            this.notify(false);
            this.currentAudioElement = null;
            resolve();
          };
          audio.onerror = (e) => {
            this.notify(false, 'Audio file failed to load');
            reject(e);
          };

          audio.play().catch((err) => {
            this.notify(false, err.message);
            reject(err);
          });
        } catch (err: any) {
          this.notify(false, err.message);
          reject(err);
        }
      });
    }

    // Web Speech synthesis for Japanese text
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        const error = 'Speech synthesis is not supported on this browser';
        this.notify(false, error);
        return reject(new Error(error));
      }

      // Re-check voices
      if (!this.voice) {
        this.initVoice();
      }

      // Clean ruby markup or extra brackets if passed in
      const cleanText = textOrUrl
        .replace(/<rt>.*?<\/rt>/g, '')
        .replace(/<.*?>/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.rate = rate;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onend = () => {
        this.notify(false);
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        // 'interrupted' or 'canceled' are not real errors
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          this.notify(false, `Speech error: ${event.error}`);
        } else {
          this.notify(false);
        }
        resolve();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioPlayer = new AudioPlayerService();
