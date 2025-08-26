import React from 'react';

interface LogoBlockProps {
  line1?: string;
  line2?: string;
  line3?: string;
  className?: string;
}

export const LogoBlock: React.FC<LogoBlockProps> = ({ 
  line1 = "Nice Shot",
  line2 = "with your", 
  line3 = "BUDDY",
  className = ""
}) => {
  return (
    <div className={`text-center text-white ${className}`}>
      <h1 className="text-5xl font-light mb-1" style={{ fontFamily: 'cursive' }}>
        {line1}
      </h1>
      <p className="text-xl mb-2 opacity-90">
        {line2}
      </p>
      <h2 className="text-6xl font-bold tracking-wider" style={{ fontFamily: 'monospace', letterSpacing: '0.2em' }}>
        {line3}
      </h2>
    </div>
  );
};