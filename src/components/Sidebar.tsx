import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { TreeNode } from '../utils/parser';
import { Settings, saveSetting, applySettings } from '../utils/settings';

interface SidebarProps {
  treeNodes: TreeNode[];
  formAction: string;
  searchQuery: string;
  isLight: boolean;
  onThemeToggle: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export const Sidebar = ({
  treeNodes,
  formAction,
  searchQuery,
  isLight,
  onThemeToggle,
  settings,
  onSettingsChange
}: SidebarProps) => {
  const [filterText, setFilterText] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closePopover = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        (popoverRef.current && popoverRef.current.contains(target)) ||
        (btnRef.current && btnRef.current.contains(target))
      ) {
        return;
      }
      setPopoverOpen(false);
    };
    document.addEventListener('click', closePopover);
    return () => document.removeEventListener('click', closePopover);
  }, []);

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

  const handleReflowParagraphsChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).checked;
    const newSettings = { ...settings, reflowParagraphs: val };
    onSettingsChange(newSettings);
    saveSetting('reflowParagraphs', val);
  };

  const handleScrollOverlapChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    const newSettings = { ...settings, scrollOverlap: val };
    onSettingsChange(newSettings);
    saveSetting('scrollOverlap', val);
  };

  useEffect(() => {
    if (containerRef.current) {
      const activeItem = containerRef.current.querySelector('.thread-tree-item.active') as HTMLElement;
      if (activeItem) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeItem.getBoundingClientRect();
        const offset = activeRect.top - containerRect.top - (containerRect.height / 2) + (activeRect.height / 2);
        container.scrollBy({ top: offset, behavior: 'smooth' });
      }
    }
  }, [treeNodes]);

  const filteredNodes = treeNodes.filter(node => {
    if (!filterText) return true;
    const author = node.author.toLowerCase();
    const subject = node.subject.toLowerCase();
    const query = filterText.toLowerCase().trim();
    return author.includes(query) || subject.includes(query);
  });

  return (
    <aside class="goodlore-sidebar">
      {/* Brand & Actions */}
      <div class="sidebar-brand-section">
        <a href={formAction} class="goodlore-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          GoodLore
        </a>
        
        <div class="sidebar-brand-actions">
          <button ref={btnRef} class="goodlore-btn goodlore-btn-icon" onClick={() => setPopoverOpen(!popoverOpen)} title="Typography & Settings">
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
          
          {/* Settings Popover */}
          <div ref={popoverRef} class={`settings-popover ${popoverOpen ? 'open' : ''}`}>
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

            <div class="settings-control-group">
              <label class="settings-label">Keyboard Scroll Overlap</label>
              <div class="settings-slider-row">
                <input type="range" min="10" max="150" step="5" value={settings.scrollOverlap} class="settings-slider" id="settings-scroll-overlap-slider" onInput={handleScrollOverlapChange} />
                <span class="settings-slider-value">{settings.scrollOverlap}px</span>
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

            <div class="settings-control-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <label class="settings-label" htmlFor="settings-reflow-check" style={{ cursor: 'pointer' }}>Reflow Text Paragraphs</label>
              <input 
                type="checkbox" 
                id="settings-reflow-check" 
                checked={settings.reflowParagraphs} 
                onChange={handleReflowParagraphsChange}
                style={{ accentColor: 'var(--accent-color)', cursor: 'pointer', width: '16px', height: '16px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Global search for kernel threads */}
      <form action={formAction} method="get" class="goodlore-search sidebar-global-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" name="q" value={searchQuery} placeholder="Search kernel threads..." />
      </form>
      
      <hr class="sidebar-divider" />
      
      {/* Existing thread conversation section */}
      <div class="sidebar-header">
        <h2 class="sidebar-title">Thread Conversation</h2>
        <span class="sidebar-count">{filteredNodes.length} messages</span>
      </div>
      
      <div class="thread-search-box">
        <div class="goodlore-search" style="padding:4px 10px; max-width:100%;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Filter replies by author or subject..." 
            value={filterText}
            onInput={(e) => setFilterText((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>
      
      <div class="thread-tree-scroll" id="thread-tree-container" ref={containerRef}>
        {filteredNodes.map((node, index) => {
          const level = node.level || 0;
          const relativeMarginLeft = level * 12;
          
          const guides = [];
          for (let i = 0; i < level; i++) {
            guides.push(
              <div 
                class="indent-guide" 
                style={{ left: `${i * 12 + 16}px` }} 
                key={i}
              />
            );
          }
          
          if (node.type === 'not-found') {
            return (
              <div class="thread-tree-item-wrapper" key={index}>
                {guides}
                <div class="thread-tree-item not-found" style={{ marginLeft: `${relativeMarginLeft}px` }}>
                  <div class="tree-item-meta">
                    <span class="tree-item-author">Missing Reply</span>
                  </div>
                  <div class="tree-item-subject">&lt;{node.messageId}&gt;</div>
                </div>
              </div>
            );
          }
          
          const shortTime = node.dateTime.split(' ')[1] || node.dateTime;
          
          return (
            <div class="thread-tree-item-wrapper" key={index}>
              {guides}
              <a 
                href={node.href} 
                class={`thread-tree-item ${node.isCurrent ? 'active' : ''}`} 
                style={{ marginLeft: `${relativeMarginLeft}px` }}
              >
                <div class="tree-item-meta">
                  <span class="tree-item-author">
                    {node.author || 'Unknown'} 
                    {node.isCurrent && <span class="current-badge">Here</span>}
                  </span>
                  <span class="tree-item-date">{shortTime}</span>
                </div>
                <div class="tree-item-subject">{node.subject || '(no subject)'}</div>
              </a>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
