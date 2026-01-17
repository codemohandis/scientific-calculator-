"""
Unit tests for trigonometric functions.

Tests trigonometric functions with degree/radian conversions and accuracy requirements.
"""

import math
import pytest

from src.scientific_calculator.functions import sin, cos, tan, asin, acos, atan
from src.scientific_calculator.exceptions import DomainError


class TestSineFunction:
    """Test sine function with degree inputs."""

    def test_sin_0_degrees(self) -> None:
        """Test sin(0°) = 0."""
        result = sin(0)
        assert abs(result - 0) < 1e-6

    def test_sin_30_degrees(self) -> None:
        """Test sin(30°) = 0.5."""
        result = sin(30)
        assert abs(result - 0.5) < 1e-6

    def test_sin_45_degrees(self) -> None:
        """Test sin(45°) = sqrt(2)/2 ≈ 0.707."""
        result = sin(45)
        assert abs(result - math.sqrt(2) / 2) < 1e-6

    def test_sin_60_degrees(self) -> None:
        """Test sin(60°) = sqrt(3)/2 ≈ 0.866."""
        result = sin(60)
        assert abs(result - math.sqrt(3) / 2) < 1e-6

    def test_sin_90_degrees(self) -> None:
        """Test sin(90°) = 1."""
        result = sin(90)
        assert abs(result - 1) < 1e-6

    def test_sin_180_degrees(self) -> None:
        """Test sin(180°) = 0."""
        result = sin(180)
        assert abs(result - 0) < 1e-6

    def test_sin_negative_angle(self) -> None:
        """Test sin(-30°) = -0.5."""
        result = sin(-30)
        assert abs(result - (-0.5)) < 1e-6

    def test_sin_360_degrees(self) -> None:
        """Test sin(360°) = 0 (full rotation)."""
        result = sin(360)
        assert abs(result - 0) < 1e-6


class TestCosineFunction:
    """Test cosine function with degree inputs."""

    def test_cos_0_degrees(self) -> None:
        """Test cos(0°) = 1."""
        result = cos(0)
        assert abs(result - 1) < 1e-6

    def test_cos_30_degrees(self) -> None:
        """Test cos(30°) = sqrt(3)/2 ≈ 0.866."""
        result = cos(30)
        assert abs(result - math.sqrt(3) / 2) < 1e-6

    def test_cos_45_degrees(self) -> None:
        """Test cos(45°) = sqrt(2)/2 ≈ 0.707."""
        result = cos(45)
        assert abs(result - math.sqrt(2) / 2) < 1e-6

    def test_cos_60_degrees(self) -> None:
        """Test cos(60°) = 0.5."""
        result = cos(60)
        assert abs(result - 0.5) < 1e-6

    def test_cos_90_degrees(self) -> None:
        """Test cos(90°) = 0."""
        result = cos(90)
        assert abs(result - 0) < 1e-6

    def test_cos_180_degrees(self) -> None:
        """Test cos(180°) = -1."""
        result = cos(180)
        assert abs(result - (-1)) < 1e-6

    def test_cos_negative_angle(self) -> None:
        """Test cos(-60°) = 0.5 (even function)."""
        result = cos(-60)
        assert abs(result - 0.5) < 1e-6


class TestTangentFunction:
    """Test tangent function with degree inputs."""

    def test_tan_0_degrees(self) -> None:
        """Test tan(0°) = 0."""
        result = tan(0)
        assert abs(result - 0) < 1e-6

    def test_tan_30_degrees(self) -> None:
        """Test tan(30°) = 1/sqrt(3) ≈ 0.577."""
        result = tan(30)
        assert abs(result - (1 / math.sqrt(3))) < 1e-6

    def test_tan_45_degrees(self) -> None:
        """Test tan(45°) = 1."""
        result = tan(45)
        assert abs(result - 1) < 1e-6

    def test_tan_60_degrees(self) -> None:
        """Test tan(60°) = sqrt(3) ≈ 1.732."""
        result = tan(60)
        assert abs(result - math.sqrt(3)) < 1e-6

    def test_tan_negative_angle(self) -> None:
        """Test tan(-45°) = -1."""
        result = tan(-45)
        assert abs(result - (-1)) < 1e-6

    def test_tan_near_90_degrees_undefined(self) -> None:
        """Test tan(90°) is undefined/very large."""
        # At 89.9999°, tan is very large
        result = tan(89.9999)
        assert abs(result) > 1e5


class TestArcsineFunction:
    """Test inverse sine function returning degrees."""

    def test_asin_0(self) -> None:
        """Test asin(0) = 0°."""
        result = asin(0)
        assert abs(result - 0) < 1e-6

    def test_asin_0_5(self) -> None:
        """Test asin(0.5) = 30°."""
        result = asin(0.5)
        assert abs(result - 30) < 1e-6

    def test_asin_sqrt2_over_2(self) -> None:
        """Test asin(sqrt(2)/2) = 45°."""
        result = asin(math.sqrt(2) / 2)
        assert abs(result - 45) < 1e-6

    def test_asin_1(self) -> None:
        """Test asin(1) = 90°."""
        result = asin(1)
        assert abs(result - 90) < 1e-6

    def test_asin_negative_0_5(self) -> None:
        """Test asin(-0.5) = -30°."""
        result = asin(-0.5)
        assert abs(result - (-30)) < 1e-6

    def test_asin_invalid_greater_than_1(self) -> None:
        """Test asin(1.5) raises DomainError."""
        with pytest.raises(DomainError):
            asin(1.5)

    def test_asin_invalid_less_than_minus_1(self) -> None:
        """Test asin(-1.5) raises DomainError."""
        with pytest.raises(DomainError):
            asin(-1.5)


class TestArccosineFunction:
    """Test inverse cosine function returning degrees."""

    def test_acos_0(self) -> None:
        """Test acos(0) = 90°."""
        result = acos(0)
        assert abs(result - 90) < 1e-6

    def test_acos_0_5(self) -> None:
        """Test acos(0.5) = 60°."""
        result = acos(0.5)
        assert abs(result - 60) < 1e-6

    def test_acos_sqrt2_over_2(self) -> None:
        """Test acos(sqrt(2)/2) = 45°."""
        result = acos(math.sqrt(2) / 2)
        assert abs(result - 45) < 1e-6

    def test_acos_1(self) -> None:
        """Test acos(1) = 0°."""
        result = acos(1)
        assert abs(result - 0) < 1e-6

    def test_acos_minus_1(self) -> None:
        """Test acos(-1) = 180°."""
        result = acos(-1)
        assert abs(result - 180) < 1e-6

    def test_acos_invalid_greater_than_1(self) -> None:
        """Test acos(1.5) raises DomainError."""
        with pytest.raises(DomainError):
            acos(1.5)

    def test_acos_invalid_less_than_minus_1(self) -> None:
        """Test acos(-1.5) raises DomainError."""
        with pytest.raises(DomainError):
            acos(-1.5)


class TestArctangentFunction:
    """Test inverse tangent function returning degrees."""

    def test_atan_0(self) -> None:
        """Test atan(0) = 0°."""
        result = atan(0)
        assert abs(result - 0) < 1e-6

    def test_atan_1_over_sqrt3(self) -> None:
        """Test atan(1/sqrt(3)) = 30°."""
        result = atan(1 / math.sqrt(3))
        assert abs(result - 30) < 1e-6

    def test_atan_1(self) -> None:
        """Test atan(1) = 45°."""
        result = atan(1)
        assert abs(result - 45) < 1e-6

    def test_atan_sqrt3(self) -> None:
        """Test atan(sqrt(3)) = 60°."""
        result = atan(math.sqrt(3))
        assert abs(result - 60) < 1e-6

    def test_atan_negative_1(self) -> None:
        """Test atan(-1) = -45°."""
        result = atan(-1)
        assert abs(result - (-45)) < 1e-6

    def test_atan_large_positive(self) -> None:
        """Test atan(1000) approaches 90°."""
        result = atan(1000)
        assert 85 < result < 90


class TestTrigonometricIdentities:
    """Test trigonometric identities for consistency."""

    def test_sin_squared_plus_cos_squared(self) -> None:
        """Test sin²(x) + cos²(x) = 1."""
        angle = 37
        sin_val = sin(angle)
        cos_val = cos(angle)
        identity = sin_val**2 + cos_val**2
        assert abs(identity - 1) < 1e-6

    def test_tan_equals_sin_over_cos(self) -> None:
        """Test tan(x) = sin(x) / cos(x)."""
        angle = 25
        tan_val = tan(angle)
        sin_val = sin(angle)
        cos_val = cos(angle)
        computed_tan = sin_val / cos_val
        assert abs(tan_val - computed_tan) < 1e-6

    def test_asin_then_sin(self) -> None:
        """Test sin(asin(x)) = x for valid x."""
        x = 0.6
        result = sin(asin(x))
        assert abs(result - x) < 1e-6

    def test_acos_then_cos(self) -> None:
        """Test cos(acos(x)) = x for valid x."""
        x = 0.7
        result = cos(acos(x))
        assert abs(result - x) < 1e-6

    def test_atan_then_tan(self) -> None:
        """Test tan(atan(x)) = x."""
        x = 2.5
        result = tan(atan(x))
        assert abs(result - x) < 1e-6
