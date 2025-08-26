'use client';
import React, { useState } from 'react';
import { PLACEHOLDER } from '../src/config/media';

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  draggable?: boolean;
  onClick?: () => void;
};

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackSrc = PLACEHOLDER,
  draggable = false,
  onClick,
}: Props) {
  const [cur, setCur] = useState(src);
  return (
    <img
      src={cur}
      alt={alt}
      className={className}
      draggable={draggable}
      onClick={onClick}
      onError={() => {
        if (cur !== fallbackSrc) setCur(fallbackSrc);
      }}
    />
  );
}
