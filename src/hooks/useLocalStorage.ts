'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';

function createStorageStore<T>(key: string, initialValue: T) {
  let listeners: Array<() => void> = [];

  function subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }

  function getSnapshot(): T {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  }

  function getServerSnapshot(): T {
    return initialValue;
  }

  function setValue(value: T | ((prev: T) => T)) {
    try {
      const currentValue = getSnapshot();
      const valueToStore = value instanceof Function ? value(currentValue) : value;
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      
      // Notify all listeners
      listeners.forEach(listener => listener());
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }

  return { subscribe, getSnapshot, getServerSnapshot, setValue };
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const store = createStorageStore<T>(key, initialValue);
  const storedValue = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    store.setValue(value);
  }, [store]);

  return [storedValue, setValue];
}
