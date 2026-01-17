/**
 * CalculatorSection Component
 * Wrapper for individual calculator components with unified styling
 * Provides card-like appearance with title, content area, and result display
 *
 * Features:
 * - Semantic HTML with section and h2 elements
 * - ARIA attributes for accessibility
 * - Responsive padding and spacing
 * - Visual styling with borders and background colors
 */

/**
 * Create a calculator section wrapper
 *
 * @param {string} title - The section title (e.g., "Unit Conversions")
 * @param {HTMLElement} calculatorElement - The calculator component to wrap
 * @returns {HTMLElement} A section element containing the calculator
 *
 * @example
 * const section = createCalculatorSection(
 *   'Unit Conversions',
 *   createConversionForm()
 * );
 */
export function createCalculatorSection(title, calculatorElement) {
  // Create section container
  const section = document.createElement('section');
  section.className = 'calculator-section';
  section.role = 'region';
  section.setAttribute('aria-label', title);

  // Create section title
  const titleElement = document.createElement('h2');
  titleElement.className = 'calculator-section__title';
  titleElement.textContent = title;
  titleElement.id = `section-${title.toLowerCase().replace(/\s+/g, '-')}`; // For linking

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'calculator-section__content';
  contentContainer.setAttribute('aria-labelledby', titleElement.id);

  // Append calculator element to content container
  if (calculatorElement) {
    contentContainer.appendChild(calculatorElement);
  }

  // Create result display container
  const resultContainer = document.createElement('div');
  resultContainer.className = 'calculator-section__result';
  resultContainer.setAttribute('aria-live', 'polite');
  resultContainer.setAttribute('aria-atomic', 'true');
  resultContainer.setAttribute('role', 'status');

  // Assemble section structure
  section.appendChild(titleElement);
  section.appendChild(contentContainer);
  section.appendChild(resultContainer);

  // Store reference to result container for easier access from calculator components
  section._resultContainer = resultContainer;

  return section;
}

/**
 * HTML Structure Generated:
 *
 * <section class="calculator-section" role="region" aria-label="[Title]">
 *   <h2 class="calculator-section__title" id="section-[title-slug]">[Title]</h2>
 *   <div class="calculator-section__content" aria-labelledby="section-[title-slug]">
 *     {Calculator Element}
 *   </div>
 *   <div class="calculator-section__result"
 *        aria-live="polite"
 *        aria-atomic="true"
 *        role="status">
 *   </div>
 * </section>
 */

/**
 * CSS Classes Applied:
 * - .calculator-section: Base styling (background, border, padding)
 * - .calculator-section__title: Section heading (h2)
 * - .calculator-section__content: Container for calculator inputs
 * - .calculator-section__result: Container for calculation results
 *
 * Responsive Padding (from calculator-sections.css):
 * - Mobile: 16px
 * - Tablet: 20px
 * - Desktop: 24px
 */

/**
 * ARIA Attributes for Accessibility:
 *
 * Section Container:
 * - role="region": Identifies as a landmark region
 * - aria-label="[Title]": Screen readers announce section title
 *
 * Title (h2):
 * - Semantic heading for screen readers
 * - id for linking content to title
 *
 * Content Container:
 * - aria-labelledby: Links to the h2 title
 *
 * Result Container:
 * - aria-live="polite": Announces result updates to screen readers
 * - aria-atomic="true": Announces entire result element when updated
 * - role="status": Identifies as status region (non-intrusive updates)
 *
 * Keyboard Navigation:
 * - Natural tab order through form elements
 * - Focus indicator on input fields (handled by main.css)
 * - Screen reader announces section when focus enters
 */

/**
 * Color Scheme (from calculator-sections.css):
 * - Calculator 1 (Unit Conversions): Light Blue (#f0f7ff)
 * - Calculator 2 (Scientific Functions): Light Green (#f0fdf4)
 * - Calculator 3 (Expression Evaluator): Light Purple (#faf5ff)
 * - Fallback: Light Gray (#f9fafb)
 *
 * nth-child selectors automatically apply colors based on section order
 */

/**
 * Responsive Behavior:
 * - Card layout adapts to container width via parent .calculator-layout
 * - Padding increases on larger screens for better spacing
 * - Shadow and hover effects provide visual feedback
 * - No horizontal scrolling at any breakpoint
 */
