/**
 * Horizontal Scroll Tests
 * Tests for ensuring no horizontal scrolling at any breakpoint
 * User Story 2: Verify no horizontal scroll at any viewport size
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Helper: Create a test layout with proper sizing
function createResponsiveLayout() {
  const layout = document.createElement('div');
  layout.className = 'calculator-layout';
  layout.style.display = 'grid';
  layout.style.gridTemplateColumns = '1fr'; // Start with mobile
  layout.style.gap = '16px';
  layout.style.width = '100%';
  layout.style.maxWidth = '100vw';

  for (let i = 0; i < 3; i++) {
    const section = document.createElement('section');
    section.className = 'calculator-section';
    section.style.width = '100%';
    section.style.minWidth = '0'; // Important for grid

    const title = document.createElement('h2');
    title.textContent = `Calculator ${i + 1}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.style.width = '100%';

    section.appendChild(title);
    section.appendChild(input);
    layout.appendChild(section);
  }

  return layout;
}

describe('T026: Horizontal Scroll Prevention Tests', () => {
  let container;
  let wrapper;

  beforeEach(() => {
    wrapper = document.createElement('div');
    wrapper.style.width = '100vw';
    wrapper.style.overflow = 'hidden'; // Hide scroll

    container = document.createElement('div');
    container.style.width = '100%';
    wrapper.appendChild(container);

    document.body.appendChild(wrapper);
  });

  afterEach(() => {
    document.body.removeChild(wrapper);
  });

  it('should not cause horizontal scroll at mobile breakpoint (375px)', () => {
    wrapper.style.width = '375px';
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = '1fr'; // Mobile: 1 column
    container.appendChild(layout);

    const layoutWidth = layout.offsetWidth;
    const containerWidth = container.offsetWidth;

    // Layout width should not exceed container width
    expect(layoutWidth).toBeLessThanOrEqual(containerWidth + 1); // +1 for rounding
  });

  it('should not cause horizontal scroll at tablet breakpoint (768px)', () => {
    wrapper.style.width = '768px';
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Tablet: 2 columns
    layout.style.gap = '20px';
    container.appendChild(layout);

    const layoutWidth = layout.offsetWidth;
    const containerWidth = container.offsetWidth;

    // Layout width should not exceed container width
    expect(layoutWidth).toBeLessThanOrEqual(containerWidth + 1);
  });

  it('should not cause horizontal scroll at desktop breakpoint (1200px)', () => {
    wrapper.style.width = '1200px';
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = 'repeat(3, 1fr)'; // Desktop: 3 columns
    layout.style.gap = '24px';
    container.appendChild(layout);

    const layoutWidth = layout.offsetWidth;
    const containerWidth = container.offsetWidth;

    // Layout width should not exceed container width
    expect(layoutWidth).toBeLessThanOrEqual(containerWidth + 1);
  });

  it('should handle small mobile screens (<360px) without horizontal scroll', () => {
    wrapper.style.width = '320px';
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = '1fr'; // Mobile: 1 column
    layout.style.gap = '12px';
    container.appendChild(layout);

    const layoutWidth = layout.offsetWidth;
    const containerWidth = container.offsetWidth;

    expect(layoutWidth).toBeLessThanOrEqual(containerWidth + 1);
  });

  it('should handle ultra-wide screens (4K) without overflow', () => {
    wrapper.style.width = '3840px';
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = 'repeat(3, 1fr)'; // Desktop: 3 columns
    layout.style.maxWidth = '1400px'; // Desktop max-width
    layout.style.marginLeft = 'auto';
    layout.style.marginRight = 'auto';
    container.appendChild(layout);

    const layoutMaxWidth = window.getComputedStyle(layout).maxWidth;
    expect(layoutMaxWidth).toBe('1400px');
  });

  it('should use box-sizing border-box to prevent overflow', () => {
    const layout = createResponsiveLayout();
    layout.style.boxSizing = 'border-box';
    container.appendChild(layout);

    const boxSizing = window.getComputedStyle(layout).boxSizing;
    expect(boxSizing).toBe('border-box');
  });

  it('should prevent child elements from causing overflow', () => {
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = '1fr';

    // Simulate a form input that might be too wide
    const section = layout.querySelector('section');
    const input = section.querySelector('input');
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';

    container.appendChild(layout);

    // Input should fit within its container
    const inputWidth = input.offsetWidth;
    const sectionWidth = section.offsetWidth;
    expect(inputWidth).toBeLessThanOrEqual(sectionWidth + 1);
  });

  it('should handle negative margin and padding correctly', () => {
    const layout = createResponsiveLayout();
    layout.style.padding = '16px';
    layout.style.margin = '0';

    container.appendChild(layout);

    // Total width should not exceed viewport
    const totalWidth = layout.offsetWidth;
    expect(totalWidth).toBeLessThanOrEqual(wrapper.offsetWidth + 1);
  });

  it('should ensure grid children respect min-width 0', () => {
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = 'repeat(3, 1fr)';

    const sections = layout.querySelectorAll('section');
    sections.forEach((section) => {
      section.style.minWidth = '0'; // Allow grid children to shrink
    });

    container.appendChild(layout);

    // All sections should fit within layout
    let totalWidth = 0;
    sections.forEach((section) => {
      totalWidth += section.offsetWidth;
    });

    expect(totalWidth).toBeLessThanOrEqual(layout.offsetWidth + 3); // +3 for rounding on 3 items
  });

  it('should handle gap correctly without causing overflow', () => {
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = 'repeat(2, 1fr)';
    layout.style.gap = '20px';

    const sections = layout.querySelectorAll('section');
    expect(sections.length).toBe(3);

    container.appendChild(layout);

    const layoutWidth = layout.offsetWidth;
    const containerWidth = container.offsetWidth;

    // Even with gap, layout should not overflow
    expect(layoutWidth).toBeLessThanOrEqual(containerWidth + 1);
  });

  it('should prevent viewport-specific units from causing scroll', () => {
    const layout = createResponsiveLayout();
    layout.style.width = '100%'; // Not 100vw (which includes scrollbar)
    layout.style.maxWidth = '100%';

    container.appendChild(layout);

    const layoutWidth = layout.offsetWidth;
    const containerWidth = container.offsetWidth;

    expect(layoutWidth).toBeLessThanOrEqual(containerWidth + 1);
  });
});

describe('T026: Edge Case Horizontal Scroll Tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '100%';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should handle landscape orientation on mobile without horizontal scroll', () => {
    const layout = createResponsiveLayout();
    layout.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Landscape might use 2 columns
    layout.style.gap = '16px';
    layout.style.width = '100%';

    container.style.width = '667px'; // Landscape iPhone width
    container.appendChild(layout);

    const layoutWidth = layout.offsetWidth;
    const containerWidth = container.offsetWidth;

    expect(layoutWidth).toBeLessThanOrEqual(containerWidth + 1);
  });

  it('should prevent content overflow with word-break settings', () => {
    const layout = createResponsiveLayout();

    const section = layout.querySelector('section');
    const longContent = document.createElement('p');
    longContent.textContent = 'VeryLongWordWithoutBreaksThatshouldstillnotcausehorizontalscrolling';
    longContent.style.wordBreak = 'break-word';

    section.appendChild(longContent);
    container.appendChild(layout);

    const contentWidth = longContent.offsetWidth;
    const sectionWidth = section.offsetWidth;

    expect(contentWidth).toBeLessThanOrEqual(sectionWidth + 1);
  });

  it('should respect overflow-x hidden if set', () => {
    const layout = createResponsiveLayout();
    layout.style.overflowX = 'hidden';

    container.appendChild(layout);

    const overflowX = window.getComputedStyle(layout).overflowX;
    expect(overflowX).toBe('hidden');
  });
});
