export interface EmailHeaders {
  from: string;
  to: string;
  cc: string;
  subject: string;
  date: string;
  'message-id': string;
  'in-reply-to': string;
}

export interface Sender {
  name: string;
  email: string;
  initials: string;
}

export interface FormattedDate {
  absolute: string;
  relative: string;
}

export interface TreeNode {
  type: 'message' | 'not-found';
  dateTime: string;
  prefixLength: number;
  href: string;
  subject: string;
  author: string;
  isCurrent: boolean;
  messageId?: string;
  level?: number;
}

export interface NavLink {
  text: string;
  href: string;
  rel: string;
}

export const parseSender = (fromStr: string): Sender => {
  const div = document.createElement('div');
  div.innerHTML = fromStr;
  const cleanFrom = div.innerText.trim();
  
  const mailtoMatch = cleanFrom.match(/^(.*?)\s*<mailto:(.*?)>$/i);
  const bracketMatch = cleanFrom.match(/^(.*?)\s*<(.*?)>$/);
  
  let name = '';
  let email = '';
  
  if (mailtoMatch) {
    name = mailtoMatch[1];
    email = mailtoMatch[2];
  } else if (bracketMatch) {
    name = bracketMatch[1];
    email = bracketMatch[2];
  } else {
    name = cleanFrom;
    email = cleanFrom;
  }
  
  name = name.replace(/^["']|["']$/g, '').trim();
  email = email.split('?')[0].trim();
  
  if (!name) {
    name = email.split('@')[0] || 'Unknown';
  }
  
  const initials = name
    .split(/\s+/)
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .substring(0, 2)
    .toUpperCase();
      
  return { name, email, initials: initials || '?' };
};

export const formatEmailDate = (dateStr: string): FormattedDate => {
  const cleanDate = dateStr.replace(/<a[\s\S]*?\/a>/gi, '').replace(/\t/g, ' ').trim();
  try {
    const d = new Date(cleanDate);
    if (isNaN(d.getTime())) return { absolute: cleanDate, relative: '' };
    
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    let relative = '';
    if (diffMins < 1) relative = 'Just now';
    else if (diffMins < 60) relative = `${diffMins}m ago`;
    else if (diffHours < 24) relative = `${diffHours}h ago`;
    else if (diffDays < 30) relative = `${diffDays}d ago`;
    else {
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) relative = `${diffMonths}mo ago`;
      else relative = `${Math.floor(diffMonths / 12)}y ago`;
    }
    
    return {
      absolute: d.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'medium' }),
      relative: relative
    };
  } catch(e) {
    return { absolute: cleanDate, relative: '' };
  }
};

export const parseMessageId = (msgIdHtml: string): string => {
  const temp = document.createElement('div');
  temp.innerHTML = msgIdHtml;
  const text = temp.innerText;
  const match = text.match(/<([^>]+)>/) || text.match(/&lt;([^&]+)&gt;/) || [null, text];
  return (match[1] || text).split('(')[0].trim();
};

export const formatRecipients = (recipientsHtml: string): string => {
  if (!recipientsHtml) return '';
  const div = document.createElement('div');
  div.innerHTML = recipientsHtml;
  
  const anchors = Array.from(div.querySelectorAll('a'));
  if (anchors.length > 0) {
    return anchors.map(a => `<span class="recipient-badge">${a.outerHTML}</span>`).join('');
  }
  
  const items = div.innerText.split(/,\s*/);
  return items.map(item => {
    const trimmed = item.trim().replace(/\n/g, '').replace(/\t/g, ' ');
    if (!trimmed) return '';
    return `<span class="recipient-badge">${trimmed}</span>`;
  }).filter(Boolean).join('');
};

export const parseTreeLine = (lineHtml: string): TreeNode | null => {
  let isCurrent = false;
  let cleanHtml = lineHtml.trim();
  if (cleanHtml.startsWith('<b>') && cleanHtml.endsWith('</b>')) {
    isCurrent = true;
    cleanHtml = cleanHtml.substring(3, cleanHtml.length - 4);
  }
  
  const isNotFound = cleanHtml.includes('[not found]');
  let anchorIndex = -1;
  if (isNotFound) {
    anchorIndex = cleanHtml.indexOf('&lt;');
  } else {
    anchorIndex = cleanHtml.indexOf('<a');
  }
  
  if (anchorIndex === -1) {
    return null;
  }
  
  const prefixLength = anchorIndex;
  
  if (isNotFound) {
    const msgIdMatch = cleanHtml.match(/&lt;(.*?)&gt;/);
    const msgId = msgIdMatch ? msgIdMatch[1] : '';
    return {
      type: 'not-found',
      dateTime: '',
      prefixLength: prefixLength,
      href: '',
      subject: '',
      author: '',
      isCurrent: false,
      messageId: msgId
    };
  }
  
  const dateMatch = cleanHtml.match(/^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);
  const dateTime = dateMatch ? dateMatch[1] : '';
  
  const anchorMatch = cleanHtml.match(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/i);
  if (!anchorMatch) return null;
  
  const href = anchorMatch[1];
  const subject = anchorMatch[2];
  
  const linkEndIndex = cleanHtml.indexOf(anchorMatch[0]) + anchorMatch[0].length;
  let author = cleanHtml.substring(linkEndIndex).trim();
  if (author.endsWith('[this message]')) {
    author = author.replace('[this message]', '').trim();
    isCurrent = true;
  }
  
  return {
    type: 'message',
    dateTime: dateTime,
    prefixLength: prefixLength,
    href: href,
    subject: subject.replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
    author: author,
    isCurrent: isCurrent
  };
};

export interface PageData {
  headers: EmailHeaders;
  bodyHtml: string;
  navLinks: NavLink[];
  treeNodes: TreeNode[];
  mboxGzUrl: string;
  mboxUrl: string;
  gitCommand: string;
  mailtoUrl: string;
  searchAction: string;
  searchQuery: string;
  sender: Sender;
  dateObj: FormattedDate;
  subjectText: string;
  messageId: string;
}

export const extractPageData = (): PageData | null => {
  const preB = document.getElementById('b');
  if (!preB) return null;

  const originalHtml = preB.innerHTML;
  const lines = originalHtml.split('\n');
  
  const headers: EmailHeaders = {
    from: '',
    to: '',
    cc: '',
    subject: '',
    date: '',
    'message-id': '',
    'in-reply-to': ''
  };
  
  let bodyStartIndex = 0;
  let currentHeaderKey: keyof EmailHeaders | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      bodyStartIndex = i + 1;
      break;
    }
    
    const headerMatch = line.match(/^([A-Za-z0-9\-]+):\s*(.*)/i);
    if (headerMatch) {
      const key = headerMatch[1].toLowerCase() as keyof EmailHeaders;
      if (headers.hasOwnProperty(key)) {
        currentHeaderKey = key;
        headers[key] = headerMatch[2];
      } else {
        currentHeaderKey = null;
      }
    } else if (currentHeaderKey && /^\s+/.test(line)) {
      headers[currentHeaderKey] += '\n' + line;
    } else {
      bodyStartIndex = i;
      break;
    }
  }
  
  const bodyHtml = lines.slice(bodyStartIndex).join('\n');
  
  const preElements = Array.from(document.querySelectorAll('pre'));
  const threadPre = preElements.find(el => el.innerHTML.includes('Thread overview:'));
  
  let navLinks: NavLink[] = [];
  let treeNodes: TreeNode[] = [];
  let mboxGzUrl = '';
  
  if (threadPre) {
    const parts = threadPre.innerHTML.split(/<b>Thread overview:/i);
    
    const navDiv = document.createElement('div');
    navDiv.innerHTML = parts[0];
    navLinks = Array.from(navDiv.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
      rel: a.getAttribute('rel') || ''
    }));
    
    if (parts[1]) {
      const threadParts = parts[1].split('\n');
      
      const mboxGzMatch = parts[1].match(/<a\s+[^>]*href=["']([^"']*\.mbox\.gz)["']/i);
      if (mboxGzMatch) {
        mboxGzUrl = mboxGzMatch[1];
      }
      
      let minPrefix = Infinity;
      for (let i = 1; i < threadParts.length; i++) {
        const parsed = parseTreeLine(threadParts[i]);
        if (parsed) {
          treeNodes.push(parsed);
          if (parsed.prefixLength < minPrefix) {
            minPrefix = parsed.prefixLength;
          }
        }
      }
      
      treeNodes.forEach(node => {
        node.level = minPrefix === Infinity ? 0 : Math.round((node.prefixLength - minPrefix) / 2);
      });
    }
  }
  
  const preR = document.getElementById('R');
  let mboxUrl = '';
  let gitCommand = '';
  let mailtoUrl = '';
  
  if (preR) {
    const mboxLink = preR.querySelector('a[href$="/raw"]');
    mboxUrl = mboxLink ? (mboxLink as HTMLAnchorElement).href : '';
    
    const rText = preR.innerText;
    const gitMatch = rText.match(/(git send-email[\s\S]*?\/path\/to\/YOUR_REPLY)/);
    gitCommand = gitMatch ? gitMatch[1].trim() : '';
    
    const mailtoLink = preR.querySelector('a[href^="mailto:"]');
    mailtoUrl = mailtoLink ? (mailtoLink as HTMLAnchorElement).href : '';
  }
  
  const sender = parseSender(headers.from);
  const dateObj = formatEmailDate(headers.date);
  const subjectText = headers.subject.replace(/<[^>]*>/g, '').trim();
  const messageId = parseMessageId(headers['message-id']);
  
  let searchAction = 'https://lore.kernel.org/all/';
  let searchQuery = '';
  const originalForm = document.querySelector('form');
  if (originalForm) {
    searchAction = originalForm.action;
    const qInput = originalForm.querySelector('input[name="q"]');
    if (qInput) searchQuery = (qInput as HTMLInputElement).value;
  }

  return {
    headers,
    bodyHtml,
    navLinks,
    treeNodes,
    mboxGzUrl,
    mboxUrl,
    gitCommand,
    mailtoUrl,
    searchAction,
    searchQuery,
    sender,
    dateObj,
    subjectText,
    messageId
  };
};
