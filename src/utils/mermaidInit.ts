// Helper function to initialize Mermaid diagrams with proper configuration
export const initMermaid = (isDarkMode: boolean = true) => {
  if (typeof window !== 'undefined' && typeof window.mermaid !== 'undefined') {
    window.mermaid.initialize({
      startOnLoad: true,
      theme: isDarkMode ? 'dark' : 'default',
      securityLevel: 'loose',
      fontSize: 16,
      fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
        padding: 10,
        rankSpacing: 60,
        nodeSpacing: 40
      },
      sequence: {
        mirrorActors: false,
        wrap: true,
        showSequenceNumbers: false,
        boxMargin: 10,
        noteMargin: 10,
        messageMargin: 35,
        messageAlign: 'center'
      },
      gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        barGap: 4,
        topPadding: 50,
        sidePadding: 75,
        gridLineStartPadding: 35
      }
    });
  }
};

// Add Mermaid rendering for React components
export const renderMermaidDiagrams = () => {
  if (typeof window !== 'undefined' && typeof window.mermaid !== 'undefined') {
    setTimeout(() => {
      window.mermaid.run({
        querySelector: '.mermaid:not([data-processed="true"])'
      });
    }, 200);
  }
};

// Ensure mermaid is properly typed
declare global {
  interface Window {
    mermaid: {
      initialize: (config: any) => void;
      run: (options: { querySelector: string }) => void;
    };
  }
}