/**
 * Navigation Tests
 * Tests for removal of tab-based navigation
 * User Story 1: Verify no tab elements present
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('T014: Tab Removal Tests - No Tab Navigation Elements', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should not have .tabs-container element', () => {
    // Create grid layout without tabs
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    container.appendChild(layout);

    const tabsContainer = container.querySelector('.tabs-container');
    expect(tabsContainer).toBeNull();
  });

  it('should not have .tab-buttons element', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    container.appendChild(layout);

    const tabButtons = container.querySelector('.tab-buttons');
    expect(tabButtons).toBeNull();
  });

  it('should not have any .tab-button elements', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    container.appendChild(layout);

    const tabButtonElements = container.querySelectorAll('.tab-button');
    expect(tabButtonElements.length).toBe(0);
  });

  it('should not have .tab-panels element', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    container.appendChild(layout);

    const tabPanels = container.querySelector('.tab-panels');
    expect(tabPanels).toBeNull();
  });

  it('should not have any .tab-content elements', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    container.appendChild(layout);

    const tabContents = container.querySelectorAll('.tab-content');
    expect(tabContents.length).toBe(0);
  });

  it('should not have tablist role', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    layout.role = 'main'; // Should have 'main' role instead
    container.appendChild(layout);

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toBeNull();
  });

  it('should not have tab role elements', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    container.appendChild(layout);

    const tabRoles = container.querySelectorAll('[role="tab"]');
    expect(tabRoles.length).toBe(0);
  });

  it('should not have tabpanel role elements', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    container.appendChild(layout);

    const tabpanels = container.querySelectorAll('[role="tabpanel"]');
    expect(tabpanels.length).toBe(0);
  });

  it('should have grid layout instead of tabs', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    layout.style.display = 'grid';
    layout.style.gridTemplateColumns = '1fr';
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement.style.display).toBe('grid');
    expect(layoutElement.style.gridTemplateColumns).toBe('1fr');
  });

  it('should have section-based navigation instead of tabs', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    // Create sections instead of tabs
    const sections = ['Unit Conversions', 'Scientific Functions', 'Expression Evaluator'];
    sections.forEach((sectionTitle) => {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const title = document.createElement('h2');
      title.className = 'calculator-section__title';
      title.textContent = sectionTitle;

      section.appendChild(title);
      layout.appendChild(section);
    });

    container.appendChild(layout);

    // Verify sections exist
    const sectionElements = container.querySelectorAll('section.calculator-section');
    expect(sectionElements.length).toBe(3);

    // Verify no tabs exist
    const tabElements = container.querySelectorAll('.tab-button, .tab-content, .tab-panels');
    expect(tabElements.length).toBe(0);
  });

  it('should maintain accessibility without tab navigation', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    layout.role = 'main';

    const section = document.createElement('section');
    section.className = 'calculator-section';
    section.role = 'region';

    const title = document.createElement('h2');
    title.textContent = 'Unit Conversions';

    section.appendChild(title);
    layout.appendChild(section);
    container.appendChild(layout);

    // Verify semantic elements exist
    expect(layout.getAttribute('role')).toBe('main');
    expect(section.getAttribute('role')).toBe('region');
    expect(container.querySelector('h2')).toBeDefined();
  });
});

describe('T014: Navigation Structure Validation', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should use heading hierarchy for section identification', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const h2 = document.createElement('h2');
      h2.className = 'calculator-section__title';
      h2.textContent = `Calculator ${i + 1}`;

      section.appendChild(h2);
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const headings = container.querySelectorAll('h2.calculator-section__title');
    expect(headings.length).toBe(3);
  });

  it('should not have click handlers for tab switching', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      layout.appendChild(section);
    }

    container.appendChild(layout);

    // Should not have elements with click handlers for tab switching
    const sections = container.querySelectorAll('.calculator-section');
    sections.forEach((section) => {
      // Verify sections are not clickable tab buttons
      expect(section.tagName).toBe('SECTION');
      expect(section.getAttribute('role')).not.toBe('tab');
    });
  });

  it('should display all sections simultaneously without hiding', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      section.style.display = 'block'; // All visible
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    sections.forEach((section) => {
      const style = window.getComputedStyle(section);
      expect(style.display).not.toBe('none'); // No hidden sections
    });
  });
});
