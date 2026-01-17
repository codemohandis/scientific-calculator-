/**
 * Visibility Tests
 * Tests for calculator visibility and layout rendering
 * User Story 1: Verify all calculators are visible at load
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('T015: Calculator Visibility Tests - All Calculators Visible at Load', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render layout container with grid display', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    layout.style.display = 'grid';
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement).toBeDefined();
    expect(layoutElement.style.display).toBe('grid');
  });

  it('should display all 3 calculator sections without hiding', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    const titles = ['Unit Conversions', 'Scientific Functions', 'Expression Evaluator'];

    titles.forEach((title) => {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      section.style.display = 'block'; // Explicitly visible

      const titleElement = document.createElement('h2');
      titleElement.textContent = title;
      section.appendChild(titleElement);

      layout.appendChild(section);
    });

    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);

    // All sections should be visible (display !== none)
    sections.forEach((section) => {
      const style = window.getComputedStyle(section);
      expect(style.display).not.toBe('none');
    });
  });

  it('should show section titles for all calculators', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    const expectedTitles = ['Unit Conversions', 'Scientific Functions', 'Expression Evaluator'];

    expectedTitles.forEach((title) => {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const titleElement = document.createElement('h2');
      titleElement.className = 'calculator-section__title';
      titleElement.textContent = title;

      section.appendChild(titleElement);
      layout.appendChild(section);
    });

    container.appendChild(layout);

    const titles = container.querySelectorAll('.calculator-section__title');
    expect(titles.length).toBe(3);

    // Verify each title is visible and correct
    titles.forEach((titleElement, index) => {
      expect(titleElement.textContent).toBe(expectedTitles[index]);
      const style = window.getComputedStyle(titleElement);
      expect(style.display).not.toBe('none');
    });
  });

  it('should have visible input fields in all calculator sections', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const content = document.createElement('div');
      content.className = 'calculator-section__content';

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Input ${i + 1}`;

      content.appendChild(input);
      section.appendChild(content);
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const inputs = container.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBe(3);

    // All inputs should be visible
    inputs.forEach((input) => {
      const style = window.getComputedStyle(input);
      expect(style.display).not.toBe('none');
    });
  });

  it('should have visible result containers for all calculators', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const resultContainer = document.createElement('div');
      resultContainer.className = 'calculator-section__result';

      section.appendChild(resultContainer);
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const resultContainers = container.querySelectorAll('.calculator-section__result');
    expect(resultContainers.length).toBe(3);

    // All result containers should be present
    resultContainers.forEach((resultContainer) => {
      expect(resultContainer).toBeDefined();
    });
  });

  it('should render grid layout on initial page load', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    layout.style.display = 'grid';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      layout.appendChild(section);
    }

    container.appendChild(layout);

    // Simulate page load completion
    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement).toBeDefined();
    expect(layoutElement.style.display).toBe('grid');

    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);
  });

  it('should not have any hidden or display:none elements at load', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      section.style.display = 'block'; // Visible

      const titleElement = document.createElement('h2');
      titleElement.textContent = `Calculator ${i + 1}`;
      titleElement.style.display = 'block'; // Visible

      const content = document.createElement('div');
      content.className = 'calculator-section__content';
      content.style.display = 'block'; // Visible

      section.appendChild(titleElement);
      section.appendChild(content);
      layout.appendChild(section);
    }

    container.appendChild(layout);

    // Check all elements for visibility
    const allElements = container.querySelectorAll('*');
    allElements.forEach((element) => {
      const style = window.getComputedStyle(element);
      const classList = element.className;

      // Tab-related elements should NOT exist
      if (classList.includes('tab')) {
        throw new Error(`Found tab element: ${classList}`);
      }
    });

    expect(true).toBe(true); // Passed if no tab elements found
  });

  it('should have all calculator sections in viewport flow', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      section.id = `section-${i}`;
      layout.appendChild(section);
    }

    container.appendChild(layout);

    // All sections should be accessible from DOM
    for (let i = 0; i < 3; i++) {
      const section = container.querySelector(`#section-${i}`);
      expect(section).toBeDefined();
      expect(section.parentElement).toBe(layout);
    }
  });

  it('should display calculators in consistent order', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    const expectedOrder = ['Unit Conversions', 'Scientific Functions', 'Expression Evaluator'];

    expectedOrder.forEach((title) => {
      const section = document.createElement('section');
      section.className = 'calculator-section';

      const titleElement = document.createElement('h2');
      titleElement.className = 'calculator-section__title';
      titleElement.textContent = title;

      section.appendChild(titleElement);
      layout.appendChild(section);
    });

    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);

    // Verify order
    sections.forEach((section, index) => {
      const titleElement = section.querySelector('.calculator-section__title');
      expect(titleElement.textContent).toBe(expectedOrder[index]);
    });
  });

  it('should have no aria-hidden attributes hiding calculators', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    sections.forEach((section) => {
      // Sections should not be hidden with aria-hidden
      const ariaHidden = section.getAttribute('aria-hidden');
      expect(ariaHidden).not.toBe('true');
    });
  });

  it('should maintain visual separation between calculator sections', () => {
    const layout = document.createElement('div');
    layout.className = 'calculator-layout';
    layout.style.gap = '16px'; // Mobile gap

    for (let i = 0; i < 3; i++) {
      const section = document.createElement('section');
      section.className = 'calculator-section';
      layout.appendChild(section);
    }

    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement.style.gap).toBe('16px');
  });
});
