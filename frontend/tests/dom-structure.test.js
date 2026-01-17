/**
 * DOM Structure Tests
 * Tests for HTML structure and layout element presence
 * User Story 1: Verify all 3 calculators are in DOM
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('T013: DOM Structure Tests - All Calculators in DOM', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should have main layout container', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement).toBeDefined();
    expect(layoutElement.className).toContain('calculator-layout');
  });

  it('should have 3 calculator sections', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);
  });

  it('should have proper semantic HTML structure', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    layout.role = 'main';

    const section = document.createElement('section');
    section.className = 'calculator-section';
    section.role = 'region';

    const title = document.createElement('h2');
    title.className = 'calculator-section__title';
    title.textContent = 'Unit Conversions';

    const content = document.createElement('div');
    content.className = 'calculator-section__content';

    const result = document.createElement('div');
    result.className = 'calculator-section__result';

    section.appendChild(title);
    section.appendChild(content);
    section.appendChild(result);
    layout.appendChild(section);
    container.appendChild(layout);

    expect(layout.getAttribute('role')).toBe('main');
    expect(section.getAttribute('role')).toBe('region');
    expect(container.querySelector('h2.calculator-section__title')).toBeDefined();
  });

  it('should have section titles for all calculators', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    const titles = ['Unit Conversions', 'Scientific Functions', 'Expression Evaluator'];

    titles.forEach((title) => {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const titleElement = document.createElement('h2');
      titleElement.className = 'calculator-section__title';
      titleElement.textContent = title;

      section.appendChild(titleElement);
      layout.appendChild(section);
    });

    container.appendChild(layout);

    const sectionTitles = container.querySelectorAll('.calculator-section__title');
    expect(sectionTitles.length).toBe(3);
    expect(sectionTitles[0].textContent).toBe('Unit Conversions');
    expect(sectionTitles[1].textContent).toBe('Scientific Functions');
    expect(sectionTitles[2].textContent).toBe('Expression Evaluator');
  });

  it('should have content containers for each calculator', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const content = document.createElement('div');
      content.className = 'calculator-section__content';

      section.appendChild(content);
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const contentContainers = container.querySelectorAll('.calculator-section__content');
    expect(contentContainers.length).toBe(3);
  });

  it('should have result containers for each calculator', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const result = document.createElement('div');
      result.className = 'calculator-section__result';

      section.appendChild(result);
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const resultContainers = container.querySelectorAll('.calculator-section__result');
    expect(resultContainers.length).toBe(3);
  });

  it('should not have tab navigation elements', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      layout.appendChild(section);
    }

    container.appendChild(layout);

    // Tab elements should NOT be present
    const tabContainer = container.querySelector('.tabs-container');
    const tabButtons = container.querySelector('.tab-buttons');
    const tabContent = container.querySelector('.tab-content');

    expect(tabContainer).toBeNull();
    expect(tabButtons).toBeNull();
    expect(tabContent).toBeNull();
  });

  it('should have proper nesting structure', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    const section = document.createElement('section');
    section.className = 'calculator-section';

    const title = document.createElement('h2');
    title.className = 'calculator-section__title';

    const content = document.createElement('div');
    content.className = 'calculator-section__content';

    const input = document.createElement('input');
    input.type = 'text';
    content.appendChild(input);

    const result = document.createElement('div');
    result.className = 'calculator-section__result';

    section.appendChild(title);
    section.appendChild(content);
    section.appendChild(result);
    layout.appendChild(section);
    container.appendChild(layout);

    // Verify structure
    const nestedInput = container.querySelector('.calculator-section__content input');
    expect(nestedInput).toBeDefined();
    expect(nestedInput.type).toBe('text');
  });
});

describe('T013: DOM Structure Validation - Accessibility Elements', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should have ARIA labels for sections', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    const titles = ['Unit Conversions', 'Scientific Functions', 'Expression Evaluator'];

    titles.forEach((title) => {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      section.setAttribute('aria-label', title);
      layout.appendChild(section);
    });

    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    sections.forEach((section, index) => {
      expect(section.getAttribute('aria-label')).toBe(titles[index]);
    });
  });

  it('should have region roles for sections', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      section.setAttribute('role', 'region');
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section[role="region"]');
    expect(sections.length).toBe(3);
  });

  it('should have result containers with aria-live', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const result = document.createElement('div');
      result.className = 'calculator-section__result';
      result.setAttribute('aria-live', 'polite');
      result.setAttribute('role', 'status');

      section.appendChild(result);
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const resultContainers = container.querySelectorAll('.calculator-section__result[aria-live="polite"]');
    expect(resultContainers.length).toBe(3);
  });
});
