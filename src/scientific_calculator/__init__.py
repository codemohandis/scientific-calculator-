"""
Scientific Calculator Package.

A full-stack calculator with support for unit conversions, scientific operations,
and compound expression evaluation with type-safe design and comprehensive testing.

Main components:
- Expression evaluator (AST-based safe evaluation)
- Unit system (Pint integration for dimensional analysis)
- Function registry (whitelisted mathematical functions)
- API layer (REST/GraphQL endpoints)
"""

from __future__ import annotations

from typing import Union

__version__ = "0.1.0"

# Type aliases for common types used throughout the calculator
Number = Union[int, float, complex]
"""Numeric type that can be evaluated"""

Value = Union[Number, str]
"""Value that can be converted or evaluated"""

Operator = str
"""String identifier for an operator (+, -, *, /, %, **)"""

Function = str
"""String identifier for a registered function (sin, cos, log, etc.)"""

__all__ = [
    "version",
    "Number",
    "Value",
    "Operator",
    "Function",
]

version = __version__
