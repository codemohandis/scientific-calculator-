"""
Unit tests for domain error handling in scientific functions.

Tests that invalid inputs raise appropriate domain errors.
"""

import pytest

from src.scientific_calculator.functions import (
    sin, cos, tan,
    asin, acos, atan,
    log10, ln, logn,
    sqrt, power, nthroot,
    stdev, variance
)
from src.scientific_calculator.exceptions import DomainError


class TestDomainErrors:
    """Test that invalid inputs raise DomainError."""

    def test_asin_out_of_range(self) -> None:
        """Test asin(x) where |x| > 1 raises DomainError."""
        with pytest.raises(DomainError):
            asin(1.5)
        with pytest.raises(DomainError):
            asin(-1.5)

    def test_acos_out_of_range(self) -> None:
        """Test acos(x) where |x| > 1 raises DomainError."""
        with pytest.raises(DomainError):
            acos(1.5)
        with pytest.raises(DomainError):
            acos(-1.5)

    def test_log10_invalid_zero(self) -> None:
        """Test log₁₀(0) raises DomainError."""
        with pytest.raises(DomainError):
            log10(0)

    def test_log10_invalid_negative(self) -> None:
        """Test log₁₀(x) where x < 0 raises DomainError."""
        with pytest.raises(DomainError):
            log10(-5)

    def test_ln_invalid_zero(self) -> None:
        """Test ln(0) raises DomainError."""
        with pytest.raises(DomainError):
            ln(0)

    def test_ln_invalid_negative(self) -> None:
        """Test ln(x) where x < 0 raises DomainError."""
        with pytest.raises(DomainError):
            ln(-1)

    def test_logn_invalid_zero_argument(self) -> None:
        """Test logₙ(0, base) raises DomainError."""
        with pytest.raises(DomainError):
            logn(0, 2)

    def test_logn_invalid_negative_argument(self) -> None:
        """Test logₙ(x, base) where x < 0 raises DomainError."""
        with pytest.raises(DomainError):
            logn(-5, 2)

    def test_logn_invalid_base_zero(self) -> None:
        """Test logₙ(x, 0) raises DomainError."""
        with pytest.raises(DomainError):
            logn(5, 0)

    def test_logn_invalid_base_one(self) -> None:
        """Test logₙ(x, 1) raises DomainError."""
        with pytest.raises(DomainError):
            logn(5, 1)

    def test_logn_invalid_negative_base(self) -> None:
        """Test logₙ(x, -base) raises DomainError."""
        with pytest.raises(DomainError):
            logn(5, -2)

    def test_sqrt_invalid_negative(self) -> None:
        """Test sqrt(x) where x < 0 raises DomainError."""
        with pytest.raises(DomainError):
            sqrt(-1)
        with pytest.raises(DomainError):
            sqrt(-100)

    def test_power_invalid_zero_to_zero(self) -> None:
        """Test 0^0 raises DomainError."""
        with pytest.raises(DomainError):
            power(0, 0)

    def test_power_invalid_zero_to_negative(self) -> None:
        """Test 0^(-n) raises DomainError."""
        with pytest.raises(DomainError):
            power(0, -1)
        with pytest.raises(DomainError):
            power(0, -0.5)

    def test_power_invalid_negative_fractional(self) -> None:
        """Test (-x)^(fractional) raises DomainError."""
        with pytest.raises(DomainError):
            power(-2, 0.5)
        with pytest.raises(DomainError):
            power(-4, 1/3)

    def test_nthroot_invalid_zero_root(self) -> None:
        """Test ⁰√x raises DomainError."""
        with pytest.raises(DomainError):
            nthroot(8, 0)

    def test_nthroot_invalid_negative_root(self) -> None:
        """Test ⁻ⁿ√x raises DomainError."""
        with pytest.raises(DomainError):
            nthroot(8, -2)

    def test_nthroot_invalid_even_root_negative(self) -> None:
        """Test ⁿ√x where n is even and x < 0 raises DomainError."""
        with pytest.raises(DomainError):
            nthroot(-16, 2)
        with pytest.raises(DomainError):
            nthroot(-8, 4)

    def test_stdev_single_value(self) -> None:
        """Test stdev([x]) requires at least 2 values."""
        with pytest.raises(DomainError):
            stdev([5])

    def test_stdev_empty_list(self) -> None:
        """Test stdev([]) on empty list raises DomainError."""
        with pytest.raises(DomainError):
            stdev([])

    def test_variance_single_value(self) -> None:
        """Test variance([x]) requires at least 2 values."""
        with pytest.raises(DomainError):
            variance([5])

    def test_variance_empty_list(self) -> None:
        """Test variance([]) on empty list raises DomainError."""
        with pytest.raises(DomainError):
            variance([])


class TestErrorMessages:
    """Test that error messages are helpful."""

    def test_log_error_message_helpful(self) -> None:
        """Test that log error mentions constraint 'x > 0'."""
        try:
            log10(-1)
        except DomainError as e:
            assert "positive" in str(e).lower() or "x > 0" in str(e)

    def test_sqrt_error_message_helpful(self) -> None:
        """Test that sqrt error mentions constraint."""
        try:
            sqrt(-1)
        except DomainError as e:
            assert "positive" in str(e).lower() or "negative" in str(e).lower()

    def test_asin_error_message_helpful(self) -> None:
        """Test that asin error mentions range."""
        try:
            asin(2)
        except DomainError as e:
            error_msg = str(e).lower()
            assert "range" in error_msg or "between" in error_msg or "-1" in error_msg
