export interface Settings {
  uiFont: string;
  bodyFont: string;
  bodySize: string;
  centerMessage: boolean;
}

export const loadSettings = (): Settings => {
  const uiFont = localStorage.getItem('goodlore-ui-font') || 'var(--font-inter)';
  const bodyFont = localStorage.getItem('goodlore-body-font') || 'var(--font-jetbrains)';
  const bodySize = localStorage.getItem('goodlore-body-size') || '15';
  const centerMessage = localStorage.getItem('goodlore-center-message') !== 'false';

  return { uiFont, bodyFont, bodySize, centerMessage };
};

export const applySettings = (settings: Settings) => {
  document.documentElement.style.setProperty('--ui-font-family', settings.uiFont);
  document.documentElement.style.setProperty('--body-font-family', settings.bodyFont);
  document.documentElement.style.setProperty('--body-font-size', `${settings.bodySize}px`);
};

export const saveSetting = (key: keyof Settings, value: string | boolean) => {
  const storageKey = `goodlore-${key === 'uiFont' ? 'ui-font' : key === 'bodyFont' ? 'body-font' : key === 'bodySize' ? 'body-size' : 'center-message'}`;
  localStorage.setItem(storageKey, String(value));
};

export const initTheme = (): boolean => {
  const savedTheme = localStorage.getItem('goodlore-theme');
  const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isLight = savedTheme === 'light' || (!savedTheme && systemLight);
  
  if (isLight) {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  return isLight;
};

export const toggleTheme = (): boolean => {
  const isLight = document.body.classList.contains('light-theme');
  if (isLight) {
    document.body.classList.remove('light-theme');
    localStorage.setItem('goodlore-theme', 'dark');
    return false;
  } else {
    document.body.classList.add('light-theme');
    localStorage.setItem('goodlore-theme', 'light');
    return true;
  }
};
export const showToast = (message: string) => {
  let toast = document.getElementById('goodlore-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'goodlore-toast';
    toast.className = 'goodlore-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg> ${message}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
};

export const copyToClipboard = (text: string, btnElement: HTMLElement, successText: string) => {
  navigator.clipboard.writeText(text).then(() => {
    const originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px;"><polyline points="20 6 9 17 4 12"></polyline></svg> ${successText}`;
    const originalBorder = btnElement.style.borderColor;
    const originalColor = btnElement.style.color;
    btnElement.style.borderColor = '#10b981';
    btnElement.style.color = '#10b981';
    
    setTimeout(() => {
      btnElement.innerHTML = originalHtml;
      btnElement.style.borderColor = originalBorder;
      btnElement.style.color = originalColor;
    }, 1800);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showToast('Failed to copy to clipboard.');
  });
};
