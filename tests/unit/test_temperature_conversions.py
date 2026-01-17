"""
Unit tests for temperature conversions.

Tests for Celsius ↔ Fahrenheit ↔ Kelvin conversions with offset handling.
"""

import pytest
from scientific_calculator.units import convert, is_compatible, get_conversion_factor
from scientific_calculator.exceptions import DimensionalityError, UnitError


class TestTemperatureConversions:
    """Test temperature unit conversions with offset handling."""

    def test_celsius_to_fahrenheit_freezing(self) -> None:
        """Test conversion of 0°C to Fahrenheit (32°F)."""
        result = convert(0, "celsius", "fahrenheit")
        assert abs(result - 32.0) < 0.00001

    def test_fahrenheit_to_celsius_freezing(self) -> None:
        """Test conversion of 32°F to Celsius (0°C)."""
        result = convert(32, "fahrenheit", "celsius")
        assert abs(result - 0.0) < 0.00001

    def test_celsius_to_fahrenheit_boiling(self) -> None:
        """Test conversion of 100°C to Fahrenheit (212°F)."""
        result = convert(100, "celsius", "fahrenheit")
        assert abs(result - 212.0) < 0.00001

    def test_fahrenheit_to_celsius_boiling(self) -> None:
        """Test conversion of 212°F to Celsius (100°C)."""
        result = convert(212, "fahrenheit", "celsius")
        assert abs(result - 100.0) < 0.00001

    def test_celsius_to_fahrenheit_room_temperature(self) -> None:
        """Test conversion of 20°C to Fahrenheit (68°F)."""
        result = convert(20, "celsius", "fahrenheit")
        assert abs(result - 68.0) < 0.00001

    def test_fahrenheit_to_celsius_room_temperature(self) -> None:
        """Test conversion of 68°F to Celsius (20°C)."""
        result = convert(68, "fahrenheit", "celsius")
        assert abs(result - 20.0) < 0.00001

    def test_celsius_to_kelvin_absolute_zero(self) -> None:
        """Test conversion of -273.15°C to Kelvin (0K)."""
        result = convert(-273.15, "celsius", "kelvin")
        assert abs(result - 0.0) < 0.00001

    def test_kelvin_to_celsius_absolute_zero(self) -> None:
        """Test conversion of 0K to Celsius (-273.15°C)."""
        result = convert(0, "kelvin", "celsius")
        assert abs(result - (-273.15)) < 0.00001

    def test_celsius_to_kelvin_room_temperature(self) -> None:
        """Test conversion of 20°C to Kelvin (293.15K)."""
        result = convert(20, "celsius", "kelvin")
        assert abs(result - 293.15) < 0.00001

    def test_kelvin_to_celsius_room_temperature(self) -> None:
        """Test conversion of 293.15K to Celsius (20°C)."""
        result = convert(293.15, "kelvin", "celsius")
        assert abs(result - 20.0) < 0.00001

    def test_fahrenheit_to_kelvin_freezing(self) -> None:
        """Test conversion of 32°F to Kelvin (273.15K)."""
        result = convert(32, "fahrenheit", "kelvin")
        assert abs(result - 273.15) < 0.00001

    def test_kelvin_to_fahrenheit_freezing(self) -> None:
        """Test conversion of 273.15K to Fahrenheit (32°F)."""
        result = convert(273.15, "kelvin", "fahrenheit")
        assert abs(result - 32.0) < 0.00001

    def test_negative_celsius_conversion(self) -> None:
        """Test conversion of negative Celsius temperature."""
        result = convert(-40, "celsius", "fahrenheit")
        assert abs(result - (-40.0)) < 0.00001  # -40°C = -40°F

    def test_negative_fahrenheit_conversion(self) -> None:
        """Test conversion of negative Fahrenheit temperature."""
        result = convert(-40, "fahrenheit", "celsius")
        assert abs(result - (-40.0)) < 0.00001


class TestTemperatureUnitCompatibility:
    """Test unit compatibility checking for temperature units."""

    def test_celsius_compatible_with_fahrenheit(self) -> None:
        """Test that Celsius is compatible with Fahrenheit."""
        assert is_compatible("celsius", "fahrenheit")

    def test_fahrenheit_compatible_with_kelvin(self) -> None:
        """Test that Fahrenheit is compatible with Kelvin."""
        assert is_compatible("fahrenheit", "kelvin")

    def test_celsius_compatible_with_kelvin(self) -> None:
        """Test that Celsius is compatible with Kelvin."""
        assert is_compatible("celsius", "kelvin")

    def test_kelvin_compatible_with_celsius(self) -> None:
        """Test that Kelvin is compatible with Celsius (symmetry)."""
        assert is_compatible("kelvin", "celsius")

    def test_celsius_not_compatible_with_meter(self) -> None:
        """Test that Celsius is not compatible with meters."""
        assert not is_compatible("celsius", "meter")

    def test_celsius_not_compatible_with_kilogram(self) -> None:
        """Test that Celsius is not compatible with kilograms."""
        assert not is_compatible("celsius", "kilogram")


class TestTemperatureAbbreviations:
    """Test temperature unit abbreviations."""

    def test_celsius_abbreviation_c(self) -> None:
        """Test conversion using 'C' abbreviation."""
        result = convert(0, "c", "fahrenheit")
        assert abs(result - 32.0) < 0.00001

    def test_fahrenheit_abbreviation_f(self) -> None:
        """Test conversion using 'F' abbreviation."""
        result = convert(32, "f", "celsius")
        assert abs(result - 0.0) < 0.00001

    def test_kelvin_abbreviation_k(self) -> None:
        """Test conversion using 'K' abbreviation."""
        result = convert(273.15, "k", "celsius")
        assert abs(result - 0.0) < 0.00001


class TestTemperatureEdgeCases:
    """Test edge cases for temperature conversions."""

    def test_very_hot_temperature_celsius_to_fahrenheit(self) -> None:
        """Test conversion of very hot temperature."""
        result = convert(1000, "celsius", "fahrenheit")
        assert abs(result - 1832.0) < 0.00001

    def test_very_cold_temperature_kelvin_to_celsius(self) -> None:
        """Test conversion near absolute zero."""
        result = convert(1, "kelvin", "celsius")
        assert abs(result - (-272.15)) < 0.00001

    def test_zero_kelvin_conversion(self) -> None:
        """Test conversion of 0K (absolute zero)."""
        result = convert(0, "kelvin", "fahrenheit")
        assert abs(result - (-459.67)) < 0.00001
