import { CircleProgress } from '../../ui/CircleProgress';
import { TooltipProvider } from '../../ui/tooltip';
import { formatTimeDisplay } from '../../../utils/countdown';
import type { DisplayInfo } from '../../../utils/countdown';
import { useDayProgress } from '../../../hooks/useSecondsProgress';
import styles from './CountdownDisplay.module.css';

interface CountdownDisplayProps {
  displayInfo: DisplayInfo;
  targetDate: Date;
}

// Format remaining time for tooltip (4h 33min 5s format)
const formatRemainingTime = (progress: number, unit: 'days' | 'hours' | 'minutes' | 'seconds'): string => {
  let totalSeconds = 0;

  if (unit === 'days') {
    // Progress represents fraction of a day (24 hours)
    totalSeconds = progress * 24 * 60 * 60;
  } else if (unit === 'hours') {
    // Progress represents fraction of an hour (60 minutes)
    totalSeconds = progress * 60 * 60;
  } else if (unit === 'minutes') {
    // Progress represents fraction of a minute (60 seconds)
    totalSeconds = progress * 60;
  } else {
    // For seconds, just show the seconds
    totalSeconds = progress * 60;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Build readable format: "4h 33min 5s"
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
};

export const CountdownDisplay = ({ displayInfo, targetDate }: CountdownDisplayProps) => {
  const { totalUnits, currentUnit, maxUnits, label, unit } = displayInfo;
  const dayProgress = useDayProgress({ targetDate, unit });

  // Show all circles representing the total units
  const circleCount = maxUnits;

  // Only the first (leftmost) circle is at full brightness and blinks
  // It shows the progress of the current unit (day/hour/minute)
  // For days: 1 full circle = 24 hours = 360 degrees
  // All other circles represent the remaining time at low opacity
  const circles = Array.from({ length: circleCount }, (_, index) => {
    let progress = index === 0 ? dayProgress : 1; // First circle shows current unit progress
    let isActive = false;
    let isFuture = index !== 0; // All except first are "future" (low opacity)

    return { progress, isActive, isFuture };
  });

  // Calculate tooltip content for the first circle
  const firstCircleTooltip = formatRemainingTime(dayProgress, unit);

  return (
    <TooltipProvider delayDuration={200}>
      <div className={styles.container}>
        <div className={styles.timeDisplay}>
          {formatTimeDisplay(totalUnits, currentUnit, unit)}
        </div>
        <div className={styles.label}>{label}</div>
        <div className={styles.circlesGrid}>
          {circles.map(({ progress, isActive, isFuture }, index) => (
            <CircleProgress
              key={index}
              progress={progress}
              size={48}
              isActive={isActive}
              isFuture={isFuture}
              isFirst={index === 0}
              tooltipContent={index === 0 ? firstCircleTooltip : undefined}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};