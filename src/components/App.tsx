import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { PageData, formatRecipients, reflowBodyHtml } from '../utils/parser';
import { Settings, toggleTheme, copyToClipboard } from '../utils/settings';
import { Header } from './Header';
import { MessageCard } from './MessageCard';
import { ReplyCard } from './ReplyCard';
import { Sidebar } from './Sidebar';

interface AppProps {
  pageData: PageData;
  initialSettings: Settings;
  initialIsLight: boolean;
}

export const App = ({ pageData, initialSettings, initialIsLight }: AppProps) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isLight, setIsLight] = useState<boolean>(initialIsLight);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.isContentEditable
      ) {
        return;
      }
      
      const header = document.querySelector('.goodlore-header');
      const headerHeight = header ? header.clientHeight : 60;
      const overlap = Number(settings.scrollOverlap) || 60;
      const scrollStep = window.innerHeight - headerHeight - overlap;

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const dir = e.shiftKey ? -1 : 1;
        window.scrollBy({ top: scrollStep * dir, behavior: 'smooth' });
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        window.scrollBy({ top: scrollStep, behavior: 'smooth' });
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        window.scrollBy({ top: -scrollStep, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings]);

  const handleThemeToggle = () => {
    const nextIsLight = toggleTheme();
    setIsLight(nextIsLight);
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleCopyEmailText = (e: MouseEvent) => {
    const rawPre = document.getElementById('b');
    const text = rawPre ? rawPre.innerText : '';
    copyToClipboard(text, e.currentTarget as HTMLElement, 'Copied Email!');
  };

  const handleJumpToReply = () => {
    const el = document.getElementById('reply-instructions-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const prevMsg = pageData.navLinks.find(l => l.text.toLowerCase() === 'prev' || l.rel === 'prev');
  const nextMsg = pageData.navLinks.find(l => l.text.toLowerCase() === 'next' || l.rel === 'next');
  const parentMsg = pageData.navLinks.find(l => l.text.toLowerCase() === 'parent');

  return (
    <div id="goodlore-app">
      <Header 
        formAction={pageData.searchAction}
        searchQuery={pageData.searchQuery}
        isLight={isLight}
        onThemeToggle={handleThemeToggle}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      
      <div class="goodlore-layout">
        <main class={`goodlore-main ${settings.centerMessage ? 'centered' : ''}`}>
          {/* Action Bar */}
          <div class="goodlore-card action-nav-bar">
            <div class="action-nav-group">
              {prevMsg && (
                <a href={prevMsg.href} class="goodlore-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform:rotate(180deg);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  Prev
                </a>
              )}
              {nextMsg && (
                <a href={nextMsg.href} class="goodlore-btn">
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
              )}
              {parentMsg && (
                <a href={parentMsg.href} class="goodlore-btn">Parent</a>
              )}
              <button class="goodlore-btn goodlore-btn-primary" onClick={handleJumpToReply}>
                Reply
              </button>
            </div>
            
            <div class="action-nav-group">
              <button class="goodlore-btn" onClick={handleCopyEmailText} title="Copy raw message content for git am">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                Copy Message Text
              </button>
              <a href={pageData.mboxUrl || '#'} class="goodlore-btn" download>Raw Email</a>
            </div>
          </div>
          
          {/* Message Card */}
          <MessageCard 
            subjectText={pageData.subjectText}
            sender={pageData.sender}
            dateObj={pageData.dateObj}
            headers={pageData.headers}
            bodyHtml={settings.reflowParagraphs ? reflowBodyHtml(pageData.bodyHtml) : pageData.bodyHtml}
            messageId={pageData.messageId}
            toBadgesHtml={formatRecipients(pageData.headers.to)}
            ccBadgesHtml={formatRecipients(pageData.headers.cc)}
          />
          
          {/* Reply Instructions Card */}
          <ReplyCard 
            gitCommand={pageData.gitCommand}
            mailtoUrl={pageData.mailtoUrl}
            mboxUrl={pageData.mboxUrl}
            mboxGzUrl={pageData.mboxGzUrl}
          />
        </main>
        
        <Sidebar treeNodes={pageData.treeNodes} />
      </div>
    </div>
  );
};
