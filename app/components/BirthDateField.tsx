import React from 'react';

interface BirthDateFieldProps {
  values: {
    year: string;
    month: string;
    day: string;
  };
  onChange: (field: 'year' | 'month' | 'day', value: string) => void;
  className?: string;
}

export const BirthDateField: React.FC<BirthDateFieldProps> = ({
  values,
  onChange,
  className = ""
}) => {
  const handleChange = (field: 'year' | 'month' | 'day', value: string) => {
    // 数値のみ許可
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // 各フィールドの最大桁数制限
    let maxLength = 4;
    if (field === 'month' || field === 'day') {
      maxLength = 2;
    }
    
    if (numericValue.length <= maxLength) {
      onChange(field, numericValue);
    }
  };

  return (
    <div className={className}>
      {/* ラベル行 */}
      <div className="grid grid-cols-[1fr,0.6fr,0.6fr] gap-8 mb-3">
        <label className="text-white text-base font-medium tracking-wide">
          年（西暦）
        </label>
        <label className="text-white text-base font-medium tracking-wide text-center">
          月
        </label>
        <label className="text-white text-base font-medium tracking-wide text-center">
          日
        </label>
      </div>
      
      {/* 入力行 */}
      <div className="grid grid-cols-[1fr,0.6fr,0.6fr] gap-8">
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={values.year}
          onChange={(e) => handleChange('year', e.target.value)}
          placeholder="YYYY"
          className="bg-transparent text-white placeholder-white/80 border-0 border-b border-white/90 focus:outline-none focus:border-white focus:border-b-2 py-2 text-center text-lg transition-colors"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={values.month}
          onChange={(e) => handleChange('month', e.target.value)}
          placeholder="MM"
          className="bg-transparent text-white placeholder-white/80 border-0 border-b border-white/90 focus:outline-none focus:border-white focus:border-b-2 py-2 text-center text-lg transition-colors"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={values.day}
          onChange={(e) => handleChange('day', e.target.value)}
          placeholder="DD"
          className="bg-transparent text-white placeholder-white/80 border-0 border-b border-white/90 focus:outline-none focus:border-white focus:border-b-2 py-2 text-center text-lg transition-colors"
        />
      </div>
    </div>
  );
};