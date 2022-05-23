import React from 'react';
import ReactDOM from 'react-dom';

export const Portal = ({ children }: { children: React.ReactNode }) => {
  let container;
  if (typeof window !== 'undefined') {
    container = document.getElementById('outside-app-context');
  }

  if (!container) return null;

  return ReactDOM.createPortal(children, container);
};
