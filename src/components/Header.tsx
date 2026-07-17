import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Settings, saveSetting, applySettings } from '../utils/settings';

interface HeaderProps {
  formAction: string;
  searchQuery: string;
  isLight: boolean;
  onThemeToggle: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export const Header = ({
  formAction,
  searchQuery,
  isLight,
  onThemeToggle,
  settings,
  onSettingsChange
}: HeaderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const closePopover = () => setPopoverOpen(false);
    document.addEventListener('click', closePopover);
    return () => document.removeEventListener('click', closePopover);
  }, []);

  const handlePopoverClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleUIFontChange = (e: Event) => {
    const val = (e.target as HTMLSelectElement).value;
    const newSettings = { ...settings, uiFont: val };
    onSettingsChange(newSettings);
    applySettings(newSettings);
    saveSetting('uiFont', val);
  };

  const handleBodyFontChange = (e: Event) => {
    const val = (e.target as HTMLSelectElement).value;
    const newSettings = { ...settings, bodyFont: val };
    onSettingsChange(newSettings);
    applySettings(newSettings);
    saveSetting('bodyFont', val);
  };

  const handleBodySizeChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    const newSettings = { ...settings, bodySize: val };
    onSettingsChange(newSettings);
    applySettings(newSettings);
    saveSetting('bodySize', val);
  };

  const handleCenterMessageChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).checked;
    const newSettings = { ...settings, centerMessage: val };
    onSettingsChange(newSettings);
    saveSetting('centerMessage', val);
  };

  return (
    <header class="goodlore-header">
      <a href={formAction} class="goodlore-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        GoodLore
      </a>
      
      <form action={formAction} method="get" class="goodlore-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" name="q" value={searchQuery} placeholder="Search kernel threads (e.g. subsystem, author, diff)..." />
      </form>
      
      <div class="goodlore-header-actions" onClick={handlePopoverClick}>
        <button class="goodlore-btn goodlore-btn-icon" onClick={() => setPopoverOpen(!popoverOpen)} title="Typography & Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>

        <button class="goodlore-btn goodlore-btn-icon" onClick={onThemeToggle} title="Toggle Light/Dark Theme">
          {isLight ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="sun-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          )}
        </button>
        <a href={`${formAction}../_/text/help/`} class="goodlore-btn">Help</a>

        <div class={`settings-popover ${popoverOpen ? 'open' : ''}`}>
          <h3 class="settings-section-title">Typography Options</h3>
          
          <div class="settings-control-group">
            <label class="settings-label" htmlFor="settings-ui-font-select">UI Font Family</label>
            <select class="settings-select" id="settings-ui-font-select" value={settings.uiFont} onChange={handleUIFontChange}>
              <option value="var(--font-inter)">Inter (Default)</option>
              <option value="var(--font-plus-jakarta)">Plus Jakarta Sans</option>
              <option value="var(--font-outfit)">Outfit</option>
              <option value="var(--font-system-sans)">System Default</option>
            </select>
          </div>

          <div class="settings-control-group">
            <label class="settings-label" htmlFor="settings-body-font-select">Message Font Family</label>
            <select class="settings-select" id="settings-body-font-select" value={settings.bodyFont} onChange={handleBodyFontChange}>
              <optgroup label="Monospace Fonts (Best for patches)">
                <option value="var(--font-jetbrains)">JetBrains Mono (Default)</option>
                <option value="var(--font-fira)">Fira Code</option>
                <option value="var(--font-source)">Source Code Pro</option>
                <option value="var(--font-roboto-mono)">Roboto Mono</option>
                <option value="var(--font-system-mono)">System Monospace</option>
              </optgroup>
              <optgroup label="Proportional Fonts (Discussions)">
                <option value="var(--font-inter)">Inter (Sans)</option>
                <option value="var(--font-plus-jakarta)">Plus Jakarta Sans</option>
                <option value="var(--font-outfit)">Outfit</option>
                <option value="var(--font-merriweather)">Merriweather (Serif)</option>
                <option value="var(--font-georgia)">Georgia (Serif)</option>
              </optgroup>
            </select>
          </div>

          <div class="settings-control-group">
            <label class="settings-label">Message Font Size</label>
            <div class="settings-slider-row">
              <input type="range" min="12" max="22" value={settings.bodySize} class="settings-slider" id="settings-body-size-slider" onInput={handleBodySizeChange} />
              <span class="settings-slider-value">{settings.bodySize}px</span>
            </div>
          </div>

          <div class="settings-control-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <label class="settings-label" htmlFor="settings-center-msg-check" style={{ cursor: 'pointer' }}>Center Message Content</label>
            <input 
              type="checkbox" 
              id="settings-center-msg-check" 
              checked={settings.centerMessage} 
              onChange={handleCenterMessageChange}
              style={{ accentColor: 'var(--accent-color)', cursor: 'pointer', width: '16px', height: '16px' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
