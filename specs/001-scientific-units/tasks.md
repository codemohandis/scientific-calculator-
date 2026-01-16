# Tasks: Scientific Operations and Unit Conversions

**Input**: Design documents from `/specs/001-scientific-units/`
**Prerequisites**: plan.md (full-stack architecture), spec.md (3 P1 user stories), data-model.md (entities), contracts/ (API), research.md (AST+Pint decisions)

**Architecture**: Full-stack with Python backend (AST-based expression evaluator + Pint) + Frontend (HTML/CSS/JavaScript with WCAG 2.1 AA accessibility)

**Organization**: Tasks grouped by user story for independent implementation, testing, and deployment.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3) - marks which story this task belongs to
- Include exact file paths in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and foundational structure for both backend and frontend

- [ ] T001 Create project structure per implementation plan (backend `src/scientific_calculator/`, frontend `frontend/src/`, tests/)
- [ ] T002 [P] Initialize Python 3.11+ project with `pyproject.toml`, uv package manager, Pint (≥0.21) dependency
- [ ] T003 [P] Initialize frontend project structure with HTML5/CSS3/JavaScript (framework TBD)
- [ ] T004 [P] Configure Python linting (ruff) and formatting (black) in pyproject.toml
- [ ] T005 [P] Configure JavaScript linting (ESLint) and formatting (Prettier)
- [ ] T006 Configure mypy --strict type checking in pyproject.toml and run configuration
- [ ] T007 Configure pytest and pytest-cov for Python backend testing
- [ ] T008 [P] Create pytest fixtures and conftest.py for backend (mock Pint registry, evaluator instances)
- [ ] T009 Setup frontend testing framework (jest/vitest for unit tests, axe-core for accessibility)
- [ ] T010 Create README.md with project overview, setup instructions, and architecture diagram
- [ ] T011 Create CONTRIBUTING.md with TDD workflow and accessibility guidelines
- [ ] T012 Initialize git commit hooks for pre-commit linting, type checking, tests

**Checkpoint**: Project scaffolding complete - backend and frontend structures ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST complete before user story implementation begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Core Infrastructure

- [ ] T013 Create exception hierarchy in `src/scientific_calculator/exceptions.py` (CalculatorException, SyntaxError, DomainError, DimensionalityError, EvaluationError)
- [ ] T014 [P] Create Unit enum/registry wrapper in `src/scientific_calculator/units.py` wrapping Pint UnitRegistry with singleton pattern
- [ ] T015 [P] Implement Pint unit initialization with all base units (distance, mass, temperature, volume) and derived units (velocity, force, pressure, energy, power, magnetic flux)
- [ ] T016 [P] Create mathematical constants (π, e) lookup in `src/scientific_calculator/units.py`
- [ ] T017 Implement temperature conversion formulas (Celsius ↔ Fahrenheit ↔ Kelvin with offset handling) in `src/scientific_calculator/units.py`
- [ ] T018 Create whitelisted operator dictionary in `src/scientific_calculator/expression_evaluator.py` (Add, Sub, Mult, Div, Pow, Mod, USub, UAdd)
- [ ] T019 [P] Create whitelisted function registry in `src/scientific_calculator/functions.py` (trigonometric, logarithmic, exponential, statistical)
- [ ] T020 Implement type hints and type definitions in `src/scientific_calculator/__init__.py` (Number, Value, Operator, Function types)
- [ ] T021 Setup API layer skeleton in `src/scientific_calculator/api.py` (entry points for evaluate(), convert(), list_units(), list_functions())

### Frontend Core Infrastructure

- [ ] T022 [P] Create main HTML entry point `frontend/index.html` with semantic structure for calculator interface
- [ ] T023 [P] Create base CSS stylesheet `frontend/src/styles/main.css` with WCAG 2.1 AA accessible color contrasts and typography
- [ ] T024 Create accessibility utilities module `frontend/src/utils/accessibility.js` (ARIA labels, focus management, keyboard navigation helpers)
- [ ] T025 [P] Create API client service `frontend/src/services/calculatorApi.js` with methods for calling backend endpoints
- [ ] T026 Create error handling and user feedback component `frontend/src/utils/errorHandler.js` (user-friendly messages, logging)
- [ ] T027 Create form validation utilities `frontend/src/utils/validation.js` (input sanitization, expression validation)

**Checkpoint**: Foundation complete - backend AST infrastructure and frontend UI foundation ready for user stories

---

## Phase 3: User Story 1 - Convert Between Standard Units (Priority: P1) 🎯 MVP

**Goal**: Enable users to convert physical measurements between metric, imperial, and SI unit systems with accuracy ±0.00001

**Independent Test**: Can be tested by executing unit conversion operations (e.g., "5 km to miles", "32°F to Celsius") and verifying results within specification tolerance without depending on scientific functions (US2) or expressions (US3)

**Acceptance Criteria**:
- ✅ Conversion 5 km → 3.10686 miles (within 5 decimals)
- ✅ Conversion 32°F → 0°C (temperature offset handling correct)
- ✅ Conversion 220 lbs → 99.79 kg (mass conversion accurate)
- ✅ Invalid unit pair rejected with clear error message
- ✅ Negative/zero values handled correctly per unit type

### Tests for User Story 1 ⚠️

> **WRITE THESE TESTS FIRST - ensure they FAIL before implementation**

- [ ] T028 [P] [US1] Unit test for kilometer-to-mile conversion in `tests/unit/test_conversions.py` (test accurate conversion factors, edge cases)
- [ ] T029 [P] [US1] Unit test for temperature conversions (Celsius ↔ Fahrenheit ↔ Kelvin) in `tests/unit/test_temperature_conversions.py` (test offset formulas)
- [ ] T030 [P] [US1] Unit test for mass conversions in `tests/unit/test_mass_conversions.py` (pound ↔ kg, gram conversions)
- [ ] T031 [P] [US1] Unit test for volume conversions in `tests/unit/test_volume_conversions.py` (liter ↔ gallon conversions)
- [ ] T032 [P] [US1] Unit test for invalid unit pair error handling in `tests/unit/test_conversion_errors.py` (unknown units, incompatible dimensions)
- [ ] T033 [P] [US1] Integration test for unit conversion workflow in `tests/integration/test_unit_conversion_workflow.py` (end-to-end conversion operations)
- [ ] T034 [P] [US1] Accessibility test for conversion results display in `frontend/tests/accessibility/test_conversion_display.js` (WCAG contrast, labels, keyboard access)

### Implementation for User Story 1

- [ ] T035 [P] [US1] Implement `convert()` method in `src/scientific_calculator/units.py` with Pint integration (value, from_unit, to_unit → converted_value)
- [ ] T036 [P] [US1] Implement `is_compatible()` method in `src/scientific_calculator/units.py` to check unit dimensionality
- [ ] T037 [P] [US1] Implement `get_conversion_factor()` in `src/scientific_calculator/units.py` to retrieve raw conversion ratios
- [ ] T038 [US1] Add temperature conversion logic in `src/scientific_calculator/units.py` with proper offset-based formula handling
- [ ] T039 [US1] Implement parsing for unit conversion syntax in `src/scientific_calculator/expression_evaluator.py` (support "X unit to unit" format)
- [ ] T040 [US1] Add validation in `src/scientific_calculator/units.py` for unsupported units with helpful error messages
- [ ] T041 [P] [US1] Create conversion API endpoint in `src/scientific_calculator/api.py` → `convert(value, from_unit, to_unit)` with error handling
- [ ] T042 [US1] Implement result formatting in `src/scientific_calculator/units.py` (5 decimal places, unit symbols, exponential notation for extreme values)
- [ ] T043 [P] [US1] Create input form component `frontend/src/components/ConversionForm.js` (number input, unit selectors, submit button)
- [ ] T044 [P] [US1] Create results display component `frontend/src/components/ConversionResult.js` (result formatting, unit display, accessibility labels)
- [ ] T045 [US1] Implement conversion form handler in `frontend/src/components/ConversionForm.js` (validation, API call, error handling)
- [ ] T046 [P] [US1] Create unit selector component `frontend/src/components/UnitSelector.js` (dropdown with grouped unit categories, search)
- [ ] T047 [US1] Connect frontend form to backend API in `frontend/src/services/calculatorApi.js` → `convert()` method
- [ ] T048 [US1] Add error message display for conversion errors in `frontend/src/components/ErrorDisplay.js` (user-friendly, accessibility-compliant)
- [ ] T049 [US1] Add type hints to all conversion functions in `src/scientific_calculator/units.py` (mypy --strict)
- [ ] T050 [US1] Run mypy --strict on backend modules for User Story 1
- [ ] T051 [US1] Run pytest with coverage on User Story 1 tests (target ≥85%)
- [ ] T052 [US1] Run accessibility tests on frontend components (axe-core) ensuring WCAG 2.1 AA compliance
- [ ] T053 [US1] Manual testing: Test all acceptance scenarios from spec (km→mi, °F→°C, lbs→kg, error cases)

**Checkpoint**: User Story 1 complete and independently testable. Unit conversions work end-to-end (backend + frontend). Can be deployed as MVP.

---

## Phase 4: User Story 2 - Perform Scientific Calculations (Priority: P1)

**Goal**: Enable users to perform advanced mathematical operations (trigonometry, logarithmic, exponential, statistical) with accuracy ±1e-6

**Independent Test**: Can be tested by executing scientific functions with known inputs and verifying outputs (sin(30°)=0.5, log₁₀(100)=2, mean([1,2,3,4,5])=3) without depending on unit conversions (US1) or compound expressions (US3)

**Acceptance Criteria**:
- ✅ Trigonometric functions (sin, cos, tan, asin, acos, atan) return correct results in degrees
- ✅ Logarithmic functions (log₁₀, ln, logₙ) accept valid arguments and reject invalid ones (log of negative)
- ✅ Exponential functions (e^x, x^y, sqrt, nth root) return accurate results
- ✅ Statistical functions (mean, median, mode, stdev, variance) handle various dataset sizes (1-10,000 values)
- ✅ Domain errors clearly explain constraints (e.g., "log() requires x > 0")

### Tests for User Story 2 ⚠️

> **WRITE THESE TESTS FIRST - ensure they FAIL before implementation**

- [ ] T054 [P] [US2] Unit test for trigonometric functions in `tests/unit/test_trigonometric.py` (sin/cos/tan in degrees, arcsin/arccos/atan accuracy)
- [ ] T055 [P] [US2] Unit test for logarithmic functions in `tests/unit/test_logarithmic.py` (log₁₀, ln, arbitrary base, domain validation)
- [ ] T056 [P] [US2] Unit test for exponential functions in `tests/unit/test_exponential.py` (e^x, x^y, sqrt, nth root accuracy)
- [ ] T057 [P] [US2] Unit test for statistical functions in `tests/unit/test_statistical.py` (mean, median, mode, stdev, variance on various datasets)
- [ ] T058 [P] [US2] Unit test for domain error handling in `tests/unit/test_scientific_errors.py` (log of negative, sqrt of negative, stdev with 1 value)
- [ ] T059 [P] [US2] Integration test for scientific calculation workflow in `tests/integration/test_scientific_workflow.py` (chained functions, result formatting)
- [ ] T060 [P] [US2] Accessibility test for function input controls in `frontend/tests/accessibility/test_function_controls.js` (labels, focus states, error announcements)

### Implementation for User Story 2

- [ ] T061 [P] [US2] Implement trigonometric functions (sin, cos, tan, asin, acos, atan) in `src/scientific_calculator/functions.py` with degree-to-radian conversion
- [ ] T062 [P] [US2] Implement logarithmic functions (log₁₀, ln, logₙ) in `src/scientific_calculator/functions.py` with domain validation (x > 0)
- [ ] T063 [P] [US2] Implement exponential functions (e^x, x^y, sqrt, nth root) in `src/scientific_calculator/functions.py` with validation
- [ ] T064 [P] [US2] Implement statistical functions (mean, median, mode, stdev, variance) in `src/scientific_calculator/functions.py` with dataset size validation
- [ ] T065 [US2] Add mathematical constant handling (π, e) in `src/scientific_calculator/expression_evaluator.py` visit_Name method
- [ ] T066 [US2] Implement visit_Call in `src/scientific_calculator/expression_evaluator.py` for function calls with domain validation
- [ ] T067 [US2] Register all scientific functions in whitelisted function dictionary in `src/scientific_calculator/functions.py`
- [ ] T068 [P] [US2] Create scientific function API endpoint in `src/scientific_calculator/api.py` → `evaluate_function(name, args)` method
- [ ] T069 [US2] Implement input parsing for function notation in `src/scientific_calculator/expression_evaluator.py` (sin(30), log(100), mean(1,2,3))
- [ ] T070 [US2] Add comprehensive error messages for domain errors in `src/scientific_calculator/functions.py` (suggest valid input ranges)
- [ ] T071 [P] [US2] Create scientific function input component `frontend/src/components/FunctionInput.js` (function selector, argument inputs, help text)
- [ ] T072 [P] [US2] Create function result display component `frontend/src/components/FunctionResult.js` (formatted output, precision control, copy-to-clipboard)
- [ ] T073 [US2] Implement function input handler in `frontend/src/components/FunctionInput.js` (validation, API call, error display)
- [ ] T074 [US2] Add function reference guide in `frontend/src/components/FunctionHelp.js` (available functions, examples, parameter guidance)
- [ ] T075 [P] [US2] Create statistical dataset input component `frontend/src/components/StatisticalInput.js` (text area or CSV, parsing, validation)
- [ ] T076 [US2] Connect function components to backend API in `frontend/src/services/calculatorApi.js` → `evaluateFunction()` method
- [ ] T077 [US2] Add type hints to all function definitions in `src/scientific_calculator/functions.py` (mypy --strict)
- [ ] T078 [US2] Run mypy --strict on backend modules for User Story 2
- [ ] T079 [US2] Run pytest with coverage on User Story 2 tests (target ≥85%)
- [ ] T080 [US2] Run accessibility tests on frontend function components (axe-core) ensuring WCAG 2.1 AA compliance
- [ ] T081 [US2] Manual testing: Test all acceptance scenarios from spec (sin(30°), log(100), mean([1,2,3,4,5]), error cases)

**Checkpoint**: User Story 2 complete and independently testable. Scientific functions work end-to-end (backend + frontend). Can be integrated with US1 or deployed separately.

---

## Phase 5: User Story 3 - Combine Operations in Expressions (Priority: P1)

**Goal**: Enable users to chain unit conversions and scientific operations in compound expressions with proper operator precedence

**Independent Test**: Can be tested by parsing and evaluating compound expressions (e.g., "sin(30) * 2 + 5", "(sqrt(16) * 2) + log(1000)") and verifying order of operations without depending on other stories (can be tested independently once Phase 2 complete)

**Acceptance Criteria**:
- ✅ Expressions evaluate with correct operator precedence (multiply before add)
- ✅ Parentheses override precedence correctly
- ✅ Function calls within expressions resolve properly
- ✅ Unit conversions within expressions combine correctly
- ✅ Error messages clearly identify the problem location

### Tests for User Story 3 ⚠️

> **WRITE THESE TESTS FIRST - ensure they FAIL before implementation**

- [ ] T082 [P] [US3] Unit test for operator precedence in `tests/unit/test_expression_precedence.py` (multiply before add, exponent right-associative)
- [ ] T083 [P] [US3] Unit test for parentheses grouping in `tests/unit/test_expression_grouping.py` (correct override of precedence)
- [ ] T084 [P] [US3] Unit test for function composition in `tests/unit/test_function_composition.py` (nested functions, sin(log(x)))
- [ ] T085 [P] [US3] Unit test for mixed conversions and operations in `tests/unit/test_mixed_expressions.py` (5km / 2 hours, unit combinations)
- [ ] T086 [P] [US3] Unit test for expression error locations in `tests/unit/test_expression_errors.py` (clear position reporting for syntax/domain errors)
- [ ] T087 [P] [US3] Integration test for complex expression workflows in `tests/integration/test_complex_expressions.py` (end-to-end parsing and evaluation)
- [ ] T088 [P] [US3] Accessibility test for expression input field in `frontend/tests/accessibility/test_expression_input.js` (labels, error announcements, keyboard navigation)

### Implementation for User Story 3

- [ ] T089 [US3] Implement `visit_BinOp()` in `src/scientific_calculator/expression_evaluator.py` for binary operations with unit awareness
- [ ] T090 [US3] Implement `visit_UnaryOp()` in `src/scientific_calculator/expression_evaluator.py` for unary operations (negation, positive)
- [ ] T091 [US3] Implement `visit_Constant()` in `src/scientific_calculator/expression_evaluator.py` for numeric literals
- [ ] T092 [US3] Implement `visit_Name()` in `src/scientific_calculator/expression_evaluator.py` for variable references (units, constants)
- [ ] T093 [US3] Implement `evaluate()` public method in `src/scientific_calculator/expression_evaluator.py` with full error handling
- [ ] T094 [US3] Add expression validation in `src/scientific_calculator/expression_evaluator.py` (max length 1000 chars, balanced parentheses, character whitelist)
- [ ] T095 [US3] Implement Pint-aware operations in `src/scientific_calculator/expression_evaluator.py` visit methods (unit multiplication/division/cancellation)
- [ ] T096 [US3] Add dimensionality error handling for incompatible unit operations in `src/scientific_calculator/expression_evaluator.py`
- [ ] T097 [P] [US3] Create expression evaluation API endpoint in `src/scientific_calculator/api.py` → `evaluate(expression)` method
- [ ] T098 [US3] Implement expression syntax validation with helpful error messages in `src/scientific_calculator/expression_evaluator.py`
- [ ] T099 [P] [US3] Create expression input component `frontend/src/components/ExpressionInput.js` (text input with code-like styling, submit button, history)
- [ ] T100 [P] [US3] Create expression result display component `frontend/src/components/ExpressionResult.js` (formatted output with unit display, copy-to-clipboard)
- [ ] T101 [US3] Implement expression input handler in `frontend/src/components/ExpressionInput.js` (real-time validation, API call, result display)
- [ ] T102 [US3] Add expression syntax help/hints in `frontend/src/components/ExpressionHelp.js` (syntax examples, operator precedence explanation)
- [ ] T103 [P] [US3] Create expression history component `frontend/src/components/HistoryPanel.js` (recent expressions, one-click repeat)
- [ ] T104 [US3] Implement expression parsing error handling with position feedback in `frontend/src/utils/expressionError.js` (highlight error location)
- [ ] T105 [US3] Connect expression component to backend API in `frontend/src/services/calculatorApi.js` → `evaluateExpression()` method
- [ ] T106 [US3] Add type hints to expression evaluator in `src/scientific_calculator/expression_evaluator.py` (mypy --strict)
- [ ] T107 [US3] Run mypy --strict on backend modules for User Story 3
- [ ] T108 [US3] Run pytest with coverage on User Story 3 tests (target ≥85%)
- [ ] T109 [US3] Run accessibility tests on frontend expression components (axe-core) ensuring WCAG 2.1 AA compliance
- [ ] T110 [US3] Manual testing: Test all acceptance scenarios from spec (precedence, parentheses, function composition, mixed expressions)

**Checkpoint**: User Story 3 complete. All three user stories now functional. Full scientific calculator MVP ready.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, documentation, testing, and quality improvements across all user stories

- [ ] T111 [P] Complete docstrings for all public functions in `src/scientific_calculator/` (NumPy/Google style with type annotations)
- [ ] T112 [P] Create API documentation in `docs/api.md` (endpoint signatures, examples, error codes)
- [ ] T113 [P] Create user guide in `docs/user-guide.md` (feature overview, examples, tips)
- [ ] T114 [P] Create developer guide in `docs/developer-guide.md` (architecture, extending functions, adding units)
- [ ] T115 Update README.md with usage examples for all three user stories
- [ ] T116 [P] Run final mypy --strict check on entire backend codebase
- [ ] T117 [P] Run full pytest suite with coverage report (target ≥85% across all stories)
- [ ] T118 [P] Run ruff linting on all Python files
- [ ] T119 [P] Run ESLint on all JavaScript files
- [ ] T120 [P] Run accessibility audit (axe-core) on entire frontend
- [ ] T121 [P] Run performance profiling on expression evaluator (ensure <100ms per query, <5ms typical)
- [ ] T122 [P] Run performance tests on UI response time (ensure <200ms)
- [ ] T123 Add additional unit tests for edge cases not covered in user story tests
- [ ] T124 Add integration tests for cross-story interactions (conversion in expression, function with unit result)
- [ ] T125 [P] Update quickstart.md with examples covering all three user stories
- [ ] T126 Create CHANGELOG.md documenting v1.0.0 release
- [ ] T127 Verify all code meets constitution requirements (type safety, TDD, error handling, versioning, accessibility)
- [ ] T128 Manual end-to-end testing: Run through complete workflows combining all three stories

**Checkpoint**: Fully polished scientific calculator ready for v1.0.0 release

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phase 3-5)**: All depend on Foundational completion
  - Can proceed in parallel (if team capacity allows)
  - Or sequentially in priority order (all P1: US1 → US2 → US3)
  - Each story independent and testable
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1** (P1 - Unit Conversions): No dependencies on other stories - fully independent
- **User Story 2** (P1 - Scientific Calculations): No dependencies on other stories - fully independent
- **User Story 3** (P1 - Compound Expressions): Can integrate US1 and US2 but is independently testable

### Within Each User Story

1. **Tests first** (TDD requirement): Write all test tasks and ensure they FAIL before implementation
2. **Models before services**: Infrastructure before logic
3. **Services before endpoints**: Business logic before API exposure
4. **Backend before frontend**: Core functionality before UI
5. **Core implementation before integration**: Feature completeness before polish

### Parallel Opportunities

**Phase 1 - Setup**:
- All [P] marked tasks can run in parallel (different files, no dependencies)
- Estimated: 2-3 days serial, 1 day with parallelization

**Phase 2 - Foundational**:
- T014-T016, T019 (backend unit setup) can run in parallel
- T022-T023, T025 (frontend base setup) can run in parallel
- Backend and frontend infrastructure can run in parallel
- Estimated: 3-4 days serial, 2 days with full parallelization

**Phase 3-5 - User Stories**:
- Once Foundational complete, all 3 user stories can start in parallel (independent)
- Within each story:
  - All [P] test tasks can run in parallel
  - All [P] backend tasks can run in parallel (different files)
  - All [P] frontend component tasks can run in parallel
  - Backend and frontend work can run in parallel
- Estimated: 5-7 days per story serial, 2-3 days with 3 developers (one per story)

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Fastest to Market

1. Complete Phase 1: Setup (1-2 days)
2. Complete Phase 2: Foundational (2-3 days)
3. Complete Phase 3: User Story 1 (3-4 days)
4. **STOP and VALIDATE**: Test US1 independently, get feedback
5. Deploy/demo MVP (unit conversions only)
6. **Total: 6-9 days to MVP with unit conversions working**

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Foundation ready (3-5 days)
2. Add User Story 1 → Test independently → Deploy (3-4 days) → **MVP: Unit Conversions**
3. Add User Story 2 → Test independently → Deploy (3-4 days) → **v1.1: Scientific Functions**
4. Add User Story 3 → Test independently → Deploy (3-4 days) → **v1.2: Compound Expressions**
5. Polish + Release (1-2 days) → **v1.0 Feature Complete**
6. **Total: 13-19 days to fully featured product, with MVPs deployed weekly**

### Parallel Team Strategy (Fastest)

With 3+ developers:

1. Everyone: Setup (1-2 days)
2. Everyone: Foundational (2-3 days)
3. Once Foundational complete:
   - Developer A: User Story 1 (3-4 days)
   - Developer B: User Story 2 (3-4 days)
   - Developer C: User Story 3 (3-4 days)
4. All together: Polish phase (1-2 days)
5. **Total: 7-11 days to fully featured product** (instead of 13-19 days)

---

## Task Count Summary

| Phase | Count | Details |
|-------|-------|---------|
| Phase 1: Setup | 12 | Project structure, dependencies, testing framework, linting |
| Phase 2: Foundational | 14 | Exception handling, unit system, function registry, API skeleton, frontend foundation |
| Phase 3: User Story 1 | 26 | 7 tests + 22 implementation (backend + frontend) |
| Phase 4: User Story 2 | 27 | 7 tests + 20 implementation (backend + frontend) |
| Phase 5: User Story 3 | 29 | 8 tests + 21 implementation (backend + frontend) |
| Phase 6: Polish | 18 | Documentation, testing, linting, accessibility, performance |
| **TOTAL** | **126 tasks** | 22 tests + 104 implementation |

---

## Notes

- All backend tasks have type hints and pass `mypy --strict` (constitution requirement)
- All tests follow TDD: write tests first, ensure they FAIL before implementation (constitution requirement)
- All frontend components must pass WCAG 2.1 AA accessibility tests (constitution v1.1.0 requirement)
- Each user story independently testable and deployable (MVP-first approach)
- [P] tasks = different files, no inter-task dependencies within a phase
- [Story] label maps task to user story for traceability and independent team assignment
- Commit after each completed task or logical task group
- Stop at any checkpoint (after each phase) to validate and gather feedback
- Use git branches per user story for parallel team development: `us1-conversions`, `us2-functions`, `us3-expressions`

---

## Success Metrics

- ✅ All tasks completed with status checked
- ✅ All tests passing (pytest coverage ≥85%)
- ✅ mypy --strict with zero errors
- ✅ WCAG 2.1 AA accessibility compliance on all UI
- ✅ Performance: <100ms per backend evaluation, <200ms UI response
- ✅ Each user story independently deployable
- ✅ Constitution requirements satisfied
