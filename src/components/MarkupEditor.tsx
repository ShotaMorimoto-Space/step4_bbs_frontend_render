'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Circle, Minus, Type, Palette, RotateCcw, Save, X } from 'lucide-react';

interface MarkupTool {
  id: string;
  type: 'circle' | 'line' | 'polyline' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  text?: string;
  color: string;
  strokeWidth: number;
}

interface MarkupEditorProps {
  imageUrl: string;
  onSave: (markupData: MarkupTool[]) => void;
  onClose: () => void;
}

const COLORS = [
  { name: '赤', value: '#FF0000' },
  { name: '青', value: '#0000FF' },
  { name: '緑', value: '#00FF00' },
  { name: '黄', value: '#FFFF00' },
  { name: '紫', value: '#800080' },
  { name: 'オレンジ', value: '#FFA500' },
  { name: 'ピンク', value: '#FFC0CB' },
  { name: '白', value: '#FFFFFF' }
];

const STROKE_WIDTHS = [1, 2, 3, 4, 5];

export default function MarkupEditor({ imageUrl, onSave, onClose }: MarkupEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<'circle' | 'line' | 'polyline' | 'text'>('circle');
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(2);
  const [markups, setMarkups] = useState<MarkupTool[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentMarkup, setCurrentMarkup] = useState<Partial<MarkupTool> | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      drawCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 背景画像を描画
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // マークアップを描画
      markups.forEach(markup => {
        drawMarkup(ctx, markup);
      });

      // 現在描画中のマークアップを描画
      if (currentMarkup) {
        drawMarkup(ctx, currentMarkup as MarkupTool);
      }
    };
    img.src = imageUrl;
  };

  const drawMarkup = (ctx: CanvasRenderingContext2D, markup: MarkupTool) => {
    ctx.strokeStyle = markup.color;
    ctx.fillStyle = markup.color;
    ctx.lineWidth = markup.strokeWidth;
    ctx.font = '16px Arial';

    switch (markup.type) {
      case 'circle':
        if (markup.width && markup.height) {
          ctx.beginPath();
          ctx.ellipse(markup.x, markup.y, markup.width / 2, markup.height / 2, 0, 0, 2 * Math.PI);
          ctx.stroke();
        }
        break;

      case 'line':
        if (markup.points && markup.points.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(markup.points[0], markup.points[1]);
          ctx.lineTo(markup.points[2], markup.points[3]);
          ctx.stroke();
        }
        break;

      case 'polyline':
        if (markup.points && markup.points.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(markup.points[0], markup.points[1]);
          for (let i = 2; i < markup.points.length; i += 2) {
            ctx.lineTo(markup.points[i], markup.points[i + 1]);
          }
          ctx.stroke();
        }
        break;

      case 'text':
        if (markup.text) {
          ctx.fillText(markup.text, markup.x, markup.y);
        }
        break;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'text') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTextPosition({ x, y });
      setShowTextInput(true);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentMarkup({
      id: Date.now().toString(),
      type: selectedTool,
      x,
      y,
      color: selectedColor,
      strokeWidth: selectedStrokeWidth,
      points: selectedTool === 'line' || selectedTool === 'polyline' ? [x, y] : undefined
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentMarkup) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'circle') {
      const width = Math.abs(x - currentMarkup.x!) * 2;
      const height = Math.abs(y - currentMarkup.y!) * 2;
      setCurrentMarkup(prev => ({ ...prev!, width, height }));
    } else if (selectedTool === 'line' && currentMarkup.points) {
      const newPoints = [...currentMarkup.points.slice(0, 2), x, y];
      setCurrentMarkup(prev => ({ ...prev!, points: newPoints }));
    } else if (selectedTool === 'polyline' && currentMarkup.points) {
      const newPoints = [...currentMarkup.points, x, y];
      setCurrentMarkup(prev => ({ ...prev!, points: newPoints }));
    }

    drawCanvas();
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentMarkup) return;

    if (currentMarkup.type === 'circle' && currentMarkup.width && currentMarkup.height) {
      if (currentMarkup.width > 10 && currentMarkup.height > 10) {
        setMarkups(prev => [...prev, currentMarkup as MarkupTool]);
      }
    } else if (currentMarkup.type === 'line' && currentMarkup.points && currentMarkup.points.length >= 4) {
      setMarkups(prev => [...prev, currentMarkup as MarkupTool]);
    } else if (currentMarkup.type === 'polyline' && currentMarkup.points && currentMarkup.points.length >= 4) {
      setMarkups(prev => [...prev, currentMarkup as MarkupTool]);
    }

    setIsDrawing(false);
    setCurrentMarkup(null);
    drawCanvas();
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const newTextMarkup: MarkupTool = {
        id: Date.now().toString(),
        type: 'text',
        x: textPosition.x,
        y: textPosition.y,
        color: selectedColor,
        strokeWidth: selectedStrokeWidth,
        text: textInput.trim()
      };
      setMarkups(prev => [...prev, newTextMarkup]);
      setTextInput('');
      setShowTextInput(false);
      drawCanvas();
    }
  };

  const handleUndo = () => {
    setMarkups(prev => prev.slice(0, -1));
    setTimeout(drawCanvas, 0);
  };

  const handleSave = () => {
    onSave(markups);
  };

  const handleClear = () => {
    setMarkups([]);
    setCurrentMarkup(null);
    setTimeout(drawCanvas, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">マークアップエディター</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex">
          {/* ツールバー */}
          <div className="w-64 bg-gray-50 p-4 border-r">
            <div className="space-y-6">
              {/* ツール選択 */}
              <div>
                <h4 className="font-medium mb-3">ツール</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTool('circle')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTool === 'circle' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Circle size={20} className="mx-auto mb-1" />
                    <span className="text-xs">円</span>
                  </button>
                  <button
                    onClick={() => setSelectedTool('line')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTool === 'line' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Minus size={20} className="mx-auto mb-1" />
                    <span className="text-xs">直線</span>
                  </button>
                  <button
                    onClick={() => setSelectedTool('polyline')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTool === 'polyline' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Minus size={20} className="mx-auto mb-1 rotate-45" />
                    <span className="text-xs">折線</span>
                  </button>
                  <button
                    onClick={() => setSelectedTool('text')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTool === 'text' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Type size={20} className="mx-auto mb-1" />
                    <span className="text-xs">テキスト</span>
                  </button>
                </div>
              </div>

              {/* 色選択 */}
              <div>
                <h4 className="font-medium mb-3">色</h4>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* 線の太さ */}
              <div>
                <h4 className="font-medium mb-3">線の太さ</h4>
                <div className="space-y-2">
                  {STROKE_WIDTHS.map(width => (
                    <button
                      key={width}
                      onClick={() => setSelectedStrokeWidth(width)}
                      className={`w-full py-2 px-3 rounded border transition-colors ${
                        selectedStrokeWidth === width ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="bg-gray-800 mx-auto"
                        style={{ height: width, width: width * 3 }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* アクション */}
              <div className="space-y-2">
                <button
                  onClick={handleUndo}
                  disabled={markups.length === 0}
                  className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  元に戻す
                </button>
                <button
                  onClick={handleClear}
                  className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  クリア
                </button>
                <button
                  onClick={handleSave}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  保存
                </button>
              </div>
            </div>
          </div>

          {/* キャンバス */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="inline-block">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="border border-gray-300 cursor-crosshair"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>

        {/* テキスト入力モーダル */}
        {showTextInput && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 w-80">
              <h4 className="font-medium mb-4">テキストを入力</h4>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="テキストを入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleTextSubmit}
                  className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  追加
                </button>
                <button
                  onClick={() => setShowTextInput(false)}
                  className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
