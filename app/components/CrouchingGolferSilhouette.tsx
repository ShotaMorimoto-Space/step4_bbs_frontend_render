import React from 'react';

interface CrouchingGolferSilhouetteProps {
  className?: string;
}

export const CrouchingGolferSilhouette: React.FC<CrouchingGolferSilhouetteProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crouching golfer silhouette */}
      <g fill="white">
        {/* Head */}
        <circle cx="140" cy="60" r="18" />
        
        {/* Cap */}
        <path d="M122 50 C122 45, 127 40, 140 40 C153 40, 158 45, 158 50 L165 47 C165 45, 163 43, 160 43 L120 43 C117 43, 115 45, 115 47 Z" />
        
        {/* Body - crouching position */}
        <path d="M140 78 C155 78, 165 88, 165 105 L165 140 C165 155, 155 165, 140 165 C125 165, 115 155, 115 140 L115 105 C115 88, 125 78, 140 78 Z" />
        
        {/* Left arm - holding club */}
        <path d="M115 95 C105 90, 95 95, 90 105 C85 115, 90 125, 100 130 L110 125 C115 120, 120 110, 115 95 Z" />
        
        {/* Right arm - extended */}
        <path d="M165 100 C175 95, 185 100, 190 110 C195 120, 190 130, 180 135 L170 130 C165 125, 160 115, 165 100 Z" />
        
        {/* Left leg - crouched */}
        <path d="M125 165 C120 165, 115 170, 115 175 L115 220 C115 235, 125 245, 135 245 C145 245, 155 235, 155 220 L155 200 C155 185, 145 175, 135 175 C130 175, 125 170, 125 165 Z" />
        
        {/* Right leg - crouched */}
        <path d="M155 165 C160 165, 165 170, 165 175 L165 210 C165 225, 155 235, 145 235 C135 235, 125 225, 125 210 L125 190 C125 175, 135 165, 145 165 C150 165, 155 170, 155 165 Z" />
        
        {/* Left foot */}
        <ellipse cx="130" cy="250" rx="18" ry="10" />
        
        {/* Right foot */}
        <ellipse cx="150" cy="240" rx="18" ry="10" />
      </g>
      
      {/* Golf club - long diagonal line */}
      <g stroke="white" strokeWidth="3" fill="none">
        <line x1="95" y1="110" x2="30" y2="40" />
        {/* Club head */}
        <path d="M25 35 L35 35 L37 45 L23 45 Z" fill="white" />
      </g>
      
      {/* Purple accent details */}
      <g fill="#6D5BFF">
        {/* Shirt details */}
        <rect x="125" y="90" width="30" height="3" rx="1" />
        <rect x="125" y="110" width="30" height="3" rx="1" />
        
        {/* Cap visor */}
        <path d="M115 47 C115 45, 117 43, 120 43 L160 43 C163 43, 165 45, 165 47 L165 50 C165 52, 163 54, 160 54 L120 54 C117 54, 115 52, 115 50 Z" />
        
        {/* Shoe details */}
        <ellipse cx="130" cy="250" rx="12" ry="6" />
        <ellipse cx="150" cy="240" rx="12" ry="6" />
      </g>
    </svg>
  );
};