/**
 * CalculatorLayout Component
 * Main container for responsive multi-column calculator layout
 * Manages CSS Grid system and responsive breakpoint classes
 *
 * Structure:
 * - Mobile (<768px): 1 column
 * - Tablet (768-1199px): 2 columns
 * - Desktop (≥1200px): 3 columns
 */

/**
 * Create and return the main calculator layout container
 * @returns {HTMLElement} The calculator layout div with grid styling
 */
export function createCalculatorLayout() {
  const layout = document.createElement('div');
  layout.className = 'calculator-layout';
  layout.role = 'main';
  layout.setAttribute('aria-label', 'Calculator interface - multiple calculators displayed simultaneously');

  // Optional: Initialize responsive class management
  initializeResponsiveClasses(layout);

  return layout;
}

/**
 * Initialize responsive CSS class management based on viewport width
 * Uses CSS media queries as primary mechanism, JavaScript as fallback
 *
 * @param {HTMLElement} layout - The calculator layout element
 */
function initializeResponsiveClasses(layout) {
  // Debounced resize handler to update responsive classes
  let resizeTimeout;

  const updateResponsiveClasses = () => {
    const width = window.innerWidth;

    // Remove all responsive classes
    layout.classList.remove('calculator-layout--mobile', 'calculator-layout--tablet', 'calculator-layout--desktop');

    // Add appropriate class based on viewport width
    if (width < 768) {
      layout.classList.add('calculator-layout--mobile');
    } else if (width < 1200) {
      layout.classList.add('calculator-layout--tablet');
    } else {
      layout.classList.add('calculator-layout--desktop');
    }
  };

  // Initial class assignment
  updateResponsiveClasses();

  // Debounced resize listener (100ms debounce)
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateResponsiveClasses, 100);
  });

  // Clean up on component removal
  // Store cleanup function for potential future use
  layout._cleanup = () => {
    clearTimeout(resizeTimeout);
    window.removeEventListener('resize', arguments.callee);
  };
}

/**
 * CSS Classes Applied by this Component:
 * - .calculator-layout: Main grid container (display: grid; grid-template-columns: 1fr)
 * - .calculator-layout--mobile: Active <768px (1 column)
 * - .calculator-layout--tablet: Active 768-1199px (2 columns)
 * - .calculator-layout--desktop: Active ≥1200px (3 columns)
 *
 * Media Queries (in responsive.css):
 * - @media (min-width: 768px): 2 columns, 20px gap
 * - @media (min-width: 1200px): 3 columns, 24px gap
 */

/**
 * ARIA Attributes:
 * - role="main": Semantic HTML, identifies as main content area
 * - aria-label: Describes the purpose of the layout
 *
 * Screen Reader Announcement:
 * "Calculator interface - multiple calculators displayed simultaneously"
 */
