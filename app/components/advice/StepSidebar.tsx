import React from 'react';

export const SWING_STEPS = {
  address:      { key: 'address',      label: 'アドレス',          tips: ['スタンス幅', 'ボール位置', '前傾角・軸', 'グリップ圧'] },
  backswing:    { key: 'backswing',    label: 'バックスイング',    tips: ['ワンピース', 'フェース向き', '軌道の入り'] },
  top:          { key: 'top',          label: 'トップ',            tips: ['手首角', 'クラブシャフト角', '前傾維持'] },
  transition:   { key: 'transition',   label: '切り返し',          tips: ['下半身リード', 'タメ', '胸の向き'] },
  downswing:    { key: 'downswing',    label: 'ダウンスイング',    tips: ['シャローイング', '手元の高さ', '回転タイミング'] },
  impact:       { key: 'impact',       label: 'インパクト',        tips: ['ハンドファースト', '入射角', '体重配分'] },
  follow:       { key: 'follow',       label: 'フォロースルー',    tips: ['フィニッシュバランス', '軸の安定'] },
  finish:       { key: 'finish',       label: 'フィニッシュ',       tips: ['バランス', '体の向き', '視線'] }
} as const;

export type SwingStepKey = keyof typeof SWING_STEPS;

type Props = {
  active: SwingStepKey;
  onChange: (k: SwingStepKey) => void;
};

const StepSidebar: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-3">
      {/* 2列グリッドでボタン大きめに */}
      <div className="grid grid-cols-2 gap-3">
        {Object.values(SWING_STEPS).map((s, idx) => (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className={`w-full py-3 rounded-xl text-sm font-medium transition
              ${active === s.key ? 'bg-white text-purple-600' : 'text-white/90 hover:bg-white/20 border border-white/20'}`}
          >
            {/* ①〜⑧ 番号表示もつけて分かりやすく */}
            <span className="mr-1">{idx + 1}.</span>{s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepSidebar;
