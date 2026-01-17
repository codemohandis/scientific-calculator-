# Phase 1: Quick Start Guide

**Date**: 2026-01-18
**Feature**: Redesign Calculator UI - Unified Multi-Column Layout
**Branch**: `002-redesign-calculator-ui`

## TL;DR

Redesign calculator UI from tab-based to unified multi-column layout using CSS Grid.

**What's changing**:
- Replace tab navigation with all calculators visible at once
- Use CSS Grid for responsive columns: 1 (mobile) → 2 (tablet) → 3 (desktop)
- Wrap calculators in visual "cards" with titles and styling
- Maintain all existing calculator functionality

**What's NOT changing**:
- Calculator components themselves (ConversionForm, FunctionInput, ExpressionInput)
- Backend API endpoints
- Input/output behavior
- Accessibility features

---

## Key Files to Modify

| File | Changes | Difficulty |
|------|---------|-----------|
| `frontend/src/main.js` | Remove tab code, add grid layout | Medium |
| `frontend/src/styles/main.css` | Add grid system, section styling | Medium |
| `frontend/src/components/CalculatorLayout.js` | NEW - Layout container | Easy |
| `frontend/src/components/CalculatorSection.js` | NEW - Section wrapper | Easy |
| `frontend/src/styles/responsive.css` | NEW - Media queries | Medium |

---

## Responsive Breakpoints Quick Reference

```css
/* Mobile (base styles) */
@media (min-width: 0px) {
  .calculator-layout {
    grid-template-columns: 1fr;  /* 1 column */
  }
}

/* Tablet */
@media (min-width: 768px) {
  .calculator-layout {
    grid-template-columns: 1fr 1fr;  /* 2 columns */
  }
}

/* Desktop */
@media (min-width: 1200px) {
  .calculator-layout {
    grid-template-columns: repeat(3, 1fr);  /* 3 columns */
  }
}
```

---

## CSS Classes to Know

**Layout**:
- `.calculator-layout`: Main grid container
- `.calculator-layout--mobile`: 1 column (CSS class applied)
- `.calculator-layout--tablet`: 2 columns (CSS class applied)
- `.calculator-layout--desktop`: 3 columns (CSS class applied)

**Section**:
- `.calculator-section`: Individual calculator card
- `.calculator-section__title`: Section heading
- `.calculator-section__content`: Calculator component container
- `.calculator-section__result`: Result display area

---

## Component Integration

### New Main Layout Structure

```
<div class="calculator-layout">
  <section class="calculator-section">
    <h2 class="calculator-section__title">Unit Conversions</h2>
    <div class="calculator-section__content">
      {ConversionForm component}
    </div>
    <div class="calculator-section__result"></div>
  </section>

  <section class="calculator-section">
    <h2 class="calculator-section__title">Scientific Functions</h2>
    <div class="calculator-section__content">
      {FunctionInput component}
    </div>
    <div class="calculator-section__result"></div>
  </section>

  <section class="calculator-section">
    <h2 class="calculator-section__title">Expression Evaluator</h2>
    <div class="calculator-section__content">
      {ExpressionInput component}
    </div>
    <div class="calculator-section__result"></div>
  </section>
</div>
```

---

## Testing Checklist

- [ ] All 3 calculators visible on desktop without horizontal scroll
- [ ] Mobile shows single column (vertical stacking)
- [ ] Tablet shows 2 columns
- [ ] Desktop shows 3 columns
- [ ] Calculators work (inputs/outputs functional)
- [ ] No console errors
- [ ] Responsive transitions smooth (no jank)
- [ ] Touch targets ≥44px on mobile
- [ ] ARIA labels present
- [ ] Screen reader announces sections
- [ ] Keyboard navigation works
- [ ] Focus indicators visible

---

## Performance Tips

1. **Avoid Layout Thrashing**: Debounce window resize handler (100-200ms)
2. **Use CSS Grid**: Better than flexbox for this layout
3. **Mobile-First CSS**: Start with mobile styles, add for larger screens
4. **No New Dependencies**: Keep using vanilla CSS
5. **Minimal JavaScript**: Only for responsive class management if needed

---

## CSS-Only Implementation (Recommended)

You can implement this with pure CSS media queries - no JavaScript needed!

```css
/* Base: Mobile - 1 column */
.calculator-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .calculator-layout {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1200px) {
  .calculator-layout {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```

That's it! CSS Grid handles the responsive layout automatically.

---

## Color Palette (Optional Enhancements)

If adding section-specific colors:

```css
.calculator-section:nth-child(1) { background: #f0f7ff; }  /* Blue */
.calculator-section:nth-child(2) { background: #f0fdf4; }  /* Green */
.calculator-section:nth-child(3) { background: #faf5ff; }  /* Purple */
```

Or keep all sections the same neutral color (#f9fafb).

---

## Common Pitfalls to Avoid

❌ **Don't**: Modify the existing calculator components
✅ **Do**: Wrap them in new layout components

❌ **Don't**: Add heavy dependencies or frameworks
✅ **Do**: Use vanilla CSS and plain JavaScript

❌ **Don't**: Use breakpoints that don't match the spec
✅ **Do**: Stick to <768px, 768-1199px, ≥1200px

❌ **Don't**: Forget accessibility
✅ **Do**: Keep ARIA labels, focus management, keyboard navigation

---

## Next Steps

1. Read `data-model.md` for detailed component architecture
2. Implement new layout components (CalculatorLayout, CalculatorSection)
3. Update `main.js` to use new layout
4. Add CSS Grid styles to `styles/main.css`
5. Add media queries to `styles/responsive.css`
6. Run responsive tests at 3 breakpoints
7. Test calculator functionality remains unchanged
8. Run accessibility tests (axe-core, keyboard, screen reader)
9. Check performance (no increased load time)
10. Create task breakdown with `/sp.tasks`

---

## Resources

- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/) - Comprehensive grid reference
- [Responsive Design Guide](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design) - MDN responsive patterns
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
- [Browser Support](https://caniuse.com/) - Check browser compatibility

