import { useState } from 'react';
import { ChevronLeft } from './ChevronLeft';
import { ChevronRight } from './ChevronRight';
import styles from './Calendar.module.css';

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  selectedTime?: string;
  onSelectTime: (time: string) => void;
}

export const Calendar = ({ selectedDate, onSelectDate, selectedTime, onSelectTime }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty slots for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelectDate(newDate);
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth.getMonth() &&
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === currentMonth.getMonth() &&
           today.getFullYear() === currentMonth.getFullYear();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>
        <div className={styles.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          type="button"
          className={styles.navButton}
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.dayNames}>
        {dayNames.map((day) => (
          <div key={day} className={styles.dayName}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {days.map((day, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.day} ${day === null ? styles.empty : ''} ${isSelectedDate(day!) ? styles.selected : ''} ${isToday(day!) ? styles.today : ''}`}
            onClick={() => day && handleDateClick(day)}
            disabled={day === null}
          >
            {day}
          </button>
        ))}
      </div>

      <div className={styles.timeSection}>
        <label className={styles.timeLabel}>Time</label>
        <input
          type="time"
          value={selectedTime || ''}
          onChange={(e) => onSelectTime(e.target.value)}
          className={styles.timeInput}
        />
      </div>
    </div>
  );
};