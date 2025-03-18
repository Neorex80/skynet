// Helper to format a date for display
export const formatDate = (date: Date): string => {
  const now = new Date();
  const dateObj = new Date(date);
  
  // If it's today, show time
  if (dateObj.toDateString() === now.toDateString()) {
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If it's this year, show month and day
  if (dateObj.getFullYear() === now.getFullYear()) {
    return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // Otherwise show date with year
  return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

// Language display mapping for better readability
export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  py: 'python',
  python: 'python',
  rb: 'ruby',
  ruby: 'ruby',
  go: 'go',
  java: 'java',
  c: 'c',
  cpp: 'c++',
  cs: 'c#',
  csharp: 'c#',
  php: 'php',
  rs: 'rust',
  rust: 'rust',
  swift: 'swift',
  kt: 'kotlin',
  kotlin: 'kotlin',
  scala: 'scala',
  sh: 'shell',
  bash: 'bash',
  zsh: 'zsh',
  shell: 'shell',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  less: 'less',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  xml: 'xml',
  sql: 'sql',
  graphql: 'graphql',
  md: 'markdown',
  markdown: 'markdown',
  dockerfile: 'dockerfile',
  docker: 'dockerfile',
  tex: 'latex',
  latex: 'latex',
  r: 'r',
  diff: 'diff',
  plaintext: 'text',
  text: 'text',
  txt: 'text',
};

// Helper to enhance code blocks with language labels and copy buttons
export const enhanceCodeBlocks = (container: HTMLDivElement | null) => {
  if (!container) return;
  
  const preElements = container.querySelectorAll('pre');
  preElements?.forEach(pre => {
    // Make sure we don't add multiple labels/buttons
    if (pre.querySelector('.code-language-label')) return;

    const code = pre.querySelector('code');
    if (!code) return;

    // Enhanced language detection with multiple patterns
    let language = 'text';
    
    // Try to detect from class names
    const classMatch = code.className.match(/(?:language|lang)-(\w+)/);
    if (classMatch && classMatch[1]) {
      language = classMatch[1].toLowerCase();
    }
    
    // Try to detect from data attributes
    const dataLang = code.getAttribute('data-language') || code.getAttribute('data-lang');
    if (dataLang) {
      language = dataLang.toLowerCase();
    }
    
    // Get the display name with fallback
    const displayName = LANGUAGE_DISPLAY_NAMES[language] || language;
    
    // Add language label
    const label = document.createElement('div');
    label.className = 'code-language-label';
    label.textContent = displayName;
    pre.appendChild(label);

    // Add copy button
    const copyButton = document.createElement('div');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';
    copyButton.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(code.textContent || '')
        .then(() => {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        })
        .catch(console.error);
    };
    pre.appendChild(copyButton);
  });
};