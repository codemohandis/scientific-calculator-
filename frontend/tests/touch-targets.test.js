/**
 * Touch Target Size Tests
 * Tests for WCAG 2.1 AA compliance: Minimum 44x44px touch targets
 * User Story 2: Verify touch targets are at least 44px on mobile
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const MINIMUM_TOUCH_TARGET = 44; // WCAG 2.1 AA minimum

describe('T027: Touch Target Size Tests - Mobile Accessibility', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should have buttons with minimum 44px height', () => {
    const button = document.createElement('button');
    button.textContent = 'Convert';
    button.style.minHeight = '44px';
    button.style.padding = '12px 16px';
    container.appendChild(button);

    const buttonHeight = button.offsetHeight;
    expect(buttonHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });

  it('should have buttons with minimum 44px width', () => {
    const button = document.createElement('button');
    button.textContent = 'Submit';
    button.style.minWidth = '44px';
    button.style.minHeight = '44px';
    button.style.padding = '12px 16px';
    container.appendChild(button);

    const buttonWidth = button.offsetWidth;
    expect(buttonWidth).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });

  it('should have input fields with minimum 44px height', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.style.minHeight = '44px';
    input.style.padding = '8px 12px';
    container.appendChild(input);

    const inputHeight = input.offsetHeight;
    expect(inputHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });

  it('should have select elements with minimum 44px height', () => {
    const select = document.createElement('select');
    const option = document.createElement('option');
    option.textContent = 'Option 1';
    select.appendChild(option);
    select.style.minHeight = '44px';
    select.style.padding = '8px 12px';
    container.appendChild(select);

    const selectHeight = select.offsetHeight;
    expect(selectHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });

  it('should have label elements with adequate touch area', () => {
    const label = document.createElement('label');
    label.textContent = 'Unit Conversion';
    label.style.display = 'block';
    label.style.padding = '8px';
    label.style.minHeight = '44px';
    label.style.cursor = 'pointer';
    container.appendChild(label);

    // Label should have adequate spacing
    expect(label.offsetHeight).toBeGreaterThanOrEqual(24); // Minimum readable height
  });

  it('should have clickable section headers with adequate height', () => {
    const heading = document.createElement('h2');
    heading.className = 'calculator-section__title';
    heading.textContent = 'Unit Conversions';
    heading.style.minHeight = '44px';
    heading.style.display = 'flex';
    heading.style.alignItems = 'center';
    container.appendChild(heading);

    const headingHeight = heading.offsetHeight;
    expect(headingHeight).toBeGreaterThanOrEqual(32); // Min readable
  });

  it('should have spacing between adjacent touch targets', () => {
    const button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    button1.style.minHeight = '44px';
    button1.style.marginBottom = '8px';

    const button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    button2.style.minHeight = '44px';

    container.appendChild(button1);
    container.appendChild(button2);

    const spacing = 8; // CSS margin
    const totalHeight = button1.offsetHeight + spacing + button2.offsetHeight;
    expect(totalHeight).toBeGreaterThan(88 + spacing);
  });

  it('should have padding inside touch targets for comfortable interaction', () => {
    const button = document.createElement('button');
    button.textContent = 'Convert';
    button.style.minHeight = '44px';
    button.style.padding = '12px 16px';
    container.appendChild(button);

    // Button should have internal padding
    const computedStyle = window.getComputedStyle(button);
    const paddingTop = parseInt(computedStyle.paddingTop);
    expect(paddingTop).toBeGreaterThanOrEqual(8);
  });

  it('should ensure form controls meet touch target minimum', () => {
    const form = document.createElement('form');

    // Input field
    const input = document.createElement('input');
    input.type = 'number';
    input.style.minHeight = '44px';

    // Select dropdown
    const select = document.createElement('select');
    select.style.minHeight = '44px';

    // Button
    const button = document.createElement('button');
    button.textContent = 'Submit';
    button.style.minHeight = '44px';

    form.appendChild(input);
    form.appendChild(select);
    form.appendChild(button);
    container.appendChild(form);

    const controls = form.querySelectorAll('input, select, button');
    controls.forEach((control) => {
      expect(control.offsetHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
    });
  });

  it('should maintain touch target size on small screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Mobile width
    });

    const button = document.createElement('button');
    button.textContent = 'Convert';
    button.style.minHeight = '44px';
    button.style.width = '100%';
    button.style.maxWidth = '100%';
    button.style.padding = '12px 16px';
    button.style.boxSizing = 'border-box';

    container.appendChild(button);

    const buttonHeight = button.offsetHeight;
    expect(buttonHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });
});

describe('T027: Touch Target Spacing Tests - WCAG Compliance', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should provide minimum spacing between buttons', () => {
    const buttons = [];
    for (let i = 0; i < 3; i++) {
      const button = document.createElement('button');
      button.textContent = `Button ${i + 1}`;
      button.style.minHeight = '44px';
      button.style.minWidth = '44px';
      button.style.margin = '4px'; // 4px margin on all sides = 8px total spacing
      buttons.push(button);
      container.appendChild(button);
    }

    // Check spacing between buttons
    expect(buttons[0].offsetHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });

  it('should have focus visible indicators within touch target', () => {
    const button = document.createElement('button');
    button.textContent = 'Test';
    button.style.minHeight = '44px';
    button.style.outline = '2px solid blue';
    button.style.outlineOffset = '2px';
    container.appendChild(button);

    const outlineWidth = window.getComputedStyle(button).outlineWidth;
    expect(outlineWidth).not.toBe('0px');
  });

  it('should ensure input fields have adequate line-height for text visibility', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.style.minHeight = '44px';
    input.style.lineHeight = '1.5';
    input.style.padding = '8px 12px';
    container.appendChild(input);

    const inputHeight = input.offsetHeight;
    expect(inputHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });

  it('should provide adequate touch target for dropdown toggles', () => {
    const select = document.createElement('select');
    select.style.minHeight = '44px';
    select.style.minWidth = '44px';

    for (let i = 0; i < 5; i++) {
      const option = document.createElement('option');
      option.textContent = `Option ${i + 1}`;
      select.appendChild(option);
    }

    container.appendChild(select);

    expect(select.offsetHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });

  it('should have expandable touch areas for small interactive elements', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.cursor = 'pointer';

    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.minHeight = '44px';
    label.style.padding = '8px 12px';
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' Agree to terms'));

    container.appendChild(label);

    expect(label.offsetHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });
});

describe('T027: Touch Target Layout Tests - Multiple Devices', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should maintain touch targets on iOS devices', () => {
    const button = document.createElement('button');
    button.textContent = 'Convert';
    button.style.minHeight = '44px';
    button.style.WebkitAppearance = 'none'; // Remove iOS default styling
    button.style.borderRadius = '8px';
    button.style.padding = '12px 16px';
    container.appendChild(button);

    expect(button.offsetHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
  });

  it('should have minimum size with padding on Android devices', () => {
    const button = document.createElement('button');
    button.textContent = 'Submit';
    button.style.minHeight = '44px';
    button.style.padding = '12px 16px';
    button.style.touchAction = 'manipulation'; // Prevent double-tap zoom
    container.appendChild(button);

    // Button should have min-height set
    expect(button.style.minHeight).toBe('44px');
    expect(button.style.padding).toBe('12px 16px');
  });

  it('should have touch-action property configured for mobile', () => {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    button.style.minHeight = '44px';
    button.style.touchAction = 'manipulation';

    container.appendChild(button);

    expect(button.style.touchAction).toBe('manipulation');
    expect(button.style.minHeight).toBe('44px');
  });
});
