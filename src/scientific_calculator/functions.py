"""
Scientific function registry with whitelisted mathematical functions.

Provides:
- Trigonometric functions (sin, cos, tan, asin, acos, atan) with degree inputs/outputs
- Logarithmic functions (log10, ln, logn) with domain validation
- Exponential functions (exp, power, sqrt, nthroot) with domain validation
- Statistical functions (mean, median, mode, stdev, variance)
- Safe function registry with parameter validation and domain checking
"""

from __future__ import annotations

import math
from typing import Callable

from src.scientific_calculator.exceptions import DomainError


# ============================================================================
# Trigonometric Functions (Degree-based)
# ============================================================================


def sin(degrees: float) -> float:
    """
    Sine function with degree input.

    Args:
        degrees: Angle in degrees

    Returns:
        Sine of the angle
    """
    radians = math.radians(degrees)
    return math.sin(radians)


def cos(degrees: float) -> float:
    """
    Cosine function with degree input.

    Args:
        degrees: Angle in degrees

    Returns:
        Cosine of the angle
    """
    radians = math.radians(degrees)
    return math.cos(radians)


def tan(degrees: float) -> float:
    """
    Tangent function with degree input.

    Args:
        degrees: Angle in degrees

    Returns:
        Tangent of the angle
    """
    radians = math.radians(degrees)
    return math.tan(radians)


def asin(x: float) -> float:
    """
    Inverse sine function, returning degrees.

    Args:
        x: Value in range [-1, 1]

    Returns:
        Angle in degrees

    Raises:
        DomainError: If x is outside [-1, 1]
    """
    if x < -1 or x > 1:
        raise DomainError(
            f"asin({x}): input must be between -1 and 1, got {x}"
        )
    radians = math.asin(x)
    return math.degrees(radians)


def acos(x: float) -> float:
    """
    Inverse cosine function, returning degrees.

    Args:
        x: Value in range [-1, 1]

    Returns:
        Angle in degrees

    Raises:
        DomainError: If x is outside [-1, 1]
    """
    if x < -1 or x > 1:
        raise DomainError(
            f"acos({x}): input must be between -1 and 1, got {x}"
        )
    radians = math.acos(x)
    return math.degrees(radians)


def atan(x: float) -> float:
    """
    Inverse tangent function, returning degrees.

    Args:
        x: Any real number

    Returns:
        Angle in degrees
    """
    radians = math.atan(x)
    return math.degrees(radians)


# ============================================================================
# Logarithmic Functions
# ============================================================================


def log10(x: float) -> float:
    """
    Base-10 logarithm.

    Args:
        x: Positive real number

    Returns:
        log₁₀(x)

    Raises:
        DomainError: If x <= 0
    """
    if x <= 0:
        raise DomainError(f"log10({x}): input must be positive, got {x}")
    return math.log10(x)


def ln(x: float) -> float:
    """
    Natural logarithm (base e).

    Args:
        x: Positive real number

    Returns:
        ln(x)

    Raises:
        DomainError: If x <= 0
    """
    if x <= 0:
        raise DomainError(f"ln({x}): input must be positive, got {x}")
    return math.log(x)


def logn(x: float, base: float) -> float:
    """
    Logarithm with arbitrary base.

    Args:
        x: Positive real number
        base: Positive real number, not equal to 1

    Returns:
        logₙ(x) = log(x) / log(base)

    Raises:
        DomainError: If x <= 0, base <= 0, or base == 1
    """
    if x <= 0:
        raise DomainError(
            f"logn({x}, {base}): argument must be positive, got {x}"
        )
    if base <= 0:
        raise DomainError(
            f"logn({x}, {base}): base must be positive, got {base}"
        )
    if base == 1:
        raise DomainError(
            f"logn({x}, {base}): base cannot be 1, got {base}"
        )
    return math.log(x) / math.log(base)


# ============================================================================
# Exponential Functions
# ============================================================================


def exp(x: float) -> float:
    """
    Exponential function e^x.

    Args:
        x: Real number

    Returns:
        e^x
    """
    return math.exp(x)


def power(base: float, exponent: float) -> float:
    """
    Power function base^exponent.

    Args:
        base: Base number
        exponent: Exponent

    Returns:
        base^exponent

    Raises:
        DomainError: If 0^0, 0^negative, or negative^fractional
    """
    # Special case: 0^0 is undefined
    if base == 0 and exponent == 0:
        raise DomainError(f"power(0, 0): 0^0 is undefined")

    # Special case: 0^negative is undefined
    if base == 0 and exponent < 0:
        raise DomainError(
            f"power(0, {exponent}): 0 to negative power is undefined"
        )

    # Special case: negative^fractional (non-integer) is complex
    if base < 0:
        # Check if exponent is a non-integer (fractional)
        if exponent != int(exponent):
            raise DomainError(
                f"power({base}, {exponent}): negative base with fractional exponent results in complex number"
            )

    return base ** exponent


def sqrt(x: float) -> float:
    """
    Square root function.

    Args:
        x: Non-negative real number

    Returns:
        √x

    Raises:
        DomainError: If x < 0
    """
    if x < 0:
        raise DomainError(f"sqrt({x}): input must be non-negative, got {x}")
    return math.sqrt(x)


def nthroot(x: float, n: float) -> float:
    """
    nth root function: ⁿ√x.

    Args:
        x: Real number
        n: Positive integer (root degree)

    Returns:
        ⁿ√x

    Raises:
        DomainError: If n <= 0 or if n is even and x < 0
    """
    if n == 0:
        raise DomainError(f"nthroot({x}, 0): root degree cannot be 0")
    if n < 0:
        raise DomainError(
            f"nthroot({x}, {n}): root degree must be positive, got {n}"
        )

    # Check if n is even and x is negative (complex result)
    if x < 0 and n == int(n) and int(n) % 2 == 0:
        raise DomainError(
            f"nthroot({x}, {n}): even root of negative number is not real"
        )

    # For odd roots of negative numbers, compute the real root
    if x < 0 and n == int(n):
        # Odd root of negative: ⁿ√x = -ⁿ√|x|
        return -(abs(x) ** (1 / n))

    return x ** (1 / n)


# ============================================================================
# Statistical Functions
# ============================================================================


def mean(data: list[float]) -> float:
    """
    Arithmetic mean (average).

    Args:
        data: List of numbers

    Returns:
        The mean value
    """
    if not data:
        return 0.0
    return sum(data) / len(data)


def median(data: list[float]) -> float:
    """
    Median value (middle value when sorted).

    Args:
        data: List of numbers

    Returns:
        The median value
    """
    if not data:
        return 0.0

    sorted_data = sorted(data)
    n = len(sorted_data)

    if n % 2 == 1:
        # Odd length: return middle element
        return float(sorted_data[n // 2])
    else:
        # Even length: return average of two middle elements
        mid1 = sorted_data[n // 2 - 1]
        mid2 = sorted_data[n // 2]
        return (mid1 + mid2) / 2


def mode(data: list[float]) -> float:
    """
    Mode (most frequent value).

    Args:
        data: List of numbers

    Returns:
        The most frequent value. If multiple modes exist, returns one of them.
    """
    if not data:
        return 0.0

    # Count occurrences
    counts: dict[float, int] = {}
    for value in data:
        counts[value] = counts.get(value, 0) + 1

    # Find the value(s) with highest count
    max_count = max(counts.values())
    for value, count in counts.items():
        if count == max_count:
            return value

    return data[0]


def variance(data: list[float]) -> float:
    """
    Sample variance (using n-1 denominator).

    Args:
        data: List of numbers (must have at least 2 values)

    Returns:
        The sample variance

    Raises:
        DomainError: If data has fewer than 2 values
    """
    if len(data) < 2:
        raise DomainError(
            f"variance: requires at least 2 values, got {len(data)}"
        )

    m = mean(data)
    squared_diffs = [(x - m) ** 2 for x in data]
    return sum(squared_diffs) / (len(data) - 1)


def stdev(data: list[float]) -> float:
    """
    Sample standard deviation (using n-1 denominator).

    Args:
        data: List of numbers (must have at least 2 values)

    Returns:
        The sample standard deviation

    Raises:
        DomainError: If data has fewer than 2 values
    """
    if len(data) < 2:
        raise DomainError(
            f"stdev: requires at least 2 values, got {len(data)}"
        )
    var = variance(data)
    return math.sqrt(var)


# ============================================================================
# Function Registry
# ============================================================================


class FunctionRegistry:
    """Registry for safe, whitelisted mathematical functions."""

    def __init__(self) -> None:
        """Initialize the function registry."""
        self.functions: dict[str, Callable[..., float]] = {}
        self._descriptions: dict[str, str] = {}
        self._register_builtins()

    def _register_builtins(self) -> None:
        """Register built-in mathematical functions."""
        # Trigonometric functions (degree-based)
        self._register("sin", sin, "Sine function (input in degrees)")
        self._register("cos", cos, "Cosine function (input in degrees)")
        self._register("tan", tan, "Tangent function (input in degrees)")
        self._register("asin", asin, "Arcsine function (output in degrees, domain: [-1, 1])")
        self._register("acos", acos, "Arccosine function (output in degrees, domain: [-1, 1])")
        self._register("atan", atan, "Arctangent function (output in degrees)")

        # Logarithmic functions
        self._register("log10", log10, "Base-10 logarithm (domain: x > 0)")
        self._register("ln", ln, "Natural logarithm (domain: x > 0)")
        self._register("logn", logn, "Logarithm with arbitrary base (domain: x > 0, base > 0, base ≠ 1)")

        # Exponential and power functions
        self._register("exp", exp, "Exponential function (e^x)")
        self._register("power", power, "Power function (x^y)")
        self._register("sqrt", sqrt, "Square root (domain: x >= 0)")
        self._register("nthroot", nthroot, "nth root function")

        # Statistical functions
        self._register("mean", mean, "Mean/average of values")
        self._register("median", median, "Median of values")
        self._register("mode", mode, "Mode (most frequent value)")
        self._register("stdev", stdev, "Sample standard deviation (requires >= 2 values)")
        self._register("variance", variance, "Sample variance (requires >= 2 values)")

    def _register(
        self, name: str, func: Callable[..., float], description: str
    ) -> None:
        """
        Register a function.

        Args:
            name: Function name
            func: The function callable
            description: Human-readable description
        """
        self.functions[name] = func
        self._descriptions[name] = description

    def get(self, name: str) -> Callable[..., float] | None:
        """
        Get a registered function by name.

        Args:
            name: Function name

        Returns:
            The function or None if not found
        """
        return self.functions.get(name)

    def is_registered(self, name: str) -> bool:
        """
        Check if a function is registered.

        Args:
            name: Function name

        Returns:
            True if the function is registered
        """
        return name in self.functions

    def list_all(self) -> dict[str, str]:
        """
        List all registered functions with descriptions.

        Returns:
            Dictionary mapping function names to descriptions
        """
        return dict(self._descriptions)

    def list_by_category(self) -> dict[str, list[str]]:
        """
        List all registered functions organized by category.

        Returns:
            Dictionary mapping categories to function names
        """
        return {
            "trigonometric": ["sin", "cos", "tan", "asin", "acos", "atan"],
            "logarithmic": ["log10", "ln", "logn"],
            "exponential": ["exp", "power", "sqrt", "nthroot"],
            "statistical": ["mean", "median", "mode", "stdev", "variance"],
        }


# Module-level singleton registry
_registry: FunctionRegistry | None = None


def get_registry() -> FunctionRegistry:
    """
    Get the global function registry.

    Returns:
        The FunctionRegistry singleton
    """
    global _registry
    if _registry is None:
        _registry = FunctionRegistry()
    return _registry
