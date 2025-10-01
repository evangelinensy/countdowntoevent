import { useEffect, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import styles from './CircleProgress.module.css';

interface CircleProgressProps {
  progress: number; // 0 to 1 (0 = empty, 1 = full)
  size?: number;
  animate?: boolean;
  isActive?: boolean; // Is this the current counting circle?
  isFuture?: boolean; // Is this a future circle?
  isFirst?: boolean; // Is this the first circle?
  tooltipContent?: string; // Tooltip text to show on hover
}

export const CircleProgress = ({
  progress,
  size = 48,
  animate = true,
  isActive = false,
  isFuture = false,
  isFirst = false,
  tooltipContent
}: CircleProgressProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - 4; // Leave some padding

    // Draw background circle (inactive)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isFuture ? 'rgba(58, 58, 58, 0.3)' : '#3A3A3A';
    ctx.fill();

    // Draw progress circle (active) - empties clockwise
    if (progress > 0) {
      ctx.beginPath();
      // To empty clockwise: start point moves clockwise as progress decreases
      const baseAngle = -Math.PI / 2; // 12 o'clock
      const startAngle = baseAngle + (1 - progress) * 2 * Math.PI; // Moves clockwise as time passes
      const endAngle = baseAngle + 2 * Math.PI; // Always ends at full circle (270°)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false); // false = clockwise
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fillStyle = isFuture ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF';
      ctx.fill();
    }
  }, [progress, size, isFuture]);

  const className = [
    styles.circle,
    animate ? styles.animate : '',
    isActive ? styles.active : '',
    isFuture ? styles.future : '',
    isFirst ? styles.firstCircle : ''
  ].filter(Boolean).join(' ');

  const canvas = (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );

  // Only show tooltip for the first circle if tooltipContent is provided
  if (isFirst && tooltipContent) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={styles.tooltipWrapper}>
            {canvas}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-black/90 text-white border-gray-700 text-xs px-2 py-1" style={{ fontFamily: 'Munro Small, monospace' }}>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    );
  }

  return canvas;
};