/**
 * Jest configuration for accessibility tests using axe-core.
 * Tests WCAG 2.1 AA compliance for frontend components.
 */

module.exports = {
  displayName: 'a11y',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/accessibility/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/accessibility/setup.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
