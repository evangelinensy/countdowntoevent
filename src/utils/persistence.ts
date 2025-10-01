export interface CountdownData {
  eventName: string;
  targetDate: Date;
}

// localStorage keys
const STORAGE_KEY = 'countdown_data';

// Save to localStorage
export const saveToLocalStorage = (data: CountdownData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      eventName: data.eventName,
      targetDate: data.targetDate.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Load from localStorage
export const loadFromLocalStorage = (): CountdownData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return {
      eventName: parsed.eventName,
      targetDate: new Date(parsed.targetDate),
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

// Clear localStorage
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

// Encode data to URL parameters
export const encodeToURL = (data: CountdownData): string => {
  const params = new URLSearchParams({
    name: data.eventName,
    date: data.targetDate.toISOString(),
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

// Decode data from URL parameters
export const decodeFromURL = (): CountdownData | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const date = params.get('date');

    if (!name || !date) return null;

    return {
      eventName: name,
      targetDate: new Date(date),
    };
  } catch (error) {
    console.error('Failed to decode from URL:', error);
    return null;
  }
};

// Copy URL to clipboard
export const copyURLToClipboard = async (url: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
