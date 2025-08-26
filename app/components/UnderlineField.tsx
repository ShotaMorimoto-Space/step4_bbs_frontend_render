import React from 'react';

interface UnderlineFieldProps {
  label: string;
  split?: boolean;
  placeholders?: [string, string];
  values?: [string, string];
  onChange?: (values: [string, string]) => void;
  className?: string;
}

export const UnderlineField: React.FC<UnderlineFieldProps> = ({
  label,
  split = false,
  placeholders = ['', ''],
  values = ['', ''],
  onChange,
  className = ""
}) => {
  const handleChange = (index: 0 | 1, value: string) => {
    if (onChange) {
      const newValues: [string, string] = [...values];
      newValues[index] = value;
      onChange(newValues);
    }
  };

  return (
    <div className={className}>
      <label className="block text-white text-base font-medium mb-3">
        {label}
      </label>
      {split ? (
        <div className="grid grid-cols-2 gap-5">
          <input
            type="text"
            value={values[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            placeholder={placeholders[0]}
            className="bg-transparent text-white placeholder-white/80 border-0 border-b border-white/90 focus:outline-none focus:border-white focus:border-b-2 py-2 transition-colors"
          />
          <input
            type="text"
            value={values[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            placeholder={placeholders[1]}
            className="bg-transparent text-white placeholder-white/80 border-0 border-b border-white/90 focus:outline-none focus:border-white focus:border-b-2 py-2 transition-colors"
          />
        </div>
      ) : (
        <input
          type="text"
          value={values[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          placeholder={placeholders[0]}
          className="w-full bg-transparent text-white placeholder-white/80 border-0 border-b border-white/90 focus:outline-none focus:border-white focus:border-b-2 py-2 transition-colors"
        />
      )}
    </div>
  );
};