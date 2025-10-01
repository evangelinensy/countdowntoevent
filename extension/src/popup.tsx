import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../src/styles/globals.css';
import { PomodoroExtension } from './PomodoroExtension';

function ExtensionPopup() {
  return <PomodoroExtension />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExtensionPopup />
  </React.StrictMode>
);
