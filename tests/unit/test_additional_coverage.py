"""
Additional tests to improve code coverage for Phase 4.

Covers edge cases and code paths not fully exercised by main test suites.
"""

import pytest

from src.scientific_calculator.functions import (
    median, mode, mean, variance, stdev,
    nthroot, power, sqrt
)
from src.scientific_calculator.exceptions import DomainError
from src.scientific_calculator.expression_evaluator import SafeExpressionEvaluator


class TestMedianEdgeCases:
    """Test edge cases for median function."""

    def test_median_empty_list(self) -> None:
        """Test median of empty list."""
        result = median([])
        assert result == 0.0

    def test_median_single_element(self) -> None:
        """Test median of single element."""
        result = median([42.0])
        assert result == 42.0

    def test_median_two_elements(self) -> None:
        """Test median of two elements (average)."""
        result = median([1.0, 3.0])
        assert abs(result - 2.0) < 1e-6


class TestModeEdgeCases:
    """Test edge cases for mode function."""

    def test_mode_empty_list(self) -> None:
        """Test mode of empty list."""
        result = mode([])
        assert result == 0.0

    def test_mode_all_unique_values(self) -> None:
        """Test mode when all values appear once."""
        result = mode([1.0, 2.0, 3.0, 4.0, 5.0])
        assert result in [1.0, 2.0, 3.0, 4.0, 5.0]


class TestMeanEdgeCases:
    """Test edge cases for mean function."""

    def test_mean_empty_list(self) -> None:
        """Test mean of empty list."""
        result = mean([])
        assert result == 0.0

    def test_mean_single_element(self) -> None:
        """Test mean of single element."""
        result = mean([7.5])
        assert abs(result - 7.5) < 1e-6


class TestNthRootEdgeCases:
    """Test edge cases for nth root function."""

    def test_nthroot_first_root(self) -> None:
        """Test first root: ¹√x = x."""
        result = nthroot(42.0, 1)
        assert abs(result - 42.0) < 1e-6

    def test_nthroot_odd_root_of_negative(self) -> None:
        """Test odd root of negative: ³√(-8) = -2."""
        result = nthroot(-8.0, 3)
        assert abs(result - (-2.0)) < 1e-6

    def test_nthroot_zero_radicand(self) -> None:
        """Test nth root of zero."""
        result = nthroot(0.0, 3)
        assert abs(result - 0.0) < 1e-6

    def test_nthroot_one_radicand(self) -> None:
        """Test nth root of one."""
        result = nthroot(1.0, 5)
        assert abs(result - 1.0) < 1e-6


class TestPowerEdgeCases:
    """Test edge cases for power function."""

    def test_power_positive_to_zero(self) -> None:
        """Test x^0 = 1 for x > 0."""
        result = power(42.0, 0)
        assert abs(result - 1.0) < 1e-6

    def test_power_negative_integer_exponent(self) -> None:
        """Test negative^integer exponent."""
        result = power(-2.0, 4)
        assert abs(result - 16.0) < 1e-6

    def test_power_negative_odd_integer(self) -> None:
        """Test negative^odd integer."""
        result = power(-2.0, 3)
        assert abs(result - (-8.0)) < 1e-6

    def test_power_fractional_exponent_positive_base(self) -> None:
        """Test positive^fractional."""
        result = power(8.0, 1/3)
        assert abs(result - 2.0) < 1e-5


class TestSqrtEdgeCases:
    """Test edge cases for sqrt function."""

    def test_sqrt_zero(self) -> None:
        """Test sqrt(0) = 0."""
        result = sqrt(0.0)
        assert abs(result - 0.0) < 1e-6

    def test_sqrt_one(self) -> None:
        """Test sqrt(1) = 1."""
        result = sqrt(1.0)
        assert abs(result - 1.0) < 1e-6

    def test_sqrt_decimal_perfect_square(self) -> None:
        """Test sqrt of decimal perfect square."""
        result = sqrt(0.25)
        assert abs(result - 0.5) < 1e-6


class TestVarianceEmptyList:
    """Test variance with minimal valid data."""

    def test_variance_two_identical_values(self) -> None:
        """Test variance([x, x]) = 0."""
        result = variance([5.0, 5.0])
        assert abs(result - 0.0) < 1e-6


class TestStdevEmptyList:
    """Test stdev with minimal valid data."""

    def test_stdev_two_identical_values(self) -> None:
        """Test stdev([x, x]) = 0."""
        result = stdev([5.0, 5.0])
        assert abs(result - 0.0) < 1e-6


class TestExpressionEvaluatorEdgeCases:
    """Test expression evaluator edge cases."""

    def test_nested_operations(self) -> None:
        """Test deeply nested operations."""
        from src.scientific_calculator.api import evaluate_expression
        result = evaluate_expression("((((1 + 2) * 3) - 4) / 2)")
        assert result["error"] is None
        assert abs(result["result"] - 2.5) < 1e-6

    def test_negative_number_literal(self) -> None:
        """Test negative number in expression."""
        from src.scientific_calculator.api import evaluate_expression
        result = evaluate_expression("-5 + 10")
        assert result["error"] is None
        assert abs(result["result"] - 5.0) < 1e-6

    def test_unary_plus(self) -> None:
        """Test unary plus operator."""
        from src.scientific_calculator.api import evaluate_expression
        result = evaluate_expression("+42")
        assert result["error"] is None
        assert abs(result["result"] - 42.0) < 1e-6

    def test_modulo_operation(self) -> None:
        """Test modulo operation."""
        from src.scientific_calculator.api import evaluate_expression
        result = evaluate_expression("10 % 3")
        assert result["error"] is None
        assert abs(result["result"] - 1.0) < 1e-6

    def test_power_operator(self) -> None:
        """Test power operator **."""
        from src.scientific_calculator.api import evaluate_expression
        result = evaluate_expression("2 ** 3")
        assert result["error"] is None
        assert abs(result["result"] - 8.0) < 1e-6

    def test_complex_arithmetic_with_trig(self) -> None:
        """Test complex expression with trigonometry."""
        from src.scientific_calculator.api import evaluate_expression
        result = evaluate_expression("sin(30) * 2 + cos(60)")
        assert result["error"] is None
        # sin(30) * 2 + cos(60) = 0.5 * 2 + 0.5 = 1.5
        assert abs(result["result"] - 1.5) < 1e-6

    def test_pi_multiplied(self) -> None:
        """Test pi constant in multiplication."""
        from src.scientific_calculator.api import evaluate_expression
        result = evaluate_expression("pi * 2")
        assert result["error"] is None
        assert abs(result["result"] - 6.283185307179586) < 1e-6

    def test_e_exponentiated(self) -> None:
        """Test e constant in exponentiation."""
        from src.scientific_calculator.api import evaluate_expression
        result = evaluate_expression("e ** 2")
        assert result["error"] is None
        import math
        assert abs(result["result"] - (math.e ** 2)) < 1e-5


class TestSafeExpressionEvaluatorContext:
    """Test SafeExpressionEvaluator with context."""

    def test_evaluator_with_context(self) -> None:
        """Test that context is properly initialized."""
        evaluator = SafeExpressionEvaluator()
        assert evaluator.context == {}
        assert evaluator.function_registry is not None

    def test_evaluator_get_unregistered_function(self) -> None:
        """Test getting unregistered function returns None."""
        evaluator = SafeExpressionEvaluator()
        func = evaluator.function_registry.get("nonexistent")
        assert func is None


class TestStatisticalFunctions:
    """Additional statistical function tests."""

    def test_variance_large_numbers(self) -> None:
        """Test variance with large numbers."""
        data = [1e6, 2e6, 3e6]
        result = variance(data)
        assert result > 0

    def test_stdev_large_numbers(self) -> None:
        """Test stdev with large numbers."""
        data = [1e6, 2e6, 3e6]
        result = stdev(data)
        assert result > 0

    def test_variance_negative_numbers(self) -> None:
        """Test variance with all negative numbers."""
        data = [-5.0, -3.0, -1.0]
        result = variance(data)
        assert result > 0

    def test_stdev_negative_numbers(self) -> None:
        """Test stdev with all negative numbers."""
        data = [-5.0, -3.0, -1.0]
        result = stdev(data)
        assert result > 0
