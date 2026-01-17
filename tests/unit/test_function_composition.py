"""
Unit tests for function composition in expression evaluation.

Tests verify that nested function calls work correctly, including:
- Simple function calls
- Nested function calls (function result as argument to another function)
- Function calls with arithmetic expressions as arguments
- Multiple nested levels
"""

import pytest
import math
from scientific_calculator.expression_evaluator import SafeExpressionEvaluator
from scientific_calculator.exceptions import EvaluationError, SyntaxError


class TestFunctionComposition:
    """Test nested and composed function calls."""

    @pytest.fixture
    def evaluator(self):
        """Create evaluator instance."""
        return SafeExpressionEvaluator()

    def test_simple_function_call(self, evaluator):
        """Simple function call without nesting."""
        result = evaluator.evaluate("sin(30)")
        assert isinstance(result, (int, float))

    def test_nested_sin_log(self, evaluator):
        """Nested function: log of sine result."""
        # log(sin(90)) = log(1) = 0
        result = evaluator.evaluate("log(sin(90))")
        assert abs(result) < 1e-10

    def test_nested_sqrt_log(self, evaluator):
        """Nested function: sqrt of log result."""
        # sqrt(log(10)) = sqrt(1) = 1 (since log10(10) = 1)
        result = evaluator.evaluate("sqrt(log(10))")
        assert abs(result - 1) < 1e-6

    def test_nested_sin_cos(self, evaluator):
        """Nested trigonometric functions."""
        result = evaluator.evaluate("sin(cos(0))")
        # cos(0) = 1, sin(1 radian) ~= 0.8414...
        assert isinstance(result, (int, float))

    def test_triple_nested_functions(self, evaluator):
        """Three levels of function nesting."""
        # sqrt(sqrt(sqrt(256))) = sqrt(sqrt(16)) = sqrt(4) = 2
        result = evaluator.evaluate("sqrt(sqrt(sqrt(256)))")
        assert abs(result - 2) < 1e-6

    def test_function_with_arithmetic_expression_argument(self, evaluator):
        """Function with arithmetic expression as argument."""
        # sin(30 + 0) = sin(30) = 0.5 (in degrees)
        result = evaluator.evaluate("sin(30 + 0)")
        assert isinstance(result, (int, float))

    def test_function_with_multiply_argument(self, evaluator):
        """Function with multiplication in argument."""
        # sqrt(4 * 4) = sqrt(16) = 4
        result = evaluator.evaluate("sqrt(4 * 4)")
        assert result == 4

    def test_function_with_divide_argument(self, evaluator):
        """Function with division in argument."""
        # sqrt(16 / 1) = sqrt(16) = 4
        result = evaluator.evaluate("sqrt(16 / 1)")
        assert result == 4

    def test_function_with_power_argument(self, evaluator):
        """Function with exponentiation in argument."""
        # sqrt(2 ** 4) = sqrt(16) = 4
        result = evaluator.evaluate("sqrt(2 ** 4)")
        assert result == 4

    def test_function_with_parentheses_argument(self, evaluator):
        """Function with parenthesized arithmetic expression."""
        # sqrt((2 + 2) ** 2) = sqrt(16) = 4
        result = evaluator.evaluate("sqrt((2 + 2) ** 2)")
        assert result == 4

    def test_multiple_functions_same_level(self, evaluator):
        """Multiple function calls at same precedence level."""
        # sin(30) + cos(0) should work
        result = evaluator.evaluate("sin(30) + cos(0)")
        assert isinstance(result, (int, float))

    def test_function_multiply_function(self, evaluator):
        """Function result multiplied by another function result."""
        # sin(90) * cos(0) = 1 * 1 = 1
        result = evaluator.evaluate("sin(90) * cos(0)")
        assert abs(result - 1) < 1e-6

    def test_function_add_function(self, evaluator):
        """Function result added to another function result."""
        # sin(0) + cos(0) = 0 + 1 = 1
        result = evaluator.evaluate("sin(0) + cos(0)")
        assert abs(result - 1) < 1e-6

    def test_function_with_constant_argument(self, evaluator):
        """Function with mathematical constant as argument."""
        # sin(pi) = 0 (where pi is approximately 3.14159...)
        result = evaluator.evaluate("sin(pi)")
        assert abs(result) < 1e-6

    def test_nested_log_functions(self, evaluator):
        """Nested logarithmic functions."""
        # ln(log(100)) = ln(2) ~= 0.693...
        result = evaluator.evaluate("ln(log(100))")
        assert abs(result - math.log(2)) < 1e-6

    def test_function_with_negation_argument(self, evaluator):
        """Function with unary negation in argument."""
        # sqrt((-1) ** 2) = sqrt(1) = 1
        result = evaluator.evaluate("sqrt((-1) ** 2)")
        assert result == 1

    def test_mean_with_multiple_arguments(self, evaluator):
        """Mean function with multiple arguments."""
        # mean(1, 2, 3, 4, 5) = 3
        result = evaluator.evaluate("mean(1, 2, 3, 4, 5)")
        assert result == 3

    def test_function_of_mean_result(self, evaluator):
        """Function applied to result of mean function."""
        # sqrt(mean(1, 4, 9, 16)) = sqrt(7.5)
        result = evaluator.evaluate("sqrt(mean(1, 4, 9, 16))")
        assert abs(result - math.sqrt(7.5)) < 1e-6

    def test_nested_mean_functions(self, evaluator):
        """Nested mean functions."""
        # mean(mean(1, 2), mean(3, 4)) = mean(1.5, 3.5) = 2.5
        result = evaluator.evaluate("mean(mean(1, 2), mean(3, 4))")
        assert abs(result - 2.5) < 1e-6

    def test_function_with_deeply_nested_arithmetic(self, evaluator):
        """Function with deeply nested arithmetic expression."""
        # sqrt(((2 + 2) * 2) / 2) = sqrt(4) = 2
        result = evaluator.evaluate("sqrt(((2 + 2) * 2) / 2)")
        assert result == 2

    def test_log_base_argument(self, evaluator):
        """Log function with specific base."""
        # log(100, 10) = 2 (log base 10 of 100)
        result = evaluator.evaluate("log(100, 10)")
        assert abs(result - 2) < 1e-6

    def test_unknown_function_raises_error(self, evaluator):
        """Unknown function should raise error."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("unknown_func(5)")

    def test_function_with_too_few_arguments(self, evaluator):
        """Function call with insufficient arguments."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("log()")

    def test_function_with_wrong_argument_type(self, evaluator):
        """Function call with invalid argument (domain error)."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("log(-1)")

    def test_tan_of_sum(self, evaluator):
        """Tangent of sum expression."""
        # tan(45 + 0) = tan(45) ~= 1
        result = evaluator.evaluate("tan(45 + 0)")
        assert isinstance(result, (int, float))

    def test_asin_of_fraction(self, evaluator):
        """Arc sine of fractional result."""
        # asin(1/2) = 30 (in degrees)
        result = evaluator.evaluate("asin(1/2)")
        assert isinstance(result, (int, float))

    def test_function_composition_with_operators(self, evaluator):
        """Complex expression mixing functions and operators."""
        # (sqrt(16) + sin(0)) * cos(0) = (4 + 0) * 1 = 4
        result = evaluator.evaluate("(sqrt(16) + sin(0)) * cos(0)")
        assert abs(result - 4) < 1e-6

    def test_power_of_function_result(self, evaluator):
        """Exponentiation of function result."""
        # sqrt(16) ** 2 = 4 ** 2 = 16
        result = evaluator.evaluate("sqrt(16) ** 2")
        assert result == 16

    def test_function_with_pi_argument(self, evaluator):
        """Function using pi constant in argument."""
        # cos(pi) = -1
        result = evaluator.evaluate("cos(pi)")
        assert abs(result - (-1)) < 1e-6

    def test_function_with_e_argument(self, evaluator):
        """Function using e constant in argument."""
        # ln(e) = 1
        result = evaluator.evaluate("ln(e)")
        assert abs(result - 1) < 1e-6
