"""
Unit tests for logarithmic functions.

Tests log₁₀, ln, and arbitrary base logarithms with domain validation.
"""

import math
import pytest

from src.scientific_calculator.functions import log10, ln, logn
from src.scientific_calculator.exceptions import DomainError


class TestLog10Function:
    """Test base-10 logarithm function."""

    def test_log10_1(self) -> None:
        """Test log₁₀(1) = 0."""
        result = log10(1)
        assert abs(result - 0) < 1e-6

    def test_log10_10(self) -> None:
        """Test log₁₀(10) = 1."""
        result = log10(10)
        assert abs(result - 1) < 1e-6

    def test_log10_100(self) -> None:
        """Test log₁₀(100) = 2."""
        result = log10(100)
        assert abs(result - 2) < 1e-6

    def test_log10_1000(self) -> None:
        """Test log₁₀(1000) = 3."""
        result = log10(1000)
        assert abs(result - 3) < 1e-6

    def test_log10_0_1(self) -> None:
        """Test log₁₀(0.1) = -1."""
        result = log10(0.1)
        assert abs(result - (-1)) < 1e-6

    def test_log10_0_01(self) -> None:
        """Test log₁₀(0.01) = -2."""
        result = log10(0.01)
        assert abs(result - (-2)) < 1e-6

    def test_log10_sqrt_10(self) -> None:
        """Test log₁₀(sqrt(10)) = 0.5."""
        result = log10(math.sqrt(10))
        assert abs(result - 0.5) < 1e-6

    def test_log10_invalid_zero(self) -> None:
        """Test log₁₀(0) raises DomainError."""
        with pytest.raises(DomainError):
            log10(0)

    def test_log10_invalid_negative(self) -> None:
        """Test log₁₀(-5) raises DomainError."""
        with pytest.raises(DomainError):
            log10(-5)

    def test_log10_very_small_positive(self) -> None:
        """Test log₁₀(1e-10) = -10."""
        result = log10(1e-10)
        assert abs(result - (-10)) < 1e-6

    def test_log10_very_large_positive(self) -> None:
        """Test log₁₀(1e10) = 10."""
        result = log10(1e10)
        assert abs(result - 10) < 1e-6


class TestNaturalLogFunction:
    """Test natural logarithm (ln) function."""

    def test_ln_1(self) -> None:
        """Test ln(1) = 0."""
        result = ln(1)
        assert abs(result - 0) < 1e-6

    def test_ln_e(self) -> None:
        """Test ln(e) = 1."""
        result = ln(math.e)
        assert abs(result - 1) < 1e-6

    def test_ln_e_squared(self) -> None:
        """Test ln(e²) = 2."""
        result = ln(math.e**2)
        assert abs(result - 2) < 1e-6

    def test_ln_10(self) -> None:
        """Test ln(10) ≈ 2.303."""
        result = ln(10)
        assert abs(result - math.log(10)) < 1e-6

    def test_ln_0_1(self) -> None:
        """Test ln(0.1) ≈ -2.303."""
        result = ln(0.1)
        assert abs(result - math.log(0.1)) < 1e-6

    def test_ln_sqrt_e(self) -> None:
        """Test ln(sqrt(e)) = 0.5."""
        result = ln(math.sqrt(math.e))
        assert abs(result - 0.5) < 1e-6

    def test_ln_invalid_zero(self) -> None:
        """Test ln(0) raises DomainError."""
        with pytest.raises(DomainError):
            ln(0)

    def test_ln_invalid_negative(self) -> None:
        """Test ln(-1) raises DomainError."""
        with pytest.raises(DomainError):
            ln(-1)

    def test_ln_very_small_positive(self) -> None:
        """Test ln(1e-10) ≈ -23.026."""
        result = ln(1e-10)
        expected = math.log(1e-10)
        assert abs(result - expected) < 1e-6

    def test_ln_very_large_positive(self) -> None:
        """Test ln(1e10) ≈ 23.026."""
        result = ln(1e10)
        expected = math.log(1e10)
        assert abs(result - expected) < 1e-6


class TestArbitraryBaseLog:
    """Test logarithm with arbitrary base."""

    def test_logn_base_2_of_8(self) -> None:
        """Test log₂(8) = 3."""
        result = logn(8, 2)
        assert abs(result - 3) < 1e-6

    def test_logn_base_2_of_16(self) -> None:
        """Test log₂(16) = 4."""
        result = logn(16, 2)
        assert abs(result - 4) < 1e-6

    def test_logn_base_3_of_27(self) -> None:
        """Test log₃(27) = 3."""
        result = logn(27, 3)
        assert abs(result - 3) < 1e-6

    def test_logn_base_5_of_125(self) -> None:
        """Test log₅(125) = 3."""
        result = logn(125, 5)
        assert abs(result - 3) < 1e-6

    def test_logn_base_10_of_100(self) -> None:
        """Test log₁₀(100) = 2."""
        result = logn(100, 10)
        assert abs(result - 2) < 1e-6

    def test_logn_base_2_of_0_5(self) -> None:
        """Test log₂(0.5) = -1."""
        result = logn(0.5, 2)
        assert abs(result - (-1)) < 1e-6

    def test_logn_base_1_5_of_2_25(self) -> None:
        """Test log₁.₅(2.25) = 2."""
        result = logn(2.25, 1.5)
        assert abs(result - 2) < 1e-6

    def test_logn_invalid_zero_argument(self) -> None:
        """Test logₙ(0, base) raises DomainError."""
        with pytest.raises(DomainError):
            logn(0, 2)

    def test_logn_invalid_negative_argument(self) -> None:
        """Test logₙ(-5, base) raises DomainError."""
        with pytest.raises(DomainError):
            logn(-5, 2)

    def test_logn_invalid_zero_base(self) -> None:
        """Test logₙ(x, 0) raises DomainError."""
        with pytest.raises(DomainError):
            logn(5, 0)

    def test_logn_invalid_one_base(self) -> None:
        """Test logₙ(x, 1) raises DomainError (base 1 is undefined)."""
        with pytest.raises(DomainError):
            logn(5, 1)

    def test_logn_invalid_negative_base(self) -> None:
        """Test logₙ(x, -2) raises DomainError."""
        with pytest.raises(DomainError):
            logn(5, -2)


class TestLogarithmicIdentities:
    """Test logarithmic mathematical identities."""

    def test_log_product(self) -> None:
        """Test log(x*y) = log(x) + log(y)."""
        x, y = 2, 5
        left = log10(x * y)
        right = log10(x) + log10(y)
        assert abs(left - right) < 1e-6

    def test_log_quotient(self) -> None:
        """Test log(x/y) = log(x) - log(y)."""
        x, y = 10, 2
        left = log10(x / y)
        right = log10(x) - log10(y)
        assert abs(left - right) < 1e-6

    def test_log_power(self) -> None:
        """Test log(x^n) = n * log(x)."""
        x, n = 2, 3
        left = log10(x**n)
        right = n * log10(x)
        assert abs(left - right) < 1e-6

    def test_change_of_base(self) -> None:
        """Test logₙ(x) = log(x) / log(n)."""
        x, base = 8, 2
        result = logn(x, base)
        expected = math.log(x) / math.log(base)
        assert abs(result - expected) < 1e-6

    def test_ln_vs_log10(self) -> None:
        """Test ln(x) = log₁₀(x) * ln(10)."""
        x = 7.5
        ln_result = ln(x)
        log10_result = log10(x)
        expected = log10_result * ln(10)
        assert abs(ln_result - expected) < 1e-6

    def test_10_to_log10(self) -> None:
        """Test 10^(log₁₀(x)) = x."""
        x = 42.5
        result = 10 ** log10(x)
        assert abs(result - x) < 1e-6

    def test_e_to_ln(self) -> None:
        """Test e^(ln(x)) = x."""
        x = 3.14
        result = math.e ** ln(x)
        assert abs(result - x) < 1e-6
