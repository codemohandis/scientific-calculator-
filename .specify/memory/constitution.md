# Python Calculator Constitution

## Core Principles

### I. Type Safety (NON-NEGOTIABLE)
All functions and classes MUST use explicit type hints. Type annotations are required for:
- All function parameters and return types
- Class attributes and instance variables
- Module-level constants and configuration

Type checking MUST pass with `mypy --strict` before code is considered complete. This ensures early error detection and improves code documentation.

### II. Test-First Development (NON-NEGOTIABLE)
Test-Driven Development (TDD) is mandatory for all features:
1. Write failing unit tests first (Red phase)
2. Implement code to satisfy tests (Green phase)
3. Refactor for clarity and performance (Refactor phase)

All public functions must have corresponding unit tests with >85% code coverage. Integration tests required for multi-module interactions.

### III. Pure Functions & Immutability
Calculator logic must use pure functions (deterministic, no side effects) where possible. Functions should not mutate global state or external data structures. This ensures predictability, testability, and ease of reasoning about behavior.

### IV. Explicit Error Handling
All potential failure modes must be explicitly handled with custom exception classes. No silent failures or bare `except` clauses. Errors should include context (input values, operation) to aid debugging.

### V. UI/UX-First Design
Core calculator functionality MUST be accessible via a responsive, intuitive user interface (web or desktop). The interface must prioritize user experience with clear visual feedback, input validation, and accessibility standards. UI components should be independently testable and decoupled from business logic through well-defined interfaces.

### VI. Semantic Versioning & Documentation
- Version format: MAJOR.MINOR.PATCH (e.g., 1.2.3)
- MAJOR: Breaking API changes
- MINOR: New features, backward compatible
- PATCH: Bug fixes

All public functions require docstrings following NumPy/Google style with type annotations in docstrings as well.

## Technology Stack

- **Language**: Python 3.11+ (backend), HTML5/CSS3/JavaScript (frontend)
- **Package Manager**: `uv` for fast, deterministic dependency management (Python)
- **Type Checker**: `mypy` with strict mode enabled (Python)
- **Testing Framework**: `pytest` for backend unit/integration tests; `pytest` + accessibility testing for frontend
- **Code Formatting**: `black` (Python), Prettier (JavaScript)
- **Linting**: `ruff` (Python), ESLint (JavaScript)
- **UI Framework**: TBD (React, Vue, or vanilla with accessibility focus)
- **Accessibility**: WCAG 2.1 AA compliance required; automated testing with axe-core or similar

## Development Workflow

1. **Feature Development**: Follow TDD—write tests first, implement, refactor (backend and UI)
2. **Type Checking**: Run `mypy --strict` (Python) before commit; zero errors required
3. **Testing**: Run `pytest` (backend) and UI accessibility/component tests; verify coverage ≥85%
4. **UI/UX Review**: All UI PRs require design review, accessibility audit, and user testing feedback
5. **Code Review**: All PRs must pass type checking and tests; manual review of logic and usability
6. **Versioning**: Update version in `pyproject.toml` and create release tags for all merged features
7. **Accessibility**: Every UI component must meet WCAG 2.1 AA standards before merge

## Governance

This constitution is the authoritative source for development practices. All changes to calculator functionality must:
- Maintain strict type safety (Python backend)
- Include comprehensive tests (following TDD for business logic and UI components)
- Pass all automated checks (type, lint, test, accessibility)
- Include docstrings and type annotations (backend)
- Maintain WCAG 2.1 AA accessibility compliance (frontend)
- Prioritize user experience and usability (UI/UX review required)

Amendments to this constitution require explicit documentation and user approval. Runtime guidance is in `readme.md`.

**Version**: 1.1.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-17
