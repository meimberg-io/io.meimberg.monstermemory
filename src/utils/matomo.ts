// Matomo tracking utilities
declare global {
  interface Window {
    _paq: any[];
  }
}

export const trackEvent = (category: string, action: string, name?: string, value?: number) => {
  if (typeof window !== 'undefined' && window._paq) {
    window._paq.push(['trackEvent', category, action, name, value]);
  }
};

export const trackPageView = (customTitle?: string) => {
  if (typeof window !== 'undefined' && window._paq) {
    if (customTitle) {
      window._paq.push(['setCustomUrl', window.location.href]);
      window._paq.push(['setDocumentTitle', customTitle]);
    }
    window._paq.push(['trackPageView']);
  }
};

export const trackGoal = (goalId: number, customRevenue?: number) => {
  if (typeof window !== 'undefined' && window._paq) {
    window._paq.push(['trackGoal', goalId, customRevenue]);
  }
};

// Game-specific tracking functions
export const trackGameStart = (gridSize: number) => {
  trackEvent('Game', 'Start', `Grid ${gridSize}x${gridSize}`, gridSize);
};

export const trackGameComplete = (gridSize: number, moves: number, timeSeconds: number) => {
  trackEvent('Game', 'Complete', `Grid ${gridSize}x${gridSize}`, timeSeconds);
  trackEvent('Game', 'Performance', `Moves for ${gridSize}x${gridSize}`, moves);
};

export const trackGridSizeChange = (fromSize: number, toSize: number) => {
  trackEvent('Game', 'GridSizeChange', `${fromSize}x${fromSize} to ${toSize}x${toSize}`);
};
