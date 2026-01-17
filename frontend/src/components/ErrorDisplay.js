/**
 * ErrorDisplay component for showing error messages.
 *
 * Displays errors with proper accessibility and dismissible alerts.
 */

/**
 * Create an error display component
 * @returns {HTMLElement} The error display element
 */
function createErrorDisplay() {
    const container = document.createElement('div');
    container.id = 'error-message';
    container.className = 'error-display';
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'assertive');
    container.setAttribute('aria-hidden', 'true');

    const content = document.createElement('div');
    content.className = 'error-content';

    const message = document.createElement('span');
    message.className = 'error-message';
    message.id = 'error-text';

    const closeButton = document.createElement('button');
    closeButton.className = 'error-close';
    closeButton.setAttribute('aria-label', 'Dismiss error message');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => dismissError());

    content.appendChild(message);
    content.appendChild(closeButton);
    container.appendChild(content);

    return container;
}

/**
 * Show an error message
 * @param {string} message - The error message to display
 * @param {number} duration - Optional duration to show (ms), 0 = persistent
 */
function showError(message, duration = 5000) {
    const errorElement = document.getElementById('error-message');
    if (!errorElement) return;

    // Update message
    const errorText = document.getElementById('error-text');
    if (errorText) {
        errorText.textContent = message;
    }

    // Remove hidden state
    errorElement.removeAttribute('aria-hidden');
    errorElement.classList.add('show');

    // Auto-dismiss if duration is set
    if (duration > 0) {
        clearTimeout(errorElement._dismissTimer);
        errorElement._dismissTimer = setTimeout(() => {
            dismissError();
        }, duration);
    }
}

/**
 * Dismiss the error message
 */
function dismissError() {
    const errorElement = document.getElementById('error-message');
    if (!errorElement) return;

    errorElement.setAttribute('aria-hidden', 'true');
    errorElement.classList.remove('show');

    if (errorElement._dismissTimer) {
        clearTimeout(errorElement._dismissTimer);
    }
}

/**
 * Show a validation error for a form field
 * @param {string} fieldId - The field element ID
 * @param {string} message - The error message
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Add error class
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    // Create or update error message
    let errorMsg = field.nextElementSibling;
    if (!errorMsg || !errorMsg.classList.contains('field-error')) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'field-error';
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
    }

    errorMsg.textContent = message;
    errorMsg.setAttribute('role', 'alert');

    // Announce to screen readers
    announceToScreenReader(`Error in ${field.getAttribute('aria-label') || field.id}: ${message}`);
}

/**
 * Clear a field error
 * @param {string} fieldId - The field element ID
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Remove error class
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');

    // Remove error message
    const errorMsg = field.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains('field-error')) {
        errorMsg.remove();
    }
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
    const announcement = document.getElementById('sr-announcement');
    if (announcement) {
        announcement.textContent = message;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createErrorDisplay,
        showError,
        dismissError,
        showFieldError,
        clearFieldError,
        announceToScreenReader,
    };
}
