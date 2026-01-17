"""
Unit tests for distance conversions.

Tests for kilometer-to-mile conversions and other distance conversions
with accuracy validation to 5 decimal places.
"""

import pytest
from scientific_calculator.units import convert, is_compatible, get_conversion_factor
from scientific_calculator.exceptions import DimensionalityError, UnitError


class TestDistanceConversions:
    """Test distance unit conversions."""

    def test_kilometer_to_mile_conversion(self) -> None:
        """Test conversion of 5 km to miles (3.10686)."""
        result = convert(5, "kilometer", "mile")
        assert abs(result - 3.10686) < 0.00001

    def test_mile_to_kilometer_conversion(self) -> None:
        """Test conversion of miles to kilometers."""
        result = convert(1, "mile", "kilometer")
        assert abs(result - 1.609344) < 0.00001

    def test_meter_to_foot_conversion(self) -> None:
        """Test conversion of meters to feet."""
        result = convert(10, "meter", "foot")
        assert abs(result - 32.808399) < 0.00001

    def test_foot_to_meter_conversion(self) -> None:
        """Test conversion of feet to meters."""
        result = convert(100, "foot", "meter")
        assert abs(result - 30.48) < 0.00001

    def test_inch_to_centimeter_conversion(self) -> None:
        """Test conversion of inches to centimeters."""
        result = convert(1, "inch", "centimeter")
        assert abs(result - 2.54) < 0.00001

    def test_centimeter_to_inch_conversion(self) -> None:
        """Test conversion of centimeters to inches."""
        result = convert(1, "centimeter", "inch")
        assert abs(result - 0.39370) < 0.00001

    def test_yard_to_meter_conversion(self) -> None:
        """Test conversion of yards to meters."""
        result = convert(1, "yard", "meter")
        assert abs(result - 0.9144) < 0.00001

    def test_zero_distance_conversion(self) -> None:
        """Test conversion of zero distance."""
        result = convert(0, "kilometer", "mile")
        assert result == 0.0

    def test_negative_distance_conversion(self) -> None:
        """Test conversion of negative distance (should work mathematically)."""
        result = convert(-5, "kilometer", "mile")
        assert abs(result - (-3.10686)) < 0.00001


class TestDistanceConversionFactors:
    """Test getting conversion factors for distance units."""

    def test_kilometer_to_mile_factor(self) -> None:
        """Test conversion factor from km to miles."""
        factor = get_conversion_factor("kilometer", "mile")
        assert abs(factor - 0.621371) < 0.00001

    def test_mile_to_kilometer_factor(self) -> None:
        """Test conversion factor from miles to km."""
        factor = get_conversion_factor("mile", "kilometer")
        assert abs(factor - 1.609344) < 0.00001

    def test_meter_to_foot_factor(self) -> None:
        """Test conversion factor from meters to feet."""
        factor = get_conversion_factor("meter", "foot")
        assert abs(factor - 3.28084) < 0.00001


class TestDistanceUnitCompatibility:
    """Test unit compatibility checking for distance units."""

    def test_kilometer_compatible_with_mile(self) -> None:
        """Test that kilometers are compatible with miles."""
        assert is_compatible("kilometer", "mile")

    def test_meter_compatible_with_foot(self) -> None:
        """Test that meters are compatible with feet."""
        assert is_compatible("meter", "foot")

    def test_inch_compatible_with_centimeter(self) -> None:
        """Test that inches are compatible with centimeters."""
        assert is_compatible("inch", "centimeter")

    def test_kilometer_not_compatible_with_kilogram(self) -> None:
        """Test that kilometers are not compatible with kilograms."""
        assert not is_compatible("kilometer", "kilogram")

    def test_kilometer_not_compatible_with_second(self) -> None:
        """Test that kilometers are not compatible with seconds."""
        assert not is_compatible("kilometer", "second")


class TestInvalidDistanceConversions:
    """Test error handling for invalid distance conversions."""

    def test_unknown_source_unit(self) -> None:
        """Test conversion with unknown source unit."""
        with pytest.raises(UnitError):
            convert(5, "invalidunit", "mile")

    def test_unknown_target_unit(self) -> None:
        """Test conversion with unknown target unit."""
        with pytest.raises(UnitError):
            convert(5, "kilometer", "invalidunit")

    def test_incompatible_unit_conversion(self) -> None:
        """Test conversion between incompatible units."""
        with pytest.raises(DimensionalityError):
            convert(5, "kilometer", "kilogram")

    def test_incompatible_unit_error_has_context(self) -> None:
        """Test that incompatible unit error includes context."""
        with pytest.raises(DimensionalityError) as exc_info:
            convert(5, "kilometer", "second")
        assert "kilometer" in str(exc_info.value)
        assert "second" in str(exc_info.value)
