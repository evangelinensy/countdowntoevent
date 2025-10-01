import { useState, useEffect } from 'react';
import { DateTimeInput } from './components/features/DateTimeInput';
import { CountdownDisplay } from './components/features/CountdownDisplay';
import { useCountdown } from './hooks/useCountdown';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  decodeFromURL,
  encodeToURL,
  copyURLToClipboard,
} from './utils/persistence';
import './App.css';

function App() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [eventName, setEventName] = useState<string>('');
  const [shareableURL, setShareableURL] = useState<string>('');
  const [showCopied, setShowCopied] = useState(false);
  const { displayInfo, timeRemaining } = useCountdown(targetDate);

  // Load from URL or localStorage on mount
  useEffect(() => {
    // First try URL parameters (takes priority)
    const urlData = decodeFromURL();
    if (urlData) {
      setTargetDate(urlData.targetDate);
      setEventName(urlData.eventName);
      return;
    }

    // Fall back to localStorage
    const storedData = loadFromLocalStorage();
    if (storedData) {
      setTargetDate(storedData.targetDate);
      setEventName(storedData.eventName);
    }
  }, []);

  const handleSetTarget = (date: Date, name: string) => {
    setTargetDate(date);
    setEventName(name);

    // Save to localStorage
    saveToLocalStorage({ eventName: name, targetDate: date });

    // Generate shareable URL
    const url = encodeToURL({ eventName: name, targetDate: date });
    setShareableURL(url);

    // Update browser URL without reload
    window.history.pushState({}, '', url);
  };

  const handleReset = () => {
    setTargetDate(null);
    setEventName('');
    setShareableURL('');
    clearLocalStorage();

    // Clear URL parameters
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleCopyLink = async () => {
    if (shareableURL) {
      const success = await copyURLToClipboard(shareableURL);
      if (success) {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    }
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
          <button onClick={handleCopyLink} className="share-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 3C13.5 2.44772 13.0523 2 12.5 2H3.5C2.94772 2 2.5 2.44772 2.5 3V21C2.5 21.5523 2.94772 22 3.5 22H12.5C13.0523 22 13.5 21.5523 13.5 21V19.5H11.5V20H4.5V4H11.5V4.5H13.5V3Z" fill="currentColor"/>
              <path d="M21.0607 12.0607L17.0607 16.0607L15.6464 14.6464L17.7929 12.5H8V10.5H17.7929L15.6464 8.35355L17.0607 6.93934L21.0607 10.9393C21.6464 11.5251 21.6464 12.4749 21.0607 13.0607Z" fill="currentColor"/>
            </svg>
            <span>{showCopied ? 'Copied!' : 'Share'}</span>
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
