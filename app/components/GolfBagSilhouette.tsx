import React from 'react';

interface GolfBagSilhouetteProps {
  className?: string;
}

export const GolfBagSilhouette: React.FC<GolfBagSilhouetteProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Golf bag silhouette */}
      <g fill="white">
        {/* Main bag body */}
        <path d="M60 80 C60 75, 65 70, 70 70 L130 70 C135 70, 140 75, 140 80 L140 250 C140 260, 130 270, 120 270 L80 270 C70 270, 60 260, 60 250 Z" />
        
        {/* Bag top opening */}
        <ellipse cx="100" cy="75" rx="35" ry="8" fill="white" />
        <ellipse cx="100" cy="70" rx="35" ry="6" fill="#6D5BFF" />
        
        {/* Side pocket */}
        <path d="M45 120 C40 120, 35 125, 35 130 L35 180 C35 185, 40 190, 45 190 L60 190 L60 120 Z" fill="white" />
        
        {/* Bag strap */}
        <path d="M140 100 C150 100, 155 105, 155 110 L155 200 C155 205, 150 210, 140 210" 
              stroke="white" strokeWidth="4" fill="none" />
        
        {/* Golf clubs sticking out */}
        <g stroke="white" strokeWidth="3" fill="none">
          {/* Driver */}
          <line x1="85" y1="70" x2="75" y2="20" />
          <ellipse cx="75" cy="18" rx="8" ry="4" fill="white" />
          
          {/* Iron */}
          <line x1="95" y1="70" x2="90" y2="25" />
          <rect x="87" y="22" width="6" height="6" fill="white" />
          
          {/* Putter */}
          <line x1="105" y1="70" x2="105" y2="30" />
          <rect x="102" y="27" width="6" height="6" fill="white" />
          
          {/* Wedge */}
          <line x1="115" y1="70" x2="120" y2="22" />
          <path d="M117 19 L123 19 L125 25 L115 25 Z" fill="white" />
        </g>
        
        {/* Bag details */}
        <rect x="70" y="120" width="60" height="4" rx="2" fill="#6D5BFF" />
        <rect x="70" y="140" width="60" height="4" rx="2" fill="#6D5BFF" />
        <rect x="70" y="160" width="60" height="4" rx="2" fill="#6D5BFF" />
        
        {/* Zipper */}
        <path d="M80 100 L120 100" stroke="#6D5BFF" strokeWidth="2" />
        <circle cx="85" cy="100" r="3" fill="#6D5BFF" />
        
        {/* Brand logo area */}
        <rect x="80" y="180" width="40" height="20" rx="4" fill="#6D5BFF" opacity="0.8" />
      </g>
    </svg>
  );
};