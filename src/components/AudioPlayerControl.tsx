import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Volume2, Gauge } from 'lucide-react';
import { audioPlayer } from '../services/audioPlayer';

interface AudioPlayerControlProps {
  audioText?: string;
  audioUrl?: string;
  questionId: string;
  playLimit?: number; // e.g. 2 for CBT exam
  isPracticeMode?: boolean;
}

export const AudioPlayerControl: React.FC<AudioPlayerControlProps> = ({
  audioText,
  audioUrl,
  questionId,
  playLimit = 2,
  isPracticeMode = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState<number>(0);
  const [rate, setRate] = useState<number>(0.95);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Reset play count when question changes
  useEffect(() => {
    setPlayCount(0);
    setStatusMessage('');
    audioPlayer.stop();
    setIsPlaying(false);
  }, [questionId]);

  // Subscribe to audio state
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe(({ isPlaying: playing, error }) => {
      setIsPlaying(playing);
      if (error) {
        setStatusMessage(error);
      }
    });

    return () => {
      unsubscribe();
      audioPlayer.stop();
    };
  }, []);

  const effectiveLimit = isPracticeMode ? Infinity : playLimit;
  const canPlay = playCount < effectiveLimit;

  const handlePlayToggle = async () => {
    if (isPlaying) {
      audioPlayer.stop();
      return;
    }

    if (!canPlay) {
      setStatusMessage('সর্বোচ্চ প্লে সীমা শেষ হয়েছে (Play limit reached)');
      return;
    }

    setStatusMessage('');
    const target = audioUrl || audioText;
    if (!target) {
      setStatusMessage('কোনো অডিও বা স্ক্রিপ্ট পাওয়া যায়নি');
      return;
    }

    try {
      setPlayCount((prev) => prev + 1);
      await audioPlayer.play(target, {
        rate,
        isUrl: Boolean(audioUrl),
      });
    } catch (err: any) {
      console.error('Audio playback error:', err);
    }
  };

  const handleReplay = async () => {
    audioPlayer.stop();
    if (!canPlay) {
      setStatusMessage('প্লে সীমা শেষ হয়েছে (Play limit reached)');
      return;
    }
    handlePlayToggle();
  };

  const speeds = [
    { label: '0.8x (ধীর)', value: 0.8 },
    { label: '1.0x (স্বাভাবিক)', value: 0.95 },
    { label: '1.2x (দ্রুত)', value: 1.2 },
  ];

  return (
    <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 my-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Play / Stop Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlayToggle}
            disabled={!isPlaying && !canPlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : canPlay
                ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>থামান (Stop)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>শুনুন (Listen Audio)</span>
              </>
            )}
          </button>

          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            disabled={!canPlay || isPlaying}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-purple-700 bg-white hover:bg-purple-100/70 border border-purple-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="পুনরায় শুনুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>আবার চালান</span>
          </button>

          {/* Sound animation / indicator */}
          <div className="flex items-center gap-1.5 text-xs text-purple-900 bg-purple-100/60 px-3 py-1.5 rounded-full">
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-purple-600 animate-bounce' : 'text-gray-400'}`} />
            <span className="font-medium">
              {isPlaying ? 'অডিও চলছে...' : 'জাপানি অডিও'}
            </span>
          </div>
        </div>

        {/* Right side: Replay Counter & Speed */}
        <div className="flex items-center gap-3 text-xs">
          {/* Replay Counter */}
          <div className="bg-white border border-purple-200 px-3 py-1.5 rounded-lg text-gray-700 font-medium">
            {isPracticeMode ? (
              <span className="text-emerald-700 font-semibold">সীমাহীন প্লে (Practice)</span>
            ) : (
              <span>
                প্লে করা হয়েছে:{' '}
                <strong className={playCount >= playLimit ? 'text-rose-600' : 'text-purple-700'}>
                  {playCount} / {playLimit}
                </strong>{' '}
                বার
              </span>
            )}
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-white border border-purple-200 rounded-lg p-1">
            <Gauge className="w-3.5 h-3.5 text-gray-500 ml-1.5" />
            {speeds.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setRate(s.value)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  Math.abs(rate - s.value) < 0.05
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {s.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {statusMessage && (
        <p className="mt-2 text-xs text-rose-600 font-medium">{statusMessage}</p>
      )}

      {/* CBT Realism Hint */}
      {!isPracticeMode && (
        <p className="mt-2 text-[11px] text-gray-500">
          * CBT পরীক্ষার নিয়ম অনুযায়ী অডিও সর্বোচ্চ ২ বার বাজানো যাবে। মনোযোগ সহকারে শুনুন।
        </p>
      )}
    </div>
  );
};
