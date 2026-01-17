"""
Unit tests for parentheses grouping in expression evaluation.

Tests verify that parentheses correctly override default operator precedence
and allow explicit grouping of operations.
"""

import pytest
from scientific_calculator.expression_evaluator import SafeExpressionEvaluator
from scientific_calculator.exceptions import EvaluationError, SyntaxError


class TestParenthesesGrouping:
    """Test parentheses override of operator precedence."""

    @pytest.fixture
    def evaluator(self):
        """Create evaluator instance."""
        return SafeExpressionEvaluator()

    def test_simple_parentheses(self, evaluator):
        """Simple parentheses grouping."""
        result = evaluator.evaluate("(2 + 3)")
        assert result == 5

    def test_parentheses_change_addition_before_multiply(self, evaluator):
        """Parentheses force addition before multiplication."""
        # Without parentheses: 2 + 3 * 4 = 2 + 12 = 14
        # With parentheses: (2 + 3) * 4 = 5 * 4 = 20
        result = evaluator.evaluate("(2 + 3) * 4")
        assert result == 20

    def test_parentheses_change_subtraction_before_multiply(self, evaluator):
        """Parentheses force subtraction before multiplication."""
        result = evaluator.evaluate("(10 - 3) * 2")
        assert result == 14  # 7 * 2 = 14

    def test_parentheses_change_division_before_multiply(self, evaluator):
        """Parentheses force division before multiplication."""
        result = evaluator.evaluate("(20 / 4) * 2")
        assert result == 10  # 5 * 2 = 10

    def test_nested_parentheses(self, evaluator):
        """Nested parentheses evaluate from inside out."""
        # ((2 + 3) * 4) = (5 * 4) = 20
        result = evaluator.evaluate("((2 + 3) * 4)")
        assert result == 20

    def test_deeply_nested_parentheses(self, evaluator):
        """Deeply nested parentheses."""
        # (((2 + 3))) = 5
        result = evaluator.evaluate("(((2 + 3)))")
        assert result == 5

    def test_multiple_parentheses_groups(self, evaluator):
        """Multiple separate parentheses groups."""
        # (2 + 3) * (4 + 5) = 5 * 9 = 45
        result = evaluator.evaluate("(2 + 3) * (4 + 5)")
        assert result == 45

    def test_parentheses_with_unary_operators(self, evaluator):
        """Parentheses with unary operators."""
        # -(2 + 3) = -5
        result = evaluator.evaluate("-(2 + 3)")
        assert result == -5

    def test_parentheses_force_exponentiation_base(self, evaluator):
        """Parentheses on exponentiation base."""
        # (2 + 3) ** 2 = 5 ** 2 = 25
        result = evaluator.evaluate("(2 + 3) ** 2")
        assert result == 25

    def test_parentheses_force_exponentiation_exponent(self, evaluator):
        """Parentheses on exponentiation exponent."""
        # 2 ** (3 + 1) = 2 ** 4 = 16
        result = evaluator.evaluate("2 ** (3 + 1)")
        assert result == 16

    def test_parentheses_override_right_associativity(self, evaluator):
        """Parentheses override right-associativity of exponentiation."""
        # Without parentheses: 2 ** 3 ** 2 = 2 ** (3 ** 2) = 2 ** 9 = 512
        # With parentheses: (2 ** 3) ** 2 = 8 ** 2 = 64
        result = evaluator.evaluate("(2 ** 3) ** 2")
        assert result == 64

    def test_parentheses_with_modulo(self, evaluator):
        """Parentheses with modulo operator."""
        # (7 + 3) % 5 = 10 % 5 = 0
        result = evaluator.evaluate("(7 + 3) % 5")
        assert result == 0

    def test_complex_nested_expression(self, evaluator):
        """Complex expression with multiple nesting levels."""
        # ((2 + 3) * (4 - 1)) = (5 * 3) = 15
        result = evaluator.evaluate("((2 + 3) * (4 - 1))")
        assert result == 15

    def test_parentheses_with_function_calls(self, evaluator):
        """Parentheses around function arguments."""
        # sin(30 + 0) should work
        result = evaluator.evaluate("sin(30 + 0)")
        assert isinstance(result, (int, float))

    def test_parentheses_with_negation(self, evaluator):
        """Parentheses with negation."""
        # -(3 - 5) = -(-2) = 2
        result = evaluator.evaluate("-(3 - 5)")
        assert result == 2

    def test_parentheses_force_subtraction_order(self, evaluator):
        """Parentheses change subtraction order."""
        # 10 - (5 - 2) = 10 - 3 = 7
        # Without parentheses: 10 - 5 - 2 = 3
        result = evaluator.evaluate("10 - (5 - 2)")
        assert result == 7

    def test_parentheses_force_division_order(self, evaluator):
        """Parentheses change division order."""
        # 24 / (2 / 2) = 24 / 1 = 24
        # Without parentheses: 24 / 2 / 2 = 6
        result = evaluator.evaluate("24 / (2 / 2)")
        assert result == 24

    def test_empty_parentheses_not_allowed(self, evaluator):
        """Empty parentheses should raise an error."""
        with pytest.raises((SyntaxError, EvaluationError)):
            evaluator.evaluate("()")

    def test_unmatched_opening_parentheses(self, evaluator):
        """Unmatched opening parentheses should raise error."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("(2 + 3")

    def test_unmatched_closing_parentheses(self, evaluator):
        """Unmatched closing parentheses should raise error."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("2 + 3)")

    def test_mismatched_parentheses(self, evaluator):
        """Mismatched parentheses should raise error."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("(2 + 3]")

    def test_parentheses_with_fractional_result(self, evaluator):
        """Parentheses with division giving fractional result."""
        # (5 / 2) = 2.5
        result = evaluator.evaluate("(5 / 2)")
        assert result == 2.5

    def test_zero_division_in_parentheses(self, evaluator):
        """Division by zero inside parentheses."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("(5 / 0)")

    def test_multiple_operations_in_parentheses(self, evaluator):
        """Multiple operations within parentheses."""
        # (2 + 3 * 4 - 5) = (2 + 12 - 5) = 9
        result = evaluator.evaluate("(2 + 3 * 4 - 5)")
        assert result == 9

    def test_parentheses_with_all_operators(self, evaluator):
        """Parentheses with multiple operator types."""
        # (2 + 3 * 4 / 2 - 1) = (2 + 6 - 1) = 7
        result = evaluator.evaluate("(2 + 3 * 4 / 2 - 1)")
        assert result == 7

    def test_parentheses_with_exponent_and_other_ops(self, evaluator):
        """Parentheses combining exponentiation with other operators."""
        # (2 + 3) ** 2 + 1 = 25 + 1 = 26
        result = evaluator.evaluate("(2 + 3) ** 2 + 1")
        assert result == 26

    def test_function_argument_parentheses(self, evaluator):
        """Function call parentheses are not grouping parentheses."""
        # sin(30) returns a float
        result = evaluator.evaluate("sin(30)")
        assert isinstance(result, (int, float))

    def test_nested_function_calls_with_parentheses(self, evaluator):
        """Nested function calls with additional grouping parentheses."""
        # (sin(30)) should be valid
        result = evaluator.evaluate("(sin(30))")
        assert isinstance(result, (int, float))
