import React from 'react';

interface GolferSilhouetteProps {
  className?: string;
}

export const GolferSilhouette: React.FC<GolferSilhouetteProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Golfer silhouette */}
      <g fill="white">
        {/* Head */}
        <circle cx="120" cy="40" r="15" />
        {/* Cap */}
        <path d="M105 35 C105 30, 110 25, 120 25 C130 25, 135 30, 135 35 L140 32 C140 30, 138 28, 135 28 L105 28 C102 28, 100 30, 100 32 Z" />
        
        {/* Body */}
        <ellipse cx="120" cy="80" rx="25" ry="35" />
        
        {/* Arms - golf swing position */}
        <path d="M95 65 C85 60, 75 65, 70 75 C65 85, 70 95, 80 100 L90 95 C95 90, 100 80, 95 65 Z" />
        <path d="M145 65 C155 60, 165 65, 170 75 C175 85, 170 95, 160 100 L150 95 C145 90, 140 80, 145 65 Z" />
        
        {/* Golf club */}
        <rect x="68" y="70" width="3" height="60" rx="1" transform="rotate(-15 70 100)" />
        <ellipse cx="65" cy="125" rx="8" ry="4" transform="rotate(-15 65 125)" />
        
        {/* Legs */}
        <ellipse cx="110" cy="140" rx="12" ry="30" />
        <ellipse cx="130" cy="140" rx="12" ry="30" />
        
        {/* Feet */}
        <ellipse cx="105" cy="170" rx="15" ry="8" />
        <ellipse cx="135" cy="170" rx="15" ry="8" />
      </g>
      
      {/* Golf ball trajectory */}
      <g fill="white" opacity="0.8">
        <circle cx="50" cy="120" r="2" />
        <circle cx="40" cy="110" r="1.5" />
        <circle cx="30" cy="100" r="1" />
      </g>
    </svg>
  );
};