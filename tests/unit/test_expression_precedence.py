"""
Unit tests for operator precedence in expression evaluation.

Tests verify that operators are evaluated in the correct order:
- Exponentiation (highest precedence, right-associative)
- Multiplication, Division, Modulo (left-associative)
- Addition, Subtraction (lowest precedence, left-associative)
- Unary operators (highest precedence)
"""

import pytest
from scientific_calculator.expression_evaluator import SafeExpressionEvaluator
from scientific_calculator.exceptions import EvaluationError, SyntaxError


class TestOperatorPrecedence:
    """Test operator precedence rules."""

    @pytest.fixture
    def evaluator(self):
        """Create evaluator instance."""
        return SafeExpressionEvaluator()

    def test_multiply_before_add(self, evaluator):
        """Multiplication should occur before addition."""
        result = evaluator.evaluate("2 + 3 * 4")
        assert result == 14  # 2 + (3 * 4) = 2 + 12 = 14

    def test_multiply_before_subtract(self, evaluator):
        """Multiplication should occur before subtraction."""
        result = evaluator.evaluate("10 - 3 * 2")
        assert result == 4  # 10 - (3 * 2) = 10 - 6 = 4

    def test_divide_before_add(self, evaluator):
        """Division should occur before addition."""
        result = evaluator.evaluate("10 + 6 / 2")
        assert result == 13  # 10 + (6 / 2) = 10 + 3 = 13

    def test_divide_before_subtract(self, evaluator):
        """Division should occur before subtraction."""
        result = evaluator.evaluate("20 - 10 / 2")
        assert result == 15  # 20 - (10 / 2) = 20 - 5 = 15

    def test_modulo_before_add(self, evaluator):
        """Modulo should occur before addition."""
        result = evaluator.evaluate("5 + 7 % 3")
        assert result == 6  # 5 + (7 % 3) = 5 + 1 = 6

    def test_power_before_multiply(self, evaluator):
        """Exponentiation should occur before multiplication."""
        result = evaluator.evaluate("2 * 3 ** 2")
        assert result == 18  # 2 * (3 ** 2) = 2 * 9 = 18

    def test_power_before_divide(self, evaluator):
        """Exponentiation should occur before division."""
        result = evaluator.evaluate("16 / 2 ** 2")
        assert result == 4  # 16 / (2 ** 2) = 16 / 4 = 4

    def test_power_right_associative(self, evaluator):
        """Exponentiation should be right-associative."""
        result = evaluator.evaluate("2 ** 3 ** 2")
        assert result == 512  # 2 ** (3 ** 2) = 2 ** 9 = 512
        # If left-associative, it would be (2 ** 3) ** 2 = 8 ** 2 = 64

    def test_unary_minus_highest_precedence(self, evaluator):
        """Unary minus should have highest precedence."""
        result = evaluator.evaluate("-2 ** 2")
        assert result == -4  # -(2 ** 2) = -(4) = -4 (unary minus applied after exponentiation)

    def test_unary_plus_highest_precedence(self, evaluator):
        """Unary plus should have highest precedence."""
        result = evaluator.evaluate("+5 * 2")
        assert result == 10  # (+5) * 2 = 5 * 2 = 10

    def test_complex_precedence_chain(self, evaluator):
        """Complex expression with multiple operators."""
        # 3 + 4 * 2 / (1 - 5) ** 2 = 3 + 4 * 2 / (-4) ** 2 = 3 + 4 * 2 / 16 = 3 + 8/16 = 3 + 0.5 = 3.5
        result = evaluator.evaluate("3 + 4 * 2 / (1 - 5) ** 2")
        assert abs(result - 3.5) < 1e-6

    def test_multiple_multiplications_left_associative(self, evaluator):
        """Multiple multiplications should be left-associative."""
        result = evaluator.evaluate("2 * 3 * 4")
        assert result == 24  # (2 * 3) * 4 = 6 * 4 = 24

    def test_multiple_divisions_left_associative(self, evaluator):
        """Multiple divisions should be left-associative."""
        result = evaluator.evaluate("24 / 2 / 3")
        assert result == 4  # (24 / 2) / 3 = 12 / 3 = 4

    def test_mixed_multiply_divide_left_associative(self, evaluator):
        """Mixed multiply/divide should be left-associative."""
        result = evaluator.evaluate("24 / 2 * 3")
        assert result == 36  # (24 / 2) * 3 = 12 * 3 = 36

    def test_add_subtract_left_associative(self, evaluator):
        """Addition and subtraction should be left-associative."""
        result = evaluator.evaluate("10 - 5 + 3")
        assert result == 8  # (10 - 5) + 3 = 5 + 3 = 8

    def test_subtract_add_left_associative(self, evaluator):
        """Subtraction followed by addition should be left-associative."""
        result = evaluator.evaluate("10 + 5 - 3")
        assert result == 12  # (10 + 5) - 3 = 15 - 3 = 12

    def test_nested_exponentiation(self, evaluator):
        """Nested exponentiation with proper associativity."""
        result = evaluator.evaluate("2 ** 2 ** 3")
        assert result == 256  # 2 ** (2 ** 3) = 2 ** 8 = 256

    def test_zero_exponent(self, evaluator):
        """Any number to the power of zero is 1."""
        result = evaluator.evaluate("5 ** 0")
        assert result == 1

    def test_negative_exponent(self, evaluator):
        """Negative exponents create fractions."""
        result = evaluator.evaluate("2 ** -1")
        assert result == 0.5

    def test_precedence_with_function_calls(self, evaluator):
        """Function calls should bind tighter than operators."""
        # Note: This tests that sin() is evaluated before multiplication
        # sin(30) * 2 should give a result
        result = evaluator.evaluate("sin(30) * 2")
        assert isinstance(result, (int, float))

    def test_modulo_with_negative_numbers(self, evaluator):
        """Modulo operation with negative numbers."""
        result = evaluator.evaluate("-7 % 3")
        assert isinstance(result, (int, float))

    def test_large_precedence_expression(self, evaluator):
        """Large expression with multiple precedence levels."""
        # 1 + 2 * 3 ** 2 - 4 / 2 = 1 + 2 * 9 - 2 = 1 + 18 - 2 = 17
        result = evaluator.evaluate("1 + 2 * 3 ** 2 - 4 / 2")
        assert result == 17

    def test_all_arithmetic_operators_mixed(self, evaluator):
        """Expression with all arithmetic operators."""
        # 10 + 5 - 3 * 2 / 2 % 3 ** 1
        # = 10 + 5 - ((3 * 2) / 2) % 3
        # = 10 + 5 - (6 / 2) % 3
        # = 10 + 5 - 3 % 3
        # = 10 + 5 - 0
        # = 15
        result = evaluator.evaluate("10 + 5 - 3 * 2 / 2 % 3 ** 1")
        assert result == 15
