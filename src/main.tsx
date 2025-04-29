import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Styles
import './index.css'
import './milkdown-fixes.css'
import './handle-fixes.css'

// Try to import Milkdown styles
try {
  // We're wrapping these in try/catch because they might fail and we don't want to break rendering
  // Try multiple themes to see which one works
  const themes = [
    import('@milkdown/crepe/theme/nord.css'),
    import('@milkdown/crepe/theme/common/style.css')
  ];
  
  Promise.allSettled(themes)
    .then(results => {
      console.log('Theme loading results:', 
        results.map((r, i) => `Theme ${i}: ${r.status}`).join(', '));
    })
    .catch(e => console.warn('Could not load Milkdown styles:', e));
} catch (e) {
  console.warn('Error importing Milkdown styles:', e);
}

import App from './App.tsx'

console.log('Starting application...');

const root = document.getElementById('root');
console.log('Root element:', root);

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('App rendered');
} else {
  console.error('Root element not found');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found</div>';
}