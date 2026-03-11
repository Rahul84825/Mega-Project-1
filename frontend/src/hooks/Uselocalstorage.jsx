import { useState } from "react";

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = (newValue) => {
    try {
      const val = typeof newValue === "function" ? newValue(value) : newValue;
      setValue(val);
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      console.warn(`useLocalStorage: failed to save key "${key}"`);
    }
  };

  const remove = () => {
    try {
      localStorage.removeItem(key);
      setValue(defaultValue);
    } catch {
      console.warn(`useLocalStorage: failed to remove key "${key}"`);
    }
  };

  return [value, set, remove];
};

export default useLocalStorage;