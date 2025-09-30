import { CircleProgress } from '../../ui/CircleProgress';
import { formatTimeDisplay } from '../../../utils/countdown';
import type { DisplayInfo } from '../../../utils/countdown';
import { useDayProgress } from '../../../hooks/useSecondsProgress';
import styles from './CountdownDisplay.module.css';

interface CountdownDisplayProps {
  displayInfo: DisplayInfo;
  targetDate: Date;
}

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

  return (
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
          />
        ))}
      </div>
    </div>
  );
};