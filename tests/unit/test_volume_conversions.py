"""
Unit tests for volume conversions.

Tests for liter ↔ gallon conversions and other volume unit conversions.
"""

import pytest
from scientific_calculator.units import convert, is_compatible, get_conversion_factor
from scientific_calculator.exceptions import DimensionalityError, UnitError


class TestVolumeConversions:
    """Test volume unit conversions."""

    def test_liter_to_gallon_conversion(self) -> None:
        """Test conversion of liters to gallons."""
        result = convert(1, "liter", "gallon")
        assert abs(result - 0.264172) < 0.0001

    def test_gallon_to_liter_conversion(self) -> None:
        """Test conversion of gallons to liters."""
        result = convert(1, "gallon", "liter")
        assert abs(result - 3.78541) < 0.0001

    def test_milliliter_to_liter_conversion(self) -> None:
        """Test conversion of milliliters to liters."""
        result = convert(1000, "milliliter", "liter")
        assert abs(result - 1.0) < 0.0001

    def test_liter_to_milliliter_conversion(self) -> None:
        """Test conversion of liters to milliliters."""
        result = convert(1, "liter", "milliliter")
        assert abs(result - 1000.0) < 0.0001

    def test_milliliter_to_gallon_conversion(self) -> None:
        """Test conversion of milliliters to gallons."""
        result = convert(3785.41, "milliliter", "gallon")
        assert abs(result - 1.0) < 0.0001

    def test_gallon_to_milliliter_conversion(self) -> None:
        """Test conversion of gallons to milliliters."""
        result = convert(1, "gallon", "milliliter")
        assert abs(result - 3785.41) < 0.0001

    def test_quart_to_liter_conversion(self) -> None:
        """Test conversion of quarts to liters."""
        result = convert(1, "quart", "liter")
        assert abs(result - 0.946353) < 0.0001

    def test_liter_to_quart_conversion(self) -> None:
        """Test conversion of liters to quarts."""
        result = convert(1, "liter", "quart")
        assert abs(result - 1.05669) < 0.0001

    def test_pint_to_liter_conversion(self) -> None:
        """Test conversion of pints to liters."""
        result = convert(1, "pint", "liter")
        assert abs(result - 0.473176) < 0.0001

    def test_liter_to_pint_conversion(self) -> None:
        """Test conversion of liters to pints."""
        result = convert(1, "liter", "pint")
        assert abs(result - 2.11338) < 0.0001

    def test_zero_volume_conversion(self) -> None:
        """Test conversion of zero volume."""
        result = convert(0, "liter", "gallon")
        assert result == 0.0

    def test_negative_volume_conversion(self) -> None:
        """Test conversion of negative volume (should work mathematically)."""
        result = convert(-1, "liter", "gallon")
        assert abs(result - (-0.264172)) < 0.0001


class TestVolumeConversionFactors:
    """Test getting conversion factors for volume units."""

    def test_liter_to_gallon_factor(self) -> None:
        """Test conversion factor from liters to gallons."""
        factor = get_conversion_factor("liter", "gallon")
        assert abs(factor - 0.264172) < 0.0001

    def test_gallon_to_liter_factor(self) -> None:
        """Test conversion factor from gallons to liters."""
        factor = get_conversion_factor("gallon", "liter")
        assert abs(factor - 3.78541) < 0.0001

    def test_milliliter_to_liter_factor(self) -> None:
        """Test conversion factor from milliliters to liters."""
        factor = get_conversion_factor("milliliter", "liter")
        assert abs(factor - 0.001) < 0.0001


class TestVolumeUnitCompatibility:
    """Test unit compatibility checking for volume units."""

    def test_liter_compatible_with_gallon(self) -> None:
        """Test that liters are compatible with gallons."""
        assert is_compatible("liter", "gallon")

    def test_milliliter_compatible_with_liter(self) -> None:
        """Test that milliliters are compatible with liters."""
        assert is_compatible("milliliter", "liter")

    def test_quart_compatible_with_pint(self) -> None:
        """Test that quarts are compatible with pints."""
        assert is_compatible("quart", "pint")

    def test_liter_not_compatible_with_meter(self) -> None:
        """Test that liters are not compatible with meters."""
        assert not is_compatible("liter", "meter")

    def test_gallon_not_compatible_with_kilogram(self) -> None:
        """Test that gallons are not compatible with kilograms."""
        assert not is_compatible("gallon", "kilogram")


class TestInvalidVolumeConversions:
    """Test error handling for invalid volume conversions."""

    def test_unknown_source_unit(self) -> None:
        """Test conversion with unknown source unit."""
        with pytest.raises(UnitError):
            convert(1, "notaunit", "gallon")

    def test_unknown_target_unit(self) -> None:
        """Test conversion with unknown target unit."""
        with pytest.raises(UnitError):
            convert(1, "liter", "notaunit")

    def test_incompatible_unit_conversion(self) -> None:
        """Test conversion between incompatible units."""
        with pytest.raises(DimensionalityError):
            convert(1, "liter", "kilogram")

    def test_incompatible_unit_error_has_context(self) -> None:
        """Test that incompatible unit error includes context."""
        with pytest.raises(DimensionalityError) as exc_info:
            convert(1, "liter", "meter")
        assert "liter" in str(exc_info.value)
        assert "meter" in str(exc_info.value)
