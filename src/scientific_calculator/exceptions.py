"""
Custom exception hierarchy for the scientific calculator.

Provides exception classes for various error conditions:
- Syntax/parsing errors
- Domain validation errors
- Dimensionality mismatches
- Evaluation errors
"""

from __future__ import annotations


class CalculatorException(Exception):
    """Base exception for all calculator errors."""

    def __init__(self, message: str, context: dict | None = None) -> None:
        """
        Initialize calculator exception.

        Args:
            message: Human-readable error message
            context: Optional dictionary with error context (expression, value, etc.)
        """
        self.message = message
        self.context = context or {}
        super().__init__(self.message)

    def __str__(self) -> str:
        """Return string representation of exception."""
        if self.context:
            context_str = " | ".join(
                f"{k}: {v}" for k, v in self.context.items()
            )
            return f"{self.message} ({context_str})"
        return self.message


class SyntaxError(CalculatorException):
    """Raised when expression has syntax errors."""

    pass


class DomainError(CalculatorException):
    """Raised when value is outside valid domain (e.g., sqrt(-1))."""

    pass


class DimensionalityError(CalculatorException):
    """Raised when unit dimensions don't match for an operation."""

    pass


class EvaluationError(CalculatorException):
    """Raised when expression evaluation fails."""

    pass
