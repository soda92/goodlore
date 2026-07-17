import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { TreeNode } from '../utils/parser';

interface SidebarProps {
  treeNodes: TreeNode[];
}

export const Sidebar = ({ treeNodes }: SidebarProps) => {
  const [filterText, setFilterText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeItem = containerRef.current.querySelector('.thread-tree-item.active');
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
