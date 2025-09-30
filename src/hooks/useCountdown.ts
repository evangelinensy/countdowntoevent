import { useState, useEffect } from 'react';
import { calculateTimeRemaining, getDisplayInfo } from '../utils/countdown';
import type { TimeRemaining, DisplayInfo } from '../utils/countdown';

export const useCountdown = (targetDate: Date | null) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [displayInfo, setDisplayInfo] = useState<DisplayInfo>({
    unit: 'seconds',
    totalUnits: 0,
    currentUnit: 0,
    maxUnits: 60,
    label: 'Seconds',
  });

  useEffect(() => {
    if (!targetDate) {
      setTimeRemaining({ total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const updateCountdown = () => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeRemaining(remaining);
      setDisplayInfo(getDisplayInfo(remaining));

      if (remaining.total <= 0) {
        // Countdown finished
        clearInterval(interval);
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeRemaining, displayInfo };
};