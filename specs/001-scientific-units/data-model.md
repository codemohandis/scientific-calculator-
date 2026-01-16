# Data Model: Scientific Operations and Unit Conversions

**Feature**: Scientific Operations and Unit Conversions (001-scientific-units)
**Date**: 2026-01-17
**Architecture**: AST-based expression evaluator with Pint integration

## Core Entities

### 1. Expression

**Definition**: Represents a user-submitted calculation query combining operations and conversions.

**Type**: String (user input) → Parsed AST → Evaluated Result

**Attributes**:
- `source: str` — Raw user input (e.g., "sin(30) * 2 + 5")
- `tokens: int` — Number of tokens in expression (max 1000)
- `parsed_ast: ast.Expression` — Parsed Abstract Syntax Tree (internal)
- `result: Value` — Evaluated result (Union[Number, Quantity])

**Validation Rules**:
- Maximum 1000 characters
- Must contain at least one valid operator, function, or constant
- Cannot contain arbitrary Python code (whitelist-only)
- Parentheses must be balanced

**Example Valid Expressions**:
- `"2 + 3 * 4"` → 14 (arithmetic)
- `"sin(30)"` → 0.5 (trigonometry in degrees)
- `"log(100)"` → 2 (logarithm base-10)
- `"5 km to meters"` → 5000 (unit conversion)
- `"(sqrt(16) * 2) + log(1000)"` → 11 (complex)

**Example Invalid Expressions**:
- `"import os"` → Rejected (not whitelisted)
- `"sin(30"` → Rejected (unbalanced parentheses)
- `"sin()"` → Rejected (missing required argument)

### 2. Value (Result Type)

**Definition**: Output of expression evaluation; can be pure number or unit-aware quantity.

**Type**: `Union[Number, Quantity]`

**Subtypes**:
- **Number**: `Union[int, float, Decimal]` — Unitless numeric result (e.g., sin(30) = 0.5)
- **Quantity**: Pint Quantity object with magnitude and unit (e.g., 5 km = 5 * kilometer)

**Attributes** (Quantity only):
- `magnitude: float` — Numeric value
- `units: Unit` — Associated unit (from Pint registry)

**Example Values**:
```python
Value = 3.141592653589793  # Pure number (π)
Value = 5.0 * ureg.kilometer  # Quantity: 5 km
Value = 0.5  # Pure number (sin(30°))
Value = 2.5 * ureg.meter / ureg.second  # Derived unit: velocity
```

**Conversion & Display Rules**:
- Display precision: 5 decimal places default (configurable)
- Quantity display format: `{magnitude:.5f} {unit_symbol}` (e.g., "5.00000 kilometer")
- Exponential notation for very large/small numbers (e.g., "1.23456e+10")

---

### 3. Unit

**Definition**: Represents a measurement standard with conversion information.

**Type**: Pint `Unit` (from Pint library)

**Attributes**:
- `symbol: str` — Unit symbol (m, ft, kg, °C, m/s, N, etc.)
- `name: str` — Full name (meter, foot, kilogram, celsius, etc.)
- `dimensionality: str` — Physical dimension ([length], [mass], [temperature], etc.)
- `base_unit: str` — SI canonical form (e.g., meter for all distance units)
- `conversion_factor: float` — Multiplicative factor to base unit

**Supported Unit Categories** (MVP scope):

#### Base Units - Distance
| Symbol | Name | Base Equivalence | Dimensionality |
|--------|------|------------------|-----------------|
| m | meter | 1.0 m | [length] |
| ft | foot | 0.3048 m | [length] |
| km | kilometer | 1000 m | [length] |
| mi | mile | 1609.34 m | [length] |
| cm | centimeter | 0.01 m | [length] |
| mm | millimeter | 0.001 m | [length] |
| nm | nanometer | 1e-9 m | [length] |
| yd | yard | 0.9144 m | [length] |
| in | inch | 0.0254 m | [length] |

#### Base Units - Mass
| Symbol | Name | Base Equivalence | Dimensionality |
|--------|------|------------------|-----------------|
| kg | kilogram | 1.0 kg | [mass] |
| g | gram | 0.001 kg | [mass] |
| lb | pound | 0.453592 kg | [mass] |
| oz | ounce | 0.0283495 kg | [mass] |
| ton | ton (metric) | 1000 kg | [mass] |
| st | stone | 6.35029 kg | [mass] |

#### Base Units - Temperature
| Symbol | Name | Formula | Notes |
|--------|------|---------|-------|
| °C | celsius | K = C + 273.15 | Offset-based |
| °F | fahrenheit | K = (F + 459.67) × 5/9 | Offset-based |
| K | kelvin | 1.0 K | Absolute scale |

#### Base Units - Volume
| Symbol | Name | Base Equivalence | Dimensionality |
|--------|------|------------------|-----------------|
| L | liter | 0.001 m³ | [length]³ |
| mL | milliliter | 1e-6 m³ | [length]³ |
| gal | gallon (US) | 0.00378541 m³ | [length]³ |
| cup | cup (US) | 0.000236588 m³ | [length]³ |
| fl oz | fluid ounce | 2.95735e-5 m³ | [length]³ |

#### Derived Units (in MVP)
| Symbol | Name | Base Form | Dimensionality | Example |
|--------|------|-----------|-----------------|---------|
| m/s | meter per second | length/time | [length]/[time] | Speed |
| km/h | kilometer per hour | length/time | [length]/[time] | Velocity |
| mph | mile per hour | length/time | [length]/[time] | Velocity |
| m/s² | meter per second squared | length/time² | [length]/[time]² | Acceleration |
| N | newton | kg⋅m/s² | [mass][length]/[time]² | Force |
| lbf | pound-force | mass⋅length/time² | [mass][length]/[time]² | Force |
| kgf | kilogram-force | mass⋅length/time² | [mass][length]/[time]² | Force |
| Pa | pascal | N/m² | [mass]/([length][time]²) | Pressure |
| atm | atmosphere | 101325 Pa | [mass]/([length][time]²) | Pressure |
| bar | bar | 100000 Pa | [mass]/([length][time]²) | Pressure |
| psi | pounds per square inch | lbf/in² | [mass]/([length][time]²) | Pressure |
| J | joule | N⋅m | [mass][length]²/[time]² | Energy |
| kWh | kilowatt-hour | 3.6e6 J | [mass][length]²/[time]² | Energy |
| cal | calorie | 4.184 J | [mass][length]²/[time]² | Energy |
| W | watt | J/s | [mass][length]²/[time]³ | Power |
| kW | kilowatt | 1000 W | [mass][length]²/[time]³ | Power |
| hp | horsepower | 745.7 W | [mass][length]²/[time]³ | Power |
| T | tesla | Wb/m² | [mass]/([time]²[current]) | Magnetic flux density |
| Wb | weber | V⋅s | [mass][length]²/([time]²[current]) | Magnetic flux |

**Validation Rules**:
- Unit symbols are case-sensitive (m ≠ M)
- Compound units use `/` for division (m/s), `**` for exponents (m**2)
- Temperature conversions use special offset logic (not simple multiplicative)
- Dimensionality checking prevents invalid operations (5 m + 3 s → error)

---

### 4. ScientificFunction

**Definition**: Mathematical or statistical function with parameter requirements and domain constraints.

**Type**: Callable with type signature

**Attributes**:
- `name: str` — Function identifier (sin, cos, log, mean, etc.)
- `parameter_count: int` — Number of required parameters (or -1 for variable args)
- `parameter_types: List[Type]` — Expected parameter types
- `domain: str` — Mathematical domain constraints (e.g., "x > 0" for log)
- `codomain: Type` — Return type (Number or Quantity)
- `implementation: Callable` — Function implementation

**Supported Functions**:

#### Trigonometric Functions

| Name | Parameters | Domain | Codomain | Notes |
|------|------------|--------|----------|-------|
| sin | 1 (angle) | -∞ < x < ∞ | [-1, 1] | Degrees by default; radians if specified |
| cos | 1 (angle) | -∞ < x < ∞ | [-1, 1] | Degrees by default |
| tan | 1 (angle) | x ≠ 90°, 270°, ... | (-∞, ∞) | Undefined at π/2 + nπ |
| asin | 1 (value) | [-1, 1] | [-90°, 90°] | Returns degrees |
| acos | 1 (value) | [-1, 1] | [0°, 180°] | Returns degrees |
| atan | 1 (value) | (-∞, ∞) | (-90°, 90°) | Returns degrees |

#### Logarithmic & Exponential Functions

| Name | Parameters | Domain | Codomain | Notes |
|------|------------|--------|----------|-------|
| log | 1 (value) | x > 0 | (-∞, ∞) | Base-10 logarithm |
| ln | 1 (value) | x > 0 | (-∞, ∞) | Natural logarithm (base e) |
| exp | 1 (value) | (-∞, ∞) | (0, ∞) | e^x |
| sqrt | 1 (value) | x ≥ 0 | [0, ∞) | Square root |
| **power** | 2 (base, exponent) | base > 0 for non-integer exp | (-∞, ∞) | Handled via ^ operator |

#### Statistical Functions

| Name | Parameters | Domain | Codomain | Notes |
|------|------------|--------|----------|-------|
| mean | variable (list) | List of 1+ numbers | Number | Arithmetic mean |
| median | variable (list) | List of 1+ numbers | Number | Middle value(s) |
| mode | variable (list) | List of 1+ numbers | Number | Most frequent value |
| stdev | variable (list) | List of 2+ numbers | Number | Standard deviation (sample) |
| variance | variable (list) | List of 2+ numbers | Number | Variance (sample) |

**Domain Validation Rules**:
```python
# Example: log() validation
if argument <= 0:
    raise ValueError(f"log() requires x > 0, got {argument}")

# Example: sqrt() validation
if argument < 0:
    raise ValueError(f"sqrt() requires x ≥ 0, got {argument}")

# Example: mean() validation
if not isinstance(argument, (list, tuple)) or len(argument) == 0:
    raise ValueError(f"mean() requires non-empty list, got {argument}")

# Example: stdev() validation
if not isinstance(argument, (list, tuple)) or len(argument) < 2:
    raise ValueError(f"stdev() requires list of 2+ values, got {len(argument)} values")
```

**Parameter Parsing**:
- Trigonometric functions accept scalar or Quantity with angle dimensionality
- Statistical functions accept comma/space-separated or list notation:
  - `mean(1, 2, 3, 4, 5)` → 3
  - `mean([1, 2, 3, 4, 5])` → 3
  - `mean(1 2 3 4 5)` → 3

---

### 5. Operator

**Definition**: Binary or unary operation (arithmetic, power, etc.).

**Type**: Python `ast.operator` type

**Supported Operators**:

#### Binary Operators
| Symbol | Operator | Precedence | Associativity | Notes |
|--------|----------|-----------|----------------|-------|
| + | Addition | 1 | Left-to-right | Number + Number → Number; Unit-aware |
| - | Subtraction | 1 | Left-to-right | Number - Number → Number; Unit-aware |
| * | Multiplication | 2 | Left-to-right | Number * Number → Number; Unit combination |
| / | Division | 2 | Left-to-right | Number / Number → Number; Unit cancellation |
| ^ | Power | 3 | Right-to-left | Number ^ Number → Number; Units with exponent |
| % | Modulo | 2 | Left-to-right | Integer % Integer → Integer |

#### Unary Operators
| Symbol | Operator | Notes |
|--------|----------|-------|
| - | Negation | -(Number) → Number; Units preserved |
| + | Positive | +(Number) → Number; No-op |

**Operator Precedence** (evaluated top-to-bottom, highest to lowest):
1. Parentheses `()`
2. Function calls `sin()`, `log()`
3. Exponentiation `^`
4. Unary operators `-`, `+`
5. Multiplication, Division `*`, `/`, `%`
6. Addition, Subtraction `+`, `-`

**Example Precedence Evaluation**:
```
Expression: 2 + 3 * 4 ^ 2
Parse: 2 + (3 * (4 ^ 2))
Evaluate: 2 + (3 * 16) = 2 + 48 = 50

Expression: sin(30) * 2 + 5
Parse: (sin(30)) * 2 + 5
Evaluate: (0.5 * 2) + 5 = 1 + 5 = 6
```

---

### 6. Error/Exception

**Definition**: Custom exception hierarchy for domain-specific error handling.

**Type Hierarchy**:
```
Exception
├── CalculatorException (base)
│   ├── SyntaxError (parsing failed)
│   ├── DomainError (math constraint violated)
│   ├── DimensionalityError (unit mismatch)
│   └── EvaluationError (runtime evaluation failure)
```

**Attributes** (all custom exceptions):
- `message: str` — User-friendly error message
- `context: Dict[str, Any]` — Error context (input, operation, values)
- `suggestion: str` — How to fix the error

**Exception Types**:

#### SyntaxError
| Cause | Example | Message | Suggestion |
|-------|---------|---------|------------|
| Unbalanced parens | `sin(30` | "Unbalanced parentheses in expression" | Check matching `(` and `)` |
| Invalid function | `foo(5)` | "Unknown function: foo" | List available functions |
| Invalid syntax | `2 + + 3` | "Invalid syntax at position X" | Check operator usage |

#### DomainError
| Cause | Example | Message | Suggestion |
|-------|---------|---------|------------|
| log of negative | `log(-5)` | "log() requires x > 0, got -5" | Use positive argument |
| sqrt of negative | `sqrt(-1)` | "sqrt() requires x ≥ 0, got -1" | Use non-negative argument |
| stdev with 1 value | `stdev(5)` | "stdev() requires 2+ values, got 1" | Provide more data points |

#### DimensionalityError
| Cause | Example | Message | Suggestion |
|-------|---------|---------|------------|
| Unit mismatch | `5m + 3s` | "Cannot add [length] to [time]" | Ensure compatible units |
| Unit cancellation | `5m / 10m` | Result is dimensionless number | Conversion may lose units |

#### EvaluationError
| Cause | Example | Message |
|-------|---------|---------|
| Division by zero | `1 / 0` | "Division by zero" |
| Overflow | `10 ^ 1000` | "Result overflow" |
| Recursion depth | Deeply nested expression | "Max recursion depth exceeded" |

---

## Relationships & State Transitions

### Expression Evaluation Flow

```
┌─────────────────────────────────────────────────────────┐
│ User Input: "sin(30) * 2 + 5"                           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 1: Parse (ast.parse)                              │
│ Validate: Syntax, parentheses balanced, 1000 char limit │
└─────────────────────────────────────────────────────────┘
                         ↓
                    [Syntax OK]
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 2: Build AST                                      │
│ ast.Expression → BinOp(                                 │
│                   left=BinOp(Call(sin), Constant(30), *),│
│                   op=Add,                               │
│                   right=Constant(5)                     │
│                  )                                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 3: Evaluate (SafeExpressionEvaluator.visit)       │
│ - Traverse AST nodes                                    │
│ - Apply operators and functions                         │
│ - Validate domains (log > 0, sqrt ≥ 0, etc.)           │
│ - Handle units (Pint Quantity)                          │
└─────────────────────────────────────────────────────────┘
                         ↓
                   [Evaluation OK]
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 4: Format Result                                  │
│ Value: sin(30) * 2 + 5 = 6.0 (5 decimal places)         │
└─────────────────────────────────────────────────────────┘
```

### Error Handling Flow

```
                    [Syntax Error]
                         ↓
    ┌─────────────────────────────────────────┐
    │ Catch SyntaxError from ast.parse()      │
    │ Convert to user-friendly message        │
    │ Return: "Invalid syntax: ..."           │
    └─────────────────────────────────────────┘

                    [Domain Error]
                         ↓
    ┌─────────────────────────────────────────┐
    │ Validate in visit_Call()                │
    │ if log(x): x <= 0 → Raise DomainError   │
    │ Return: "log() requires x > 0, got ..." │
    └─────────────────────────────────────────┘

                  [Unit Mismatch Error]
                         ↓
    ┌─────────────────────────────────────────┐
    │ Pint validates dimensionality           │
    │ Catch DimensionalityError               │
    │ Return: "Cannot add [length] to [time]" │
    └─────────────────────────────────────────┘
```

---

## Data Validation & Constraints

### Input Validation (Expression)
- **Max length**: 1000 characters
- **Character whitelist**: 0-9, +, -, *, /, ^, %, (, ), ., letters, spaces
- **No code injection**: Whitelist-only operators/functions (no eval)

### Numeric Validation
- **Range**: -1e308 < x < 1e308 (float limits)
- **Precision**: 5 decimal places display (configurable)
- **Overflow detection**: Catch and report gracefully

### Unit Validation
- **Dimensionality checking**: Pint ensures unit compatibility
- **Offset handling**: Temperature conversions use special formulas
- **Conversion completeness**: All base units registered in Pint

### Function Parameter Validation
- **Arity checking**: log(1) OK, log(1,2) FAIL
- **Type checking**: mean([1,2,3]) OK, mean(1) FAIL
- **Domain checking**: log(x) requires x > 0

---

## Summary

This data model provides:
1. **Type Safety**: All entities have explicit types with validation
2. **Clear Semantics**: Expressions → Operations → Results flow
3. **Error Context**: Exceptions include suggestions and input context
4. **Unit Awareness**: Pint integration with dimensional analysis
5. **Function Precision**: Whitelisted, domain-validated operations

The model aligns with the specification's accuracy (±0.00001 for conversions, 1e-6 for functions) and performance (<100ms per expression).
