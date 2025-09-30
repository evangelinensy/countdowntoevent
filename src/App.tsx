import { useState } from 'react';
import { DateTimeInput } from './components/features/DateTimeInput';
import { CountdownDisplay } from './components/features/CountdownDisplay';
import { useCountdown } from './hooks/useCountdown';
import './App.css';

function App() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [eventName, setEventName] = useState<string>('');
  const { displayInfo, timeRemaining } = useCountdown(targetDate);

  const handleSetTarget = (date: Date, name: string) => {
    setTargetDate(date);
    setEventName(name);
  };

  const handleReset = () => {
    setTargetDate(null);
    setEventName('');
  };

  return (
    <div className="app">
      {!targetDate || timeRemaining.total === 0 ? (
        <DateTimeInput onSetTarget={handleSetTarget} />
      ) : (
        <div className="countdown-view">
          <button onClick={handleReset} className="reset-button">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 9C0 9.3418 0.126953 9.63477 0.400391 9.88867L7.99805 17.3301C8.21289 17.5449 8.48633 17.6621 8.80859 17.6621C9.45312 17.6621 9.9707 17.1543 9.9707 16.5C9.9707 16.1777 9.83398 15.8945 9.61914 15.6699L2.77344 9L9.61914 2.33008C9.83398 2.10547 9.9707 1.8125 9.9707 1.5C9.9707 0.845703 9.45312 0.337891 8.80859 0.337891C8.48633 0.337891 8.21289 0.455078 7.99805 0.669922L0.400391 8.10156C0.126953 8.36523 0 8.6582 0 9Z" fill="#A0A0A0"/>
            </svg>
            <span>Back</span>
          </button>
          <h2 className="event-title">{eventName}</h2>
          <CountdownDisplay displayInfo={displayInfo} targetDate={targetDate} />
          {timeRemaining.total === 0 && (
            <div className="finished-message">
              <h3>Time's up! 🎉</h3>
              <p>The countdown has finished.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
