# Tasks: Redesign Calculator UI - Unified Multi-Column Layout

**Input**: Design documents from `specs/002-redesign-calculator-ui/`
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), quickstart.md (✅)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- **File paths**: All paths relative to project root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and CSS Grid foundation

- [x] T001 Create CSS Grid layout foundation in `frontend/src/styles/main.css` with container setup
- [x] T002 [P] Create new responsive stylesheet in `frontend/src/styles/responsive.css` for media queries
- [x] T003 [P] Create calculator sections styling file in `frontend/src/styles/calculator-sections.css`
- [x] T004 Configure Vitest/Jest for responsive layout testing in `frontend/package.json`
- [x] T005 [P] Install axe-core for accessibility testing in `frontend/package.json`
- [x] T006 Create test configuration file `frontend/jest.config.js` for accessibility tests

**Checkpoint**: CSS infrastructure ready for component implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout components that enable all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create CalculatorLayout component in `frontend/src/components/CalculatorLayout.js` with CSS Grid system
- [x] T008 Create CalculatorSection wrapper component in `frontend/src/components/CalculatorSection.js` with ARIA attributes
- [x] T009 Update main.js layout in `frontend/src/main.js` to use new layout component structure (remove tabs, add grid)
- [x] T010 [P] Create responsive breakpoint utilities in `frontend/src/utils/responsive.js` for viewport detection
- [x] T011 [P] Document responsive breakpoints in `frontend/src/styles/responsive.css` (768px, 1200px)

**Checkpoint**: Layout infrastructure complete - user story implementation can now begin

---

## Phase 3: User Story 1 - View All Calculators at Once (Priority: P1) 🎯 MVP

**Goal**: Display all three calculators simultaneously without tabs, improving discoverability and user experience

**Independent Test**: Open calculator interface and verify:
1. All three calculators (Unit Conversions, Scientific Functions, Expression Evaluator) visible at once
2. No tab navigation elements present
3. Each calculator maintains full functionality
4. Clear visual separation between calculators

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T012 [P] [US1] Responsive layout test for desktop view in `frontend/tests/responsive-layout.test.js` - verify 2-3 columns visible
- [x] T013 [P] [US1] DOM structure test in `frontend/tests/dom-structure.test.js` - verify all 3 calculators in DOM
- [x] T014 [P] [US1] Tab removal test in `frontend/tests/navigation.test.js` - verify no tab elements present
- [x] T015 [P] [US1] Calculator visibility test in `frontend/tests/visibility.test.js` - verify all calculators visible at load

### Implementation for User Story 1

- [x] T016 [P] [US1] Wrap ConversionForm in CalculatorSection in `frontend/src/main.js` (Title: "Unit Conversions")
- [x] T017 [P] [US1] Wrap FunctionInput in CalculatorSection in `frontend/src/main.js` (Title: "Scientific Functions")
- [x] T018 [P] [US1] Wrap ExpressionInput in CalculatorSection in `frontend/src/main.js` (Title: "Expression Evaluator")
- [x] T019 [US1] Mount CalculatorLayout as main container in `frontend/src/main.js` replacing tab-based layout
- [x] T020 [US1] Apply base mobile-first styles to CalculatorLayout in `frontend/src/styles/main.css` (1 column, 100% width)
- [x] T021 [US1] Remove all tab-related HTML/CSS from `frontend/src/main.js` (tab buttons, tab content divs)
- [x] T022 [US1] Verify all calculator functionality unchanged in manual testing (inputs, outputs, calculations work)

**Checkpoint**: User Story 1 complete - all three calculators visible simultaneously without tabs

---

## Phase 4: User Story 2 - Responsive Multi-Column Layout (Priority: P2)

**Goal**: Display calculators optimally across desktop, tablet, and mobile viewports with proper spacing and readability

**Independent Test**: Resize browser window and verify:
1. Desktop (1200px+): Calculators in 2-3 columns, efficient space usage
2. Tablet (768-1199px): Calculators in 1-2 columns, readable inputs
3. Mobile (<768px): Calculators stacked vertically, full-width inputs
4. No horizontal scrolling at any breakpoint
5. Smooth transitions between breakpoints

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T023 [P] [US2] Tablet breakpoint test (768px) in `frontend/tests/responsive-layout.test.js` - verify 1-2 columns
- [x] T024 [P] [US2] Desktop breakpoint test (1200px+) in `frontend/tests/responsive-layout.test.js` - verify 3 columns
- [x] T025 [P] [US2] Mobile breakpoint test (<768px) in `frontend/tests/responsive-layout.test.js` - verify 1 column stacking
- [x] T026 [P] [US2] No horizontal scrolling test in `frontend/tests/horizontal-scroll.test.js` - verify width ≤ viewport
- [x] T027 [P] [US2] Touch target size test in `frontend/tests/accessibility.test.js` - verify ≥44px on mobile
- [x] T028 [US2] Breakpoint transition test in `frontend/tests/responsive-layout.test.js` - verify smooth resizing

### Implementation for User Story 2

- [x] T029 [P] [US2] Add tablet media query (768px) in `frontend/src/styles/responsive.css` - 2 column layout
- [x] T030 [P] [US2] Add desktop media query (1200px) in `frontend/src/styles/responsive.css` - 3 column layout
- [x] T031 [P] [US2] Set gap/spacing for tablet in `frontend/src/styles/responsive.css` (20px gap)
- [x] T032 [P] [US2] Set gap/spacing for desktop in `frontend/src/styles/responsive.css` (24px gap)
- [x] T033 [US2] Add max-width constraint for desktop in `frontend/src/styles/responsive.css` (1400px)
- [x] T034 [US2] Center layout on desktop in `frontend/src/styles/responsive.css` (margin: 0 auto)
- [x] T035 [US2] Test responsive layout at all 3 breakpoints manually (resize browser)
- [x] T036 [US2] Verify no layout shifts or overflow at edge cases (<360px, 4K displays)

**Checkpoint**: User Stories 1 AND 2 complete - responsive layout working across all devices

---

## Phase 5: User Story 3 - Visual Hierarchy and Organization (Priority: P2)

**Goal**: Apply distinct styling to each calculator section for visual identification and improved UX

**Independent Test**: Visually inspect calculator page and verify:
1. Each section has clear, visible title (Unit Conversions / Scientific Functions / Expression Evaluator)
2. Distinct background colors or cards distinguish sections
3. Clear borders or spacing separate sections visually
4. Non-technical user can identify calculator types without relying on functionality
5. Input field purposes are clear via labels and placeholders

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T037 [P] [US3] Section title rendering test in `frontend/tests/visual-hierarchy.test.js` - verify h2 with section title
- [x] T037 [P] [US3] Section styling test in `frontend/tests/visual-hierarchy.test.js` - verify background color applied
- [x] T038 [P] [US3] Border/spacing test in `frontend/tests/visual-hierarchy.test.js` - verify visual separation
- [x] T039 [P] [US3] Color contrast test in `frontend/tests/accessibility.test.js` - verify ≥4.5:1 contrast ratio
- [x] T040 [US3] Visual regression test in `frontend/tests/visual-regression.test.js` - baseline screenshots at 3 breakpoints

### Implementation for User Story 3

- [x] T041 [P] [US3] Add section titles to each calculator in `frontend/src/main.js` ("Unit Conversions", "Scientific Functions", "Expression Evaluator")
- [x] T042 [P] [US3] Apply background color to .calculator-section in `frontend/src/styles/calculator-sections.css` (#f9fafb or neutral)
- [x] T043 [P] [US3] Add border styling to .calculator-section in `frontend/src/styles/calculator-sections.css` (1px solid, light border)
- [x] T044 [P] [US3] Set border-radius for card styling in `frontend/src/styles/calculator-sections.css` (8px)
- [x] T045 [P] [US3] Add padding to sections in `frontend/src/styles/calculator-sections.css` (16px mobile, 20px tablet, 24px desktop)
- [x] T046 [US3] Style section titles in `frontend/src/styles/calculator-sections.css` (18px mobile, 20px desktop, weight 600, margin 0 0 12px 0)
- [x] T047 [US3] Apply optional distinct colors per section in `frontend/src/styles/calculator-sections.css` (blue for conversions, green for functions, purple for expressions - or all neutral)
- [x] T048 [US3] Verify labels and placeholders are clear in existing calculator components (no changes needed)
- [x] T049 [US3] Visual test: Take screenshots at 3 breakpoints, verify visual distinction clear

**Checkpoint**: All user stories complete - UI redesign fully implemented with visual organization

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality assurance, testing, and documentation

- [x] T050 [P] Run responsive layout tests (Vitest/Jest) in `frontend/tests/responsive-layout.test.js`
- [x] T051 [P] Run accessibility tests (axe-core) in `frontend/tests/accessibility.test.js` - verify WCAG 2.1 AA compliance
- [x] T052 [P] Run visual regression tests in `frontend/tests/visual-regression.test.js` at 3 breakpoints
- [x] T053 [P] Keyboard navigation test: Tab through all inputs, verify focus order logical
- [x] T054 [P] Screen reader test: Test with NVDA/VoiceOver, verify sections announced
- [x] T055 [P] Manual cross-browser testing (Chrome, Firefox, Safari, Edge) at 3 breakpoints
- [x] T056 Manual touch testing on iOS and Android devices for mobile experience
- [x] T057 Performance test: Verify page load time increase ≤10% vs tab version
- [x] T058 Memory test: Verify no memory leaks on resize events (debounce working)
- [x] T059 Update documentation in `frontend/README.md` with responsive design notes
- [x] T060 Run ESLint on all CSS/JS files in `frontend/src/` - zero errors required
- [x] T061 Run Prettier formatting check in `frontend/src/`
- [x] T062 Validate all calculator functionality unchanged (manual smoke test)
- [x] T063 Create user story demo (screenshots or video) showing layout at 3 breakpoints
- [x] T064 Run quickstart.md validation checklist to confirm all success criteria met
- [x] T065 Final review: Verify no regressions in existing calculator functionality

**Checkpoint**: Polish complete - production-ready responsive calculator UI

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - CRITICAL, BLOCKS user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP deliverable
- **User Story 2 (Phase 4)**: Depends on US1 completion (adds breakpoint styles)
- **User Story 3 (Phase 5)**: Depends on US2 completion (adds visual styling)
- **Polish (Phase 6)**: Depends on all stories completion

### User Story Dependencies

- **User Story 1 (MVP)**: Can start after Foundational - No dependencies on other stories - Independently testable
- **User Story 2**: Can start after US1 - Builds on US1 layout - Independently testable
- **User Story 3**: Can start after US2 - Adds styling to US2 layout - Independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- CSS foundation before specific styling
- Core implementation before optional enhancements
- Story complete before moving to next priority

### Parallel Opportunities (if team capacity allows)

**Phase 1 (Setup)**:
- All [P] tasks can run in parallel (different files, no dependencies)
- CSS files: main.css, responsive.css, calculator-sections.css in parallel
- Test setup: Vitest/Jest config and axe-core setup in parallel

**Phase 2 (Foundational)**:
- Layout components (CalculatorLayout, CalculatorSection) can start in parallel
- Responsive utilities and breakpoint documentation in parallel
- All tasks can start once Phase 1 complete

**Phase 3 (User Story 1)**:
- All tests [P] can write in parallel
- All wrapper implementations [P] can start after tests pass
- Single developer team: Sequential (write tests → implement → verify)

**Phase 4-5 (User Stories 2-3)**:
- If two developers: Developer A on US2, Developer B on US3 (after Phase 3 complete)
- Both stories can run in parallel after US1 baseline established

---

## Parallel Example: Phase 1 Setup

```bash
# All these can run in parallel:
Task T002: Create responsive.css
Task T003: Create calculator-sections.css
Task T004: Configure Vitest in package.json
Task T005: Install axe-core in package.json
```

---

## Parallel Example: Phase 3 User Story 1 Tests

```bash
# All tests can be written in parallel:
Task T012: Desktop layout test
Task T013: DOM structure test
Task T014: Tab removal test
Task T015: Visibility test
# Then all implementations can start in parallel:
Task T016: Wrap ConversionForm
Task T017: Wrap FunctionInput
Task T018: Wrap ExpressionInput
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - **RECOMMENDED**

1. Complete Phase 1: Setup (CSS infrastructure)
2. Complete Phase 2: Foundational (Layout components)
3. Complete Phase 3: User Story 1 (Display all calculators)
4. **STOP and VALIDATE**: Test US1 independently - all calculators visible, no tabs
5. **DEMO/RELEASE**: US1 is production-ready MVP

### Incremental Delivery (User Stories 2 & 3)

After MVP validation:

1. Add Phase 4: User Story 2 (Responsive breakpoints)
2. Test US2 independently - layout adapts to mobile/tablet/desktop
3. Add Phase 3: User Story 3 (Visual styling)
4. Test US3 independently - sections clearly identified
5. Run Phase 6: Polish & Testing
6. Final validation and deployment

### Parallel Team Strategy (if 3+ developers)

1. **Sprint 1**: All developers complete Phase 1 + Phase 2 together (Setup + Foundational)
2. **Sprint 2**: Once Phase 2 done:
   - Developer A: Phase 3 (User Story 1)
   - Developer B: Phase 4 (User Story 2)
   - Developer C: Phase 5 (User Story 3)
3. **Sprint 3**: Phase 6 (Polish & Testing) together
4. Stories can complete independently and integrate naturally

---

## Success Metrics

Each user story achieves **independent functionality**:

**US1 Success**: All three calculators visible, no tabs, all calculator features work
**US2 Success**: Layout responsive at 3 breakpoints, no horizontal scrolling anywhere
**US3 Success**: Each calculator visually distinct, 100% user identification accuracy
**Overall Success**: WCAG 2.1 AA compliant, <10% load time increase, smooth 60fps transitions

---

## Notes

- [P] = Different files, no dependencies - can parallelize
- [Story] = Traceability to specific user story (US1, US2, US3)
- Each user story independently completable and testable
- Tests must fail before implementation (TDD approach)
- Commit after each task or logical group (2-3 tasks per commit)
- Stop at any checkpoint to validate story independently
- Use quickstart.md (specs/002-redesign-calculator-ui/quickstart.md) as developer reference

---

## Time Estimation (Single Developer)

- Phase 1 (Setup): 1-2 hours (CSS infrastructure)
- Phase 2 (Foundational): 2-3 hours (Layout components)
- Phase 3 (US1): 2-3 hours (Wrap calculators, remove tabs)
- Phase 4 (US2): 2-3 hours (Add responsive breakpoints)
- Phase 5 (US3): 1-2 hours (Add visual styling)
- Phase 6 (Polish): 2-3 hours (Testing, accessibility, docs)
- **Total**: ~12-16 hours for complete implementation

---

## Quick Start

1. Read `specs/002-redesign-calculator-ui/quickstart.md` for developer reference
2. Start Phase 1 (Setup) - CSS infrastructure
3. Complete Phase 2 (Foundational) - Layout components
4. Implement User Story 1 (MVP) - All calculators visible
5. Validate US1 independently before proceeding to US2/US3

