"""
Scientific function registry with whitelisted mathematical functions.

Provides:
- Trigonometric functions (sin, cos, tan, etc.)
- Logarithmic functions (log, ln)
- Exponential functions (exp, pow)
- Statistical functions (mean, median, stdev)
- Safe function registry with parameter validation
"""

from __future__ import annotations

from typing import Callable


class FunctionRegistry:
    """Registry for safe, whitelisted mathematical functions."""

    def __init__(self) -> None:
        """Initialize the function registry."""
        self.functions: dict[str, Callable[..., float]] = {}
        self._register_builtins()

    def _register_builtins(self) -> None:
        """Register built-in mathematical functions."""
        # TODO: Register trigonometric functions
        # TODO: Register logarithmic functions
        # TODO: Register exponential functions
        # TODO: Register statistical functions
        pass

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
        # TODO: Return function names and descriptions
        return {}


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
