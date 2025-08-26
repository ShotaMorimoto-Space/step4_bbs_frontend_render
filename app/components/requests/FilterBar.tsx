import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { RequestFilters, Club } from '../../../src/types/requests';

interface FilterBarProps {
  filters: RequestFilters;
  onFiltersChange: (filters: Partial<RequestFilters>) => void;
  onReset: () => void;
}

// === 選択肢 ===
const CLUBS: { value: Club | 'all'; label: string }[] = [
  { value: 'all', label: 'すべてのクラブ' },
  { value: 'driver', label: 'ドライバー' },
  { value: 'wood', label: 'ウッド' },
  { value: 'utility', label: 'ユーティリティ' },
  { value: 'iron', label: 'アイアン' },
  { value: 'wedge', label: 'ウェッジ' },
  { value: 'putter', label: 'パター' },
];

const TAGS = [
  'スライス', 'フック', 'トップ', 'ダフリ', '方向性', '弾道の高さ',
  'リズム', 'ミート率', '飛距離不足', 'スピン量',
];

const PERIODS = [
  { value: 'all', label: '全期間' },
  { value: '24h', label: '直近24時間' },
  { value: '3d', label: '直近3日' },
  { value: '7d', label: '直近7日' },
] as const;

// 開いているメニューを一元管理（同時オープンを防ぐ）
type OpenMenu = 'club' | 'tag' | 'history' | null;

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const toggle = (menu: OpenMenu) => {
    setOpenMenu(prev => (prev === menu ? null : menu));
  };

  const toggleTag = (tag: string) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ tags: next });
  };

  const hasActive =
    filters.club !== 'all' ||
    filters.tags.length > 0 ||
    filters.period !== 'all' ||
    filters.sort !== 'newest' ||
    filters.search !== '';

  return (
    // relative: ドロップダウンの基準。z-10 以上で下の動画より前面へ。
    <div className="relative z-20 bg-white/5 backdrop-blur-sm border-b border-white/10">
      {/* 上段：3等分グリッド（中央揃え・等間隔・折り返し禁止） */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => toggle('club')}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold
              whitespace-nowrap leading-none
              ${openMenu === 'club' || filters.club !== 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'}
            `}
          >
            <span>クラブタグ</span>
            <ChevronDown size={16} className={openMenu === 'club' ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>

          <button
            onClick={() => toggle('tag')}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold
              whitespace-nowrap leading-none
              ${openMenu === 'tag' || filters.tags.length > 0
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'}
            `}
          >
            <span>課題タグ</span>
            {filters.tags.length > 0 && (
              <span className="text-xs opacity-80">({filters.tags.length})</span>
            )}
            <ChevronDown size={16} className={openMenu === 'tag' ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>

          <button
            onClick={() => toggle('history')}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold
              whitespace-nowrap leading-none
              ${openMenu === 'history' || filters.period !== 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'}
            `}
          >
            <span>依頼履歴</span>
            <ChevronDown size={16} className={openMenu === 'history' ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>
        </div>

        {/* アクティブタグ表示（必要なら残す） */}
        {filters.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {filters.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:bg-white/20 rounded-full p-0.5"
                  aria-label={`${tag} を外す`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* リセット */}
        {hasActive && (
          <div className="mt-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-2 bg-red-500/20 text-red-200 rounded-lg text-xs font-medium hover:bg-red-500/30"
            >
              <X size={14} />
              フィルターをリセット
            </button>
          </div>
        )}
      </div>

      {/* ===== ドロップダウン（全幅） ===== */}
      {openMenu && (
        <>
          {/* 背景の半透明レイヤー（クリックで閉じる） */}
          <button
            onClick={() => setOpenMenu(null)}
            className="fixed inset-0 z-40 bg-black/40"
            aria-label="メニューを閉じる"
          />

          {/* メニュー本体（バー直下・全幅・前面表示） */}
          <div className="absolute left-0 right-0 top-full z-50 px-4 pb-3">
            <div className="mt-2 rounded-2xl border border-white/15 bg-[#261045]/90 backdrop-blur-xl shadow-2xl">
              {/* クラブタグ */}
              {openMenu === 'club' && (
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {CLUBS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => {
                          onFiltersChange({ club: c.value });
                          setOpenMenu(null);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-sm text-left
                          ${filters.club === c.value
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 課題タグ */}
              {openMenu === 'tag' && (
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {TAGS.map(tag => {
                      const active = filters.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`w-full rounded-lg px-3 py-2 text-sm text-left
                            ${active
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-right">
                    <button
                      onClick={() => setOpenMenu(null)}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/20"
                    >
                      閉じる
                    </button>
                  </div>
                </div>
              )}

              {/* 依頼履歴（期間） */}
              {openMenu === 'history' && (
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {PERIODS.map(p => (
                      <button
                        key={p.value}
                        onClick={() => {
                          onFiltersChange({ period: p.value });
                          setOpenMenu(null);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-sm text-left
                          ${filters.period === p.value
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterBar;