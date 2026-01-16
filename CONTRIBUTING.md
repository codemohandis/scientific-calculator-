# Contributing to Scientific Calculator

Thank you for your interest in contributing to the Scientific Calculator project! This document provides guidelines for development, testing, and code quality standards.

## Code of Conduct

- Be respectful and inclusive
- Focus on code quality and user experience
- Provide constructive feedback
- Help others learn and grow

## Development Workflow

### 1. Before You Start

1. Review the [Constitution](./CLAUDE.md) - all principles are non-negotiable
2. Check [README.md](./README.md) for architecture and setup instructions
3. Familiarize yourself with the current [specification](./specs/001-scientific-units/spec.md)
4. Read through the [implementation plan](./specs/001-scientific-units/plan.md)

### 2. Setting Up Your Development Environment

#### Backend (Python)

```bash
# Clone and navigate to the repository
git clone <repository-url>
cd scientific-calculator

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies with development tools
uv pip install -e ".[dev]"

# Verify setup
mypy src/
ruff check src/
pytest tests/ -v
```

#### Frontend (JavaScript)

```bash
cd frontend

# Install dependencies
npm install

# Verify setup
npm run lint
npm test
```

## Test-Driven Development (TDD)

This project **mandates** TDD for all features. Follow this workflow:

### Step 1: Red - Write a Failing Test

Write a test that describes the desired behavior BEFORE implementing the feature:

**Example: Backend test for unit conversion**

```python
# tests/unit/test_conversions.py
import pytest
from src.scientific_calculator.units import convert

def test_convert_kilometers_to_miles():
    """Test conversion from kilometers to miles."""
    result = convert(5.0, 'km', 'miles')
    assert result == pytest.approx(3.10686, abs=0.00001)

def test_convert_invalid_units_raises_error():
    """Test that invalid unit pairs raise an error."""
    with pytest.raises(ValueError):
        convert(5.0, 'invalid_unit', 'miles')
```

**Example: Frontend test for calculator input**

```javascript
// frontend/tests/unit/calculator.test.js
import { describe, it, expect } from 'vitest';

describe('Calculator Input', () => {
  it('should validate expression format', () => {
    const input = '5 km in miles';
    expect(isValidExpression(input)).toBe(true);
  });

  it('should reject invalid expressions', () => {
    const input = '5 km in !!!';
    expect(isValidExpression(input)).toBe(false);
  });
});
```

Run the test to confirm it fails:

```bash
# Backend
pytest tests/unit/test_conversions.py::test_convert_kilometers_to_miles -v

# Frontend
npm test -- calculator.test.js
```

### Step 2: Green - Write Minimal Code

Implement the minimum code necessary to make the test pass:

```python
# src/scientific_calculator/units.py
def convert(value: float, from_unit: str, to_unit: str) -> float:
    """Convert between units."""
    # Minimal implementation
    if from_unit == 'km' and to_unit == 'miles':
        return value * 0.621371
    raise ValueError(f"Unsupported conversion: {from_unit} to {to_unit}")
```

### Step 3: Refactor - Improve the Implementation

Once tests pass, improve the code while keeping tests green:

```python
# src/scientific_calculator/units.py
from pint import UnitRegistry

_registry = UnitRegistry()

def convert(value: float, from_unit: str, to_unit: str) -> float:
    """Convert between units using Pint."""
    try:
        quantity = value * _registry(from_unit)
        return quantity.to(to_unit).magnitude
    except Exception as e:
        raise ValueError(f"Cannot convert {from_unit} to {to_unit}") from e
```

## Type Safety Requirements (NON-NEGOTIABLE)

All Python code must have:
- 100% type hints on all functions and variables
- Pass `mypy --strict` without warnings
- No `Any` types without explicit justification

### Type Hints Example

```python
from typing import Union, List, Dict

def evaluate_expression(
    expression: str,
    variables: Dict[str, float] | None = None,
) -> Union[float, str]:
    """
    Evaluate a mathematical expression.

    Args:
        expression: The expression to evaluate
        variables: Optional variables for the expression

    Returns:
        The result or an error message

    Raises:
        ValueError: If the expression is invalid
    """
    # Implementation
    pass
```

### Checking Type Safety

```bash
# Run mypy with strict mode
mypy src/

# Run ruff for linting
ruff check src/

# Format code with black
black src/
```

## Accessibility Requirements (WCAG 2.1 AA)

All UI components must meet WCAG 2.1 AA standards:

### 1. Semantic HTML

```html
<!-- ✅ GOOD: Semantic structure -->
<form>
  <label for="expression-input">Enter expression:</label>
  <input
    id="expression-input"
    type="text"
    aria-describedby="input-help"
    placeholder="e.g., 5 km in miles"
  />
  <small id="input-help">
    Use mathematical operators: +, -, *, /, ^
  </small>
  <button type="submit">Calculate</button>
</form>

<!-- ❌ BAD: Non-semantic structure -->
<div onclick="calculate()">
  <p>Enter expression:</p>
  <div class="input" placeholder="expression"></div>
  <div class="button">Calculate</div>
</div>
```

### 2. Color Contrast

Ensure at least 4.5:1 contrast ratio for normal text:

```css
/* ✅ GOOD: Sufficient contrast */
.result-text {
  color: #000000;      /* Black */
  background: #ffffff; /* White - 21:1 contrast */
}

/* ❌ BAD: Insufficient contrast */
.result-text {
  color: #cccccc;      /* Light gray */
  background: #ffffff; /* White - 1.1:1 contrast */
}
```

### 3. Keyboard Navigation

All interactive elements must be keyboard accessible:

```javascript
// ✅ GOOD: Keyboard events handled
element.addEventListener('click', handleAction);
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
});

// ✅ GOOD: Tab order logical
<input id="expression" />
<button id="calculate">Calculate</button>
<div id="results" tabindex="0" role="region"></div>
```

### 4. ARIA Labels and Roles

```html
<!-- ✅ GOOD: ARIA support -->
<div role="region" aria-label="Results" aria-live="polite">
  <p id="result">Result appears here</p>
</div>

<button aria-label="Clear expression">Clear</button>

<!-- ✅ GOOD: Error announcements -->
<div role="alert" aria-live="assertive">
  Invalid expression. Please check your input.
</div>
```

### Testing Accessibility

```bash
# Run accessibility tests
cd frontend
npm run test:a11y

# Manual testing with axe DevTools browser extension
# https://www.deque.com/axe/devtools/
```

## Code Review Checklist

Before submitting a pull request, verify:

### Backend Checklist

- [ ] All functions have type hints
- [ ] `mypy --strict` passes without warnings
- [ ] `ruff check` passes
- [ ] `black` formatting applied
- [ ] All new code is tested (TDD)
- [ ] Test coverage ≥85% overall
- [ ] Integration tests for cross-module workflows
- [ ] Error messages include context and suggestions
- [ ] Documentation/docstrings added

### Frontend Checklist

- [ ] ESLint passes without warnings
- [ ] Prettier formatting applied
- [ ] Unit tests written (TDD)
- [ ] Accessibility tests pass
- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation works
- [ ] Color contrast ratios checked
- [ ] Responsive design verified

### Both

- [ ] Constitution principles followed
- [ ] No console errors or warnings
- [ ] Git commit message is clear and concise
- [ ] Branch name follows convention: `feature/name` or `fix/name`

## Running the Full Test Suite

```bash
# Backend tests
pytest tests/ -v --cov=src/scientific_calculator

# Frontend tests
cd frontend
npm test

# Frontend accessibility tests
npm run test:a11y

# Code quality checks
mypy src/
ruff check src/
black --check src/ tests/
cd frontend && npm run lint
```

## Commit Message Guidelines

Write clear, concise commit messages:

```
# ✅ GOOD
git commit -m "Add kilometer to mile conversion with 5-decimal accuracy"

# ✅ GOOD
git commit -m "Fix temperature offset handling in Celsius to Fahrenheit"

# ❌ BAD
git commit -m "fix stuff"

# ❌ BAD
git commit -m "Updated utils"
```

Format: `<verb> <description>`

Verbs: Add, Fix, Update, Refactor, Remove, Document, Test, etc.

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/descriptive-name`
2. Make changes following TDD and code quality guidelines
3. Run the full test suite locally
4. Push to your fork: `git push origin feature/descriptive-name`
5. Open a pull request with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to related issues
   - Verification of test coverage
6. Address review feedback
7. Rebase and merge once approved

## Common Issues and Solutions

### Issue: mypy fails with "Cannot find implementation"

**Solution**: Ensure all imports are typed and installed:

```bash
# Install development dependencies
uv pip install -e ".[dev]"

# Run mypy with verbose output
mypy src/ --show-error-codes
```

### Issue: Pytest coverage below 85%

**Solution**: Write tests for uncovered code:

```bash
# Generate coverage report with HTML
pytest --cov=src/scientific_calculator --cov-report=html

# Open htmlcov/index.html in browser to see coverage
```

### Issue: ESLint errors in JavaScript

**Solution**: Let Prettier auto-fix and fix remaining issues:

```bash
# Auto-fix formatting
npm run format

# Fix linting errors
npm run lint:fix
```

## Performance Guidelines

- Expression evaluation: <100ms target
- Typical case: <5ms target
- Profile code using Python's `cProfile` or browser DevTools
- Document performance-sensitive code

## Security Considerations

- Never use `eval()` or `exec()`
- Sanitize all user input
- Use Pint for unit calculations (safe)
- Report security issues privately
- Keep dependencies updated

## Getting Help

- Check existing issues and discussions
- Review test examples in `tests/` and `frontend/tests/`
- Read the [implementation plan](./specs/001-scientific-units/plan.md)
- Ask in pull request reviews
- Open a discussion issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
