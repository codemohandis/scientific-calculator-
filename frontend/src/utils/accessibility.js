/**
 * Accessibility utilities for WCAG 2.1 AA compliance.
 * Provides helpers for ARIA labels, focus management, and keyboard navigation.
 */

/**
 * Announces a message to screen readers.
 * Creates a live region if not already present.
 *
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive' (default: 'polite')
 * @returns {void}
 */
export function announceToScreenReader(message, priority = 'polite') {
  let liveRegion = document.querySelector(`[role="status"][aria-live="${priority}"]`);

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  // Clear and update content
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 0);
}

/**
 * Manages focus for modal dialogs or focused regions.
 * Traps focus within the specified element.
 *
 * @param {HTMLElement} element - The element to trap focus in
 * @returns {function} - Function to remove the focus trap
 */
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift+Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Manages focus restoration (e.g., when opening/closing dialogs).
 *
 * @returns {object} - Object with save/restore methods
 */
export function createFocusManager() {
  let savedFocus = null;

  return {
    /**
     * Save current focus
     */
    saveFocus() {
      savedFocus = document.activeElement;
    },

    /**
     * Restore saved focus
     */
    restoreFocus() {
      if (savedFocus && savedFocus.focus) {
        savedFocus.focus();
      }
    },
  };
}

/**
 * Adds keyboard navigation to an element that normally requires mouse interaction.
 * Triggers action on Enter or Space key.
 *
 * @param {HTMLElement} element - The element to add keyboard support to
 * @param {function} callback - Function to call when activated
 * @returns {function} - Function to remove the listener
 */
export function makeKeyboardAccessible(element, callback) {
  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback(event);
    }
  }

  element.addEventListener('keydown', handleKeyDown);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Sets accessible error/status messages on a form field.
 *
 * @param {HTMLElement} inputElement - The input field
 * @param {string} message - Error message to display
 * @param {string} type - 'error', 'warning', or 'success'
 * @returns {void}
 */
export function setFieldMessage(inputElement, message, type = 'error') {
  // Create or update aria-describedby
  let descriptionId = inputElement.getAttribute('aria-describedby');

  if (!descriptionId) {
    descriptionId = `${inputElement.id || 'field'}-description`;
    inputElement.setAttribute('aria-describedby', descriptionId);
  }

  // Create or update the description element
  let descriptionElement = document.getElementById(descriptionId);

  if (!descriptionElement) {
    descriptionElement = document.createElement('div');
    descriptionElement.id = descriptionId;
    descriptionElement.className = 'help-text';
    inputElement.parentNode.insertBefore(descriptionElement, inputElement.nextSibling);
  }

  descriptionElement.textContent = message;
  descriptionElement.className = `help-text ${type}`;

  // Update aria-invalid for errors
  if (type === 'error') {
    inputElement.setAttribute('aria-invalid', 'true');
  } else {
    inputElement.removeAttribute('aria-invalid');
  }
}

/**
 * Creates an alert dialog for screen readers and visual users.
 *
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} type - 'error', 'warning', 'success', 'info'
 * @returns {HTMLElement} - The alert element
 */
export function createAlert(title, message, type = 'info') {
  const alert = document.createElement('div');
  alert.setAttribute('role', 'alert');
  alert.setAttribute('aria-live', 'assertive');
  alert.className = `alert alert-${type}`;

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;

  const messageElement = document.createElement('p');
  messageElement.textContent = message;

  alert.appendChild(titleElement);
  alert.appendChild(messageElement);

  // Announce to screen readers immediately
  announceToScreenReader(`${title}: ${message}`, 'assertive');

  return alert;
}

/**
 * Checks if an element is visible to screen readers.
 *
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if element is visible to screen readers
 */
export function isScreenReaderVisible(element) {
  return !(
    element.offsetParent === null ||
    element.getAttribute('aria-hidden') === 'true' ||
    element.style.display === 'none' ||
    element.style.visibility === 'hidden'
  );
}

/**
 * Gets all ARIA attributes from an element.
 *
 * @param {HTMLElement} element - The element
 * @returns {object} - Object with all ARIA attributes
 */
export function getAriaAttributes(element) {
  const ariaAttrs = {};
  const attrs = element.attributes;

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name.startsWith('aria-')) {
      ariaAttrs[attr.name] = attr.value;
    }
  }

  return ariaAttrs;
}

/**
 * Handles skip to main content link.
 * Should be placed at the beginning of the page (hidden by default).
 *
 * @param {string} mainContentId - ID of the main content element
 * @returns {HTMLElement} - The skip link element
 */
export function createSkipLink(mainContentId = 'main') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${mainContentId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';

  skipLink.addEventListener('click', (e) => {
    const mainContent = document.getElementById(mainContentId);
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  });

  return skipLink;
}

/**
 * Debounce function for accessibility (e.g., live regions updates).
 *
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default {
  announceToScreenReader,
  trapFocus,
  createFocusManager,
  makeKeyboardAccessible,
  setFieldMessage,
  createAlert,
  isScreenReaderVisible,
  getAriaAttributes,
  createSkipLink,
  debounce,
};
