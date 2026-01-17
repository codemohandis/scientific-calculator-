/**
 * Responsive Design Utilities
 * Viewport detection and breakpoint management for responsive layout
 *
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1199px
 * - Desktop: >= 1200px
 */

/**
 * Breakpoint configuration
 * Using industry-standard breakpoints (Bootstrap, Material Design, Tailwind)
 */
const BREAKPOINTS = {
  MOBILE: 0,      // Base: < 768px
  TABLET: 768,    // Medium: 768px - 1199px
  DESKTOP: 1200   // Large: >= 1200px
};

/**
 * Get current viewport width
 * @returns {number} Current window inner width in pixels
 */
export function getViewportWidth() {
  return window.innerWidth;
}

/**
 * Get current viewport height
 * @returns {number} Current window inner height in pixels
 */
export function getViewportHeight() {
  return window.innerHeight;
}

/**
 * Determine current breakpoint based on viewport width
 * @returns {string} One of: 'mobile', 'tablet', 'desktop'
 */
export function getCurrentBreakpoint() {
  const width = getViewportWidth();

  if (width < BREAKPOINTS.TABLET) {
    return 'mobile';
  } else if (width < BREAKPOINTS.DESKTOP) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Check if viewport matches a specific breakpoint
 * @param {string} breakpoint - Breakpoint to check: 'mobile', 'tablet', or 'desktop'
 * @returns {boolean} True if viewport is at or above the breakpoint
 */
export function isBreakpoint(breakpoint) {
  return getCurrentBreakpoint() === breakpoint;
}

/**
 * Check if viewport is at or above mobile breakpoint
 * @returns {boolean} True if width >= 0px (always true)
 */
export function isMobileOrLarger() {
  return getViewportWidth() >= BREAKPOINTS.MOBILE;
}

/**
 * Check if viewport is at or above tablet breakpoint
 * @returns {boolean} True if width >= 768px
 */
export function isTabletOrLarger() {
  return getViewportWidth() >= BREAKPOINTS.TABLET;
}

/**
 * Check if viewport is at or above desktop breakpoint
 * @returns {boolean} True if width >= 1200px
 */
export function isDesktopOrLarger() {
  return getViewportWidth() >= BREAKPOINTS.DESKTOP;
}

/**
 * Check if viewport is smaller than desktop (mobile or tablet)
 * @returns {boolean} True if width < 1200px
 */
export function isSmallScreen() {
  return getViewportWidth() < BREAKPOINTS.DESKTOP;
}

/**
 * Register a listener for breakpoint changes
 * Callback fires when viewport crosses a breakpoint threshold
 *
 * @param {Function} callback - Called with {breakpoint, width} when breakpoint changes
 * @returns {Function} Unsubscribe function to remove listener
 *
 * @example
 * const unsubscribe = onBreakpointChange(({breakpoint, width}) => {
 *   console.log(`Breakpoint changed to: ${breakpoint} at ${width}px`);
 * });
 * // Later: unsubscribe();
 */
export function onBreakpointChange(callback) {
  let previousBreakpoint = getCurrentBreakpoint();
  let resizeTimeout;

  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const currentBreakpoint = getCurrentBreakpoint();
      if (currentBreakpoint !== previousBreakpoint) {
        previousBreakpoint = currentBreakpoint;
        callback({
          breakpoint: currentBreakpoint,
          width: getViewportWidth(),
          height: getViewportHeight()
        });
      }
    }, 100); // Debounce: 100ms
  };

  window.addEventListener('resize', handleResize);

  // Return unsubscribe function
  return () => {
    clearTimeout(resizeTimeout);
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Register a listener for viewport resize events
 * Callback fires on every resize (debounced)
 *
 * @param {Function} callback - Called with {width, height} on resize
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 100)
 * @returns {Function} Unsubscribe function to remove listener
 *
 * @example
 * const unsubscribe = onResize(({width, height}) => {
 *   console.log(`Viewport: ${width}x${height}`);
 * }, 150);
 * // Later: unsubscribe();
 */
export function onResize(callback, debounceMs = 100) {
  let resizeTimeout;

  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      callback({
        width: getViewportWidth(),
        height: getViewportHeight()
      });
    }, debounceMs);
  };

  window.addEventListener('resize', handleResize);

  // Return unsubscribe function
  return () => {
    clearTimeout(resizeTimeout);
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Use media query to detect viewport
 * Uses CSS media queries as primary detection mechanism
 *
 * @param {string} query - CSS media query string
 * @returns {Object} MediaQueryList object with matches property
 *
 * @example
 * const mediaQuery = useMediaQuery('(min-width: 768px)');
 * console.log(mediaQuery.matches); // true if tablet or larger
 */
export function useMediaQuery(query) {
  return window.matchMedia(query);
}

/**
 * Create a media query listener
 * Recommended over direct window.matchMedia for easier cleanup
 *
 * @param {string} query - CSS media query string
 * @param {Function} callback - Called with {matches} when media query state changes
 * @returns {Function} Unsubscribe function to remove listener
 *
 * @example
 * const unsubscribe = onMediaQueryChange('(min-width: 768px)', ({matches}) => {
 *   console.log(`Is tablet or larger: ${matches}`);
 * });
 * // Later: unsubscribe();
 */
export function onMediaQueryChange(query, callback) {
  const mediaQuery = window.matchMedia(query);

  const handleChange = (e) => {
    callback({ matches: e.matches });
  };

  // Use addEventListener for better browser support
  mediaQuery.addEventListener('change', handleChange);

  // Return unsubscribe function
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}

/**
 * Get all breakpoint information
 * @returns {Object} Breakpoint configuration object
 */
export function getBreakpoints() {
  return { ...BREAKPOINTS };
}

/**
 * Common media queries (for convenience)
 */
export const MEDIA_QUERIES = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1199px)',
  desktop: '(min-width: 1200px)',
  tabletOrLarger: '(min-width: 768px)',
  desktopOrLarger: '(min-width: 1200px)',
  smallerThanDesktop: '(max-width: 1199px)',
  touchDevice: '(hover: none) and (pointer: coarse)',
  highDPI: '(min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  darkMode: '(prefers-color-scheme: dark)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)'
};

/**
 * Usage Examples:
 *
 * // Get current breakpoint
 * const breakpoint = getCurrentBreakpoint(); // 'mobile', 'tablet', or 'desktop'
 *
 * // Check specific breakpoint
 * if (isTabletOrLarger()) {
 *   // Tablet or desktop layout
 * }
 *
 * // Listen for breakpoint changes
 * const unsubscribe = onBreakpointChange(({breakpoint, width}) => {
 *   console.log(`Changed to ${breakpoint} at ${width}px`);
 * });
 *
 * // Listen for all resize events
 * const unsubscribe = onResize(({width, height}) => {
 *   console.log(`Viewport: ${width}x${height}`);
 * });
 *
 * // Use media queries directly
 * const darkMode = useMediaQuery(MEDIA_QUERIES.darkMode);
 * console.log(darkMode.matches); // true if dark mode enabled
 */
