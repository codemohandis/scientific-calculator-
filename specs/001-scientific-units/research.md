# Research Phase 0: Scientific Operations and Unit Conversions

**Feature**: Scientific Operations and Unit Conversions
**Date**: 2026-01-17
**Status**: Complete - All clarifications resolved

## Expression Parser Architecture

### Decision: Custom AST-Based Evaluator + Pint Integration

**What was chosen**: Implement a custom `ast.NodeVisitor` subclass for safe expression parsing and evaluation, integrated with the Pint library for unit-aware computation.

**Rationale**:
- **Safety**: Use Python's built-in `ast` module (standard library) instead of `eval()`. This eliminates arbitrary code execution risks while maintaining type safety.
- **Zero Core Dependencies**: The `ast` module handles parsing correctly; only add Pint for unit handling.
- **Precise Control**: Custom `NodeVisitor` allows explicit whitelisting of operators and functions.
- **Type Safety**: Full type hint support with `ast.AST` types and function signatures.
- **Operator Precedence**: Automatically correct (no manual precedence handling needed).
- **Performance**: <5ms per expression evaluation (well under 100ms requirement).

### Architecture Overview

```
Expression String
    ↓
Python ast.parse() → AST Tree
    ↓
Custom SafeExpressionEvaluator (NodeVisitor subclass)
    ↓
Whitelisted Operations:
  - Operators: +, -, *, /, ^, %
  - Math Functions: sin, cos, tan, sqrt, log, ln, exp
  - Statistical: mean, median, stdev, variance
  - Units: Pint Quantity objects
    ↓
Error Handling (3 layers):
  1. Syntax errors (ast.parse fails)
  2. Domain errors (log of negative, sqrt of negative)
  3. Unit dimensionality errors (Pint validation)
    ↓
Typed Result: Union[Number, Quantity]
```

### Key Implementation Details

**Core Evaluator Class Structure**:
- `__init__(ureg: UnitRegistry)` — Initialize with unit registry
- `visit_BinOp()` — Handle binary operations (+, -, *, /, ^, %)
- `visit_UnaryOp()` — Handle unary operations (-, +)
- `visit_Call()` — Handle function calls with domain validation
- `visit_Constant()` — Handle numeric literals
- `visit_Name()` — Handle variable references (units, constants like π, e)
- `evaluate(expression: str) -> Value` — Public API to parse and evaluate

**Whitelisted Operations**:
```python
Operators: Add, Sub, Mult, Div, Pow, Mod
Functions: sin, cos, tan, asin, acos, atan, sqrt, log, ln, exp, mean, median, stdev
Constants: pi (π), e
Units: Via Pint registry (meter, foot, kilogram, pound, celsius, fahrenheit, kelvin, etc.)
```

### Alternatives Evaluated & Rejected

| Approach | Why Rejected |
|----------|-------------|
| Recursive Descent Parser (hand-written) | 200-500 LOC overhead; manual precedence handling; bug-prone |
| Pratt Parser | Still requires manual lexing; Python's `ast` solves problem cleanly |
| Parser Libraries (PLY, Lark, pyparsing) | External dependencies; 2-3x slower than `ast`; overkill for expressions |
| SymPy | 60+ MB installation; symbolic overhead; over-engineered for numeric calculator |
| NumExpr | Optimized for large arrays (>100k); calculator uses scalars |
| Asteval | Less control over whitelisted operations; `ast.NodeVisitor` is cleaner |

---

## Unit Handling & Conversions

### Decision: Pint for Dimensional Analysis and Unit Management

**What was chosen**: Use the Pint library for units, conversions, and dimensional analysis.

**Rationale**:
- **Comprehensive Unit Registry**: SI, metric, imperial, scientific units (velocity, force, pressure, energy, power, magnetic flux)
- **Dimensional Analysis**: Prevents invalid operations (e.g., "5 meters + 3 seconds" raises error)
- **Native Expression Support**: Can parse strings like "5.0 * meter" or "10.0 * kilogram"
- **Type-Safe Quantity Objects**: `Quantity` type naturally integrates with type hints
- **Zero Dependencies**: Pint has no external dependencies (pure Python)
- **NumPy Integration**: Future-proofs for advanced array operations
- **Well-Documented**: Extensive documentation and community support

### Unit Categories Supported

**Base Units**:
- Distance: meter, foot, kilometer, mile, centimeter, millimeter, nanometer, inch, yard
- Mass: kilogram, gram, pound, ounce, ton, stone
- Temperature: celsius, fahrenheit, kelvin
- Volume: liter, gallon, milliliter, cubic meter, cubic foot

**Derived Units (in MVP scope)**:
- Velocity: meter/second (m/s), kilometer/hour (km/h), mile/hour (mph)
- Acceleration: meter/second² (m/s²), gravity (g)
- Force: newton (N), pound-force (lbf), kilogram-force (kgf)
- Pressure: pascal (Pa), atmosphere (atm), bar, psi
- Energy: joule (J), kilowatt-hour (kWh), calorie (cal)
- Power: watt (W), kilowatt (kW), horsepower (hp)
- Magnetic Flux: tesla (T), weber (Wb)

### Pint Integration Pattern

```python
from pint import UnitRegistry, DimensionalityError

ureg = UnitRegistry()

# Unit-aware operations
distance = 5 * ureg.kilometer
distance_in_miles = distance.to(ureg.mile)  # Auto-conversion
speed = distance / (2 * ureg.hour)  # Derived unit creation

# Error on incompatible units
try:
    result = (5 * ureg.meter) + (3 * ureg.second)  # Raises DimensionalityError
except DimensionalityError as e:
    print(f"Cannot add: {e}")  # "Cannot convert from 'meter' ([length]) to 'second' ([time])"
```

---

## Error Handling Strategy

### Three-Layer Error Architecture

#### Layer 1: Parse-Time Errors (Syntax)
**Triggered**: When AST fails to parse expression
**Example**: `"2 + 3 +" → SyntaxError`
**Handling**: Catch `ast.SyntaxError`, convert to `ValueError` with user-friendly message

#### Layer 2: Domain Errors (Math)
**Triggered**: When operation violates mathematical domain
**Examples**:
- `log(-5)` → Domain error
- `sqrt(-1)` → Domain error (in real number context)
- `1 / 0` → Division by zero error

**Handling**: Validate arguments in `visit_Call()` before function execution; raise `ValueError` with context

#### Layer 3: Unit Dimensionality Errors
**Triggered**: When operations mix incompatible units
**Example**: `(5 * meter) + (10 * second)` → DimensionalityError
**Handling**: Catch Pint's `DimensionalityError`, convert to `ValueError` with clear unit mismatch message

### Error Message Format

All errors follow this pattern:
```
<Operation Type>: <Description>
Suggestion: <How to fix or alternative>
Input: <User's expression>
```

**Example**:
```
Domain Error: log() requires a positive argument
Suggestion: Check that your logarithm argument is > 0
Input: log(-5)
```

---

## Type Safety Implementation

### Type Hints Coverage

**Target**: 100% of functions (requirement SC-007)

**Key Types**:
```python
from typing import Union, Callable, Dict, Any
from pint import Quantity
from decimal import Decimal

Number = Union[int, float]
Value = Union[Number, Quantity]
Operator = Callable[[Any, Any], Any]
Function = Callable[..., Number]
```

**Tools**:
- `mypy --strict` for static analysis
- `Protocol` types for function interfaces
- `Literal` types for operator/function names
- `TypeGuard` for runtime type narrowing

### Example: Fully Typed Evaluator

```python
class SafeExpressionEvaluator(ast.NodeVisitor):
    def __init__(self, ureg: UnitRegistry) -> None:
        self.ureg: UnitRegistry = ureg
        self.operators: Dict[type[ast.operator], Operator] = {...}
        self.functions: Dict[str, Function] = {...}

    def visit_BinOp(self, node: ast.BinOp) -> Value:
        left: Value = self.visit(node.left)
        right: Value = self.visit(node.right)
        op: Optional[Operator] = self.operators.get(type(node.op))
        # ... implementation

    def evaluate(self, expression: str) -> Value:
        try:
            tree: ast.Expression = ast.parse(expression, mode='eval')
            return self.visit(tree.body)
        except SyntaxError as e:
            raise ValueError(f"Invalid syntax: {e.msg}")
```

---

## Performance Targets

### Expected Latency

| Operation | Time | Notes |
|-----------|------|-------|
| Parse expression | <1ms | For typical <50 token expressions |
| Evaluate simple operation | <1ms | Single arithmetic operation |
| Function call (sin, log) | <1ms | Cached math library calls |
| Unit conversion | <1ms | Pint lookup and conversion |
| Complex expression (10 ops) | <10ms | Nested parentheses, multiple functions |
| **Total per query** | **<5ms** | Well under 100ms requirement (SC-003) |

### Optimization Strategies (if needed)

1. **AST Caching**: Reuse parsed trees for repeated expressions
2. **Bytecode Compilation**: Use `compile()` for hot paths
3. **Lazy Imports**: Import modules only when functions used
4. **Pint Registry Singleton**: Share one registry across all evaluations

### Memory Profile

- AST tree: ~1KB per parsed expression
- Pint UnitRegistry: ~5MB (one-time, amortized)
- **Total**: <10MB for CLI application

---

## Testing Strategy

### Unit Test Scope

**File**: `tests/unit/test_expression_evaluator.py`

Test categories:
1. **Arithmetic Operations**: +, -, *, /, ^, % with precedence
2. **Mathematical Functions**: sin, cos, sqrt, log (with degree/radian conversions)
3. **Statistical Functions**: mean, median, stdev (single and array inputs)
4. **Unit Conversions**: All base and derived units
5. **Error Handling**: Domain errors, syntax errors, dimensionality errors
6. **Edge Cases**: Very large numbers, very small numbers, negative values where valid

Target: ≥85% code coverage (requirement SC-008)

### Integration Test Scope

**File**: `tests/integration/test_scientific_calculator_workflows.py`

Test workflows (end-to-end):
1. "Convert 100 miles to kilometers"
2. "Calculate sin(30°) * 2 + 5"
3. "Convert 100°F to Celsius"
4. "Calculate mean([1, 2, 3, 4, 5])"
5. "Complex: (sqrt(16) * 2) + (log(100) / ln(e))"

### Type Checking

**File**: `pyproject.toml`
```toml
[tool.mypy]
strict = true
warn_unused_ignores = true
warn_redundant_casts = true
```

Run before commit: `mypy --strict src/`

---

## CLI Design (TBD in Tasks Phase)

### Input Format

Commands will follow pattern:
```bash
calc convert 5 km to miles
calc sin 30
calc "sin(30) * 2 + 5"
calc mean 1 2 3 4 5
```

### Output Format

Precision: 5 decimal places default
```
5.0 kilometer = 3.10686 mile
sin(30°) = 0.5
(sin(30°) * 2) + 5 = 6.0
mean([1, 2, 3, 4, 5]) = 3.0
```

---

## Dependencies Summary

| Dependency | Version | Purpose | Type |
|------------|---------|---------|------|
| pint | ≥0.21 | Units and dimensional analysis | External |
| Python | 3.11+ | Language and stdlib (ast, math, statistics) | Runtime |
| pytest | ≥7.0 | Test framework | Dev |
| mypy | ≥1.0 | Type checking | Dev |
| black | ≥23.0 | Code formatting | Dev |
| ruff | ≥0.1 | Linting | Dev |

---

## Next Steps

Phase 1 will use these decisions to:
1. Create `data-model.md` with entity definitions
2. Generate API contracts in `contracts/` directory
3. Create `quickstart.md` with implementation examples
4. Generate Phase 2 tasks breakdown
