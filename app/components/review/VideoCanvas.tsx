import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlayCircle, PauseCircle, Type } from 'lucide-react';
import type { Annotation, Tool, Point, CircleAnno, LineAnno, AngleAnno, TextAnno } from '../../../src/types/review';

export type VideoCanvasProps = {
  videoUrl: string;
  currentTime: number;
  tool: Tool;
  color?: string;
  annotations: Annotation[];
  onTimeChange: (t: number) => void;
  onAdd: (anno: Annotation) => void;
  onUpdate: (anno: Annotation) => void;
  onDelete: (id: string) => void;
  onSaveFrame?: (url: string) => void;
};

type DrawingState = {
  isDrawing: boolean;
  startPoint?: Point;
  currentPoint?: Point;
  anglePoints?: Point[];
};

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  videoUrl,
  currentTime,
  tool,
  color = '#8B5CF6',
  annotations,
  onTimeChange,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawingState, setDrawingState] = useState<DrawingState>({ isDrawing: false });
  const [showTextInput, setShowTextInput] = useState<{ point: Point } | null>(null);
  const [textInputValue, setTextInputValue] = useState('');

  // Video time sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeChange(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onTimeChange]);

  // Seek to specific time
  useEffect(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - currentTime) > 0.1) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Draw annotations
  const drawAnnotations = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Filter annotations near current time (±0.3s)
    const visibleAnnotations = annotations.filter(
      anno => Math.abs(anno.time - currentTime) <= 0.3
    );

    visibleAnnotations.forEach(anno => {
      ctx.strokeStyle = anno.color || color;
      ctx.fillStyle = anno.color || color;
      ctx.lineWidth = 3;

      switch (anno.tool) {
        case 'circle': {
          const circleAnno = anno as CircleAnno;
          ctx.beginPath();
          ctx.arc(circleAnno.center.x, circleAnno.center.y, circleAnno.radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        }
        case 'line': {
          const lineAnno = anno as LineAnno;
          ctx.beginPath();
          ctx.moveTo(lineAnno.from.x, lineAnno.from.y);
          ctx.lineTo(lineAnno.to.x, lineAnno.to.y);
          ctx.stroke();
          break;
        }
        case 'angle': {
          const angleAnno = anno as AngleAnno;
          // Draw angle lines
          ctx.beginPath();
          ctx.moveTo(angleAnno.a.x, angleAnno.a.y);
          ctx.lineTo(angleAnno.b.x, angleAnno.b.y);
          ctx.lineTo(angleAnno.c.x, angleAnno.c.y);
          ctx.stroke();
          
          // Draw angle arc
          const radius = 30;
          const angle1 = Math.atan2(angleAnno.a.y - angleAnno.b.y, angleAnno.a.x - angleAnno.b.x);
          const angle2 = Math.atan2(angleAnno.c.y - angleAnno.b.y, angleAnno.c.x - angleAnno.b.x);
          
          ctx.beginPath();
          ctx.arc(angleAnno.b.x, angleAnno.b.y, radius, angle1, angle2);
          ctx.stroke();
          
          // Draw degree text
          ctx.fillStyle = 'white';
          ctx.font = '14px sans-serif';
          ctx.fillText(`${angleAnno.degrees.toFixed(1)}°`, angleAnno.b.x + 35, angleAnno.b.y - 10);
          break;
        }
        case 'text': {
          const textAnno = anno as TextAnno;
          ctx.fillStyle = 'white';
          ctx.font = '16px sans-serif';
          ctx.fillText(textAnno.text, textAnno.at.x, textAnno.at.y);
          break;
        }
      }
    });

    // Draw current drawing state
    if (drawingState.isDrawing && drawingState.startPoint && drawingState.currentPoint) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(drawingState.currentPoint.x - drawingState.startPoint.x, 2) +
          Math.pow(drawingState.currentPoint.y - drawingState.startPoint.y, 2)
        );
        ctx.beginPath();
        ctx.arc(drawingState.startPoint.x, drawingState.startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(drawingState.startPoint.x, drawingState.startPoint.y);
        ctx.lineTo(drawingState.currentPoint.x, drawingState.currentPoint.y);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }
  }, [annotations, currentTime, color, drawingState, tool]);

  // Redraw on animation frame
  useEffect(() => {
    const animate = () => {
      drawAnnotations();
      requestAnimationFrame(animate);
    };
    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [drawAnnotations]);

  const getCanvasPoint = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const calculateAngle = (a: Point, b: Point, c: Point): number => {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };
    
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
    const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
    
    const cosAngle = dot / (magAB * magCB);
    return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'select' || tool === 'erase') return;

    const point = getCanvasPoint(e);

    if (tool === 'text') {
      setShowTextInput({ point });
      return;
    }

    if (tool === 'angle') {
      const anglePoints = drawingState.anglePoints || [];
      const newAnglePoints = [...anglePoints, point];
      
      if (newAnglePoints.length === 3) {
        // Complete angle annotation
        const [a, b, c] = newAnglePoints;
        const degrees = calculateAngle(a, b, c);
        
        const annotation: AngleAnno = {
          id: crypto.randomUUID(),
          tool: 'angle',
          time: currentTime,
          color,
          a, b, c, degrees
        };
        
        onAdd(annotation);
        setDrawingState({ isDrawing: false });
      } else {
        setDrawingState({ isDrawing: true, anglePoints: newAnglePoints });
      }
      return;
    }

    setDrawingState({
      isDrawing: true,
      startPoint: point,
      currentPoint: point
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawingState.isDrawing || !drawingState.startPoint) return;
    if (tool === 'angle') return;

    const point = getCanvasPoint(e);
    setDrawingState(prev => ({ ...prev, currentPoint: point }));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!drawingState.isDrawing || !drawingState.startPoint || !drawingState.currentPoint) return;
    if (tool === 'angle') return;

    const endPoint = getCanvasPoint(e);

    if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(endPoint.x - drawingState.startPoint.x, 2) +
        Math.pow(endPoint.y - drawingState.startPoint.y, 2)
      );
      
      if (radius > 5) {
        const annotation: CircleAnno = {
          id: crypto.randomUUID(),
          tool: 'circle',
          time: currentTime,
          color,
          center: drawingState.startPoint,
          radius
        };
        onAdd(annotation);
      }
    } else if (tool === 'line') {
      const annotation: LineAnno = {
        id: crypto.randomUUID(),
        tool: 'line',
        time: currentTime,
        color,
        from: drawingState.startPoint,
        to: endPoint
      };
      onAdd(annotation);
    }

    setDrawingState({ isDrawing: false });
  };

  const handleTextSubmit = () => {
    if (!showTextInput || !textInputValue.trim()) return;

    const annotation: TextAnno = {
      id: crypto.randomUUID(),
      tool: 'text',
      time: currentTime,
      color,
      at: showTextInput.point,
      text: textInputValue.trim()
    };

    onAdd(annotation);
    setShowTextInput(null);
    setTextInputValue('');
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (tool === 'erase') {
      const point = getCanvasPoint(e);
      
      // Find annotation to delete (simple hit test)
      const toDelete = annotations.find(anno => {
        if (Math.abs(anno.time - currentTime) > 0.3) return false;
        
        switch (anno.tool) {
          case 'circle': {
            const circleAnno = anno as CircleAnno;
            const dist = Math.sqrt(
              Math.pow(point.x - circleAnno.center.x, 2) +
              Math.pow(point.y - circleAnno.center.y, 2)
            );
            return Math.abs(dist - circleAnno.radius) < 10;
          }
          case 'line': {
            const lineAnno = anno as LineAnno;
            // Simple distance to line check
            const A = point.y - lineAnno.from.y;
            const B = lineAnno.from.x - point.x;
            const C = lineAnno.to.x * lineAnno.from.y - lineAnno.from.x * lineAnno.to.y;
            const distance = Math.abs(A * lineAnno.to.x + B * lineAnno.to.y + C) / 
              Math.sqrt(A * A + B * B);
            return distance < 10;
          }
          case 'text': {
            const textAnno = anno as TextAnno;
            const dist = Math.sqrt(
              Math.pow(point.x - textAnno.at.x, 2) +
              Math.pow(point.y - textAnno.at.y, 2)
            );
            return dist < 20;
          }
          default:
            return false;
        }
      });

      if (toDelete) {
        onDelete(toDelete.id);
      }
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        playsInline
        muted
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video) {
            video.currentTime = currentTime;
          }
        }}
      />

      {/* Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        width={640}
        height={360}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      />

      {/* Video Controls */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={handlePlayPause}
          className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          {isPlaying ? (
            <PauseCircle className="text-white" size={24} />
          ) : (
            <PlayCircle className="text-white" size={24} />
          )}
        </button>
      </div>

      {/* Time Display */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')}
      </div>

      {/* Text Input Modal */}
      {showTextInput && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
            <h3 className="text-gray-800 font-medium mb-3">テキストを入力</h3>
            <input
              type="text"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              placeholder="注釈テキストを入力..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowTextInput(null);
                  setTextInputValue('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleTextSubmit}
                disabled={!textInputValue.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Angle Points Indicator */}
      {tool === 'angle' && drawingState.anglePoints && (
        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-2 rounded">
          角度測定: {drawingState.anglePoints.length}/3点
        </div>
      )}
    </div>
  );
};