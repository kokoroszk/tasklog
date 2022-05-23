import { useState, useRef, useCallback, useEffect } from 'react';

export const useCloseOnClickOutside = () => {
  const [isActive, setActive] = useState(false);
  const targetRef = useRef<any>();

  const handler = useCallback((e: MouseEvent) => {
    if (targetRef.current.contains(e.target)) return;
    setActive(false);
    document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('click', handler);
      return;
    }
    document.removeEventListener('click', handler);
  }, [isActive, handler]);

  return { isActive, setActive, targetRef };
};
