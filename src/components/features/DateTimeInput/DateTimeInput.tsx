import { useState, useEffect, useRef } from 'react';
import { parseDate } from '@internationalized/date';
import type { DateValue } from 'react-aria-components';
import { I18nProvider } from 'react-aria';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { DateField, DateInput } from '../../ui/datefield';
import { Label } from '../../ui/field';
import { Calendar } from '../../ui/Calendar';
import styles from './DateTimeInput.module.css';

interface DateTimeInputProps {
  onSetTarget: (date: Date, eventName: string) => void;
}

export const DateTimeInput = ({ onSetTarget }: DateTimeInputProps) => {
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dateValue, setDateValue] = useState<DateValue | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [circleProgress, setCircleProgress] = useState(1); // 1 = full, 0 = empty
  const [isHoveringCircle, setIsHoveringCircle] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Convert DateValue to Date
  const dateValueToDate = (value: DateValue): Date => {
    return new Date(value.year, value.month - 1, value.day);
  };

  // Convert Date to DateValue
  const dateToDateValue = (date: Date): DateValue => {
    return parseDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  };

  // Reset timer function
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCircleProgress(1);
    startTimer();
  };

  // Start timer function
  const startTimer = () => {
    const totalDuration = 25 * 60 * 1000; // 25 minutes in ms (Pomodoro)
    const tickInterval = 1 * 1000; // 1 second in ms
    const totalTicks = totalDuration / tickInterval; // 1500 ticks
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

    intervalRef.current = interval as unknown as number;
  };

  // 20-minute countdown that ticks every 1 second
  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Draw the circle on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Clear with transparency
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    // Only draw the remaining portion (what's left) - empties clockwise
    if (circleProgress > 0) {
      // Save the context state
      ctx.save();

      ctx.beginPath();
      // To empty clockwise: start point moves clockwise as progress decreases
      const baseAngle = -Math.PI / 2; // 12 o'clock
      const startAngle = baseAngle + (1 - circleProgress) * 2 * Math.PI; // Moves clockwise as time passes
      const endAngle = baseAngle + 2 * Math.PI; // Always ends at full circle (270°)

      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false); // false = clockwise
      ctx.closePath();

      // Create gradient for circle
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, '#F0F0F0');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Clip to the circle area for text rendering
      ctx.clip();

      // Calculate remaining time
      const totalSeconds = Math.floor(circleProgress * 25 * 60); // 25 minutes in seconds (Pomodoro)
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const timeText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      // Draw text with gradient (only visible in clipped area)
      ctx.font = '400 64.8px "Munro Small", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Measure text to position gradient accurately
      const textMetrics = ctx.measureText(timeText);
      const textHeight = 64.8; // Font size
      const textTop = centerY - textHeight / 2;
      const textBottom = centerY + textHeight / 2;

      // Create text gradient (180deg: top black to bottom 5% black)
      const textGradient = ctx.createLinearGradient(centerX, textTop, centerX, textBottom);
      textGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)'); // 80% opacity black at top
      textGradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)'); // 5% opacity black at bottom

      ctx.fillStyle = textGradient;
      ctx.fillText(timeText, centerX, centerY);

      // Restore context
      ctx.restore();
    }
  }, [circleProgress]);

  const handleStartCountdown = () => {
    if (!selectedDate) {
      setAlertMessage('Please select a date');
      setShowAlert(true);
      return;
    }

    // Combine date and time (default to 12:00 AM if no time selected)
    const targetDate = new Date(selectedDate);
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      targetDate.setHours(hours, minutes, 0, 0);
    } else {
      targetDate.setHours(0, 0, 0, 0);
    }

    if (targetDate <= new Date()) {
      setAlertMessage("We can't go back in time. Please select a future date or time.");
      setShowAlert(true);
      return;
    }

    // Use "Counting down" as default if no event name provided
    const finalEventName = eventName.trim() || 'Counting down';
    onSetTarget(targetDate, finalEventName);
  };

  // Handle DateField change
  const handleDateFieldChange = (value: DateValue | null) => {
    setDateValue(value);
    if (value) {
      const date = dateValueToDate(value);
      setSelectedDate(date);
    } else {
      setSelectedDate(undefined);
    }
  };

  // Sync dateValue when selectedDate changes from Calendar
  useEffect(() => {
    if (selectedDate && !dateValue) {
      setDateValue(dateToDateValue(selectedDate));
    }
  }, [selectedDate, dateValue]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>COUNTDOWN</h1>

      <div
        className={`${styles.glowCircle} ${isHoveringCircle ? styles.hoverCircle : ''}`}
        onMouseEnter={() => setIsHoveringCircle(true)}
        onMouseLeave={() => setIsHoveringCircle(false)}
        onClick={resetTimer}
      >
        <canvas ref={canvasRef} className={styles.centerCircle} style={{ width: 320, height: 320 }} />
        {isHoveringCircle && (
          <div className={styles.resetText}>RESET</div>
        )}
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
          <I18nProvider locale="en-GB">
            <DateField
              value={dateValue}
              onChange={handleDateFieldChange}
            >
              <Label className={styles.label}>Countdown to event</Label>
              <div className={styles.dateFieldWrapper}>
                <DateInput className={styles.dateInput} />
                <button
                  type="button"
                  className={styles.calendarButton}
                  onClick={() => setShowCalendar(!showCalendar)}
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="w-5 h-5" />
                </button>
              </div>
            </DateField>
          </I18nProvider>
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

        {selectedDate && (
          <button
            type="button"
            onClick={handleStartCountdown}
            className={styles.startButton}
          >
            Start Countdown
          </button>
        )}
      </div>

      {/* Custom Alert Modal */}
      {showAlert && (
        <div className={styles.alertOverlay} onClick={() => setShowAlert(false)}>
          <div className={styles.alertModal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.alertMessage}>{alertMessage}</p>
            <button
              className={styles.alertButton}
              onClick={() => setShowAlert(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};