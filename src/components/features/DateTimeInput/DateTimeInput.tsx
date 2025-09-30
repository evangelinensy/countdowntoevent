import { useState, useEffect, useRef } from 'react';
import { Calendar } from '../../ui/Calendar';
import styles from './DateTimeInput.module.css';

interface DateTimeInputProps {
  onSetTarget: (date: Date, eventName: string) => void;
}

export const DateTimeInput = ({ onSetTarget }: DateTimeInputProps) => {
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [circleProgress, setCircleProgress] = useState(1); // 1 = full, 0 = empty
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3-minute countdown that ticks every 3 seconds
  useEffect(() => {
    const totalDuration = 3 * 60 * 1000; // 3 minutes in ms
    const tickInterval = 3 * 1000; // 3 seconds in ms
    const totalTicks = totalDuration / tickInterval; // 60 ticks
    let currentTick = totalTicks;

    const interval = setInterval(() => {
      currentTick--;
      setCircleProgress(currentTick / totalTicks);

      if (currentTick <= 0) {
        clearInterval(interval);
        currentTick = totalTicks; // Reset
        setCircleProgress(1);
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, []);

  // Draw the circle on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 240;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Clear with transparency
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    // Only draw the remaining portion (what's left)
    if (circleProgress > 0) {
      ctx.beginPath();
      // Start from top and draw clockwise for remaining time
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (2 * Math.PI * circleProgress);

      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, '#F0F0F0');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [circleProgress]);

  const handleStartCountdown = () => {
    if (!eventName.trim()) {
      alert('Please enter an event name');
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const targetDate = new Date(selectedDate);
    targetDate.setHours(hours, minutes, 0, 0);

    if (targetDate <= new Date()) {
      alert('Please select a future date and time');
      return;
    }

    onSetTarget(targetDate, eventName);
  };

  const formatDateDisplay = () => {
    if (!selectedDate) return 'DD / MM / YY';
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = String(selectedDate.getFullYear()).slice(-2);
    return `${day} / ${month} / ${year}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>COUNTDOWN</h1>

      <div className={styles.glowCircle}>
        <canvas ref={canvasRef} className={styles.centerCircle} style={{ width: 240, height: 240 }} />
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label htmlFor="eventName" className={styles.label}>
            Event name
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className={styles.input}
              placeholder="my crush's birthday"
              maxLength={50}
            />
            {eventName && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setEventName('')}
                aria-label="Clear"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="date" className={styles.label}>
            Countdown to event
          </label>
          <button
            type="button"
            className={styles.datePickerButton}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {formatDateDisplay()}
          </button>
        </div>

        {showCalendar && (
          <div
            className={styles.calendarOverlay}
            onClick={() => setShowCalendar(false)}
          >
            <div
              className={styles.calendarWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowCalendar(false)}
                aria-label="Close calendar"
              >
                ×
              </button>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                }}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
              />
            </div>
          </div>
        )}

        {selectedDate && selectedTime && (
          <button
            type="button"
            onClick={handleStartCountdown}
            className={styles.startButton}
          >
            Start Countdown
          </button>
        )}
      </div>
    </div>
  );
};