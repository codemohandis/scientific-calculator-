# API Contract: SafeExpressionEvaluator

**Module**: `src/scientific_calculator/expression_evaluator.py`
**Date**: 2026-01-17
**Status**: Contract (implementation pending)

## Overview

The `SafeExpressionEvaluator` is the core component that parses and evaluates mathematical expressions containing arithmetic operations, scientific functions, and unit-aware computations.

---

## Class: SafeExpressionEvaluator

### Constructor

```python
def __init__(self, ureg: UnitRegistry) -> None:
    """
    Initialize the expression evaluator with a unit registry.

    Args:
        ureg: Pint UnitRegistry instance for unit-aware computation

    Type signature: (UnitRegistry) -> None
    """
```

**Preconditions**:
- `ureg` must be a valid Pint `UnitRegistry` instance
- Registry should have all base and derived units pre-configured

**Postconditions**:
- Evaluator is ready to parse and evaluate expressions
- All operator and function whitelists are initialized

**Side Effects**: None (pure constructor)

---

### Method: evaluate

```python
def evaluate(self, expression: str) -> Value:
    """
    Parse and evaluate a mathematical expression.

    Args:
        expression: Expression string (e.g., "sin(30) * 2 + 5")

    Returns:
        Evaluated result (Number or Pint Quantity)
        Type: Union[int, float, Quantity]

    Raises:
        ValueError: For syntax, domain, or unit errors

    Type signature: (str) -> Union[int, float, Quantity]
    """
```

**Preconditions**:
- `expression` is a non-empty string
- `expression` length ≤ 1000 characters

**Postconditions**:
- Returns a `Number` (dimensionless) or `Quantity` (with units)
- Result is accurate to specification (±1e-6 for functions, ±1e-5 for conversions)

**Error Cases**:
| Input | Error | Message Pattern |
|-------|-------|-----------------|
| `"sin(30"` | ValueError | "Syntax error.*parentheses" |
| `"foo(5)"` | ValueError | "Unknown function: foo" |
| `"log(-5)"` | ValueError | "domain error.*x > 0" |
| `"sqrt(-1)"` | ValueError | "domain error.*x ≥ 0" |
| `"1 / 0"` | ValueError | "Division by zero" |
| `"5m + 3s"` | ValueError | "Unit mismatch" |
| Expression >1000 chars | ValueError | "exceeds maximum length" |
| Empty string | ValueError | "non-empty string" |

**Performance**:
- Typical case (<50 tokens): <5ms
- Complex case (10+ operations): <10ms
- Specification: <100ms

**Type Safety**:
- All parameters and returns have type hints
- Uses `Union`, `Optional`, `Callable` from `typing`
- `mypy --strict` compliant

---

### Method: visit_BinOp (AST Visitor)

```python
def visit_BinOp(self, node: ast.BinOp) -> Value:
    """
    Handle binary operations (+, -, *, /, ^, %).

    Type signature: (ast.BinOp) -> Value

    Supported operators:
    - ast.Add (+)
    - ast.Sub (-)
    - ast.Mult (*)
    - ast.Div (/)
    - ast.Pow (^)
    - ast.Mod (%)
    """
```

**Operator Behavior**:

| Operator | Example | Result Type | Notes |
|----------|---------|------------|-------|
| `+` | `2 + 3` | Number | Unit-aware; converts if compatible |
| `-` | `10 - 3` | Number | Unit-aware |
| `*` | `2 * 3` | Number | Units multiply: `m * m = m²` |
| `/` | `10 / 2` | Number | Units divide: `m / s = m/s` |
| `^` | `2 ^ 3` | Number | Right-associative; units exponentiate |
| `%` | `10 % 3` | Number | Modulo; unitless only |

**Type Checking**:
- Validates that operators are whitelisted
- Checks unit compatibility (Pint's `DimensionalityError` → `ValueError`)
- Handles type coercion (int → float as needed)

---

### Method: visit_Call (AST Visitor)

```python
def visit_Call(self, node: ast.Call) -> Value:
    """
    Handle function calls with domain validation.

    Type signature: (ast.Call) -> Value

    Validates:
    - Function is in whitelist
    - Correct argument count
    - Domain constraints (log > 0, sqrt ≥ 0, etc.)
    """
```

**Whitelisted Functions**:

#### Trigonometric (input in degrees)
| Function | Signature | Domain | Range | Notes |
|----------|-----------|--------|-------|-------|
| sin | `sin(angle)` | ℝ | [-1, 1] | Converts °→rad internally |
| cos | `cos(angle)` | ℝ | [-1, 1] | Converts °→rad internally |
| tan | `tan(angle)` | ℝ \ {90°+n×180°} | ℝ | Converts °→rad internally |
| asin | `asin(x)` | [-1, 1] | [-90°, 90°] | Output in degrees |
| acos | `acos(x)` | [-1, 1] | [0°, 180°] | Output in degrees |
| atan | `atan(x)` | ℝ | (-90°, 90°) | Output in degrees |

#### Logarithmic/Exponential
| Function | Signature | Domain | Range | Notes |
|----------|-----------|--------|-------|-------|
| log | `log(x)` | x > 0 | ℝ | Base-10 logarithm |
| ln | `ln(x)` | x > 0 | ℝ | Natural logarithm |
| exp | `exp(x)` | ℝ | (0, ∞) | e^x |
| sqrt | `sqrt(x)` | x ≥ 0 | [0, ∞) | Square root |

#### Statistical
| Function | Signature | Arg Type | Constraints | Notes |
|----------|-----------|----------|-------------|-------|
| mean | `mean(list)` | List[Number] | 1+ values | Arithmetic mean |
| median | `median(list)` | List[Number] | 1+ values | Middle value(s) |
| mode | `mode(list)` | List[Number] | 1+ values | Most frequent value |
| stdev | `stdev(list)` | List[Number] | 2+ values | Sample std dev |
| variance | `variance(list)` | List[Number] | 2+ values | Sample variance |

**Domain Validation Examples**:
```python
# Domain error: log(-5)
# → ValueError: "log() domain error: requires x > 0, got -5"

# Domain error: sqrt(-1)
# → ValueError: "sqrt() domain error: requires x ≥ 0, got -1"

# Domain error: stdev([5])
# → ValueError: "stdev() requires at least 2 values (sample statistical functions), got 1"

# Arity error: sin(1, 2)
# → ValueError: "sin() takes exactly 1 argument (2 given)"
```

---

### Method: visit_Constant (AST Visitor)

```python
def visit_Constant(self, node: ast.Constant) -> Number:
    """
    Handle numeric literals.

    Type signature: (ast.Constant) -> Number

    Accepts: int, float
    Rejects: str, bool, None, etc.
    """
```

**Examples**:
- `42` → `42` (int)
- `3.14` → `3.14` (float)
- `1e10` → `10000000000.0` (scientific notation)

---

### Method: visit_Name (AST Visitor)

```python
def visit_Name(self, node: ast.Name) -> Value:
    """
    Handle variables (mathematical constants or units).

    Type signature: (ast.Name) -> Value

    Returns: Number (for constants) or Quantity (for units)
    """
```

**Mathematical Constants**:
| Name | Value | Type |
|------|-------|------|
| `pi` | 3.14159... | float |
| `e` | 2.71828... | float |

**Unit Variables**:
Resolves unit strings via Pint registry:
- `meter`, `m` → Pint unit
- `foot`, `ft` → Pint unit
- `kilogram`, `kg` → Pint unit
- `celsius`, `°C` → Pint unit (with offset)
- etc.

**Examples**:
```python
evaluate("pi")           # → 3.14159265...
evaluate("e")            # → 2.71828182...
evaluate("5 * meter")    # → Quantity(5.0, 'meter')
evaluate("3.14 * kilometer")  # → Quantity(3.14, 'kilometer')
```

---

### Method: visit_UnaryOp (AST Visitor)

```python
def visit_UnaryOp(self, node: ast.UnaryOp) -> Value:
    """
    Handle unary operations (negation, positive).

    Type signature: (ast.UnaryOp) -> Value

    Operators:
    - ast.USub (-)  → Negation
    - ast.UAdd (+)  → Positive (no-op)
    """
```

**Examples**:
```python
evaluate("-5")           # → -5
evaluate("-(2 + 3)")     # → -5
evaluate("+10")          # → 10
```

---

## Type Definitions

```python
from typing import Union
from pint import Quantity

Number = Union[int, float]
Value = Union[Number, Quantity]
Operator = Callable[[Any, Any], Any]
Function = Callable[..., Number]
```

---

## Error Handling Strategy

### Three-Layer Error Handling

#### Layer 1: Parse-Time (ast.parse)
```python
try:
    tree = ast.parse(expression, mode='eval')
except SyntaxError as e:
    raise ValueError(f"Syntax error: {e.msg} at position {e.offset}")
```

#### Layer 2: Domain Validation (visit_Call)
```python
if func_name == 'log' and arg <= 0:
    raise ValueError(f"log() domain error: requires x > 0, got {arg}")
```

#### Layer 3: Unit Dimensionality (visit_BinOp)
```python
try:
    result = op_func(left, right)
except DimensionalityError as e:
    raise ValueError(f"Unit mismatch: {e}")
```

---

## Assumptions & Constraints

**Assumptions**:
1. Angles default to degrees (e.g., `sin(30)` = `sin(30°)`)
2. Temperature conversions use offset-based formulas
3. Floating-point precision maintained internally; display as configured
4. Expressions are evaluated once (no caching)
5. Unit registry is pre-configured with all needed units

**Constraints**:
- Expression max length: 1000 characters
- Max recursion depth: 50 (to prevent stack overflow)
- Supported numeric range: -1e308 < x < 1e308 (float limits)
- Operators are binary or unary only (no ternary)
- No keyword arguments in functions

---

## Testing Requirements

### Unit Tests (per `test_expression_evaluator.py`)
- [ ] All arithmetic operators (+, -, *, /, ^, %)
- [ ] Operator precedence (multiply before add)
- [ ] Parentheses grouping
- [ ] All trigonometric functions (degree input)
- [ ] All logarithmic functions (including domain)
- [ ] Exponential functions
- [ ] All statistical functions
- [ ] Domain errors (log, sqrt, stdev)
- [ ] Syntax errors (unbalanced parens, unknown functions)
- [ ] Unit conversions (compatible, incompatible)
- [ ] Edge cases (very large/small numbers, negative values)

### Integration Tests
- [ ] Complex expressions (10+ operations)
- [ ] Nested function calls
- [ ] Unit conversion chains
- [ ] Mixed operations and conversions

### Type Checking
- [ ] `mypy --strict` passes
- [ ] All functions have type hints
- [ ] No `Any` types without justification

### Performance Tests
- [ ] Typical expression <5ms
- [ ] Complex expression <10ms
- [ ] Worst case <100ms

---

## Version & Changelog

**Version**: 1.0.0
**Date**: 2026-01-17
**Status**: Contract (implementation pending)

### Future Extensions
- Radian mode toggle for trigonometric functions
- Cached AST compilation for repeated expressions
- Custom function registration (plugin system)
- Complex number support
- Matrix operations
