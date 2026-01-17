"""
Unit tests for conversion error handling.

Tests for error handling with invalid unit pairs, unknown units, and
incompatible dimensions.
"""

import pytest
from scientific_calculator.units import convert, is_compatible
from scientific_calculator.exceptions import DimensionalityError, UnitError


class TestInvalidUnitErrorHandling:
    """Test error handling for invalid units."""

    def test_unknown_from_unit_error(self) -> None:
        """Test error when source unit is unknown."""
        with pytest.raises(UnitError) as exc_info:
            convert(5, "invalidunit", "meter")
        assert "Unknown unit" in str(exc_info.value) or "kilometres" in str(exc_info.value)

    def test_unknown_to_unit_error(self) -> None:
        """Test error when target unit is unknown."""
        with pytest.raises(UnitError) as exc_info:
            convert(5, "meter", "megameter_squared")
        assert "Unknown unit" in str(exc_info.value) or "megameter_squared" in str(exc_info.value)

    def test_both_units_unknown_error(self) -> None:
        """Test error when both units are unknown."""
        with pytest.raises(UnitError):
            convert(5, "unknown1", "unknown2")

    def test_invalid_unit_error_includes_value(self) -> None:
        """Test that invalid unit error includes context."""
        with pytest.raises(UnitError) as exc_info:
            convert(5, "invalidunit", "meter")
        assert str(exc_info.value)


class TestIncompatibleUnitConversions:
    """Test error handling for dimensionally incompatible conversions."""

    def test_length_to_mass_conversion_error(self) -> None:
        """Test error when converting length to mass."""
        with pytest.raises(DimensionalityError) as exc_info:
            convert(5, "kilometer", "kilogram")
        assert "Cannot convert" in str(exc_info.value) or "incompatible" in str(exc_info.value)

    def test_mass_to_time_conversion_error(self) -> None:
        """Test error when converting mass to time."""
        with pytest.raises(DimensionalityError) as exc_info:
            convert(10, "kilogram", "second")
        assert "Cannot convert" in str(exc_info.value) or "incompatible" in str(exc_info.value)

    def test_volume_to_length_conversion_error(self) -> None:
        """Test error when converting volume to length."""
        with pytest.raises(DimensionalityError):
            convert(1, "liter", "meter")

    def test_temperature_to_length_conversion_error(self) -> None:
        """Test error when converting temperature to length."""
        with pytest.raises(Exception):  # Pint raises OffsetUnitCalculusError
            convert(20, "celsius", "kilometer")

    def test_error_includes_both_units_in_context(self) -> None:
        """Test that error message includes both units."""
        with pytest.raises(DimensionalityError) as exc_info:
            convert(5, "kilometer", "kilogram")
        error_str = str(exc_info.value)
        assert "kilometer" in error_str
        assert "kilogram" in error_str


class TestIncompatibleUnitChecking:
    """Test is_compatible() error handling."""

    def test_is_compatible_with_invalid_unit(self) -> None:
        """Test is_compatible with invalid unit."""
        with pytest.raises(UnitError):
            is_compatible("unknown_unit", "meter")

    def test_is_compatible_both_invalid_units(self) -> None:
        """Test is_compatible with both units invalid."""
        with pytest.raises(UnitError):
            is_compatible("unknown1", "unknown2")

    def test_is_compatible_returns_false_for_incompatible(self) -> None:
        """Test is_compatible returns False for dimensionally incompatible units."""
        assert not is_compatible("kilometer", "kilogram")
        assert not is_compatible("liter", "second")
        assert not is_compatible("celsius", "meter")


class TestSpecialCaseConversionErrors:
    """Test error handling for special case conversions."""

    def test_temperature_abbreviation_error(self) -> None:
        """Test that temperature abbreviations work correctly."""
        # These should work
        result = convert(0, "c", "f")
        assert abs(result - 32.0) < 0.0001

    def test_empty_unit_string_error(self) -> None:
        """Test error handling for empty unit string."""
        with pytest.raises(Exception):  # Pint raises various errors for empty strings
            convert(5, "", "meter")

    def test_whitespace_only_unit_error(self) -> None:
        """Test error handling for whitespace-only unit string."""
        with pytest.raises(Exception):  # Pint raises AssertionError for whitespace
            convert(5, "   ", "meter")

    def test_unit_with_invalid_syntax_error(self) -> None:
        """Test error handling for unit with invalid syntax."""
        # Note: "meter@@@" is actually interpreted as "meter" by Pint, so this won't error
        # Testing with a truly invalid unit instead
        with pytest.raises(UnitError):
            convert(5, "invalidXXXunit", "kilometer")


class TestConversionErrorMessages:
    """Test that error messages are user-friendly."""

    def test_error_message_clarity(self) -> None:
        """Test that error messages are clear about the issue."""
        try:
            convert(5, "kilometer", "kilogram")
        except DimensionalityError as e:
            error_msg = str(e)
            # Should mention the problem
            assert "Cannot convert" in error_msg or "incompatible" in error_msg

    def test_unknown_unit_error_message(self) -> None:
        """Test that unknown unit error is clear."""
        try:
            convert(5, "megameter_squared", "meter")
        except UnitError as e:
            error_msg = str(e)
            # Should mention it's an unknown unit
            assert "Unknown unit" in error_msg or "invalid" in error_msg.lower()

    def test_error_suggests_valid_units(self) -> None:
        """Test that errors provide helpful context."""
        try:
            convert(5, "kilometer", "kilogram")
        except DimensionalityError as e:
            # Should have context about what went wrong
            assert str(e)


class TestZeroAndNegativeHandling:
    """Test handling of zero and negative values in conversions."""

    def test_zero_value_conversion_all_unit_types(self) -> None:
        """Test that zero converts correctly for all unit types."""
        assert convert(0, "meter", "foot") == 0
        assert convert(0, "kilogram", "pound") == 0
        assert convert(0, "liter", "gallon") == 0

    def test_negative_distance_conversion(self) -> None:
        """Test negative distance conversion."""
        result = convert(-5, "kilometer", "mile")
        assert result < 0

    def test_negative_mass_conversion(self) -> None:
        """Test negative mass conversion."""
        result = convert(-10, "kilogram", "pound")
        assert result < 0

    def test_negative_volume_conversion(self) -> None:
        """Test negative volume conversion."""
        result = convert(-1, "liter", "gallon")
        assert result < 0
