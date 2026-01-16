"""
AST-based expression evaluator for safe mathematical expression evaluation.

Provides safe evaluation of mathematical expressions using Python's ast module
instead of eval(). Supports:
- Binary operations (+, -, *, /, %, **)
- Unary operations (-, +)
- Unit-aware quantities via Pint
- Scientific functions
- Proper operator precedence
"""

from __future__ import annotations

import ast
import operator
from typing import Any

from scientific_calculator.exceptions import EvaluationError, SyntaxError
from scientific_calculator.functions import get_registry as get_function_registry


class SafeExpressionEvaluator(ast.NodeVisitor):
    """
    Safe AST-based evaluator for mathematical expressions.

    Uses Python's ast module to parse and evaluate expressions without
    relying on eval(), ensuring safe execution. All operations are from
    a whitelisted set.
    """

    # Whitelisted binary operators for safe evaluation
    OPERATORS: dict[type, Any] = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
    }

    # Whitelisted unary operators
    UNARY_OPERATORS: dict[type, Any] = {
        ast.UAdd: operator.pos,
        ast.USub: operator.neg,
    }

    def __init__(self) -> None:
        """Initialize the evaluator with function registry."""
        self.context: dict[str, Any] = {}
        self.function_registry = get_function_registry()

    def evaluate(self, expression: str) -> Any:
        """
        Evaluate a mathematical expression.

        Args:
            expression: String representation of the expression

        Returns:
            The result of the evaluation

        Raises:
            SyntaxError: If expression has invalid syntax
            EvaluationError: If expression contains unsafe operations
            ZeroDivisionError: If division by zero occurs
        """
        try:
            tree = ast.parse(expression, mode="eval")
        except SyntaxError as e:
            raise SyntaxError(
                f"Invalid expression syntax",
                {"expression": expression, "error": str(e)},
            ) from e

        try:
            return self.visit(tree.body)
        except ZeroDivisionError as e:
            raise EvaluationError(
                "Division by zero",
                {"expression": expression},
            ) from e
        except Exception as e:
            raise EvaluationError(
                f"Evaluation error: {str(e)}",
                {"expression": expression},
            ) from e

    def visit_BinOp(self, node: ast.BinOp) -> Any:
        """Visit binary operation node."""
        left = self.visit(node.left)
        right = self.visit(node.right)

        op_type = type(node.op)
        if op_type not in self.OPERATORS:
            raise SyntaxError(
                f"Unsupported binary operator: {op_type.__name__}",
                {"operator": op_type.__name__},
            )

        operator_func = self.OPERATORS[op_type]

        try:
            return operator_func(left, right)
        except ZeroDivisionError:
            raise
        except Exception as e:
            raise EvaluationError(
                f"Binary operation failed: {str(e)}",
                {"left": left, "right": right, "operator": op_type.__name__},
            ) from e

    def visit_UnaryOp(self, node: ast.UnaryOp) -> Any:
        """Visit unary operation node."""
        operand = self.visit(node.operand)

        op_type = type(node.op)
        if op_type not in self.UNARY_OPERATORS:
            raise SyntaxError(
                f"Unsupported unary operator: {op_type.__name__}",
                {"operator": op_type.__name__},
            )

        operator_func = self.UNARY_OPERATORS[op_type]
        return operator_func(operand)

    def visit_Call(self, node: ast.Call) -> Any:
        """Visit function call node."""
        if not isinstance(node.func, ast.Name):
            raise SyntaxError(
                "Only simple function calls are allowed",
                {"expression": ast.unparse(node)},
            )

        func_name = node.func.id
        if not self.function_registry.is_registered(func_name):
            raise SyntaxError(
                f"Unknown function: {func_name}",
                {"function": func_name},
            )

        # Evaluate arguments
        args = [self.visit(arg) for arg in node.args]

        try:
            func = self.function_registry.get(func_name)
            assert func is not None
            return func(*args)
        except Exception as e:
            raise EvaluationError(
                f"Function call failed: {func_name}",
                {"function": func_name, "error": str(e)},
            ) from e

    def visit_Constant(self, node: ast.Constant) -> Any:
        """Visit constant node (number, string, etc.)."""
        if not isinstance(node.value, (int, float, complex)):
            raise SyntaxError(
                f"Only numeric constants are allowed",
                {"type": type(node.value).__name__},
            )

        return node.value

    def visit_Name(self, node: ast.Name) -> Any:
        """Visit variable name node."""
        name = node.id

        # Check for mathematical constants
        if name == "pi":
            return 3.141592653589793
        if name == "e":
            return 2.718281828459045

        if name not in self.context:
            raise SyntaxError(
                f"Unknown variable: {name}",
                {"variable": name},
            )

        return self.context[name]

    def generic_visit(self, node: ast.AST) -> Any:
        """Reject any unhandled AST node types."""
        raise SyntaxError(
            f"Unsupported expression type: {type(node).__name__}",
            {"node_type": type(node).__name__},
        )
