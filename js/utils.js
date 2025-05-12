// Utility functions

/**
 * Toggle visibility of an element
 * @param {HTMLElement} element - The element to toggle
 * @param {boolean} show - Whether to show or hide the element
 */
function toggleElementVisibility(element, show) {
  if (show) {
    element.classList.remove('hidden');
    // For animations, wait a tiny bit to let the browser recognize the element is in the DOM
    setTimeout(() => {
      element.classList.add('visible');
    }, 10);
  } else {
    element.classList.remove('visible');
    element.classList.add('hidden');
  }
}

/**
 * Format a date string to a locale format
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX');
}

/**
 * Format a date object to a locale date string
 * @param {Date} date - The date object
 * @returns {string} - The formatted date string
 */
function formatDateObject(date) {
  return date.toLocaleDateString('es-MX');
}

/**
 * Handle form submission errors
 * @param {Error} error - The error object
 * @param {string} message - The error message to display
 */
function handleError(error, message = 'Ha ocurrido un error') {
  console.error(error);
  // Implementation for error notification would go here
  // For now, we'll just log to console
}

/**
 * Create a sortable table header
 * @param {string} property - The property to sort by
 * @param {function} sortFunction - The function to call when sorting
 */
function setupSortableHeader(property, sortFunction) {
  const headerElement = document.querySelector(`th[data-sort="${property}"]`);
  if (headerElement) {
    headerElement.addEventListener('click', () => {
      sortFunction(property);
    });
  }
}