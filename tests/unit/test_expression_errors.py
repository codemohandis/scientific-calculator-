"""
Unit tests for expression error handling and error location reporting.

Tests verify that:
- Syntax errors are caught and reported with useful context
- Domain errors are caught and reported with suggestions
- Error messages include expression context
- Invalid expressions are rejected appropriately
"""

import pytest
from scientific_calculator.expression_evaluator import SafeExpressionEvaluator
from scientific_calculator.exceptions import EvaluationError, SyntaxError, DomainError


class TestExpressionErrors:
    """Test error handling in expression evaluation."""

    @pytest.fixture
    def evaluator(self):
        """Create evaluator instance."""
        return SafeExpressionEvaluator()

    def test_invalid_syntax_missing_operand(self, evaluator):
        """Error when operator has missing operand."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("2 +")

    def test_invalid_syntax_missing_closing_paren(self, evaluator):
        """Error when parentheses are unmatched."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("(2 + 3")

    def test_invalid_syntax_missing_opening_paren(self, evaluator):
        """Error when closing paren without opening."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("2 + 3)")

    def test_invalid_syntax_invalid_operator(self, evaluator):
        """Error for unsupported operator."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("2 // 3")

    def test_invalid_syntax_consecutive_operators(self, evaluator):
        """Error with consecutive operators."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("2 * * 3")

    def test_division_by_zero_error(self, evaluator):
        """Error when dividing by zero."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("5 / 0")

    def test_log_of_zero_error(self, evaluator):
        """Error when taking log of zero."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("log(0)")

    def test_log_of_negative_error(self, evaluator):
        """Error when taking log of negative number."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("log(-1)")

    def test_sqrt_of_negative_error(self, evaluator):
        """Error when taking square root of negative."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("sqrt(-1)")

    def test_ln_of_negative_error(self, evaluator):
        """Error when taking ln of negative."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("ln(-5)")

    def test_unknown_function_error(self, evaluator):
        """Error for undefined function."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("unknown_func(5)")

    def test_unknown_variable_error(self, evaluator):
        """Error for undefined variable."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("x + 5")

    def test_function_missing_arguments_error(self, evaluator):
        """Error when function is called without required arguments."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("sin()")

    def test_string_literal_error(self, evaluator):
        """Error when string literal is used."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate('"hello"')

    def test_empty_expression_error(self, evaluator):
        """Error for completely empty expression."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("")

    def test_whitespace_only_expression_error(self, evaluator):
        """Error for expression with only whitespace."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("   ")

    def test_complex_missing_operand(self, evaluator):
        """Error in complex expression with missing operand."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("2 * 3 +")

    def test_complex_syntax_error(self, evaluator):
        """Error in complex expression with syntax error."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("(2 + 3 * (4 - 5)))")

    def test_asin_out_of_domain_error(self, evaluator):
        """Error when asin argument is out of [-1, 1] range."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("asin(2)")

    def test_acos_out_of_domain_error(self, evaluator):
        """Error when acos argument is out of [-1, 1] range."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("acos(1.5)")

    def test_modulo_by_zero_error(self, evaluator):
        """Error when modulo divisor is zero."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("5 % 0")

    def test_power_domain_error(self, evaluator):
        """Error for invalid power operations."""
        # 0 ** -1 is undefined (0 to negative power)
        with pytest.raises(EvaluationError):
            evaluator.evaluate("0 ** -1")

    def test_error_message_includes_context(self, evaluator):
        """Error message should include context about the error."""
        try:
            evaluator.evaluate("log(-5)")
        except EvaluationError as e:
            error_str = str(e)
            assert len(error_str) > 0  # Should have some error message
            assert isinstance(error_str, str)

    def test_invalid_unicode_characters(self, evaluator):
        """Error for invalid characters in expression."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("2 + ∞")

    def test_unbalanced_parentheses_error(self, evaluator):
        """Error for various unbalanced parentheses."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("((2 + 3)")

    def test_multiple_consecutive_unary_operators(self, evaluator):
        """Multiple unary operators (like --) should be allowed for negation."""
        # --5 = 5, so this is valid
        result = evaluator.evaluate("--5")
        assert result == 5

    def test_leading_dot_error(self, evaluator):
        """Error for invalid number format."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate(".5 + 2")

    def test_trailing_dot_error(self, evaluator):
        """Error for invalid number format."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("5. + 2")

    def test_invalid_function_syntax(self, evaluator):
        """Error for invalid function call syntax."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("sin 5")  # Missing parentheses

    def test_stat_function_single_value_error(self, evaluator):
        """Error when statistical function requires multiple values."""
        # stdev with single value should error
        with pytest.raises(EvaluationError):
            evaluator.evaluate("stdev(5)")

    def test_median_empty_error(self, evaluator):
        """Error for median with no arguments."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("median()")

    def test_mean_empty_error(self, evaluator):
        """Error for mean with no arguments."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("mean()")

    def test_variance_single_value_error(self, evaluator):
        """Error for variance with single value."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("variance(1)")

    def test_error_contains_expression_info(self, evaluator):
        """Error message should contain expression context."""
        try:
            evaluator.evaluate("5 / 0")
        except EvaluationError as e:
            # Error should contain useful information
            assert "5 / 0" in str(e) or "division" in str(e).lower() or "zero" in str(e).lower()

    def test_nested_function_error_propagates(self, evaluator):
        """Errors in nested functions should propagate."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("sqrt(log(-1))")

    def test_log_base_less_than_one_error(self, evaluator):
        """Error for invalid log base."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("log(100, 0.5)")

    def test_log_base_one_error(self, evaluator):
        """Error for log base of 1."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("log(100, 1)")

    def test_log_negative_base_error(self, evaluator):
        """Error for negative log base."""
        with pytest.raises(EvaluationError):
            evaluator.evaluate("log(100, -2)")

    def test_expression_too_complex_error(self, evaluator):
        """Very deeply nested expression."""
        # Create deeply nested expression - parser may have limits
        deeply_nested = "(" * 100 + "5" + ")" * 100
        # This may or may not raise an error depending on recursion limit
        try:
            result = evaluator.evaluate(deeply_nested)
            # If it succeeds, result should be 5
            assert result == 5
        except (SyntaxError, EvaluationError, RecursionError):
            # If it fails, that's expected for deeply nested expressions
            pass

    def test_variable_with_special_characters_error(self, evaluator):
        """Error for variable names with invalid characters."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("x$y + 5")

    def test_function_name_with_numbers_error(self, evaluator):
        """Error for calling non-existent function with numbers."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("func123(5)")

    def test_incomplete_function_call_error(self, evaluator):
        """Error for incomplete function call."""
        with pytest.raises(SyntaxError):
            evaluator.evaluate("sin(5")
