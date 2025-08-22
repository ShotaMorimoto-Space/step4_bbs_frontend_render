'use client';
import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, Save, Send, Mic, Play, Pause, Loader2, Camera
} from 'lucide-react';
import StepSidebar, { SWING_STEPS, SwingStepKey } from 'src/components/advice/StepSidebar';
import VoiceRecorder from 'src/components/advice/VoiceRecorder';
import SnapshotAnnotator from 'src/components/advice/SnapshotAnnotator';

type Props = {
  videoId?: string;
  onNavigate: (screen: string, params?: any) => void;
};

const DUMMY_VIDEO = '/videos/dummy.mp4';
const DUMMY_THUMB = '/images/dummy.jpg';

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const AdviceNew: React.FC<Props> = ({ videoId, onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const [activeStep, setActiveStep] = useState<SwingStepKey>('address');
  const [notes, setNotes] = useState<Record<SwingStepKey, string>>({
    address:'', backswing:'', top:'', transition:'', downswing:'', impact:'', follow:'', finish:''
  });
  const [voiceNotes, setVoiceNotes] = useState<Record<SwingStepKey, string | null>>({
    address:null, backswing:null, top:null, transition:null, downswing:null, impact:null, follow:null, finish:null
  });

  type Shot = { id:string; url:string; time:number; step:SwingStepKey };
  const [shots, setShots] = useState<Shot[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const stepMeta = useMemo(() => SWING_STEPS[activeStep], [activeStep]);
  const stepOrder = Object.keys(SWING_STEPS) as SwingStepKey[];

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const captureFrame = async () => {
    const v = videoRef.current;
    if (!v) return;
    const w = v.videoWidth, h = v.videoHeight;
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr); ctx.drawImage(v, 0, 0, w, h);
    const url = canvas.toDataURL('image/jpeg', 0.95);

    setShots(prev => [
      { id: String(Date.now()), url, time: v.currentTime, step: activeStep }, ...prev
    ]);
  };

  const previewItems = stepOrder.map((k) => ({
    key: k,
    label: SWING_STEPS[k].label,
    note: notes[k],
    stepShots: shots.filter(s => s.step === k)
  }));

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* 背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${DUMMY_THUMB})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90" />
      </div>

      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3">
          <button onClick={() => onNavigate('coach-home')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-white font-medium">添削（{stepMeta.label}）</h1>
          <div className="w-10" />
        </div>

        {/* ステップタブ */}
        <div className="px-4">
          <StepSidebar active={activeStep} onChange={setActiveStep} />
        </div>

        {/* 本文 */}
        <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-4">
          {/* 動画 + スライダー */}
          <div className="rounded-2xl overflow-hidden border border-white/30">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              poster={DUMMY_THUMB}
              src={DUMMY_VIDEO}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
              onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime || 0)}
              controls={false}
            />

            <div className="flex justify-around items-center bg-black/70 text-white text-sm py-2">
              <button onClick={togglePlay} className="flex items-center gap-1">
                {playing ? <Pause size={18}/> : <Play size={18}/>}
                {playing ? '一時停止' : '再生'}
              </button>
              <button onClick={captureFrame} className="flex items-center gap-1">
                <Camera size={18}/> フレーム保存
              </button>
              <div>{formatTime(current)} / {formatTime(duration)}</div>
            </div>
            {/* seekバー */}
            <div className="px-4 py-2 bg-black/70">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.05}
                value={current}
                onChange={(e)=>{
                  const t=parseFloat(e.target.value);
                  setCurrent(t);
                  if(videoRef.current){ videoRef.current.currentTime=t;}
                }}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          {/* チェックポイント */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <div className="mb-2 text-white/90 font-medium">{stepMeta.label} のチェックポイント</div>
            <ul className="list-disc ml-5 space-y-1 text-white/80 text-sm">
              {stepMeta.tips.map((t,i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          {/* コメント ＋録音ボタン */}
          <div className="space-y-2">
            <textarea
              value={notes[activeStep]}
              onChange={(e) => setNotes(prev => ({ ...prev, [activeStep]: e.target.value }))}
              placeholder="気づきやアドバイスを記入してください"
              className="w-full min-h-[120px] rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-white p-4"
            />
            <div className="flex justify-end">
              <VoiceRecorder
                value={voiceNotes[activeStep]}
                onChange={(url) => setVoiceNotes(prev => ({ ...prev, [activeStep]: url }))}
                label=""
              />
            </div>
          </div>

          {/* キャプチャ一覧 */}
          {shots.length > 0 && (
            <div className="space-y-3">
              <div className="text-white/90 text-sm">保存したフレーム（タップで編集）</div>
              <div className="space-y-3">
                {shots.map((s) => (
                  <SnapshotAnnotator
                    key={s.id}
                    src={s.url}
                    time={s.time}
                    onChange={(exportedUrl) => {
                      setShots(prev => prev.map(p => p.id === s.id ? { ...p, url: exportedUrl ?? p.url } : p));
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="sticky bottom-0 bg-black/70 backdrop-blur-sm border-t border-white/10 p-4 pb-safe">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={()=>{
                localStorage.setItem(`advice-draft-${videoId ?? 'dummy'}`, JSON.stringify({ videoId, notes, voiceNotes, shots }));
                alert('下書きを保存しました');
              }}
              className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/20 text-white hover:bg-white/30"
            >
              <Save size={20} /> 下書き保存
            </button>
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-600 text-white hover:bg-green-700"
            >
              <Send size={20} /> プレビュー
            </button>
          </div>
        </div>
      </div>

      {/* プレビュー */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPreviewOpen(false)} />
          <div className="absolute inset-x-4 bottom-4 top-14 bg-white/95 rounded-2xl shadow-2xl overflow-hidden max-w-[640px] mx-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-medium text-slate-700 flex items-center gap-2"><Send size={18}/>送信前の最終確認</span>
              <button onClick={() => setPreviewOpen(false)} className="p-2 rounded hover:bg-slate-100">✕</button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-104px)] space-y-3">
              {previewItems.map((item) => (
                <div key={item.key} className="border rounded-xl p-3">
                  <div className="font-medium mb-2">{item.label}</div>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap mb-2">
                    {item.note || '（コメントなし）'}
                  </div>
                  {item.stepShots?.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {item.stepShots.map((s) => (
                        <div key={s.id} className="relative">
                          <img
                            src={s.url}
                            className="w-full max-h-[160px] object-contain rounded border bg-black"
                          />
                          <div className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1 rounded">
                            {formatTime(s.time)}
                          </div>
                        </div>
                      ))}
                    </div>
                ) : (
                  <div className="text-xs text-slate-500">（キャプチャ無し）</div>
                )}
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex gap-2 justify-end bg-white">
              <button className="px-4 py-2 rounded-lg border hover:bg-slate-50" onClick={() => setPreviewOpen(false)}>編集に戻る</button>
              <button
                onClick={async () => { setSubmitting(true); await new Promise(r=>setTimeout(r,1000)); alert('送信しました！'); setSubmitting(false); setPreviewOpen(false); onNavigate('coach-home'); }}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>}
                送信する
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdviceNew;
