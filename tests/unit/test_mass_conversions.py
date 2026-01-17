"""
Unit tests for mass conversions.

Tests for pound ↔ kilogram, gram conversions and other mass unit conversions.
"""

import pytest
from scientific_calculator.units import convert, is_compatible, get_conversion_factor
from scientific_calculator.exceptions import DimensionalityError, UnitError


class TestMassConversions:
    """Test mass unit conversions."""

    def test_pound_to_kilogram_conversion(self) -> None:
        """Test conversion of 220 lbs to kg (99.79)."""
        result = convert(220, "pound", "kilogram")
        assert abs(result - 99.790436) < 0.002

    def test_kilogram_to_pound_conversion(self) -> None:
        """Test conversion of kilograms to pounds."""
        result = convert(1, "kilogram", "pound")
        assert abs(result - 2.20462) < 0.0001

    def test_gram_to_ounce_conversion(self) -> None:
        """Test conversion of grams to ounces."""
        result = convert(28.35, "gram", "ounce")
        assert abs(result - 1.0) < 0.0001

    def test_ounce_to_gram_conversion(self) -> None:
        """Test conversion of ounces to grams."""
        result = convert(1, "ounce", "gram")
        assert abs(result - 28.35) < 0.001

    def test_kilogram_to_gram_conversion(self) -> None:
        """Test conversion of kilograms to grams."""
        result = convert(1, "kilogram", "gram")
        assert abs(result - 1000.0) < 0.0001

    def test_gram_to_kilogram_conversion(self) -> None:
        """Test conversion of grams to kilograms."""
        result = convert(1000, "gram", "kilogram")
        assert abs(result - 1.0) < 0.0001

    def test_ton_to_kilogram_conversion(self) -> None:
        """Test conversion of metric tons to kilograms."""
        result = convert(1, "ton", "kilogram")
        assert abs(result - 1000.0) < 0.0001

    def test_kilogram_to_ton_conversion(self) -> None:
        """Test conversion of kilograms to metric tons."""
        result = convert(1000, "kilogram", "ton")
        assert abs(result - 1.0) < 0.0001

    def test_pound_to_gram_conversion(self) -> None:
        """Test conversion of pounds to grams."""
        result = convert(1, "pound", "gram")
        assert abs(result - 453.592) < 0.001

    def test_gram_to_pound_conversion(self) -> None:
        """Test conversion of grams to pounds."""
        result = convert(453.592, "gram", "pound")
        assert abs(result - 1.0) < 0.0001

    def test_zero_mass_conversion(self) -> None:
        """Test conversion of zero mass."""
        result = convert(0, "kilogram", "pound")
        assert result == 0.0

    def test_negative_mass_conversion(self) -> None:
        """Test conversion of negative mass (should work mathematically)."""
        result = convert(-1, "kilogram", "pound")
        assert abs(result - (-2.20462)) < 0.0001


class TestMassConversionFactors:
    """Test getting conversion factors for mass units."""

    def test_pound_to_kilogram_factor(self) -> None:
        """Test conversion factor from pounds to kg."""
        factor = get_conversion_factor("pound", "kilogram")
        assert abs(factor - 0.45359237) < 0.0001

    def test_kilogram_to_pound_factor(self) -> None:
        """Test conversion factor from kg to pounds."""
        factor = get_conversion_factor("kilogram", "pound")
        assert abs(factor - 2.20462) < 0.0001

    def test_gram_to_kilogram_factor(self) -> None:
        """Test conversion factor from grams to kg."""
        factor = get_conversion_factor("gram", "kilogram")
        assert abs(factor - 0.001) < 0.0001


class TestMassUnitCompatibility:
    """Test unit compatibility checking for mass units."""

    def test_pound_compatible_with_kilogram(self) -> None:
        """Test that pounds are compatible with kilograms."""
        assert is_compatible("pound", "kilogram")

    def test_gram_compatible_with_ounce(self) -> None:
        """Test that grams are compatible with ounces."""
        assert is_compatible("gram", "ounce")

    def test_kilogram_compatible_with_ton(self) -> None:
        """Test that kilograms are compatible with metric tons."""
        assert is_compatible("kilogram", "ton")

    def test_pound_not_compatible_with_kilometer(self) -> None:
        """Test that pounds are not compatible with kilometers."""
        assert not is_compatible("pound", "kilometer")

    def test_kilogram_not_compatible_with_second(self) -> None:
        """Test that kilograms are not compatible with seconds."""
        assert not is_compatible("kilogram", "second")


class TestInvalidMassConversions:
    """Test error handling for invalid mass conversions."""

    def test_unknown_source_unit(self) -> None:
        """Test conversion with unknown source unit."""
        with pytest.raises(UnitError):
            convert(10, "notaunit", "gram")

    def test_unknown_target_unit(self) -> None:
        """Test conversion with unknown target unit."""
        with pytest.raises(UnitError):
            convert(10, "kilogram", "invalidunit")

    def test_incompatible_unit_conversion(self) -> None:
        """Test conversion between incompatible units."""
        with pytest.raises(DimensionalityError):
            convert(10, "kilogram", "meter")

    def test_incompatible_unit_error_has_context(self) -> None:
        """Test that incompatible unit error includes context."""
        with pytest.raises(DimensionalityError) as exc_info:
            convert(10, "kilogram", "liter")
        assert "kilogram" in str(exc_info.value)
        assert "liter" in str(exc_info.value)
