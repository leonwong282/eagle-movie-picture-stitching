import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './lib/i18n'; // Initialize i18n
import { setupEagleLanguageListener, cleanupLanguageListener } from './lib/i18n';
import './styles/globals.css';

// Cleanup any existing listeners (important for HMR)
cleanupLanguageListener();

// Setup Eagle language change listener with proper cleanup
const cleanupLanguage = setupEagleLanguageListener();

// Cleanup on HMR (Vite hot module replacement)
const hot = (import.meta as ImportMeta & { hot?: { dispose: (cb: () => void) => void } }).hot;
if (hot) {
  hot.dispose(() => {
    cleanupLanguage();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
