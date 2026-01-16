# Implementation Plan: Scientific Operations and Unit Conversions

**Branch**: `001-scientific-units` | **Date**: 2026-01-17 | **Spec**: [specs/001-scientific-units/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-scientific-units/spec.md`

## Summary

Build a scientific calculator with support for:
1. **Unit Conversions** — Metric/imperial conversions (distance, weight, temperature, volume) plus derived units (velocity, force, pressure, energy, power)
2. **Scientific Operations** — Trigonometric (sin, cos, tan), logarithmic (log, ln), exponential (e^x, x^y), and statistical (mean, median, stdev) functions
3. **Compound Expressions** — Parse and evaluate complex expressions combining conversions and calculations with proper operator precedence
4. **User Interface** — Web/desktop interface with responsive design, accessibility support (WCAG 2.1 AA), and clear error messaging

**Technical Approach**: Custom AST-based expression evaluator (Python's `ast` module) integrated with Pint for unit-aware computation. Type-safe with 100% type hints, TDD discipline, ≥85% test coverage.

## Technical Context

**Language/Version**: Python 3.11+ (backend), HTML5/CSS3/JavaScript (frontend)
**Primary Dependencies**: Pint (≥0.21) for units and dimensional analysis
**Storage**: N/A (pure computation, no persistence)
**Testing**: pytest (backend), UI component + accessibility testing (frontend)
**Target Platform**: Web application (modern browsers) or desktop UI (Electron/PyQt); includes Python backend API
**Project Type**: Full-stack: Python package (backend) + UI framework (frontend)
**Performance Goals**: <100ms per expression evaluation; <5ms typical case; <200ms UI response time
**Constraints**: <10MB memory footprint; support expressions up to 1000 characters; max 50 recursion depth; WCAG 2.1 AA accessibility mandatory
**Scale/Scope**: MVP feature (3 user stories), 500-800 LOC backend + UI components; comprehensive function library; accessibility compliance

## Constitution Check

*GATE: Must pass before proceeding. Re-check after Phase 1 design.*

**Type Safety (NON-NEGOTIABLE)**:
- ✅ PASS: All functions will have explicit type hints (Union, Callable, Dict types defined)
- ✅ PASS: `mypy --strict` compliance planned and tested

**Test-First Development (NON-NEGOTIABLE)**:
- ✅ PASS: TDD required; tests written first, then implementation
- ✅ PASS: Target ≥85% coverage per constitution and spec (SC-008)
- ✅ PASS: Integration tests for multi-module workflows required

**Pure Functions & Immutability**:
- ✅ PASS: Expression evaluator uses pure functions (no global state)
- ✅ PASS: `ast.NodeVisitor` pattern naturally enforces immutability

**Explicit Error Handling**:
- ✅ PASS: Custom exception classes planned (`DomainError`, `SyntaxError`, `DimensionalityError`)
- ✅ PASS: No bare `except` clauses; all errors include context

**UI/UX-First Design**:
- ✅ PASS: Core functionality accessible via responsive UI (requirement FR-009)
- ✅ PASS: Backend API decoupled from UI; independently testable
- ✅ PASS: WCAG 2.1 AA accessibility compliance required for all UI components
- ✅ PASS: Clear visual feedback and input validation in UI design

**Semantic Versioning & Documentation**:
- ✅ PASS: Version tracking in `pyproject.toml`; docstrings required
- ✅ PASS: NumPy/Google style docstrings with type annotations

## Project Structure

### Documentation (this feature)

```text
specs/001-scientific-units/
├── spec.md                  # Feature specification (user stories, requirements)
├── plan.md                  # This file (architecture and design)
├── research.md              # Phase 0 (expression parser architecture, unit handling)
├── data-model.md            # Phase 1 (entities, data structures, validation)
├── quickstart.md            # Phase 1 (implementation examples, usage patterns)
├── contracts/               # Phase 1 (API contracts for components)
│   ├── expression_evaluator.md
│   ├── unit_converter.md
│   └── scientific_functions.md
├── checklists/
│   └── requirements.md      # Specification quality validation
└── tasks.md                 # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
src/
├── scientific_calculator/
│   ├── __init__.py
│   ├── expression_evaluator.py      # Core AST-based evaluator
│   ├── units.py                     # Pint integration, unit registry
│   ├── functions.py                 # Math, trig, statistical functions
│   ├── exceptions.py                # Custom exception classes
│   └── api.py                       # REST/GraphQL API for UI consumption

frontend/
├── index.html                       # Entry point
├── src/
│   ├── components/                  # UI components (calculator, input, results)
│   ├── styles/                      # CSS with accessibility focus
│   ├── services/                    # API client
│   └── utils/                       # Accessibility helpers, utilities
└── tests/
    ├── unit/                        # Component tests
    └── accessibility/               # WCAG 2.1 AA compliance tests

tests/
├── unit/
│   ├── test_expression_evaluator.py
│   ├── test_units.py
│   ├── test_functions.py
│   └── test_exceptions.py
├── integration/
│   └── test_scientific_calculator_workflows.py
└── conftest.py                      # Pytest fixtures and configuration

pyproject.toml                        # Dependencies, version, type checking config
README.md                             # Usage documentation
```

**Structure Decision**: Full-stack architecture with clear separation:

**Backend** (Python):
- `expression_evaluator.py` — AST visitor for parsing and evaluation
- `units.py` — Pint wrapper for unit-aware computation
- `functions.py` — Whitelisted mathematical and statistical functions
- `api.py` — REST/GraphQL API layer exposing evaluator to frontend
- `exceptions.py` — Custom error classes with context

**Frontend** (HTML/CSS/JavaScript):
- `components/` — Reusable UI components (calculator, input, results display)
- `styles/` — CSS with WCAG 2.1 AA accessibility compliance
- `services/` — API client for backend communication
- `utils/` — Accessibility helpers, form validation, error handling

## Complexity Tracking

**No Constitution Check Violations** — All core principles satisfied:
- Type safety enforced through full type hints + mypy --strict (Python backend)
- TDD enforced through test-first workflow (backend logic and UI components)
- Pure functions by design (immutable AST processing)
- Explicit error handling (custom exception hierarchy)
- UI/UX-first through dedicated API and frontend components with accessibility focus
- WCAG 2.1 AA compliance required for all UI (new mandate in v1.1.0 constitution)
- Semantic versioning tracked in pyproject.toml
