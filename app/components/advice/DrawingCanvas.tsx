'use client';
import React, { useEffect, useRef, useState } from 'react';

/** 動画上に簡単に線を描けるダミーのオーバーレイ。保存はしません */
const DrawingCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [ratio, setRatio] = useState(1);

  // コンテナのサイズに追従
  useEffect(() => {
    const cvs = ref.current!;
    const resize = () => {
      if (!cvs || !cvs.parentElement) return;
      const rect = cvs.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.floor(rect.width * dpr);
      cvs.height = Math.floor(rect.height * dpr);
      cvs.style.width = rect.width + 'px';
      cvs.style.height = rect.height + 'px';
      setRatio(dpr);
    };
    resize();
    const obs = new ResizeObserver(resize);
    if (cvs.parentElement) obs.observe(cvs.parentElement);
    return () => obs.disconnect();
  }, []);

  const handleDown = (e: React.MouseEvent) => {
    setDrawing(true);
    draw(e, true);
  };
  const handleMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    draw(e, false);
  };
  const handleUp = () => setDrawing(false);

  const draw = (e: React.MouseEvent, moveTo: boolean) => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const rect = cvs.getBoundingClientRect();
    const x = (e.clientX - rect.left) * ratio;
    const y = (e.clientY - rect.top) * ratio;

    ctx.lineWidth = 3 * ratio;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineCap = 'round';

    if (moveTo) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  return (
    <canvas
      ref={ref}
      className="w-full h-full"
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
    />
  );
};

export default DrawingCanvas;
