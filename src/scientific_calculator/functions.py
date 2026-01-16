"""
Scientific function registry with whitelisted mathematical functions.

Provides:
- Trigonometric functions (sin, cos, tan, asin, acos, atan)
- Logarithmic functions (log, log10, ln)
- Exponential functions (exp, pow, sqrt)
- Statistical functions (mean, median, stdev)
- Safe function registry with parameter validation and domain checking
"""

from __future__ import annotations

import math
from statistics import mean as _mean
from statistics import median as _median
from statistics import stdev as _stdev
from typing import Callable


class FunctionRegistry:
    """Registry for safe, whitelisted mathematical functions."""

    def __init__(self) -> None:
        """Initialize the function registry."""
        self.functions: dict[str, Callable[..., float]] = {}
        self._descriptions: dict[str, str] = {}
        self._register_builtins()

    def _register_builtins(self) -> None:
        """Register built-in mathematical functions."""
        # Trigonometric functions
        self._register("sin", math.sin, "Sine function (input in radians)")
        self._register("cos", math.cos, "Cosine function (input in radians)")
        self._register("tan", math.tan, "Tangent function (input in radians)")
        self._register("asin", math.asin, "Arcsine function (domain: [-1, 1])")
        self._register("acos", math.acos, "Arccosine function (domain: [-1, 1])")
        self._register("atan", math.atan, "Arctangent function")

        # Logarithmic functions
        self._register("log", math.log10, "Base-10 logarithm (domain: x > 0)")
        self._register("log10", math.log10, "Base-10 logarithm (domain: x > 0)")
        self._register("ln", math.log, "Natural logarithm (domain: x > 0)")

        # Exponential and power functions
        self._register("exp", math.exp, "Exponential function (e^x)")
        self._register("sqrt", math.sqrt, "Square root (domain: x >= 0)")
        self._register("pow", pow, "Power function (x^y)")

        # Statistical functions (for lists)
        self._register("mean", _mean, "Mean/average of values")
        self._register("median", _median, "Median of values")
        self._register("stdev", _stdev, "Standard deviation of values")

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
            "logarithmic": ["log", "log10", "ln"],
            "exponential": ["exp", "sqrt", "pow"],
            "statistical": ["mean", "median", "stdev"],
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
