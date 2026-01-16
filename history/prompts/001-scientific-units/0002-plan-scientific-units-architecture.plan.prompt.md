---
id: 0002
title: Plan scientific units architecture
stage: plan
date: 2026-01-17
surface: agent
model: claude-haiku-4-5-20251001
feature: 001-scientific-units
branch: 001-scientific-units
user: user
command: /sp.plan
labels: ["architecture", "ast-parser", "pint", "expression-evaluator", "type-safety"]
links:
  spec: specs/001-scientific-units/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-scientific-units/plan.md
  - specs/001-scientific-units/research.md
  - specs/001-scientific-units/data-model.md
  - specs/001-scientific-units/quickstart.md
  - specs/001-scientific-units/contracts/expression_evaluator.md
tests:
  - Constitution check - all gates pass
  - Research phase complete (expression parser architecture resolved)
  - Data model defined (Expression, Value, Unit, Function, Operator, Exception entities)
  - API contracts specified (SafeExpressionEvaluator class)
---

## Prompt

(No specific prompt; `/sp.plan` command executed from feature specification)

## Response snapshot

Created comprehensive implementation plan for scientific operations and unit conversions feature. Phase 0 and Phase 1 complete:

**Phase 0 (Research)**:
- Expression parser architecture: Custom AST-based evaluator using Python's `ast` module
- Alternative approaches evaluated (recursive descent, Pratt, parser libraries, SymPy, NumExpr)
- Decision: Custom `ast.NodeVisitor` + Pint integration (optimal safety/performance/control trade-off)
- Unit handling: Pint for dimensional analysis, derived units support (velocity, force, pressure, energy, power, magnetic flux)
- Error handling: 3-layer strategy (parse errors, domain errors, unit dimensionality)
- Type safety: 100% type hints with mypy --strict target
- Performance targets: <100ms per expression, typical case <5ms

**Phase 1 (Design)**:
- Data model: Expression, Value, Unit, ScientificFunction, Operator, Error hierarchy
- Project structure: Single Python package with 5 core modules + tests
- Source layout: src/scientific_calculator/, tests/unit/, tests/integration/
- API contracts: SafeExpressionEvaluator class with 7 visitor methods + evaluate() entry point
- Whitelisted operations: 6 arithmetic operators, 6 trigonometric, 4 logarithmic, 4 exponential, 5 statistical functions
- Unit categories: 9 distance units, 6 mass units, 3 temperature scales, 5 volume units, 15 derived units
- Implementation examples: Working code skeletons with full type hints and docstrings

**Constitution Alignment**:
- ✅ Type Safety: All functions typed; mypy --strict planned
- ✅ TDD: Test-first workflow outlined with pytest fixtures
- ✅ Pure Functions: AST visitor pattern naturally enforces immutability
- ✅ Error Handling: Custom exception hierarchy with context and suggestions
- ✅ CLI-First: Dedicated cli.py module with argparse interface
- ✅ Semantic Versioning: Version tracking in pyproject.toml

## Outcome

- ✅ Impact: Comprehensive technical architecture established; design decisions documented with rationale; implementation guidance provided via code examples; ready for task breakdown phase
- 🧪 Tests: Constitution check PASS (all principles satisfied); no violations; ready for Phase 2 (task generation)
- 📁 Files: 5 spec documents (plan.md, research.md, data-model.md, quickstart.md, contracts/expression_evaluator.md) + 1 checklist (requirements.md)
- 🔁 Next prompts: /sp.tasks (break into implementation tasks), /sp.adr (document architectural decisions), or proceed directly to implementation
- 🧠 Reflection: Architecture balances user requirements (compound expressions, derived units) with implementation simplicity (Python stdlib, single dependency). AST-based approach provides type safety and correctness without performance penalty. Design-first approach (spec→research→data model→contracts) prevents implementation rework and ensures testability.

## Evaluation notes (flywheel)

- Failure modes observed: None - design workflow completed smoothly; Pint research agent provided comprehensive comparison of alternatives
- Graders run and results (PASS/FAIL): PASS - Constitution gates satisfied; design documents complete; code examples compile and type-check; no blocking issues identified
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Consider creating ADR documents for two major architectural decisions: (1) AST-based vs hand-written parser, (2) Pint vs custom unit system
