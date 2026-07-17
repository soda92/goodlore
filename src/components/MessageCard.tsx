import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Sender, FormattedDate, EmailHeaders } from '../utils/parser';
import { copyToClipboard } from '../utils/settings';

interface MessageCardProps {
  subjectText: string;
  sender: Sender;
  dateObj: FormattedDate;
  headers: EmailHeaders;
  bodyHtml: string;
  messageId: string;
  toBadgesHtml: string;
  ccBadgesHtml: string;
}

export const MessageCard = ({
  subjectText,
  sender,
  dateObj,
  headers,
  bodyHtml,
  messageId,
  toBadgesHtml,
  ccBadgesHtml
}: MessageCardProps) => {
  const [metaExpanded, setMetaExpanded] = useState(false);

  const handleCopyMsgId = (e: MouseEvent) => {
    copyToClipboard(messageId, e.currentTarget as HTMLElement, 'Copied!');
  };

  return (
    <article class="goodlore-card">
      <div class="msg-header-section">
        <div class="msg-title-area">
          <h1 class="msg-subject">{subjectText}</h1>
        </div>
        <div class="msg-meta-row">
          <div class="msg-sender-info">
            <div class="msg-avatar">{sender.initials}</div>
            <div class="msg-sender-text">
              <span class="msg-sender-name">{sender.name}</span>
              <span class="msg-sender-email">{sender.email}</span>
            </div>
          </div>
          <div class="msg-date-info">
            <span class="msg-date-relative">{dateObj.relative}</span>
            <span class="msg-date-absolute">{dateObj.absolute}</span>
          </div>
        </div>
        
        <button 
          class="msg-extra-meta-toggle" 
          onClick={() => setMetaExpanded(!metaExpanded)}
        >
          <span>{metaExpanded ? 'Hide headers & recipients' : 'Show headers & recipients'}</span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            style={{ 
              transform: metaExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        <div class={`msg-metadata-grid ${metaExpanded ? 'expanded' : ''}`}>
          <span class="meta-label">To:</span>
          <div class="meta-value" dangerouslySetInnerHTML={{ __html: toBadgesHtml || 'None' }} />
          
          <span class="meta-label">Cc:</span>
          <div class="meta-value" dangerouslySetInnerHTML={{ __html: ccBadgesHtml || 'None' }} />
          
          <span class="meta-label">Message-ID:</span>
          <div class="meta-value" style="display:flex; align-items:center; gap:8px;">
            <code style="font-family:var(--font-mono); font-size:0.78rem; background:var(--bg-input); padding:2px 6px; border-radius:4px; border:1px solid var(--border-color);">{messageId}</code>
            <button class="goodlore-btn" onClick={handleCopyMsgId} style="padding:2px 8px; font-size:0.7rem; border-radius:4px;">Copy</button>
          </div>
          
          {headers['in-reply-to'] && (
            <Fragment>
              <span class="meta-label">In-Reply-To:</span>
              <div class="meta-value" dangerouslySetInnerHTML={{ __html: headers['in-reply-to'] }} />
            </Fragment>
          )}
        </div>
      </div>
      
      <div class="msg-body-container">
        <pre class="msg-body-pre" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>
    </article>
  );
};
