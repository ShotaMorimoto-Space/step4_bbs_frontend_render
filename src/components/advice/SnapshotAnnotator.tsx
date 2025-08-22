'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Eraser, Pencil, Minus, MoveRight, Square, Circle,
  RotateCcw, RotateCw, Download,
} from 'lucide-react';

type Tool = 'pen' | 'line' | 'arrow' | 'rect' | 'circle' | 'erase';
type DrawCmd =
  | { t: 'pen' | 'erase'; color: string; width: number; points: Array<[number, number]> }
  | { t: 'line' | 'arrow' | 'rect' | 'circle'; color: string; width: number; from: [number, number]; to: [number, number] };

type Props = { src: string; time?: number; onChange?: (exportedUrl: string) => void; };

const SnapshotAnnotator: React.FC<Props> = ({ src, time, onChange }) => {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const tmpRef  = useRef<HTMLCanvasElement>(null);

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const dprRef = useRef<number>(1);

  const [cssW, setCssW] = useState(0);
  const [cssH, setCssH] = useState(0);

  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#ffffff');
  const [width, setWidth] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const startPos = useRef<[number, number] | null>(null);
  const penPts = useRef<Array<[number, number]>>([]);

  const [stack, setStack] = useState<DrawCmd[]>([]);
  const [redoStack, setRedoStack] = useState<DrawCmd[]>([]);

  // 画像読み込み
  useEffect(() => {
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);

  // リサイズ & 初期描画設定
  useEffect(() => {
    if (!img) return;
    dprRef.current = window.devicePixelRatio || 1;

    const resizeAndRedraw = () => {
      const outer = baseRef.current?.parentElement?.parentElement as HTMLElement | null;
      const container = outer ?? baseRef.current?.parentElement ?? document.body;
      const containerWidth = container ? container.clientWidth : 360;
      const aspect = img.height / img.width;
      const targetCssW = Math.min(containerWidth, 1000);
      const targetCssH = Math.min(Math.floor(targetCssW * aspect), Math.floor(window.innerHeight * 0.6));

      setCssW(targetCssW);
      setCssH(targetCssH);

      // canvasへ反映
      [baseRef.current, tmpRef.current].forEach((cvs) => {
        if (!cvs) return;
        cvs.width  = Math.floor(targetCssW * dprRef.current);
        cvs.height = Math.floor(targetCssH * dprRef.current);
        cvs.style.width  = `${targetCssW}px`;
        cvs.style.height = `${targetCssH}px`;
      });

      redrawAll(targetCssW, targetCssH);
    };

    resizeAndRedraw();
    const ro = new ResizeObserver(resizeAndRedraw);
    const observeTarget = baseRef.current?.parentElement?.parentElement ?? baseRef.current?.parentElement ?? undefined;
    if (observeTarget) ro.observe(observeTarget);
    window.addEventListener('resize', resizeAndRedraw);
    return () => { ro.disconnect(); window.removeEventListener('resize', resizeAndRedraw); };
  }, [img]);

  useEffect(() => {
    if (cssW && cssH) redrawAll(cssW, cssH);
  }, [stack]);

  const redrawAll = (w: number, h: number) => {
    if (!img || !baseRef.current) return;
    const b = baseRef.current;
    const ctx = b.getContext('2d')!;
    const dpr = dprRef.current;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, b.width, b.height);
    ctx.scale(dpr, dpr);
    ctx.drawImage(img, 0, 0, w, h);

    for (const cmd of stack) drawCmd(ctx, cmd);
    if (tmpRef.current) {
      const t = tmpRef.current.getContext('2d')!;
      tmpRef.current.width = tmpRef.current.width;
      t.scale(dpr, dpr);
    }
  };

  const drawCmd = (ctx: CanvasRenderingContext2D, cmd: DrawCmd) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = cmd.width;
    ctx.strokeStyle = cmd.t === 'erase' ? 'rgba(0,0,0,1)' : cmd.color;
    ctx.globalCompositeOperation = cmd.t === 'erase' ? 'destination-out' : 'source-over';

    const line = (a: [number, number], b: [number, number]) => {
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    };

    switch (cmd.t) {
      case 'pen':
      case 'erase':
        for (let i = 1; i < cmd.points.length; i++) line(cmd.points[i-1], cmd.points[i]);
        break;
      case 'line':
        line(cmd.from, cmd.to); break;
      case 'arrow': {
        line(cmd.from, cmd.to);
        const head = 10; const ang = Math.atan2(cmd.to[1]-cmd.from[1], cmd.to[0]-cmd.from[0]);
        line(cmd.to, [cmd.to[0]-head*Math.cos(ang-Math.PI/6), cmd.to[1]-head*Math.sin(ang-Math.PI/6)]);
        line(cmd.to, [cmd.to[0]-head*Math.cos(ang+Math.PI/6), cmd.to[1]-head*Math.sin(ang+Math.PI/6)]);
        break;
      }
      case 'rect':
        ctx.strokeRect(Math.min(cmd.from[0], cmd.to[0]), Math.min(cmd.from[1], cmd.to[1]),
                       Math.abs(cmd.to[0]-cmd.from[0]), Math.abs(cmd.to[1]-cmd.from[1]));
        break;
      case 'circle': {
        const cx=(cmd.from[0]+cmd.to[0])/2, cy=(cmd.from[1]+cmd.to[1])/2;
        const rx=Math.abs(cmd.to[0]-cmd.from[0])/2, ry=Math.abs(cmd.to[1]-cmd.from[1])/2;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); ctx.stroke(); break;
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const ev2pt = (e: React.MouseEvent): [number, number] => {
    const rect = baseRef.current!.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const onDown = (e: React.MouseEvent) => {
    setDrawing(true);
    const p = ev2pt(e);
    startPos.current = p;
    penPts.current = [p];

    const t = tmpRef.current!.getContext('2d')!;
    tmpRef.current!.width = tmpRef.current!.width;
    t.scale(dprRef.current, dprRef.current);
    drawPreview(t, p, p);
  };
  const onMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    const p = ev2pt(e);
    const t = tmpRef.current!.getContext('2d')!;
    tmpRef.current!.width = tmpRef.current!.width;
    t.scale(dprRef.current, dprRef.current);
    drawPreview(t, startPos.current!, p);
    if (tool === 'pen' || tool === 'erase') {
      penPts.current.push(p);
      const ctx = baseRef.current!.getContext('2d')!;
      drawCmd(ctx, { t: tool, color, width, points: [penPts.current.at(-2)!, p] });
    }
  };
  const onUp = (e: React.MouseEvent) => {
    if (!drawing) return;
    setDrawing(false);
    const p = ev2pt(e);
    const cmd: DrawCmd =
      (tool === 'pen' || tool === 'erase')
        ? { t: tool, color, width, points: penPts.current }
        : { t: tool, color, width, from: startPos.current!, to: p };
    setStack((s) => [...s, cmd]); setRedoStack([]);
    if (tmpRef.current) tmpRef.current.width = tmpRef.current.width;
  };

  const drawPreview = (ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number]) => {
    const cmd: DrawCmd = (tool === 'pen' || tool === 'erase')
      ? { t: tool, color, width, points: [from, to] }
      : { t: tool, color, width, from, to };
    drawCmd(ctx, cmd);
  };

  const undo = () => setStack((s) => (s.length ? (setRedoStack(r => [...r, s[s.length-1]]), s.slice(0, -1)) : s));
  const redo = () => setRedoStack((r) => (r.length ? (setStack(s => [...s, r[r.length-1]]), r.slice(0, -1)) : r));
  const clearAll = () => { setStack([]); setRedoStack([]); };
  const exportPng = () => {
    const url = baseRef.current!.toDataURL('image/png');
    onChange?.(url);
    const a = document.createElement('a'); a.href = url; a.download = 'snapshot-annotated.png'; a.click();
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-3 text-white overflow-hidden">
      {/* ★ ツールバー右下に縦並び表示 */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
        <button title="ペン" onClick={() => setTool('pen')} className={`p-2 rounded ${tool==='pen'?'bg-white text-purple-600':'bg-white/20'}`}><Pencil size={16}/></button>
        <button title="直線" onClick={() => setTool('line')} className={`p-2 rounded ${tool==='line'?'bg-white text-purple-600':'bg-white/20'}`}><Minus size={16}/></button>
        <button title="矢印" onClick={() => setTool('arrow')} className={`p-2 rounded ${tool==='arrow'?'bg-white text-purple-600':'bg-white/20'}`}><MoveRight size={16}/></button>
        <button title="矩形" onClick={() => setTool('rect')} className={`p-2 rounded ${tool==='rect'?'bg-white text-purple-600':'bg-white/20'}`}><Square size={16}/></button>
        <button title="円" onClick={() => setTool('circle')} className={`p-2 rounded ${tool==='circle'?'bg-white text-purple-600':'bg-white/20'}`}><Circle size={16}/></button>
        <button title="消しゴム" onClick={() => setTool('erase')} className={`p-2 rounded ${tool==='erase'?'bg-white text-purple-600':'bg-white/20'}`}><Eraser size={16}/></button>
        <button title="Undo" onClick={undo} className="p-2 rounded bg-white/20"><RotateCcw size={16}/></button>
        <button title="Redo" onClick={redo} className="p-2 rounded bg-white/20"><RotateCw size={16}/></button>
        <button title="Export" onClick={exportPng} className="p-2 rounded bg-green-600"><Download size={16}/></button>
      </div>

      {/* Canvas表示領域 */}
      <div className="w-full rounded-xl overflow-hidden border border-white/10">
        <div className="relative" style={{ width: (cssW || 1), height: (cssH || 1) }}>
          <canvas ref={baseRef} className="block absolute inset-0 w-full h-full" />
          <canvas
            ref={tmpRef}
            className="block absolute inset-0 w-full h-full"
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
          />
        </div>
      </div>

      {stack.length > 0 && (
        <div className="mt-2 text-right">
          <button onClick={clearAll} className="px-3 py-1 text-xs rounded bg-white/10 hover:bg-white/20">すべて消去</button>
        </div>
      )}
    </div>
  );
};

export default SnapshotAnnotator;
