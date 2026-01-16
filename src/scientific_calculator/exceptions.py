"""
Custom exception hierarchy for the scientific calculator.

Provides exception classes for various error conditions:
- Syntax/parsing errors
- Domain validation errors
- Dimensionality mismatches
- Evaluation errors
- Unit compatibility errors
"""

from __future__ import annotations


class CalculatorException(Exception):
    """
    Base exception for all calculator errors.

    Provides rich context information for debugging and user feedback.
    """

    def __init__(self, message: str, context: dict | None = None) -> None:
        """
        Initialize calculator exception.

        Args:
            message: Human-readable error message
            context: Optional dictionary with error context (expression, value, etc.)

        Example:
            >>> raise CalculatorException(
            ...     "Invalid unit conversion",
            ...     {"from_unit": "km", "to_unit": "kg", "reason": "incompatible"}
            ... )
        """
        self.message = message
        self.context = context or {}
        super().__init__(str(self))

    def __str__(self) -> str:
        """Return string representation of exception."""
        if self.context:
            context_str = " | ".join(
                f"{k}: {v}" for k, v in self.context.items()
            )
            return f"{self.message} ({context_str})"
        return self.message

    def __repr__(self) -> str:
        """Return representation of exception."""
        return f"{self.__class__.__name__}({self.message!r}, {self.context!r})"


class SyntaxError(CalculatorException):
    """
    Raised when expression has syntax errors.

    Examples:
        - Unbalanced parentheses
        - Invalid operators
        - Unexpected tokens
    """

    pass


class DomainError(CalculatorException):
    """
    Raised when value is outside valid domain for an operation.

    Examples:
        - sqrt(-1)
        - log(0)
        - asin(2)
    """

    pass


class DimensionalityError(CalculatorException):
    """
    Raised when unit dimensions don't match for an operation.

    Examples:
        - Adding 5 km + 3 kg
        - Converting miles to kilograms
        - Invalid unit pair for conversion
    """

    pass


class EvaluationError(CalculatorException):
    """
    Raised when expression evaluation fails.

    Examples:
        - Division by zero
        - Undefined variable
        - Function evaluation error
    """

    pass


class UnitError(CalculatorException):
    """
    Raised when a unit is unknown or invalid.

    Examples:
        - Unknown unit: "kilomiles"
        - Invalid unit syntax: "km/s/s"
    """

    pass
