import { h } from 'preact';
import { useState } from 'preact/hooks';
import { copyToClipboard } from '../utils/settings';

interface ReplyCardProps {
  gitCommand: string;
  mailtoUrl: string;
  mboxUrl: string;
  mboxGzUrl: string;
}

export const ReplyCard = ({
  gitCommand,
  mailtoUrl,
  mboxUrl,
  mboxGzUrl
}: ReplyCardProps) => {
  const [activeTab, setActiveTab] = useState<'git' | 'mailto' | 'mbox'>('git');

  const handleCopyGit = (e: MouseEvent) => {
    copyToClipboard(gitCommand, e.currentTarget as HTMLElement, 'Copied Command!');
  };

  return (
    <div class="goodlore-card" id="reply-instructions-card">
      <h2 style="font-family:var(--font-title); font-size:1.15rem; margin-top:0; margin-bottom:14px; color:var(--text-primary);">Reply to this thread</h2>
      <div class="reply-tabs-header">
        <button 
          class={`reply-tab-btn ${activeTab === 'git' ? 'active' : ''}`} 
          onClick={() => setActiveTab('git')}
        >
          Git send-email
        </button>
        <button 
          class={`reply-tab-btn ${activeTab === 'mailto' ? 'active' : ''}`} 
          onClick={() => setActiveTab('mailto')}
        >
          Mailto link
        </button>
        <button 
          class={`reply-tab-btn ${activeTab === 'mbox' ? 'active' : ''}`} 
          onClick={() => setActiveTab('mbox')}
        >
          Mbox file
        </button>
      </div>
      
      {/* Tab: Git */}
      <div class={`reply-tab-content ${activeTab === 'git' ? 'active' : ''}`}>
        <p style="font-size:0.85rem; margin-top:0; margin-bottom:12px; color:var(--text-secondary);">
          Copy and run this command in your Linux repository to post your reply publicly. Replace <code>/path/to/YOUR_REPLY</code> with your draft plain-text file.
        </p>
        <div class="copy-container">
          <button class="copy-btn" onClick={handleCopyGit}>Copy Command</button>
          <pre class="code-block" style="white-space:pre-wrap; word-break:break-all;">{gitCommand || 'No git command found'}</pre>
        </div>
      </div>
      
      {/* Tab: Mailto */}
      <div class={`reply-tab-content ${activeTab === 'mailto' ? 'active' : ''}`}>
        <p style="font-size:0.85rem; margin-top:0; margin-bottom:16px; color:var(--text-secondary);">
          Open this conversation in your system's default email client. Senders, CCs, Subject, and In-Reply-To headers will be pre-configured.
        </p>
        <a href={mailtoUrl} class="goodlore-btn goodlore-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          Reply via Email Client
        </a>
      </div>
      
      {/* Tab: Mbox */}
      <div class={`reply-tab-content ${activeTab === 'mbox' ? 'active' : ''}`}>
        <p style="font-size:0.85rem; margin-top:0; margin-bottom:16px; color:var(--text-secondary);">
          Import the message block directly into text-based email clients or local mail tools.
        </p>
        <div style="display:flex; gap:10px;">
          <a href={mboxUrl} class="goodlore-btn" download>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Message Mbox
          </a>
          {mboxGzUrl && (
            <a href={mboxGzUrl} class="goodlore-btn" download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download Entire Thread (.mbox.gz)
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
