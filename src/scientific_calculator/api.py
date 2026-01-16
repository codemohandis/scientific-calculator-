"""
API layer for the scientific calculator.

Provides entry points for:
- Expression evaluation
- Unit conversion and queries
- Function listing and information
- Error handling with user-friendly messages
"""

from __future__ import annotations

from typing import Any

from scientific_calculator.exceptions import (
    CalculatorException,
    DimensionalityError,
    EvaluationError,
    SyntaxError,
    UnitError,
)
from scientific_calculator.expression_evaluator import SafeExpressionEvaluator
from scientific_calculator.functions import get_registry as get_function_registry
from scientific_calculator.units import (
    convert,
    get_conversion_factor,
    is_compatible,
)


def evaluate_expression(expression: str, context: dict[str, float] | None = None) -> dict[str, Any]:
    """
    Evaluate a mathematical expression.

    Args:
        expression: The expression to evaluate
        context: Optional dictionary of variables for the expression

    Returns:
        Dictionary with result, unit, and error information:
        - If successful: {"result": float, "error": None}
        - If error: {"result": None, "error": str}

    Example:
        >>> evaluate_expression("2 + 3 * 4")
        {"result": 14.0, "error": None}
    """
    try:
        evaluator = SafeExpressionEvaluator()
        if context:
            evaluator.context = context
        result = evaluator.evaluate(expression)
        return {"result": float(result), "error": None}
    except (SyntaxError, EvaluationError) as e:
        return {"result": None, "error": str(e)}
    except Exception as e:
        return {
            "result": None,
            "error": f"Unexpected error: {str(e)}",
        }


def list_units() -> dict[str, list[str]]:
    """
    List all available units organized by category.

    Returns:
        Dictionary mapping unit categories to unit lists
    """
    return {
        "distance": ["meter", "kilometer", "mile", "foot", "inch", "yard"],
        "mass": ["kilogram", "gram", "pound", "ounce", "ton"],
        "temperature": ["celsius", "fahrenheit", "kelvin"],
        "volume": ["liter", "milliliter", "gallon", "quart", "pint"],
        "derived": [
            "velocity",
            "force",
            "pressure",
            "energy",
            "power",
            "magnetic_flux",
        ],
    }


def list_functions() -> dict[str, list[str]]:
    """
    List all available functions organized by category.

    Returns:
        Dictionary mapping function categories to function lists
    """
    registry = get_function_registry()
    return registry.list_by_category()


def get_function_info(func_name: str) -> dict[str, Any] | None:
    """
    Get information about a specific function.

    Args:
        func_name: Name of the function

    Returns:
        Dictionary with function information or None if not found
    """
    registry = get_function_registry()
    if not registry.is_registered(func_name):
        return None

    all_funcs = registry.list_all()
    return {
        "name": func_name,
        "description": all_funcs.get(func_name, ""),
    }


def convert_units(value: float, from_unit: str, to_unit: str) -> dict[str, Any]:
    """
    Convert a value between units.

    Args:
        value: The value to convert
        from_unit: Source unit
        to_unit: Target unit

    Returns:
        Dictionary with conversion result:
        - If successful: {"result": float, "from_unit": str, "to_unit": str, "error": None}
        - If error: {"result": None, "from_unit": str, "to_unit": str, "error": str}

    Example:
        >>> convert_units(5, "km", "miles")
        {"result": 3.10686, "from_unit": "km", "to_unit": "miles", "error": None}
    """
    try:
        if not is_compatible(from_unit, to_unit):
            return {
                "result": None,
                "from_unit": from_unit,
                "to_unit": to_unit,
                "error": f"Cannot convert {from_unit} to {to_unit}: incompatible units",
            }

        result = convert(value, from_unit, to_unit)
        return {
            "result": round(result, 5),  # 5 decimal places precision
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": None,
        }
    except UnitError as e:
        return {
            "result": None,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": str(e),
        }
    except DimensionalityError as e:
        return {
            "result": None,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": str(e),
        }
    except Exception as e:
        return {
            "result": None,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": f"Unexpected error: {str(e)}",
        }


def check_unit_compatibility(from_unit: str, to_unit: str) -> dict[str, Any]:
    """
    Check if two units are compatible for conversion.

    Args:
        from_unit: First unit
        to_unit: Second unit

    Returns:
        Dictionary with compatibility information:
        {"compatible": bool, "from_unit": str, "to_unit": str, "error": str | None}
    """
    try:
        compatible = is_compatible(from_unit, to_unit)
        return {
            "compatible": compatible,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": None,
        }
    except CalculatorException as e:
        return {
            "compatible": False,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": str(e),
        }
    except Exception as e:
        return {
            "compatible": False,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": f"Unexpected error: {str(e)}",
        }


def get_conversion_factor_api(from_unit: str, to_unit: str) -> dict[str, Any]:
    """
    Get the conversion factor between two units.

    Args:
        from_unit: Source unit
        to_unit: Target unit

    Returns:
        Dictionary with conversion factor or error
    """
    try:
        factor = get_conversion_factor(from_unit, to_unit)
        return {
            "factor": factor,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": None,
        }
    except (UnitError, DimensionalityError) as e:
        return {
            "factor": None,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": str(e),
        }
    except Exception as e:
        return {
            "factor": None,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "error": f"Unexpected error: {str(e)}",
        }
