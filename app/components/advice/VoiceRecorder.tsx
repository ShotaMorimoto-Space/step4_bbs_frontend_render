'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Mic, StopCircle, Trash2, Play, Pause } from 'lucide-react';

type Props = {
  value: string | null;               // 既存の音声（URL）
  onChange: (url: string | null) => void;
  label?: string;
};

const VoiceRecorder: React.FC<Props> = ({ value, onChange, label }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(value ?? null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    setAudioUrl(value ?? null);
  }, [value]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onChange(url);
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
    } catch (e) {
      alert('マイクが使用できませんでした。ブラウザ権限を確認してください。');
      console.error(e);
    }
  };

  const stop = () => {
    mediaRecorder?.stop();
    mediaRecorder?.stream.getTracks().forEach(t => t.stop());
    setMediaRecorder(null);
    setRecording(false);
  };

  const remove = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    onChange(null);
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/20 p-3 bg-black/20 text-white">
      {label && <div className="text-sm mb-2 text-white/80">{label}</div>}

      {!audioUrl ? (
        <div className="flex items-center gap-3">
          {!recording ? (
            <button onClick={start} className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 flex items-center gap-2 text-xs">
              <Mic size={20} />
              録音開始
            </button>
          ) : (
            <button onClick={stop} className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2">
              <StopCircle size={20} />
              停止
            </button>
          )}
          <span className="text-sm text-white/70">{recording ? '録音中…' : '音声でコメントを残せます（任意）'}</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} />
          <button onClick={togglePlay} className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 flex items-center gap-2">
            {playing ? <Pause size={18} /> : <Play size={18} />}
            {playing ? '一時停止' : '再生'}
          </button>
          <button onClick={remove} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-2">
            <Trash2 size={18} />
            削除
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
