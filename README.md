# Scientific Calculator

A full-stack scientific calculator with support for unit conversions, scientific operations, and compound expression evaluation.

## Features

- **Unit Conversions**: Convert between metric, imperial, and SI units (distance, mass, temperature, volume)
- **Derived Units**: Support for velocity, force, pressure, energy, power, and magnetic flux
- **Scientific Functions**: Trigonometric (sin, cos, tan), logarithmic (log, ln), exponential (e^x, x^y), and statistical (mean, median, stdev)
- **Compound Expressions**: Parse and evaluate complex expressions with proper operator precedence
- **Accessible UI**: WCAG 2.1 AA compliant interface with keyboard navigation and screen reader support

## Project Structure

```
scientific-calculator/
├── src/
│   └── scientific_calculator/
│       ├── __init__.py              # Package initialization
│       ├── expression_evaluator.py  # AST-based expression evaluator
│       ├── units.py                 # Pint integration and unit registry
│       ├── functions.py             # Scientific function registry
│       ├── exceptions.py            # Custom exception classes
│       └── api.py                   # REST/GraphQL API layer
├── frontend/
│   ├── index.html                   # Entry point
│   ├── src/
│   │   ├── main.js                  # Application entry
│   │   ├── components/              # UI components
│   │   ├── styles/                  # CSS with accessibility focus
│   │   ├── services/                # API client
│   │   └── utils/                   # Utilities and helpers
│   └── tests/
│       ├── unit/                    # Component unit tests
│       └── accessibility/           # WCAG 2.1 AA compliance tests
├── tests/
│   ├── unit/                        # Backend unit tests
│   ├── integration/                 # Integration tests
│   └── conftest.py                  # Pytest configuration and fixtures
├── pyproject.toml                   # Python project configuration
├── frontend/package.json            # Node.js dependencies
└── README.md                        # This file
```

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- `uv` package manager (for Python)

### Backend Setup

```bash
# Install Python dependencies using uv
uv pip install -e ".[dev]"

# Or using pip
pip install -e ".[dev]"
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running Tests

### Backend Tests

```bash
# Run all backend tests
pytest

# Run with coverage
pytest --cov=src/scientific_calculator --cov-report=html

# Run specific test file
pytest tests/unit/test_conversions.py

# Run with verbose output
pytest -v
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run accessibility tests
npm run test:a11y

# Run with coverage
npm run test:coverage
```

## Code Quality

### Python Backend

```bash
# Format code with black
black src/ tests/

# Lint with ruff
ruff check src/ tests/

# Type check with mypy
mypy src/

# Run all checks
black src/ tests/ && ruff check src/ tests/ && mypy src/
```

### JavaScript Frontend

```bash
cd frontend

# Format code
npm run format

# Lint
npm run lint

# Check formatting
npm run format:check
```

## Development Workflow

### Test-Driven Development (TDD)

1. **Red**: Write a failing test that describes the desired behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Clean up the implementation while keeping tests passing

All features must follow TDD discipline:
- Write tests first
- Implement functionality
- Verify ≥85% test coverage
- Maintain type safety (mypy --strict)

### Accessibility Requirements

All UI components must:
- Follow WCAG 2.1 AA standards
- Include proper ARIA labels and roles
- Support keyboard navigation
- Maintain color contrast ratios (4.5:1 for normal text)
- Be testable with axe-core

### Type Safety

- 100% type hints required for Python code
- `mypy --strict` compliance mandatory
- No `Any` types without explicit justification

## Architecture

### Backend (Python)

The backend uses a custom AST-based expression evaluator integrated with Pint for unit-aware computation:

- **Expression Evaluator**: Safe evaluation using Python's `ast` module (no `eval()`)
- **Unit System**: Pint `UnitRegistry` for dimensional analysis
- **Function Registry**: Whitelisted mathematical and statistical functions
- **Error Handling**: Custom exception hierarchy with domain validation

### Frontend (JavaScript/HTML/CSS)

The frontend provides an accessible, responsive UI:

- **Components**: Reusable calculator, input, and results display components
- **Accessibility**: WCAG 2.1 AA compliance with ARIA labels and keyboard support
- **API Client**: Axios-based service for backend communication
- **Styling**: CSS with accessible color contrasts and responsive design

## API Reference

### Backend Endpoints

#### POST /api/evaluate
Evaluate an expression.

**Request:**
```json
{
  "expression": "5 km in miles"
}
```

**Response:**
```json
{
  "result": 3.10686,
  "unit": "miles",
  "error": null
}
```

#### GET /api/units
List available units.

**Response:**
```json
{
  "distance": ["km", "miles", "meter", "foot"],
  "mass": ["kg", "pounds", "gram"],
  "temperature": ["celsius", "fahrenheit", "kelvin"],
  "volume": ["liter", "gallon"],
  "derived": ["velocity", "force", "pressure", "energy", "power"]
}
```

#### GET /api/functions
List available functions.

**Response:**
```json
{
  "trigonometric": ["sin", "cos", "tan"],
  "logarithmic": ["log", "ln"],
  "exponential": ["exp", "pow"],
  "statistical": ["mean", "median", "stdev"]
}
```

## Performance Goals

- Expression evaluation: <100ms
- Typical case: <5ms
- UI response time: <200ms
- Memory footprint: <10MB

## Constitution

This project follows the Scientific Calculator Constitution (v1.1.0), which mandates:

1. **Type Safety (NON-NEGOTIABLE)**: All code must use explicit type hints with `mypy --strict`
2. **Test-First Development (NON-NEGOTIABLE)**: TDD discipline with ≥85% coverage
3. **Pure Functions & Immutability**: AST processing with no global state
4. **Explicit Error Handling**: Custom exception hierarchy with context
5. **UI/UX-First Design**: Responsive, accessible interface (WCAG 2.1 AA)
6. **Semantic Versioning**: Version tracking in `pyproject.toml`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines, TDD workflow, and accessibility requirements.

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue in the repository.