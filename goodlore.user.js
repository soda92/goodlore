// ==UserScript==
// @name         GoodLore - Modernized lore.kernel.org
// @namespace    https://github.com/soda92/goodlore
// @version      1.0.0
// @description  A premium, modern, and highly interactive user experience for lore.kernel.org threads. Includes light/dark mode, thread filtering, hierarchical indent guidelines, visual reply templates, and beautiful typography.
// @author       Antigravity
// @match        https://lore.kernel.org/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject Stylesheet and Google Fonts
    const injectStylesAndFonts = () => {
        // Add Google Fonts
        const linkFonts = document.createElement('link');
        linkFonts.rel = 'stylesheet';
        linkFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap';
        document.head.appendChild(linkFonts);

        // Add SVG Icons Library (Lucide-like inline style helper)
        const styleElement = document.createElement('style');
        styleElement.id = 'goodlore-styles';
        styleElement.textContent = `
            :root {
                --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                --font-title: 'Plus Jakarta Sans', var(--font-sans);
                --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
                
                /* Dark Theme Variables (Default) */
                --bg-app: #0b0f19;
                --bg-card: #161b26;
                --bg-card-hover: #1f2638;
                --bg-input: #1e2533;
                --border-color: #242b3d;
                --text-primary: #f1f5f9;
                --text-secondary: #94a3b8;
                --text-muted: #64748b;
                --accent-color: #6366f1;
                --accent-hover: #4f46e5;
                --accent-bg: rgba(99, 102, 241, 0.15);
                --indent-line: #2e384e;
                
                --diff-add-bg: rgba(16, 185, 129, 0.12);
                --diff-add-text: #34d399;
                --diff-add-border: rgba(16, 185, 129, 0.2);
                --diff-del-bg: rgba(239, 68, 68, 0.12);
                --diff-del-text: #f87171;
                --diff-del-border: rgba(239, 68, 68, 0.2);
                
                --quote-bg: rgba(99, 102, 241, 0.04);
                --quote-border: #6366f1;
                --quote-text: #818cf8;
                
                --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
            }
            
            body.light-theme {
                /* Light Theme Variables */
                --bg-app: #f8fafc;
                --bg-card: #ffffff;
                --bg-card-hover: #f1f5f9;
                --bg-input: #f1f5f9;
                --border-color: #e2e8f0;
                --text-primary: #0f172a;
                --text-secondary: #475569;
                --text-muted: #94a3b8;
                --accent-color: #4f46e5;
                --accent-hover: #4338ca;
                --accent-bg: rgba(79, 70, 229, 0.08);
                --indent-line: #cbd5e1;
                
                --diff-add-bg: rgba(16, 185, 129, 0.08);
                --diff-add-text: #065f46;
                --diff-add-border: rgba(16, 185, 129, 0.15);
                --diff-del-bg: rgba(239, 68, 68, 0.08);
                --diff-del-text: #991b1b;
                --diff-del-border: rgba(239, 68, 68, 0.15);
                
                --quote-bg: rgba(79, 70, 229, 0.03);
                --quote-border: #4f46e5;
                --quote-text: #3730a3;
                
                --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
            }
            
            /* Apply global variables */
            body {
                background-color: var(--bg-app);
                color: var(--text-primary);
                font-family: var(--font-sans);
                margin: 0;
                padding: 0;
                transition: background-color 0.25s ease, color 0.25s ease;
                -webkit-font-smoothing: antialiased;
            }
            
            /* Hide default content on transformed thread pages */
            body.goodlore-transformed-page > *:not(#goodlore-app) {
                display: none !important;
            }
            
            /* Modern Scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: var(--border-color);
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: var(--text-muted);
            }
            
            /* Modernized Non-thread Pages (Global Styling upgrade) */
            body:not(.goodlore-transformed-page) {
                padding: 24px;
                max-width: 1200px;
                margin: 0 auto;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            
            body:not(.goodlore-transformed-page) pre {
                background-color: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 16px;
                overflow-x: auto;
                font-family: var(--font-mono);
                font-size: 0.9rem;
                box-shadow: var(--shadow-sm);
            }
            
            body:not(.goodlore-transformed-page) a {
                color: var(--accent-color);
                text-decoration: none;
                transition: color 0.2s;
            }
            
            body:not(.goodlore-transformed-page) a:hover {
                text-decoration: underline;
                color: var(--accent-hover);
            }
            
            body:not(.goodlore-transformed-page) input[type="text"] {
                background-color: var(--bg-input);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                border-radius: 6px;
                padding: 6px 12px;
                font-family: var(--font-sans);
                outline: none;
                transition: border-color 0.2s;
            }
            
            body:not(.goodlore-transformed-page) input[type="text"]:focus {
                border-color: var(--accent-color);
            }
            
            body:not(.goodlore-transformed-page) input[type="submit"] {
                background-color: var(--accent-color);
                color: white;
                border: none;
                border-radius: 6px;
                padding: 6px 16px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
                margin-left: 6px;
            }
            
            body:not(.goodlore-transformed-page) input[type="submit"]:hover {
                background-color: var(--accent-hover);
            }

            /* --- GOODLORE MODERN THREAD APP STYLES --- */
            #goodlore-app {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                background-color: var(--bg-app);
            }
            
            .goodlore-header {
                background-color: var(--bg-card);
                border-bottom: 1px solid var(--border-color);
                padding: 12px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 100;
                box-shadow: var(--shadow-sm);
            }
            
            .goodlore-logo {
                font-family: var(--font-title);
                font-size: 1.3rem;
                font-weight: 800;
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--text-primary);
                text-decoration: none;
                background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .goodlore-search {
                display: flex;
                align-items: center;
                background-color: var(--bg-input);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 6px 14px;
                width: 100%;
                max-width: 440px;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            
            .goodlore-search:focus-within {
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
            }
            
            .goodlore-search svg {
                color: var(--text-muted);
                flex-shrink: 0;
            }
            
            .goodlore-search input {
                background: transparent;
                border: none;
                color: var(--text-primary);
                font-family: var(--font-sans);
                font-size: 0.9rem;
                outline: none;
                width: 100%;
                margin-left: 8px;
            }
            
            .goodlore-header-actions {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .goodlore-btn {
                background-color: var(--bg-input);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: 7px 14px;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 500;
                cursor: pointer;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s;
                user-select: none;
            }
            
            .goodlore-btn:hover {
                background-color: var(--bg-card-hover);
                border-color: var(--text-muted);
            }
            
            .goodlore-btn:active {
                transform: scale(0.98);
            }
            
            .goodlore-btn-primary {
                background-color: var(--accent-color);
                color: white;
                border: none;
            }
            
            .goodlore-btn-primary:hover {
                background-color: var(--accent-hover);
                color: white;
            }
            
            .goodlore-btn-icon {
                padding: 7px;
                border-radius: 8px;
                aspect-ratio: 1;
            }
            
            /* Content Container layout */
            .goodlore-layout {
                display: flex;
                gap: 24px;
                padding: 24px;
                max-width: 1600px;
                width: 100%;
                margin: 0 auto;
                box-sizing: border-box;
                flex: 1;
            }
            
            @media (max-width: 1100px) {
                .goodlore-layout {
                    flex-direction: column;
                }
                .goodlore-sidebar {
                    width: 100% !important;
                    height: auto !important;
                    position: static !important;
                }
            }
            
            .goodlore-main {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .goodlore-sidebar {
                width: 380px;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                gap: 16px;
                position: sticky;
                top: 86px;
                height: calc(100vh - 120px);
            }
            
            /* Card Component Styles */
            .goodlore-card {
                background-color: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 24px;
                box-shadow: var(--shadow-sm);
            }
            
            /* Action Nav Bar */
            .action-nav-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .action-nav-group {
                display: flex;
                gap: 8px;
            }
            
            /* Message details card */
            .msg-header-section {
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            
            .msg-title-area {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 16px;
                margin-bottom: 16px;
            }
            
            .msg-subject {
                font-family: var(--font-title);
                font-size: 1.4rem;
                font-weight: 700;
                color: var(--text-primary);
                margin: 0;
                line-height: 1.35;
            }
            
            .msg-meta-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
            }
            
            .msg-sender-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .msg-avatar {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-title);
                font-weight: 700;
                font-size: 1.05rem;
                box-shadow: var(--shadow-sm);
            }
            
            .msg-sender-text {
                display: flex;
                flex-direction: column;
            }
            
            .msg-sender-name {
                font-weight: 600;
                color: var(--text-primary);
                font-size: 0.95rem;
            }
            
            .msg-sender-email {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }
            
            .msg-date-info {
                text-align: right;
                font-size: 0.8rem;
                color: var(--text-secondary);
            }
            
            .msg-date-relative {
                font-weight: 600;
                color: var(--accent-color);
                display: block;
                font-size: 0.85rem;
            }
            
            .msg-extra-meta-toggle {
                background: none;
                border: none;
                color: var(--accent-color);
                font-size: 0.8rem;
                font-weight: 500;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-top: 8px;
            }
            
            .msg-extra-meta-toggle:hover {
                background-color: var(--accent-bg);
            }
            
            .msg-metadata-grid {
                display: none;
                grid-template-columns: auto 1fr;
                gap: 8px 16px;
                font-size: 0.82rem;
                background-color: var(--bg-app);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 14px;
                margin-top: 12px;
                animation: slideDown 0.2s ease-out;
            }
            
            .msg-metadata-grid.expanded {
                display: grid;
            }
            
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .meta-label {
                font-weight: 600;
                color: var(--text-secondary);
            }
            
            .meta-value {
                color: var(--text-primary);
            }
            
            .meta-value a {
                color: var(--accent-color);
                text-decoration: none;
            }
            
            .meta-value a:hover {
                text-decoration: underline;
            }
            
            /* Message body rendering */
            .msg-body-container {
                position: relative;
            }
            
            .msg-body-actions {
                position: absolute;
                top: -12px;
                right: 0;
                z-index: 10;
                display: flex;
                gap: 8px;
            }
            
            .msg-body-pre {
                font-family: var(--font-mono);
                font-size: 0.92rem;
                line-height: 1.65;
                margin: 0;
                white-space: pre-wrap;
                word-wrap: break-word;
                color: var(--text-primary);
                overflow-x: auto;
                padding: 6px;
            }
            
            .msg-body-pre a {
                color: var(--accent-color);
                text-decoration: none;
                border-bottom: 1px dashed transparent;
            }
            
            .msg-body-pre a:hover {
                border-bottom-color: var(--accent-color);
                color: var(--accent-hover);
            }
            
            /* Quotations */
            .msg-body-pre .q {
                border-left: 3px solid var(--quote-border);
                padding-left: 14px;
                margin: 10px 0;
                color: var(--quote-text);
                background-color: var(--quote-bg);
                display: block;
                border-radius: 0 4px 4px 0;
            }
            
            /* Git Diffs styling in public-inbox */
            .msg-body-pre .add {
                background-color: var(--diff-add-bg);
                color: var(--diff-add-text);
                border-left: 3px solid var(--diff-add-border);
                display: inline-block;
                width: calc(100% - 3px);
                padding-left: 4px;
                border-radius: 0 2px 2px 0;
            }
            
            .msg-body-pre .del {
                background-color: var(--diff-del-bg);
                color: var(--diff-del-text);
                border-left: 3px solid var(--diff-del-border);
                display: inline-block;
                width: calc(100% - 3px);
                padding-left: 4px;
                border-radius: 0 2px 2px 0;
            }
            
            /* Sidebar Thread Tree styles */
            .sidebar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
            }
            
            .sidebar-title {
                font-family: var(--font-title);
                font-size: 1.05rem;
                font-weight: 700;
                margin: 0;
                color: var(--text-primary);
            }
            
            .sidebar-count {
                font-size: 0.75rem;
                background-color: var(--accent-bg);
                color: var(--accent-color);
                padding: 3px 8px;
                border-radius: 12px;
                font-weight: 600;
            }
            
            .thread-search-box {
                margin-bottom: 12px;
            }
            
            .thread-tree-scroll {
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding-right: 4px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                background-color: var(--bg-card);
                padding: 10px;
            }
            
            .thread-tree-item-wrapper {
                position: relative;
                min-height: 48px;
            }
            
            .thread-tree-item {
                position: relative;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 0.82rem;
                cursor: pointer;
                transition: all 0.15s ease;
                text-decoration: none;
                color: var(--text-primary);
                display: block;
                border: 1px solid transparent;
            }
            
            .thread-tree-item:hover {
                background-color: var(--bg-card-hover);
                border-color: var(--border-color);
            }
            
            .thread-tree-item.active {
                background-color: var(--accent-bg);
                border-color: var(--accent-color);
                font-weight: 600;
            }
            
            .thread-tree-item.not-found {
                color: var(--text-muted);
                opacity: 0.55;
                cursor: not-allowed;
            }
            
            .indent-guide {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 1px;
                background-color: var(--indent-line);
                opacity: 0.7;
                pointer-events: none;
            }
            
            .tree-item-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 3px;
                gap: 8px;
            }
            
            .tree-item-author {
                font-weight: 600;
                color: var(--text-primary);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .thread-tree-item.active .tree-item-author {
                color: var(--accent-color);
            }
            
            .tree-item-date {
                font-size: 0.72rem;
                color: var(--text-muted);
                flex-shrink: 0;
            }
            
            .tree-item-subject {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--text-secondary);
                font-size: 0.78rem;
            }
            
            .thread-tree-item.active .tree-item-subject {
                color: var(--text-primary);
            }
            
            .current-badge {
                font-size: 0.65rem;
                background-color: var(--accent-color);
                color: white;
                padding: 1px 4px;
                border-radius: 4px;
                margin-left: 6px;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            /* Reply Section Styling */
            .reply-tabs-header {
                display: flex;
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 16px;
                gap: 4px;
            }
            
            .reply-tab-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                padding: 8px 16px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
                outline: none;
            }
            
            .reply-tab-btn:hover {
                color: var(--text-primary);
            }
            
            .reply-tab-btn.active {
                color: var(--accent-color);
                border-bottom-color: var(--accent-color);
            }
            
            .reply-tab-content {
                display: none;
            }
            
            .reply-tab-content.active {
                display: block;
                animation: fadeIn 0.2s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .copy-container {
                position: relative;
                margin-top: 10px;
            }
            
            .copy-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background-color: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: #e2e8f0;
                padding: 5px 10px;
                border-radius: 6px;
                font-size: 0.72rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                backdrop-filter: blur(4px);
            }
            
            .copy-btn:hover {
                background-color: rgba(255, 255, 255, 0.16);
                border-color: rgba(255, 255, 255, 0.24);
                color: white;
            }
            
            .code-block {
                background-color: #0b0f19 !important;
                border-radius: 8px;
                padding: 16px;
                overflow-x: auto;
                font-family: var(--font-mono);
                font-size: 0.82rem;
                color: #e2e8f0;
                margin: 0;
                border: 1px solid #242b3d;
                line-height: 1.5;
            }
            
            /* Toast Message Component */
            .goodlore-toast {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background-color: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 0.88rem;
                font-weight: 500;
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: 8px;
                z-index: 1000;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
            }
            
            .goodlore-toast.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(styleElement);
    };

    // 2. Helper functions for parsing content
    const parseSender = (fromStr) => {
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
        email = email.split('?')[0].trim(); // Remove mailto parameters
        
        if (!name) {
            name = email.split('@')[0] || 'Unknown';
        }
        
        // Initials for avatar
        const initials = name
            .split(/\s+/)
            .map(n => n[0])
            .filter(Boolean)
            .join('')
            .substring(0, 2)
            .toUpperCase();
            
        return { name, email, initials: initials || '?' };
    };

    const formatEmailDate = (dateStr) => {
        const cleanDate = dateStr.replace(/<a[\s\S]*?\/a>/gi, '').replace(/\t/g, ' ').trim();
        try {
            const d = new Date(cleanDate);
            if (isNaN(d.getTime())) return { absolute: cleanDate, relative: '' };
            
            const now = new Date();
            const diffMs = now - d;
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

    const parseMessageId = (msgIdHtml) => {
        const temp = document.createElement('div');
        temp.innerHTML = msgIdHtml;
        const text = temp.innerText;
        const match = text.match(/<([^>]+)>/) || text.match(/&lt;([^&]+)&gt;/) || [null, text];
        return (match[1] || text).split('(')[0].trim();
    };

    const formatRecipients = (recipientsHtml) => {
        if (!recipientsHtml) return '';
        // Split by commas, taking care not to split inside tags
        const div = document.createElement('div');
        div.innerHTML = recipientsHtml;
        
        // Find links
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

    // Parse the hierarchical tree of the thread overview
    const parseTreeLine = (lineHtml) => {
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
            return null; // Not a valid tree node
        }
        
        const prefixLength = anchorIndex;
        
        if (isNotFound) {
            const msgIdMatch = cleanHtml.match(/&lt;(.*?)&gt;/);
            const msgId = msgIdMatch ? msgIdMatch[1] : '';
            return {
                type: 'not-found',
                prefixLength: prefixLength,
                messageId: msgId,
                isCurrent: false
            };
        }
        
        // Extract DateTime
        const dateMatch = cleanHtml.match(/^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);
        const dateTime = dateMatch ? dateMatch[1] : '';
        
        // Extract Anchor details
        const anchorMatch = cleanHtml.match(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/i);
        if (!anchorMatch) return null;
        
        const href = anchorMatch[1];
        let subject = anchorMatch[2];
        
        // Extract Author name
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

    // Show toast message
    const showToast = (message) => {
        let toast = document.getElementById('goodlore-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'goodlore-toast';
            toast.className = 'goodlore-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> ${message}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    };

    // Theme Switcher manager
    const initTheme = () => {
        const savedTheme = localStorage.getItem('goodlore-theme');
        const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && systemLight)) {
            document.body.classList.add('light-theme');
        }
        
        // Listen for system theme change if no override is saved
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            if (!localStorage.getItem('goodlore-theme')) {
                if (e.matches) {
                    document.body.classList.add('light-theme');
                } else {
                    document.body.classList.remove('light-theme');
                }
            }
        });
    };

    const toggleTheme = () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            localStorage.setItem('goodlore-theme', 'dark');
            showToast('Switched to Dark Mode');
        } else {
            document.body.classList.add('light-theme');
            localStorage.setItem('goodlore-theme', 'light');
            showToast('Switched to Light Mode');
        }
    };

    // 3. Transformation Main Logic
    const transformPage = () => {
        const preB = document.getElementById('b');
        if (!preB) return; // Not a thread message page, global style upgrade handles it

        // Extract metadata, content, and instructions
        const originalHtml = preB.innerHTML;
        const lines = originalHtml.split('\n');
        
        const rawHeaders = {
            from: '',
            to: '',
            cc: '',
            subject: '',
            date: '',
            'message-id': '',
            'in-reply-to': ''
        };
        
        let bodyStartIndex = 0;
        let currentHeaderKey = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === '') {
                bodyStartIndex = i + 1;
                break;
            }
            
            const headerMatch = line.match(/^([A-Za-z0-9\-]+):\s*(.*)/i);
            if (headerMatch) {
                currentHeaderKey = headerMatch[1].toLowerCase();
                if (rawHeaders.hasOwnProperty(currentHeaderKey)) {
                    rawHeaders[currentHeaderKey] = headerMatch[2];
                }
            } else if (currentHeaderKey && /^\s+/.test(line)) {
                rawHeaders[currentHeaderKey] += '\n' + line;
            } else {
                bodyStartIndex = i;
                break;
            }
        }
        
        const bodyHtml = lines.slice(bodyStartIndex).join('\n');
        
        // Extract navigation links & thread overview
        const preElements = Array.from(document.querySelectorAll('pre'));
        const threadPre = preElements.find(el => el.innerHTML.includes('Thread overview:'));
        
        let navLinks = [];
        let treeNodes = [];
        let threadHeadingHtml = 'Thread Overview';
        let mboxGzUrl = '';
        
        if (threadPre) {
            const parts = threadPre.innerHTML.split(/<b>Thread overview:/i);
            
            // Part 1: navigation links
            const navDiv = document.createElement('div');
            navDiv.innerHTML = parts[0];
            navLinks = Array.from(navDiv.querySelectorAll('a')).map(a => ({
                text: a.innerText.trim(),
                href: a.href,
                rel: a.getAttribute('rel') || ''
            }));
            
            // Part 2: Thread overview list
            if (parts[1]) {
                const threadParts = parts[1].split('\n');
                const titleLine = threadParts[0]; // e.g. " </b>94+ messages / expand[flat|nested]..."
                
                // Keep links in heading (expand flat/nested, etc.)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = titleLine;
                threadHeadingHtml = 'Thread Overview: ' + tempDiv.innerHTML.replace('</b>', '').trim();
                
                // Try to find mbox.gz link
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
                
                // Set relative depth levels
                treeNodes.forEach(node => {
                    node.level = minPrefix === Infinity ? 0 : Math.round((node.prefixLength - minPrefix) / 2);
                });
            }
        }
        
        // Extract reply instructions from #R
        const preR = document.getElementById('R');
        let mboxUrl = '';
        let gitCommand = '';
        let mailtoUrl = '';
        
        if (preR) {
            const mboxLink = preR.querySelector('a[href$="/raw"]');
            mboxUrl = mboxLink ? mboxLink.href : '';
            
            const rText = preR.innerText;
            const gitMatch = rText.match(/(git send-email[\s\S]*?\/path\/to\/YOUR_REPLY)/);
            gitCommand = gitMatch ? gitMatch[1].trim() : '';
            
            const mailtoLink = preR.querySelector('a[href^="mailto:"]');
            mailtoUrl = mailtoLink ? mailtoLink.href : '';
        }
        
        // Format headers for rendering
        const sender = parseSender(rawHeaders.from);
        const dateObj = formatEmailDate(rawHeaders.date);
        const subjectText = rawHeaders.subject.replace(/<[^>]*>/g, '').trim();
        const messageId = parseMessageId(rawHeaders['message-id']);
        
        // Mark page as transformed
        document.body.classList.add('goodlore-transformed-page');
        
        // Parse search box action & query
        let formAction = 'https://lore.kernel.org/all/';
        let searchQuery = '';
        const originalForm = document.querySelector('form');
        if (originalForm) {
            formAction = originalForm.action;
            const qInput = originalForm.querySelector('input[name="q"]');
            if (qInput) searchQuery = qInput.value;
        }

        // Render Action Buttons
        const prevMsg = navLinks.find(l => l.text.toLowerCase() === 'prev' || l.rel === 'prev');
        const nextMsg = navLinks.find(l => l.text.toLowerCase() === 'next' || l.rel === 'next');
        const parentMsg = navLinks.find(l => l.text.toLowerCase() === 'parent');
        
        let actionButtonsHtml = '';
        if (prevMsg) {
            actionButtonsHtml += `<a href="${prevMsg.href}" class="goodlore-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform:rotate(180deg);"><polyline points="9 18 15 12 9 6"></polyline></svg> Prev</a>`;
        }
        if (nextMsg) {
            actionButtonsHtml += `<a href="${nextMsg.href}" class="goodlore-btn">Next <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></a>`;
        }
        if (parentMsg) {
            actionButtonsHtml += `<a href="${parentMsg.href}" class="goodlore-btn">Parent</a>`;
        }
        actionButtonsHtml += `<button class="goodlore-btn goodlore-btn-primary" id="jump-reply-btn">Reply</button>`;
        
        // CC and To elements HTML
        const toBadges = formatRecipients(rawHeaders.to);
        const ccBadges = formatRecipients(rawHeaders.cc);
        
        // Build New App HTML
        const appContainer = document.createElement('div');
        appContainer.id = 'goodlore-app';
        appContainer.innerHTML = `
            <header class="goodlore-header">
                <a href="${formAction}" class="goodlore-logo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    GoodLore
                </a>
                
                <form action="${formAction}" method="get" class="goodlore-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" name="q" value="${searchQuery}" placeholder="Search kernel threads (e.g. subsystem, author, diff)...">
                </form>
                
                <div class="goodlore-header-actions">
                    <button class="goodlore-btn goodlore-btn-icon" id="theme-toggle-btn" title="Toggle Light/Dark Theme">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="sun-icon" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </button>
                    <a href="${formAction}../_/text/help/" class="goodlore-btn">Help</a>
                </div>
            </header>
            
            <div class="goodlore-layout">
                <main class="goodlore-main">
                    <!-- Action Bar -->
                    <div class="goodlore-card action-nav-bar">
                        <div class="action-nav-group">
                            ${actionButtonsHtml}
                        </div>
                        <div class="action-nav-group">
                            <button class="goodlore-btn" id="copy-email-btn" title="Copy raw message content for git am">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                                Copy Message Text
                            </button>
                            <a href="${mboxUrl || '#'}" class="goodlore-btn" download>Raw Email</a>
                        </div>
                    </div>
                    
                    <!-- Message Card -->
                    <article class="goodlore-card">
                        <div class="msg-header-section">
                            <div class="msg-title-area">
                                <h1 class="msg-subject">${subjectText}</h1>
                            </div>
                            <div class="msg-meta-row">
                                <div class="msg-sender-info">
                                    <div class="msg-avatar">${sender.initials}</div>
                                    <div class="msg-sender-text">
                                        <span class="msg-sender-name">${sender.name}</span>
                                        <span class="msg-sender-email">${sender.email}</span>
                                    </div>
                                </div>
                                <div class="msg-date-info">
                                    <span class="msg-date-relative">${dateObj.relative}</span>
                                    <span class="msg-date-absolute">${dateObj.absolute}</span>
                                </div>
                            </div>
                            
                            <button class="msg-extra-meta-toggle" id="meta-toggle-btn">
                                <span>Show headers & recipients</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            
                            <div class="msg-metadata-grid" id="metadata-grid">
                                <span class="meta-label">To:</span>
                                <div class="meta-value">${toBadges || 'None'}</div>
                                
                                <span class="meta-label">Cc:</span>
                                <div class="meta-value">${ccBadges || 'None'}</div>
                                
                                <span class="meta-label">Message-ID:</span>
                                <div class="meta-value" style="display:flex; align-items:center; gap:8px;">
                                    <code style="font-family:var(--font-mono); font-size:0.78rem; background:var(--bg-input); padding:2px 6px; border-radius:4px; border:1px solid var(--border-color);">${messageId}</code>
                                    <button class="goodlore-btn" id="copy-msgid-btn" style="padding:2px 8px; font-size:0.7rem; border-radius:4px;">Copy</button>
                                </div>
                                
                                ${rawHeaders['in-reply-to'] ? `
                                    <span class="meta-label">In-Reply-To:</span>
                                    <div class="meta-value">${rawHeaders['in-reply-to']}</div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="msg-body-container">
                            <pre class="msg-body-pre">${bodyHtml}</pre>
                        </div>
                    </article>
                    
                    <!-- Reply Instructions Card -->
                    <div class="goodlore-card" id="reply-instructions-card">
                        <h2 style="font-family:var(--font-title); font-size:1.15rem; margin-top:0; margin-bottom:14px; color:var(--text-primary);">Reply to this thread</h2>
                        <div class="reply-tabs-header">
                            <button class="reply-tab-btn active" data-tab="git">Git send-email</button>
                            <button class="reply-tab-btn" data-tab="mailto">Mailto link</button>
                            <button class="reply-tab-btn" data-tab="mbox">Mbox file</button>
                        </div>
                        
                        <!-- Tab: Git -->
                        <div class="reply-tab-content active" id="reply-tab-git">
                            <p style="font-size:0.85rem; margin-top:0; margin-bottom:12px; color:var(--text-secondary);">
                                Copy and run this command in your Linux repository to post your reply publicly. Replace <code>/path/to/YOUR_REPLY</code> with your draft plain-text file.
                            </p>
                            <div class="copy-container">
                                <button class="copy-btn" id="copy-git-btn">Copy Command</button>
                                <pre class="code-block" style="white-space:pre-wrap; word-break:break-all;">${gitCommand || 'No git command found'}</pre>
                            </div>
                        </div>
                        
                        <!-- Tab: Mailto -->
                        <div class="reply-tab-content" id="reply-tab-mailto">
                            <p style="font-size:0.85rem; margin-top:0; margin-bottom:16px; color:var(--text-secondary);">
                                Open this conversation in your system's default email client. Senders, CCs, Subject, and In-Reply-To headers will be pre-configured.
                            </p>
                            <a href="${mailtoUrl}" class="goodlore-btn goodlore-btn-primary">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                Reply via Email Client
                            </a>
                        </div>
                        
                        <!-- Tab: Mbox -->
                        <div class="reply-tab-content" id="reply-tab-mbox">
                            <p style="font-size:0.85rem; margin-top:0; margin-bottom:16px; color:var(--text-secondary);">
                                Import the message block directly into text-based email clients or local mail tools.
                            </p>
                            <div style="display:flex; gap:10px;">
                                <a href="${mboxUrl}" class="goodlore-btn" download>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Download Message Mbox
                                </a>
                                ${mboxGzUrl ? `
                                    <a href="${mboxGzUrl}" class="goodlore-btn" download>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        Download Entire Thread (.mbox.gz)
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </main>
                
                <aside class="goodlore-sidebar">
                    <div class="sidebar-header">
                        <h2 class="sidebar-title">Thread Conversation</h2>
                        <span class="sidebar-count" id="thread-msg-count">${treeNodes.length} messages</span>
                    </div>
                    
                    <div class="thread-search-box">
                        <div class="goodlore-search" style="padding:4px 10px; max-width:100%;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" id="sidebar-filter" placeholder="Filter replies by author or subject...">
                        </div>
                    </div>
                    
                    <div class="thread-tree-scroll" id="thread-tree-container">
                        <!-- Tree nodes will render here -->
                    </div>
                </aside>
            </div>
        `;
        
        document.body.appendChild(appContainer);
        
        // Render Thread tree nodes
        const treeContainer = document.getElementById('thread-tree-container');
        if (treeContainer && treeNodes.length > 0) {
            treeNodes.forEach(node => {
                const wrapper = document.createElement('div');
                wrapper.className = 'thread-tree-item-wrapper';
                
                // Add vertical guides lines
                let guidesHtml = '';
                for (let i = 0; i < node.level; i++) {
                    guidesHtml += `<div class="indent-guide" style="left: ${i * 12 + 16}px;"></div>`;
                }
                
                const relativeMarginLeft = node.level * 12;
                
                if (node.type === 'not-found') {
                    wrapper.innerHTML = `
                        ${guidesHtml}
                        <div class="thread-tree-item not-found" style="margin-left: ${relativeMarginLeft}px;">
                            <div class="tree-item-meta">
                                <span class="tree-item-author">Missing Reply</span>
                            </div>
                            <div class="tree-item-subject">&lt;${node.messageId}&gt;</div>
                        </div>
                    `;
                } else {
                    wrapper.innerHTML = `
                        ${guidesHtml}
                        <a href="${node.href}" class="thread-tree-item ${node.isCurrent ? 'active' : ''}" style="margin-left: ${relativeMarginLeft}px;">
                            <div class="tree-item-meta">
                                <span class="tree-item-author">${node.author || 'Unknown'} ${node.isCurrent ? '<span class="current-badge">Here</span>' : ''}</span>
                                <span class="tree-item-date">${node.dateTime.split(' ')[1] || node.dateTime}</span>
                            </div>
                            <div class="tree-item-subject">${node.subject || '(no subject)'}</div>
                        </a>
                    `;
                }
                treeContainer.appendChild(wrapper);
            });
            
            // Scroll the active node in thread view into screen center
            setTimeout(() => {
                const activeItem = treeContainer.querySelector('.thread-tree-item.active');
                if (activeItem) {
                    activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }, 300);
        }
        
        // Register Event Listeners
        
        // 1. Theme toggle icons updater
        const updateThemeIcons = () => {
            const isLight = document.body.classList.contains('light-theme');
            document.getElementById('sun-icon').style.display = isLight ? 'none' : 'block';
            document.getElementById('moon-icon').style.display = isLight ? 'block' : 'none';
        };
        updateThemeIcons();
        
        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            toggleTheme();
            updateThemeIcons();
        });
        
        // 2. Extra metadata dropdown toggle
        const metaToggle = document.getElementById('meta-toggle-btn');
        const metaGrid = document.getElementById('metadata-grid');
        metaToggle.addEventListener('click', () => {
            const isExpanded = metaGrid.classList.toggle('expanded');
            metaToggle.querySelector('span').innerText = isExpanded ? 'Hide headers & recipients' : 'Show headers & recipients';
            metaToggle.querySelector('svg').style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            metaToggle.querySelector('svg').style.transition = 'transform 0.2s';
        });
        
        // 3. Action copy headers text
        document.getElementById('copy-email-btn').addEventListener('click', function() {
            // Reconstruct the full email containing headers and body exactly
            const rawText = preB.innerText;
            copyToClipboard(rawText, this, 'Copied Email!');
        });
        
        // 4. Copy Message ID button
        document.getElementById('copy-msgid-btn').addEventListener('click', function() {
            copyToClipboard(messageId, this, 'Copied!');
        });
        
        // 5. Jump to reply scroll trigger
        document.getElementById('jump-reply-btn').addEventListener('click', () => {
            document.getElementById('reply-instructions-card').scrollIntoView({ behavior: 'smooth' });
        });
        
        // 6. Copy Git send-email command
        document.getElementById('copy-git-btn').addEventListener('click', function() {
            copyToClipboard(gitCommand, this, 'Copied Command!');
        });
        
        // 7. Reply tab switches
        const tabBtns = document.querySelectorAll('.reply-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.reply-tab-content').forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`reply-tab-${tabId}`).classList.add('active');
            });
        });
        
        // 8. Sidebar filter input search list
        const filterInput = document.getElementById('sidebar-filter');
        filterInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const items = treeContainer.querySelectorAll('.thread-tree-item-wrapper');
            let countVisible = 0;
            
            items.forEach(wrapper => {
                const item = wrapper.querySelector('.thread-tree-item');
                if (!item) return;
                const author = (item.querySelector('.tree-item-author')?.innerText || '').toLowerCase();
                const subject = (item.querySelector('.tree-item-subject')?.innerText || '').toLowerCase();
                
                if (author.includes(query) || subject.includes(query)) {
                    wrapper.style.display = 'block';
                    countVisible++;
                } else {
                    wrapper.style.display = 'none';
                }
            });
            
            document.getElementById('thread-msg-count').innerText = `${countVisible} found`;
        });
    };

    // Generic copy utility
    function copyToClipboard(text, btnElement, successText) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHtml = btnElement.innerHTML;
            btnElement.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px;"><polyline points="20 6 9 17 4 12"></polyline></svg> ${successText}`;
            btnElement.style.borderColor = '#10b981';
            btnElement.style.color = '#10b981';
            
            setTimeout(() => {
                btnElement.innerHTML = originalHtml;
                btnElement.style.borderColor = '';
                btnElement.style.color = '';
            }, 1800);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Failed to copy to clipboard.');
        });
    }

    // 4. Initialize Userscript
    const init = () => {
        injectStylesAndFonts();
        initTheme();
        
        // Only run thread layout transformation if this is a thread message view (has element #b)
        if (document.getElementById('b')) {
            transformPage();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
