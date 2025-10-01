export interface TimeRemaining {
  total: number; // total milliseconds
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
  const now = new Date();
  const total = targetDate.getTime() - now.getTime();

  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
};

export type DisplayUnit = 'days' | 'hours' | 'minutes' | 'seconds';

export interface DisplayInfo {
  unit: DisplayUnit;
  totalUnits: number;
  currentUnit: number;
  maxUnits: number;
  label: string;
}

export const getDisplayInfo = (timeRemaining: TimeRemaining): DisplayInfo => {
  const { total, hours, minutes, seconds } = timeRemaining;

  // If more than 24 hours remaining, show days (whole numbers only)
  if (total > 24 * 60 * 60 * 1000) {
    const totalDays = Math.floor(total / (24 * 60 * 60 * 1000));
    return {
      unit: 'days',
      totalUnits: totalDays,
      currentUnit: hours,
      maxUnits: totalDays,
      label: totalDays === 1 ? 'Day' : 'Days',
    };
  }

  // If more than 1 hour remaining, show hours (whole numbers)
  if (total > 60 * 60 * 1000) {
    const totalHours = Math.floor(total / (60 * 60 * 1000));
    return {
      unit: 'hours',
      totalUnits: totalHours,
      currentUnit: minutes,
      maxUnits: totalHours,
      label: totalHours === 1 ? 'Hour' : 'Hours',
    };
  }

  // If more than 1 minute remaining, show minutes (whole numbers)
  if (total > 60 * 1000) {
    const totalMinutes = Math.floor(total / (60 * 1000));
    return {
      unit: 'minutes',
      totalUnits: totalMinutes,
      currentUnit: seconds,
      maxUnits: totalMinutes,
      label: totalMinutes === 1 ? 'Minute' : 'Minutes',
    };
  }

  // Show seconds
  return {
    unit: 'seconds',
    totalUnits: seconds,
    currentUnit: 0,
    maxUnits: 60,
    label: seconds === 1 ? 'Second' : 'Seconds',
  };
};

export const formatTimeDisplay = (totalUnits: number, currentUnit: number, unit: DisplayUnit): string => {
  // For days, show only the total days (no decimal/fractional part)
  if (unit === 'days') {
    return String(totalUnits).padStart(2, '0');
  }
  // For hours, minutes, seconds - show with fractional part
  return `${String(totalUnits).padStart(2, '0')}:${String(currentUnit).padStart(2, '0')}`;
};