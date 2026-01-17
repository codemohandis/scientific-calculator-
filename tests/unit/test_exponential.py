"""
Unit tests for exponential functions.

Tests e^x, x^y, sqrt, and nth root functions with accuracy requirements.
"""

import math
import pytest

from src.scientific_calculator.functions import exp, power, sqrt, nthroot
from src.scientific_calculator.exceptions import DomainError


class TestExponentialEFunction:
    """Test e^x function."""

    def test_exp_0(self) -> None:
        """Test e^0 = 1."""
        result = exp(0)
        assert abs(result - 1) < 1e-6

    def test_exp_1(self) -> None:
        """Test e^1 = e ≈ 2.71828."""
        result = exp(1)
        assert abs(result - math.e) < 1e-6

    def test_exp_2(self) -> None:
        """Test e^2 ≈ 7.389."""
        result = exp(2)
        assert abs(result - math.e**2) < 1e-6

    def test_exp_negative_1(self) -> None:
        """Test e^(-1) = 1/e ≈ 0.368."""
        result = exp(-1)
        assert abs(result - (1 / math.e)) < 1e-6

    def test_exp_0_5(self) -> None:
        """Test e^0.5 = sqrt(e) ≈ 1.649."""
        result = exp(0.5)
        assert abs(result - math.sqrt(math.e)) < 1e-6

    def test_exp_ln_inverse(self) -> None:
        """Test e^(ln(x)) = x."""
        x = 5.7
        from src.scientific_calculator.functions import ln
        result = exp(ln(x))
        assert abs(result - x) < 1e-6

    def test_exp_very_small_negative(self) -> None:
        """Test e^(-100) ≈ 0 (very small)."""
        result = exp(-100)
        assert 0 < result < 1e-40

    def test_exp_small_positive(self) -> None:
        """Test e^(-10) ≈ 0.0000454."""
        result = exp(-10)
        expected = math.exp(-10)
        assert abs(result - expected) < 1e-6


class TestPowerFunction:
    """Test x^y function."""

    def test_power_2_0(self) -> None:
        """Test 2^0 = 1."""
        result = power(2, 0)
        assert abs(result - 1) < 1e-6

    def test_power_2_3(self) -> None:
        """Test 2^3 = 8."""
        result = power(2, 3)
        assert abs(result - 8) < 1e-6

    def test_power_2_10(self) -> None:
        """Test 2^10 = 1024."""
        result = power(2, 10)
        assert abs(result - 1024) < 1e-6

    def test_power_10_2(self) -> None:
        """Test 10^2 = 100."""
        result = power(10, 2)
        assert abs(result - 100) < 1e-6

    def test_power_5_negative_1(self) -> None:
        """Test 5^(-1) = 0.2."""
        result = power(5, -1)
        assert abs(result - 0.2) < 1e-6

    def test_power_4_0_5(self) -> None:
        """Test 4^0.5 = 2."""
        result = power(4, 0.5)
        assert abs(result - 2) < 1e-6

    def test_power_27_third(self) -> None:
        """Test 27^(1/3) = 3."""
        result = power(27, 1/3)
        assert abs(result - 3) < 1e-5

    def test_power_0_5_2(self) -> None:
        """Test 0.5^2 = 0.25."""
        result = power(0.5, 2)
        assert abs(result - 0.25) < 1e-6

    def test_power_0_5_negative_2(self) -> None:
        """Test 0.5^(-2) = 4."""
        result = power(0.5, -2)
        assert abs(result - 4) < 1e-6

    def test_power_negative_base_even_exponent(self) -> None:
        """Test (-2)^2 = 4."""
        result = power(-2, 2)
        assert abs(result - 4) < 1e-6

    def test_power_negative_base_odd_exponent(self) -> None:
        """Test (-2)^3 = -8."""
        result = power(-2, 3)
        assert abs(result - (-8)) < 1e-6

    def test_power_negative_base_fractional_exponent(self) -> None:
        """Test (-2)^0.5 raises DomainError (complex result)."""
        with pytest.raises(DomainError):
            power(-2, 0.5)

    def test_power_zero_positive_exponent(self) -> None:
        """Test 0^5 = 0."""
        result = power(0, 5)
        assert abs(result - 0) < 1e-6

    def test_power_zero_zero(self) -> None:
        """Test 0^0 is undefined, raises DomainError."""
        with pytest.raises(DomainError):
            power(0, 0)

    def test_power_zero_negative_exponent(self) -> None:
        """Test 0^(-1) is undefined, raises DomainError."""
        with pytest.raises(DomainError):
            power(0, -1)


class TestSquareRootFunction:
    """Test sqrt function."""

    def test_sqrt_0(self) -> None:
        """Test sqrt(0) = 0."""
        result = sqrt(0)
        assert abs(result - 0) < 1e-6

    def test_sqrt_1(self) -> None:
        """Test sqrt(1) = 1."""
        result = sqrt(1)
        assert abs(result - 1) < 1e-6

    def test_sqrt_4(self) -> None:
        """Test sqrt(4) = 2."""
        result = sqrt(4)
        assert abs(result - 2) < 1e-6

    def test_sqrt_9(self) -> None:
        """Test sqrt(9) = 3."""
        result = sqrt(9)
        assert abs(result - 3) < 1e-6

    def test_sqrt_16(self) -> None:
        """Test sqrt(16) = 4."""
        result = sqrt(16)
        assert abs(result - 4) < 1e-6

    def test_sqrt_2(self) -> None:
        """Test sqrt(2) ≈ 1.41421."""
        result = sqrt(2)
        assert abs(result - math.sqrt(2)) < 1e-6

    def test_sqrt_0_25(self) -> None:
        """Test sqrt(0.25) = 0.5."""
        result = sqrt(0.25)
        assert abs(result - 0.5) < 1e-6

    def test_sqrt_100(self) -> None:
        """Test sqrt(100) = 10."""
        result = sqrt(100)
        assert abs(result - 10) < 1e-6

    def test_sqrt_invalid_negative(self) -> None:
        """Test sqrt(-1) raises DomainError."""
        with pytest.raises(DomainError):
            sqrt(-1)

    def test_sqrt_invalid_large_negative(self) -> None:
        """Test sqrt(-100) raises DomainError."""
        with pytest.raises(DomainError):
            sqrt(-100)

    def test_sqrt_very_small_positive(self) -> None:
        """Test sqrt(1e-10) ≈ 1e-5."""
        result = sqrt(1e-10)
        assert abs(result - 1e-5) < 1e-12

    def test_sqrt_very_large_positive(self) -> None:
        """Test sqrt(1e10) ≈ 1e5."""
        result = sqrt(1e10)
        assert abs(result - 1e5) < 1e-1


class TestNthRootFunction:
    """Test nth root function."""

    def test_nthroot_8_cube(self) -> None:
        """Test ∛8 = 2."""
        result = nthroot(8, 3)
        assert abs(result - 2) < 1e-6

    def test_nthroot_27_cube(self) -> None:
        """Test ∛27 = 3."""
        result = nthroot(27, 3)
        assert abs(result - 3) < 1e-6

    def test_nthroot_16_fourth(self) -> None:
        """Test ⁴√16 = 2."""
        result = nthroot(16, 4)
        assert abs(result - 2) < 1e-6

    def test_nthroot_32_fifth(self) -> None:
        """Test ⁵√32 = 2."""
        result = nthroot(32, 5)
        assert abs(result - 2) < 1e-6

    def test_nthroot_1_any(self) -> None:
        """Test ⁿ√1 = 1 for any n."""
        for n in [2, 3, 5, 10]:
            result = nthroot(1, n)
            assert abs(result - 1) < 1e-6

    def test_nthroot_0_any(self) -> None:
        """Test ⁿ√0 = 0 for any n."""
        for n in [2, 3, 5]:
            result = nthroot(0, n)
            assert abs(result - 0) < 1e-6

    def test_nthroot_negative_odd_root(self) -> None:
        """Test ∛(-8) = -2."""
        result = nthroot(-8, 3)
        assert abs(result - (-2)) < 1e-6

    def test_nthroot_negative_even_root(self) -> None:
        """Test ⁴√(-16) raises DomainError."""
        with pytest.raises(DomainError):
            nthroot(-16, 4)

    def test_nthroot_invalid_n_zero(self) -> None:
        """Test ⁰√x raises DomainError (0th root undefined)."""
        with pytest.raises(DomainError):
            nthroot(8, 0)

    def test_nthroot_invalid_n_negative(self) -> None:
        """Test ⁻²√x raises DomainError."""
        with pytest.raises(DomainError):
            nthroot(8, -2)

    def test_nthroot_invalid_n_one(self) -> None:
        """Test ¹√x = x (should work)."""
        result = nthroot(42, 1)
        assert abs(result - 42) < 1e-6

    def test_nthroot_fractional_x(self) -> None:
        """Test ³√0.125 = 0.5."""
        result = nthroot(0.125, 3)
        assert abs(result - 0.5) < 1e-6


class TestExponentialIdentities:
    """Test exponential mathematical identities."""

    def test_power_identity(self) -> None:
        """Test x^y = e^(y*ln(x))."""
        x, y = 3, 2.5
        from src.scientific_calculator.functions import ln
        left = power(x, y)
        right = exp(y * ln(x))
        assert abs(left - right) < 1e-5

    def test_sqrt_equals_power_half(self) -> None:
        """Test sqrt(x) = x^0.5."""
        x = 16
        left = sqrt(x)
        right = power(x, 0.5)
        assert abs(left - right) < 1e-6

    def test_nthroot_equals_power(self) -> None:
        """Test ⁿ√x = x^(1/n)."""
        x, n = 32, 5
        left = nthroot(x, n)
        right = power(x, 1/n)
        assert abs(left - right) < 1e-5

    def test_power_product(self) -> None:
        """Test x^a * x^b = x^(a+b)."""
        x, a, b = 2, 3, 2
        left = power(x, a) * power(x, b)
        right = power(x, a + b)
        assert abs(left - right) < 1e-6

    def test_power_quotient(self) -> None:
        """Test x^a / x^b = x^(a-b)."""
        x, a, b = 3, 5, 2
        left = power(x, a) / power(x, b)
        right = power(x, a - b)
        assert abs(left - right) < 1e-6
