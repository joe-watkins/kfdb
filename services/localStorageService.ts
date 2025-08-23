import { KFDBCategories } from '../types';

const STORAGE_KEY = 'kfdb_session_data';

export interface StoredSessionData {
  topic: string;
  sessionTitle: string;
  items: KFDBCategories;
  timestamp: number;
}

export const saveToLocalStorage = (data: Omit<StoredSessionData, 'timestamp'>): void => {
  try {
    const dataToStore: StoredSessionData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): StoredSessionData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};