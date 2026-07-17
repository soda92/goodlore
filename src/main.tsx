import { h, render } from 'preact';
import { App } from './components/App';
import { extractPageData } from './utils/parser';
import { initTheme, loadSettings, applySettings } from './utils/settings';
import './styles.css';

const injectFonts = () => {
  const linkFonts = document.createElement('link');
  linkFonts.rel = 'stylesheet';
  linkFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Roboto+Mono:wght@400;500;600&family=Source+Code+Pro:wght@400;500;600&family=Fira+Code:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap';
  document.head.appendChild(linkFonts);
};

const init = () => {
  injectFonts();
  const isLight = initTheme();
  const currentSettings = loadSettings();
  applySettings(currentSettings);

  const pageData = extractPageData();
  if (pageData) {
    document.body.classList.add('goodlore-transformed-page');
    
    const container = document.createElement('div');
    container.id = 'goodlore-app';
    document.body.appendChild(container);

    render(
      <App 
        pageData={pageData}
        initialSettings={currentSettings}
        initialIsLight={isLight}
      />,
      container
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
