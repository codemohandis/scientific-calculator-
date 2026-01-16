"""
API layer for the scientific calculator.

Provides REST/GraphQL endpoints for:
- Expression evaluation
- Unit listing and queries
- Function listing and queries
- Error handling and user feedback
"""

from __future__ import annotations

from typing import Any


async def evaluate_expression(expression: str) -> dict[str, Any]:
    """
    Evaluate a mathematical expression.

    Args:
        expression: The expression to evaluate

    Returns:
        Dictionary with result, unit, and error information

    Raises:
        ValueError: If expression is invalid
    """
    # TODO: Parse and evaluate expression
    # TODO: Return result with unit information
    raise NotImplementedError("Expression evaluation API not yet implemented")


async def list_units() -> dict[str, list[str]]:
    """
    List all available units organized by category.

    Returns:
        Dictionary mapping unit categories to unit lists
    """
    # TODO: Return organized unit listing
    raise NotImplementedError("Unit listing API not yet implemented")


async def list_functions() -> dict[str, list[str]]:
    """
    List all available functions organized by category.

    Returns:
        Dictionary mapping function categories to function lists
    """
    # TODO: Return organized function listing
    raise NotImplementedError("Function listing API not yet implemented")


async def convert_units(value: float, from_unit: str, to_unit: str) -> dict[str, Any]:
    """
    Convert a value between units.

    Args:
        value: The value to convert
        from_unit: Source unit
        to_unit: Target unit

    Returns:
        Dictionary with conversion result

    Raises:
        ValueError: If units are incompatible
    """
    # TODO: Perform unit conversion
    # TODO: Return result with accuracy information
    raise NotImplementedError("Unit conversion API not yet implemented")
