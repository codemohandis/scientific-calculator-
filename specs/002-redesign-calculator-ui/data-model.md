# Phase 1: Component & Layout Model

**Date**: 2026-01-18
**Feature**: Redesign Calculator UI - Unified Multi-Column Layout
**Branch**: `002-redesign-calculator-ui`

## Component Architecture

### Core Components

#### CalculatorLayout (NEW)
**Purpose**: Main layout container that orchestrates all calculators

**Responsibilities**:
- Define CSS Grid system for responsive columns
- Manage layout state (current viewport width)
- Handle window resize events for layout recalculation
- Apply responsive CSS classes

**Props**: None (uses document-level CSS Grid)

**Children**:
- 3x CalculatorSection components

**CSS Classes**:
- `.calculator-layout`: Main container with CSS Grid
- `.calculator-layout--mobile`: 1 column layout (<768px)
- `.calculator-layout--tablet`: 1-2 columns (768-1199px)
- `.calculator-layout--desktop`: 2-3 columns (≥1200px)

---

#### CalculatorSection (NEW)
**Purpose**: Wrapper for individual calculator with unified styling

**Responsibilities**:
- Provide consistent visual styling for each calculator
- Add section title and visual separation
- Handle result container within section
- Maintain responsive spacing

**Props**:
- `title`: string - Section title (e.g., "Unit Conversions")
- `children`: HTML element - The calculator component to wrap

**Attributes**:
- `role="region"` - Semantic HTML for screen readers
- `aria-label={title}` - Accessible label

**CSS Classes**:
- `.calculator-section`: Base styling (background, border, padding)
- `.calculator-section__title`: Section heading
- `.calculator-section__content`: Inner container for calculator
- `.calculator-section__result`: Result display area

**Styling Details**:
- Background color: Light gray (#f9fafb) or card-style with border
- Border: 1px solid border color (#d1d5db)
- Border-radius: 8px
- Padding: 16-24px depending on viewport
- Margin: Consistent spacing between sections

---

### Existing Components (MINIMAL CHANGES)

#### ConversionForm.js
**Current Status**: Fully functional, maintains all features

**Modifications Needed**:
- Wrap in CalculatorSection component in main.js
- No code changes to component itself

**Integration**:
```javascript
<CalculatorSection title="Unit Conversions">
  {createConversionForm()}
</CalculatorSection>
```

---

#### FunctionInput.js
**Current Status**: Fully functional, maintains all features

**Modifications Needed**:
- Wrap in CalculatorSection component in main.js
- No code changes to component itself

**Integration**:
```javascript
<CalculatorSection title="Scientific Functions">
  {createFunctionInput()}
</CalculatorSection>
```

---

#### ExpressionInput.js
**Current Status**: Fully functional, maintains all features

**Modifications Needed**:
- Wrap in CalculatorSection component in main.js
- No code changes to component itself

**Integration**:
```javascript
<CalculatorSection title="Expression Evaluator">
  {createExpressionInput()}
</CalculatorSection>
```

---

## Layout System

### CSS Grid Configuration

**Base Layout (Mobile - <768px)**:
```css
.calculator-layout {
  display: grid;
  grid-template-columns: 1fr;  /* Single column */
  gap: 16px;                    /* Spacing between items */
  max-width: 100%;
}
```

**Tablet Layout (768px-1199px)**:
```css
@media (min-width: 768px) {
  .calculator-layout {
    grid-template-columns: 1fr 1fr;  /* Two columns */
    gap: 20px;
  }
}
```

**Desktop Layout (≥1200px)**:
```css
@media (min-width: 1200px) {
  .calculator-layout {
    grid-template-columns: repeat(3, 1fr);  /* Three columns */
    gap: 24px;
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

### Responsive Behavior

| Breakpoint | Columns | Gap | Max-Width | Notes |
|-----------|---------|-----|-----------|-------|
| Mobile | 1 | 16px | 100% | Full width, vertical stacking |
| Tablet | 1-2 | 20px | 100% | Two columns if space allows |
| Desktop | 3 | 24px | 1400px | Three columns with center alignment |

---

## Visual Styling

### Color Scheme

**Calculator Section Colors** (distinct but harmonious):
- **Unit Conversions**: Light blue (#f0f7ff) background
- **Scientific Functions**: Light green (#f0fdf4) background
- **Expression Evaluator**: Light purple (#faf5ff) background

**Fallback** (if colors not desired):
- All sections: Light gray (#f9fafb) with subtle borders

### Typography

**Section Titles**:
- Font: Inherit from body
- Size: 18px on mobile, 20px on tablet/desktop
- Weight: 600 (semibold)
- Color: #1f2937 (dark gray)
- Margin: 0 0 12px 0

### Spacing

**Standard Values**:
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px

**Section Spacing**:
- Padding: 16px (mobile), 20px (tablet), 24px (desktop)
- Gap between sections: 16px (mobile), 20px (tablet), 24px (desktop)

---

## Accessibility Model

### ARIA Attributes

**CalculatorLayout**:
```html
<div class="calculator-layout" role="main">
```

**CalculatorSection**:
```html
<section class="calculator-section" role="region" aria-label="Unit Conversions">
```

### Focus Management

- Tab order: Natural order through DOM
- Focus indicator: Blue outline (2px solid #0066cc)
- Focus-visible styles applied to interactive elements

### Screen Reader Considerations

- Section titles announced via `aria-label`
- Results containers announced as `aria-live="polite"`
- Error messages announced immediately with `role="alert"`

---

## State Management

### Responsive State Tracking

**Information Needed**:
- Current viewport width
- Current breakpoint (mobile/tablet/desktop)

**Implementation**:
- Use `window.matchMedia()` for media query listeners
- Update layout classes on resize events
- Debounce resize handler (100-200ms) to prevent excessive recalculations

---

## Integration Points

### In main.js

```javascript
const calculatorLayout = document.createElement('div');
calculatorLayout.className = 'calculator-layout';

// Create and append calculator sections
calculatorLayout.appendChild(
  createCalculatorSection('Unit Conversions', createConversionForm())
);
calculatorLayout.appendChild(
  createCalculatorSection('Scientific Functions', createFunctionInput())
);
calculatorLayout.appendChild(
  createCalculatorSection('Expression Evaluator', createExpressionInput())
);

app.appendChild(calculatorLayout);
```

### File Dependencies

- `main.js`: Imports CalculatorLayout, CalculatorSection, all calculator components
- `styles/main.css`: Imports responsive styles
- `styles/responsive.css`: Media queries and breakpoint styles
- `styles/calculator-sections.css`: Section-specific styling

---

## Testing Considerations

### Unit Tests (CalculatorLayout)
- Layout renders with correct number of children
- CSS Grid classes applied correctly
- Resize events trigger class updates
- Breakpoint changes apply correct classes

### Unit Tests (CalculatorSection)
- Title renders correctly
- ARIA attributes present and correct
- Children mounted correctly
- CSS classes applied

### Integration Tests
- All three calculators visible on desktop
- Single column on mobile
- Two columns on tablet
- No horizontal scrolling at any breakpoint
- Calculator functionality unchanged

### Accessibility Tests
- Tab order logical
- Focus indicators visible
- Screen reader announces all sections
- ARIA labels correct

