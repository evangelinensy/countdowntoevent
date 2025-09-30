import { useState, useEffect } from 'react';

interface DayProgressOptions {
  targetDate: Date;
  unit: 'days' | 'hours' | 'minutes' | 'seconds';
}

export const useDayProgress = ({ targetDate, unit }: DayProgressOptions) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const timeRemaining = targetDate.getTime() - now.getTime();

      if (timeRemaining <= 0) {
        setProgress(0);
        return;
      }

      if (unit === 'days') {
        // For days: calculate progress within the current day
        // Get the hours/minutes/seconds remaining in the current day
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        const currentDayProgress = (timeRemaining % millisecondsInDay) / millisecondsInDay;
        setProgress(currentDayProgress);
      } else if (unit === 'hours') {
        // For hours: calculate progress within the current hour
        const millisecondsInHour = 60 * 60 * 1000;
        const currentHourProgress = (timeRemaining % millisecondsInHour) / millisecondsInHour;
        setProgress(currentHourProgress);
      } else if (unit === 'minutes') {
        // For minutes: calculate progress within the current minute
        const millisecondsInMinute = 60 * 1000;
        const currentMinuteProgress = (timeRemaining % millisecondsInMinute) / millisecondsInMinute;
        setProgress(currentMinuteProgress);
      } else {
        // For seconds: show second hand
        const now = new Date();
        const secondsProgress = 1 - (now.getSeconds() / 60);
        setProgress(secondsProgress);
      }
    };

    // Update immediately
    updateProgress();

    // Update every 100ms for smooth animation
    const interval = setInterval(updateProgress, 100);

    return () => clearInterval(interval);
  }, [targetDate, unit]);

  return progress;
};