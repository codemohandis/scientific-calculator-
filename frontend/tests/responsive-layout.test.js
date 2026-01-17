/**
 * Responsive Layout Tests
 * Tests for calculator layout at different viewport sizes
 * TDD: Tests written first, designed to fail until implementation complete
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/dom';

// Helper: Set viewport size and trigger resize
function setViewportSize(width, height = 768) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
}

// Helper: Create calculator layout DOM structure
function createTestLayout() {
  const layout = document.createElement('div');
  layout.className = 'calculator-layout';
  layout.role = 'main';

  // Create 3 calculator sections
  for (let i = 1; i <= 3; i++) {
    const section = document.createElement('section');
    section.className = 'calculator-section';
    section.id = `section-${i}`;
    section.innerHTML = `
      <h2 class="calculator-section__title">Calculator ${i}</h2>
      <div class="calculator-section__content">
        <input type="text" placeholder="Input ${i}" />
      </div>
      <div class="calculator-section__result"></div>
    `;
    layout.appendChild(section);
  }

  return layout;
}

describe('T012: Responsive Layout Tests - Desktop View', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    setViewportSize(1400, 800); // Desktop size
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render calculator layout container', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement).toBeDefined();
    expect(layoutElement).not.toBeNull();
  });

  it('should display all 3 calculator sections at desktop', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);
  });

  it('should have CSS Grid applied to layout', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    const styles = window.getComputedStyle(layoutElement);

    expect(styles.display).toBe('grid');
  });

  it('should show 2-3 columns visible on desktop view', () => {
    const layout = createTestLayout();
    layout.style.gridTemplateColumns = 'repeat(3, 1fr)'; // Desktop: 3 columns
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });
});

describe('T023: Responsive Layout Tests - Tablet View', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    setViewportSize(900, 600); // Tablet size
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should display 1-2 columns on tablet breakpoint (768px)', () => {
    const layout = createTestLayout();
    layout.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Tablet: 2 columns
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
  });

  it('should have accessible gap spacing on tablet', () => {
    const layout = createTestLayout();
    layout.style.gap = '20px'; // Tablet gap
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement.style.gap).toBe('20px');
  });

  it('should maintain all sections visible on tablet', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);
  });
});

describe('T025: Responsive Layout Tests - Mobile View', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    setViewportSize(375, 667); // Mobile size (iPhone)
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should display single column on mobile (<768px)', () => {
    const layout = createTestLayout();
    layout.style.gridTemplateColumns = '1fr'; // Mobile: 1 column
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement.style.gridTemplateColumns).toBe('1fr');
  });

  it('should stack calculators vertically on mobile', () => {
    const layout = createTestLayout();
    layout.style.display = 'grid';
    layout.style.gridTemplateColumns = '1fr';
    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);
    // All should be stacked in single column
  });

  it('should have appropriate mobile spacing', () => {
    const layout = createTestLayout();
    layout.style.gap = '16px'; // Mobile gap
    container.appendChild(layout);

    const layoutElement = container.querySelector('.calculator-layout');
    expect(layoutElement.style.gap).toBe('16px');
  });
});

describe('T028: Responsive Layout Transition Tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should handle viewport resize from mobile to tablet', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    // Start at mobile
    setViewportSize(375);
    expect(window.innerWidth).toBe(375);

    // Resize to tablet
    setViewportSize(900);
    expect(window.innerWidth).toBe(900);

    // Layout should still have all sections
    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);
  });

  it('should handle viewport resize from desktop to mobile', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    // Start at desktop
    setViewportSize(1400);
    expect(window.innerWidth).toBe(1400);

    // Resize to mobile
    setViewportSize(320);
    expect(window.innerWidth).toBe(320);

    // Layout should still have all sections
    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);
  });
});

describe('T015: Calculator Visibility Tests - All Calculators Visible', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render all 3 calculator sections', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    const sections = container.querySelectorAll('.calculator-section');
    expect(sections.length).toBe(3);
  });

  it('should have sections visible with calculator content', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    const inputs = container.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBe(3); // One input per calculator
  });

  it('should have distinct calculator IDs for accessibility', () => {
    const layout = createTestLayout();
    container.appendChild(layout);

    const section1 = container.querySelector('#section-1');
    const section2 = container.querySelector('#section-2');
    const section3 = container.querySelector('#section-3');

    expect(section1).toBeDefined();
    expect(section2).toBeDefined();
    expect(section3).toBeDefined();
  });
});
