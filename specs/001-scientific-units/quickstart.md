# Quick Start: Scientific Operations and Unit Conversions

**Feature**: Scientific Operations and Unit Conversions (001-scientific-units)
**Date**: 2026-01-17
**Target Audience**: Developers implementing the feature

This document provides code examples and patterns for implementing the expression evaluator and scientific calculator components.

---

## Implementation Overview

### Core Components

```
scientific_calculator/
├── expression_evaluator.py    # AST-based evaluator (main)
├── units.py                   # Pint wrapper
├── functions.py               # Math and statistical functions
├── exceptions.py              # Custom error classes
└── cli.py                     # Command-line interface
```

### Dependency Stack

```
User Input
    ↓
CLI (cli.py) — Parses command-line arguments
    ↓
Expression Evaluator (expression_evaluator.py) — ast.NodeVisitor
    ↓
Unit System (units.py) — Pint UnitRegistry wrapper
    ↓
Functions (functions.py) — Whitelisted math operations
    ↓
Exceptions (exceptions.py) — Error handling
    ↓
Result (Number or Quantity) — Output to user
```

---

## Example 1: Basic Expression Evaluator Setup

### File: `src/scientific_calculator/expression_evaluator.py`

```python
import ast
import math
import operator
import statistics
from typing import Any, Callable, Dict, Optional, Union
from pint import UnitRegistry, Quantity, DimensionalityError

# Type definitions
Number = Union[int, float]
Value = Union[Number, Quantity]

class SafeExpressionEvaluator(ast.NodeVisitor):
    """
    Type-safe expression evaluator supporting arithmetic, mathematical,
    statistical operations, and unit-aware computation via Pint.
    """

    def __init__(self, ureg: UnitRegistry) -> None:
        """
        Initialize evaluator with a Pint unit registry.

        Args:
            ureg: Pint UnitRegistry instance for unit-aware computation
        """
        self.ureg: UnitRegistry = ureg

        # Whitelisted binary operators
        self.operators: Dict[type[ast.operator], Callable[[Any, Any], Any]] = {
            ast.Add: operator.add,
            ast.Sub: operator.sub,
            ast.Mult: operator.mul,
            ast.Div: operator.truediv,
            ast.Pow: operator.pow,
            ast.Mod: operator.mod,
        }

        # Whitelisted unary operators
        self.unary_operators: Dict[type[ast.unaryop], Callable[[Any], Any]] = {
            ast.USub: operator.neg,
            ast.UAdd: operator.pos,
        }

        # Whitelisted mathematical functions
        self.functions: Dict[str, Callable[..., Number]] = {
            # Trigonometric (require degree-to-radian conversion)
            'sin': math.sin,
            'cos': math.cos,
            'tan': math.tan,
            'asin': math.asin,
            'acos': math.acos,
            'atan': math.atan,

            # Logarithmic/Exponential
            'log': math.log10,       # Base-10
            'ln': math.log,          # Natural log
            'exp': math.exp,         # e^x
            'sqrt': math.sqrt,       # Square root

            # Statistical
            'mean': statistics.mean,
            'median': statistics.median,
            'mode': statistics.mode,
            'stdev': statistics.stdev,
            'variance': statistics.variance,
        }

    def visit_BinOp(self, node: ast.BinOp) -> Value:
        """
        Handle binary operations with unit awareness.

        Supports: +, -, *, /, ^, %

        Type hints: Value Op Value -> Value (with Pint unit checking)
        """
        left: Value = self.visit(node.left)
        right: Value = self.visit(node.right)

        op_func: Optional[Callable[[Any, Any], Any]] = self.operators.get(
            type(node.op)
        )
        if op_func is None:
            raise ValueError(f"Unsupported operator: {node.op.__class__.__name__}")

        try:
            result: Value = op_func(left, right)
            return result
        except ZeroDivisionError:
            raise ValueError("Division by zero")
        except DimensionalityError as e:
            raise ValueError(f"Unit mismatch: Cannot combine incompatible units: {e}")
        except (ValueError, TypeError) as e:
            raise ValueError(f"Operation failed: {e}")

    def visit_UnaryOp(self, node: ast.UnaryOp) -> Value:
        """
        Handle unary operations (negation, positive).

        Type hints: Op Value -> Value (with Pint support)
        """
        operand: Value = self.visit(node.operand)

        op_func: Optional[Callable[[Any], Any]] = self.unary_operators.get(
            type(node.op)
        )
        if op_func is None:
            raise ValueError(f"Unsupported unary operator: {node.op.__class__.__name__}")

        return op_func(operand)

    def visit_Call(self, node: ast.Call) -> Value:
        """
        Handle function calls with domain validation.

        Type hints: Call[str, List[Value]] -> Value

        Validates:
        - Function exists in whitelist
        - Correct number of arguments
        - Domain constraints (log > 0, sqrt >= 0, etc.)
        """
        if not isinstance(node.func, ast.Name):
            raise ValueError("Only simple function calls are supported")

        func_name: str = node.func.id
        if func_name not in self.functions:
            raise ValueError(
                f"Unknown function: {func_name}. "
                f"Available: {', '.join(self.functions.keys())}"
            )

        args: list[Value] = [self.visit(arg) for arg in node.args]

        # Domain validation by function
        if func_name == 'log':
            if len(args) != 1:
                raise ValueError(f"{func_name}() takes exactly 1 argument ({len(args)} given)")
            if isinstance(args[0], (int, float)) and args[0] <= 0:
                raise ValueError(
                    f"log() domain error: requires x > 0, got {args[0]}"
                )

        elif func_name == 'ln':
            if len(args) != 1:
                raise ValueError(f"{func_name}() takes exactly 1 argument ({len(args)} given)")
            if isinstance(args[0], (int, float)) and args[0] <= 0:
                raise ValueError(
                    f"ln() domain error: requires x > 0, got {args[0]}"
                )

        elif func_name == 'sqrt':
            if len(args) != 1:
                raise ValueError(f"{func_name}() takes exactly 1 argument ({len(args)} given)")
            if isinstance(args[0], (int, float)) and args[0] < 0:
                raise ValueError(
                    f"sqrt() domain error: requires x ≥ 0, got {args[0]}"
                )

        elif func_name in ('sin', 'cos', 'tan', 'asin', 'acos', 'atan'):
            if len(args) != 1:
                raise ValueError(f"{func_name}() takes exactly 1 argument ({len(args)} given)")
            # Trigonometric: convert degrees to radians
            if isinstance(args[0], (int, float)):
                args[0] = math.radians(args[0])

        elif func_name in ('mean', 'median', 'mode', 'stdev', 'variance'):
            if not args:
                raise ValueError(f"{func_name}() requires at least 1 argument")
            # Handle list-of-numbers argument
            if isinstance(args[0], (list, tuple)):
                args = args[0]  # type: ignore
            if len(args) == 0:
                raise ValueError(f"{func_name}() requires non-empty list")
            if func_name in ('stdev', 'variance') and len(args) < 2:
                raise ValueError(
                    f"{func_name}() requires at least 2 values "
                    f"(sample statistical functions), got {len(args)}"
                )

        # Call function with validated arguments
        try:
            result: Value = self.functions[func_name](*args)
            return result
        except (ValueError, statistics.StatisticsError) as e:
            raise ValueError(f"Error in {func_name}(): {e}")

    def visit_Constant(self, node: ast.Constant) -> Number:
        """
        Handle numeric constants (literals).

        Type hints: Constant -> Number
        """
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Unsupported constant type: {type(node.value).__name__}")

    def visit_Name(self, node: ast.Name) -> Value:
        """
        Handle variable references (mathematical constants or units).

        Type hints: Name -> (Number | Quantity)

        Recognizes:
        - Mathematical constants: pi, e
        - Pint units: meter, foot, kilogram, celsius, etc.
        """
        var_name: str = node.id

        # Mathematical constants
        if var_name == 'pi':
            return math.pi
        if var_name == 'e':
            return math.e

        # Try to parse as unit
        try:
            return self.ureg(var_name)
        except Exception:
            raise ValueError(
                f"Unknown variable or unit: {var_name}. "
                f"Try 'pi', 'e', or a valid unit like 'meter', 'foot', 'kg'"
            )

    def evaluate(self, expression: str) -> Value:
        """
        Parse and evaluate an expression string.

        Type hints: str -> Value

        Args:
            expression: Mathematical expression (e.g., "sin(30) * 2 + 5")

        Returns:
            Evaluated result (Number or Quantity with units)

        Raises:
            ValueError: For syntax, domain, or unit errors

        Examples:
            >>> evaluator.evaluate("2 + 3 * 4")
            14
            >>> evaluator.evaluate("sin(30)")
            0.5
            >>> evaluator.evaluate("5 * meter")
            5 <Unit('meter')>
        """
        if not expression or not isinstance(expression, str):
            raise ValueError("Expression must be a non-empty string")

        if len(expression) > 1000:
            raise ValueError("Expression exceeds maximum length of 1000 characters")

        # Parse expression into AST
        try:
            tree: ast.Expression = ast.parse(expression, mode='eval')
        except SyntaxError as e:
            raise ValueError(
                f"Syntax error in expression: {e.msg} at position {e.offset}. "
                f"Check parentheses, operators, and function names."
            )

        # Evaluate AST
        try:
            result: Value = self.visit(tree.body)
            return result
        except ValueError:
            # Re-raise ValueError (already has good message)
            raise
        except Exception as e:
            # Catch any unexpected errors
            raise ValueError(f"Evaluation failed: {e}")
```

---

## Example 2: Unit System Integration

### File: `src/scientific_calculator/units.py`

```python
from pint import UnitRegistry
from typing import Dict

class UnitSystem:
    """
    Wrapper around Pint UnitRegistry for unit conversion support.
    Provides a singleton registry with pre-configured units.
    """

    _instance: 'UnitSystem' = None
    ureg: UnitRegistry

    def __init__(self) -> None:
        """Initialize or reuse unit registry singleton."""
        if UnitSystem._instance is not None:
            raise RuntimeError("Use UnitSystem.get() instead of __init__()")

        self.ureg = UnitRegistry()

        # Define custom units and constants if needed
        self.ureg.define('miles_per_hour = mile / hour')
        self.ureg.define('kilometers_per_hour = kilometer / hour')

    @classmethod
    def get(cls) -> 'UnitSystem':
        """Get or create singleton unit system."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def convert(self, value: float, from_unit: str, to_unit: str) -> float:
        """
        Convert value from one unit to another.

        Type hints: (float, str, str) -> float

        Args:
            value: Numeric value
            from_unit: Source unit string (e.g., "meter", "foot")
            to_unit: Target unit string (e.g., "kilometer", "mile")

        Returns:
            Converted value

        Raises:
            ValueError: If units are incompatible or unknown

        Example:
            >>> unit_sys = UnitSystem.get()
            >>> unit_sys.convert(5, 'kilometer', 'mile')
            3.106856...
        """
        try:
            quantity = value * self.ureg(from_unit)
            result = quantity.to(self.ureg(to_unit))
            return float(result.magnitude)
        except Exception as e:
            raise ValueError(
                f"Unit conversion failed: {from_unit} to {to_unit}. "
                f"Check that units are compatible. Error: {e}"
            )

    def is_compatible(self, unit1: str, unit2: str) -> bool:
        """
        Check if two units are dimensionally compatible.

        Type hints: (str, str) -> bool

        Example:
            >>> unit_sys = UnitSystem.get()
            >>> unit_sys.is_compatible('meter', 'foot')  # Distance
            True
            >>> unit_sys.is_compatible('meter', 'second')  # Distance vs Time
            False
        """
        try:
            q1 = self.ureg(unit1)
            q2 = self.ureg(unit2)
            return q1.dimensionality == q2.dimensionality
        except Exception:
            return False

    def get_all_units(self) -> Dict[str, str]:
        """
        Get list of all available units.

        Returns dict mapping unit symbol to unit name.
        """
        units: Dict[str, str] = {}
        for unit_name in dir(self.ureg):
            if not unit_name.startswith('_'):
                try:
                    unit = getattr(self.ureg, unit_name)
                    if hasattr(unit, 'dimensionality'):
                        units[unit_name] = str(unit.dimensionality)
                except Exception:
                    pass
        return units
```

---

## Example 3: Custom Exception Classes

### File: `src/scientific_calculator/exceptions.py`

```python
from typing import Any, Dict, Optional

class CalculatorException(Exception):
    """Base exception for calculator operations."""

    def __init__(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None,
        suggestion: Optional[str] = None
    ) -> None:
        """
        Initialize exception with message, context, and suggestion.

        Args:
            message: User-friendly error message
            context: Dict with error context (input, values, etc.)
            suggestion: How to fix the error
        """
        super().__init__(message)
        self.message = message
        self.context = context or {}
        self.suggestion = suggestion

    def __str__(self) -> str:
        """Format exception for user display."""
        lines = [f"Error: {self.message}"]
        if self.context:
            lines.append(f"Context: {self.context}")
        if self.suggestion:
            lines.append(f"Suggestion: {self.suggestion}")
        return "\n".join(lines)


class SyntaxError(CalculatorException):
    """Expression parsing failed (syntax error)."""
    pass


class DomainError(CalculatorException):
    """Mathematical domain constraint violated (e.g., log of negative)."""
    pass


class DimensionalityError(CalculatorException):
    """Unit/dimensional mismatch (e.g., 5m + 3s)."""
    pass


class EvaluationError(CalculatorException):
    """Runtime evaluation failure."""
    pass
```

---

## Example 4: CLI Interface

### File: `src/scientific_calculator/cli.py`

```python
import argparse
import sys
from typing import Optional

from scientific_calculator.expression_evaluator import SafeExpressionEvaluator
from scientific_calculator.units import UnitSystem


def main() -> int:
    """
    CLI entry point for scientific calculator.

    Type hints: () -> int (exit code)

    Usage:
        calc "sin(30) * 2 + 5"
        calc "convert 5 km to miles"
        calc "mean([1, 2, 3, 4, 5])"
    """
    parser = argparse.ArgumentParser(
        description="Scientific calculator with unit conversion support"
    )
    parser.add_argument(
        "expression",
        help="Expression to evaluate (e.g., 'sin(30) * 2 + 5')"
    )
    parser.add_argument(
        "--precision",
        type=int,
        default=5,
        help="Decimal places in output (default: 5)"
    )

    args = parser.parse_args()

    # Initialize evaluator
    unit_system = UnitSystem.get()
    evaluator = SafeExpressionEvaluator(unit_system.ureg)

    # Evaluate expression
    try:
        result = evaluator.evaluate(args.expression)

        # Format output
        if isinstance(result, float):
            formatted = f"{result:.{args.precision}f}"
        else:
            # Pint Quantity
            magnitude = float(result.magnitude)
            unit_str = str(result.units)
            formatted = f"{magnitude:.{args.precision}f} {unit_str}"

        print(f"{args.expression} = {formatted}")
        return 0

    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
```

---

## Example 5: Unit Tests (TDD Pattern)

### File: `tests/unit/test_expression_evaluator.py`

```python
import math
import pytest
from pint import UnitRegistry

from scientific_calculator.expression_evaluator import SafeExpressionEvaluator


@pytest.fixture
def evaluator() -> SafeExpressionEvaluator:
    """Fixture: initialized evaluator with default unit registry."""
    ureg = UnitRegistry()
    return SafeExpressionEvaluator(ureg)


class TestArithmeticOperations:
    """Tests for basic arithmetic operators."""

    def test_addition(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test addition: 2 + 3 = 5"""
        result = evaluator.evaluate("2 + 3")
        assert result == 5

    def test_subtraction(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test subtraction: 10 - 3 = 7"""
        result = evaluator.evaluate("10 - 3")
        assert result == 7

    def test_multiplication(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test multiplication: 2 * 3 = 6"""
        result = evaluator.evaluate("2 * 3")
        assert result == 6

    def test_division(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test division: 10 / 2 = 5"""
        result = evaluator.evaluate("10 / 2")
        assert result == 5

    def test_power(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test exponentiation: 2 ^ 3 = 8"""
        result = evaluator.evaluate("2 ^ 3")
        assert result == 8

    def test_operator_precedence(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test precedence: 2 + 3 * 4 = 14 (not 20)"""
        result = evaluator.evaluate("2 + 3 * 4")
        assert result == 14

    def test_parentheses_override(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test parentheses: (2 + 3) * 4 = 20"""
        result = evaluator.evaluate("(2 + 3) * 4")
        assert result == 20


class TestTrigonometricFunctions:
    """Tests for trigonometric functions (degree-based input)."""

    def test_sin_30(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test sin(30°) = 0.5"""
        result = evaluator.evaluate("sin(30)")
        assert abs(result - 0.5) < 1e-10

    def test_cos_0(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test cos(0°) = 1"""
        result = evaluator.evaluate("cos(0)")
        assert abs(result - 1.0) < 1e-10

    def test_tan_45(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test tan(45°) = 1"""
        result = evaluator.evaluate("tan(45)")
        assert abs(result - 1.0) < 1e-10


class TestLogarithmicFunctions:
    """Tests for logarithmic functions."""

    def test_log_100(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test log₁₀(100) = 2"""
        result = evaluator.evaluate("log(100)")
        assert abs(result - 2.0) < 1e-10

    def test_ln_e(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test ln(e) = 1"""
        result = evaluator.evaluate("ln(e)")
        assert abs(result - 1.0) < 1e-10

    def test_sqrt_16(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test sqrt(16) = 4"""
        result = evaluator.evaluate("sqrt(16)")
        assert abs(result - 4.0) < 1e-10


class TestStatisticalFunctions:
    """Tests for statistical functions."""

    def test_mean_simple(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test mean([1, 2, 3, 4, 5]) = 3"""
        # Implementation would parse list input
        # This is a placeholder for actual test
        pass


class TestErrorHandling:
    """Tests for error conditions."""

    def test_log_negative(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test that log(-5) raises ValueError (domain error)"""
        with pytest.raises(ValueError, match="domain error"):
            evaluator.evaluate("log(-5)")

    def test_sqrt_negative(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test that sqrt(-1) raises ValueError"""
        with pytest.raises(ValueError, match="domain error"):
            evaluator.evaluate("sqrt(-1)")

    def test_division_by_zero(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test that 1 / 0 raises ValueError"""
        with pytest.raises(ValueError, match="Division by zero"):
            evaluator.evaluate("1 / 0")

    def test_syntax_error(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test that unbalanced parentheses raise ValueError"""
        with pytest.raises(ValueError, match="Syntax error"):
            evaluator.evaluate("sin(30")

    def test_unknown_function(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test that unknown function raises ValueError"""
        with pytest.raises(ValueError, match="Unknown function"):
            evaluator.evaluate("foo(5)")


class TestUnitConversions:
    """Tests for unit-aware conversions."""

    def test_kilometer_to_meter(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test 5 km = 5000 m"""
        result = evaluator.evaluate("5 * kilometer")
        # Result is Pint Quantity; convert to meters
        result_m = result.to("meter")
        assert abs(float(result_m.magnitude) - 5000.0) < 1e-6

    def test_incompatible_units(self, evaluator: SafeExpressionEvaluator) -> None:
        """Test that 5m + 3s raises error (incompatible units)"""
        with pytest.raises(ValueError, match="Unit mismatch|incompatible"):
            evaluator.evaluate("5 * meter + 3 * second")
```

---

## Testing Checklist

Before moving to implementation (tasks), ensure:

- [ ] Unit tests for all arithmetic operators
- [ ] Unit tests for trigonometric functions (degree handling)
- [ ] Unit tests for logarithmic/exponential functions
- [ ] Unit tests for statistical functions
- [ ] Unit tests for domain errors (log, sqrt, etc.)
- [ ] Unit tests for syntax errors (parentheses, unknown functions)
- [ ] Integration tests for compound expressions
- [ ] Integration tests for unit conversions
- [ ] Integration tests for CLI interface
- [ ] Type checking: `mypy --strict src/`
- [ ] Code coverage: `pytest --cov --cov-report=html`
- [ ] Performance: Each expression <100ms

---

## Next Steps

This quickstart provides implementation patterns and examples. The next phase (`/sp.tasks`) will:

1. Break down development into specific, testable tasks
2. Define test specifications and acceptance criteria
3. Create a task dependency graph
4. Estimate effort and complexity per task

The implementation should follow the patterns shown here, maintaining:
- 100% type hints (`mypy --strict` compliant)
- TDD discipline (tests first, then implementation)
- ≥85% code coverage
- <100ms per expression evaluation
- Clear error messages with suggestions
