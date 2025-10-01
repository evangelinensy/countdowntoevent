import { useState, useEffect, useRef } from 'react';
import styles from './PomodoroExtension.module.css';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

interface TimerState {
  startTime: number | null;
  isRunning: boolean;
}

export const PomodoroExtension = () => {
  const [timeRemaining, setTimeRemaining] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Load timer state from Chrome storage
  useEffect(() => {
    chrome.storage.local.get(['pomodoroState'], (result) => {
      if (result.pomodoroState) {
        const state: TimerState = result.pomodoroState;
        if (state.isRunning && state.startTime) {
          const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
          const remaining = Math.max(0, POMODORO_DURATION - elapsed);
          setTimeRemaining(remaining);
          setIsRunning(remaining > 0);
        }
      }
    });
  }, []);

  // Tick every second
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        chrome.storage.local.get(['pomodoroState'], (result) => {
          if (result.pomodoroState) {
            const state: TimerState = result.pomodoroState;
            if (state.startTime) {
              const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
              const remaining = Math.max(0, POMODORO_DURATION - elapsed);
              setTimeRemaining(remaining);

              if (remaining === 0) {
                setIsRunning(false);
                chrome.storage.local.set({
                  pomodoroState: { startTime: null, isRunning: false }
                });
              }
            }
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Draw circle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate progress (0 = done, 1 = full time)
    const progress = timeRemaining / POMODORO_DURATION;

    if (isRunning) {
      // Draw only the remaining time as white (shrinking clockwise)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const sweptAngle = (1 - progress) * 2 * Math.PI; // How much has been swept clockwise
      const startAngle = -Math.PI / 2 + sweptAngle; // Start after the swept portion
      const endAngle = startAngle + (progress * 2 * Math.PI); // Draw the remaining portion
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else {
      // Draw full white circle when not running
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }, [timeRemaining, isRunning]);

  const handleStart = () => {
    const startTime = Date.now();
    setIsRunning(true);
    setTimeRemaining(POMODORO_DURATION);
    chrome.storage.local.set({
      pomodoroState: { startTime, isRunning: true }
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(POMODORO_DURATION);
    chrome.storage.local.set({
      pomodoroState: { startTime: null, isRunning: false }
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOpenWebApp = () => {
    chrome.tabs.create({ url: 'https://countdowntodate.netlify.app/' });
  };

  const handleOpenPortfolio = () => {
    chrome.tabs.create({ url: 'https://www.evangeline.design' });
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.externalLink}
        onClick={handleOpenWebApp}
        title="Open full web app"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 3h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={styles.title}>POMODORO TIMER</div>

      <div className={styles.circleContainer}>
        <div className={styles.timeDisplay}>
          {formatTime(timeRemaining)}
        </div>

        <div
          className={`${styles.circle} ${isHovering ? styles.hoverCircle : ''}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={isRunning ? handleReset : handleStart}
        >
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className={styles.canvas}
          />
          <div className={styles.circleText}>
            {isRunning ? 'RESET' : 'START'}
          </div>
        </div>
      </div>

      <button
        className={styles.credit}
        onClick={handleOpenPortfolio}
        title="Visit evangeline.design"
      >
        evangeline.design
      </button>
    </div>
  );
};
