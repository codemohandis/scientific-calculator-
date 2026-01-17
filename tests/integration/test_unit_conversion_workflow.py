"""
Integration tests for unit conversion workflow.

Tests end-to-end conversion operations from user input through API.
"""

import pytest
from scientific_calculator.units import convert, is_compatible, get_conversion_factor
from scientific_calculator.exceptions import DimensionalityError, UnitError


class TestCompleteConversionWorkflows:
    """Test complete unit conversion workflows."""

    def test_simple_distance_conversion_workflow(self) -> None:
        """Test a simple distance conversion workflow."""
        # User wants to convert 10 km to miles
        if is_compatible("kilometer", "mile"):
            result = convert(10, "kilometer", "mile")
            assert abs(result - 6.21371) < 0.0001

    def test_temperature_conversion_workflow(self) -> None:
        """Test temperature conversion workflow."""
        # User wants to convert room temperature from Celsius to Fahrenheit
        if is_compatible("celsius", "fahrenheit"):
            result = convert(20, "celsius", "fahrenheit")
            assert abs(result - 68.0) < 0.0001

    def test_mass_conversion_workflow(self) -> None:
        """Test mass conversion workflow."""
        # User wants to convert 150 lbs to kilograms
        if is_compatible("pound", "kilogram"):
            result = convert(150, "pound", "kilogram")
            assert abs(result - 68.0388) < 0.0001

    def test_volume_conversion_workflow(self) -> None:
        """Test volume conversion workflow."""
        # User wants to convert 2 gallons to liters
        if is_compatible("gallon", "liter"):
            result = convert(2, "gallon", "liter")
            assert abs(result - 7.57082) < 0.0001

    def test_multiple_conversions_chain(self) -> None:
        """Test chaining multiple conversions."""
        # Convert 1 mile to meters to kilometers
        miles_to_meters = convert(1, "mile", "meter")
        meters_to_kilometers = convert(miles_to_meters, "meter", "kilometer")
        # Should be approximately 1.609344 km
        assert abs(meters_to_kilometers - 1.609344) < 0.0001

    def test_conversion_factor_usage_workflow(self) -> None:
        """Test using conversion factor for multiple values."""
        # Get the conversion factor once
        factor = get_conversion_factor("kilometer", "mile")

        # Apply to multiple values
        result1 = 5 * factor
        result2 = 10 * factor
        result3 = 100 * factor

        assert abs(result1 - 3.10686) < 0.0001
        assert abs(result2 - 6.21371) < 0.0001
        assert abs(result3 - 62.1371) < 0.0001


class TestMultipleConversionTypes:
    """Test conversions across different physical quantities."""

    def test_distance_unit_categories(self) -> None:
        """Test various distance unit conversions."""
        conversions = [
            (5, "kilometer", "mile", 3.10686),
            (100, "meter", "foot", 328.084),
            (1, "inch", "centimeter", 2.54),
            (1, "yard", "meter", 0.9144),
        ]
        for value, from_unit, to_unit, expected in conversions:
            result = convert(value, from_unit, to_unit)
            assert abs(result - expected) < 0.0001

    def test_mass_unit_categories(self) -> None:
        """Test various mass unit conversions."""
        conversions = [
            (1, "kilogram", "pound", 2.20462),
            (100, "gram", "ounce", 3.52740),
            (1, "pound", "kilogram", 0.45359237),
            (1000, "kilogram", "ton", 1.0),
        ]
        for value, from_unit, to_unit, expected in conversions:
            result = convert(value, from_unit, to_unit)
            assert abs(result - expected) < 0.0001

    def test_temperature_unit_categories(self) -> None:
        """Test various temperature unit conversions."""
        conversions = [
            (0, "celsius", "fahrenheit", 32.0),
            (100, "celsius", "fahrenheit", 212.0),
            (32, "fahrenheit", "celsius", 0.0),
            (0, "celsius", "kelvin", 273.15),
        ]
        for value, from_unit, to_unit, expected in conversions:
            result = convert(value, from_unit, to_unit)
            assert abs(result - expected) < 0.0001

    def test_volume_unit_categories(self) -> None:
        """Test various volume unit conversions."""
        conversions = [
            (1, "liter", "gallon", 0.264172),
            (1, "gallon", "liter", 3.78541),
            (1000, "milliliter", "liter", 1.0),
            (1, "gallon", "quart", 4.0),
        ]
        for value, from_unit, to_unit, expected in conversions:
            result = convert(value, from_unit, to_unit)
            assert abs(result - expected) < 0.0001


class TestErrorRecoveryWorkflow:
    """Test error handling in conversion workflows."""

    def test_validate_before_convert_workflow(self) -> None:
        """Test workflow of validating units before converting."""
        from_unit = "kilometer"
        to_unit = "mile"

        # First check compatibility
        if is_compatible(from_unit, to_unit):
            result = convert(5, from_unit, to_unit)
            assert result > 0

    def test_handle_incompatible_units_gracefully(self) -> None:
        """Test graceful handling of incompatible units."""
        from_unit = "kilometer"
        to_unit = "kilogram"

        # Check compatibility first
        assert not is_compatible(from_unit, to_unit)

        # Only convert if compatible
        if is_compatible(from_unit, to_unit):
            result = convert(5, from_unit, to_unit)
        else:
            # Handle incompatibility
            with pytest.raises(DimensionalityError):
                convert(5, from_unit, to_unit)

    def test_retry_with_different_units(self) -> None:
        """Test retrying with different units after error."""
        # Try invalid conversion first
        with pytest.raises(DimensionalityError):
            convert(5, "kilometer", "kilogram")

        # Then try valid conversion
        result = convert(5, "kilometer", "mile")
        assert abs(result - 3.10686) < 0.0001


class TestPrecisionPreservation:
    """Test that precision is preserved across conversions."""

    def test_round_trip_conversion_precision(self) -> None:
        """Test that converting back and forth preserves value."""
        original = 5.0

        # Convert there and back
        converted = convert(original, "kilometer", "mile")
        back = convert(converted, "mile", "kilometer")

        # Should be very close to original
        assert abs(back - original) < 0.0001

    def test_multiple_round_trips(self) -> None:
        """Test multiple conversions maintain precision."""
        value = 100.0

        # km -> m -> ft
        km_to_m = convert(value, "kilometer", "meter")
        m_to_ft = convert(km_to_m, "meter", "foot")

        # Direct km to ft
        km_to_ft_direct = convert(value, "kilometer", "foot")

        # Results should match
        assert abs(m_to_ft - km_to_ft_direct) < 0.001


class TestRealWorldScenarios:
    """Test real-world conversion scenarios."""

    def test_cooking_measurement_conversion(self) -> None:
        """Test cooking-related unit conversions."""
        # Recipe calls for 2 liters, but you want to use gallons
        liters = 2
        gallons = convert(liters, "liter", "gallon")
        assert abs(gallons - 0.528344) < 0.0001

    def test_sports_performance_conversion(self) -> None:
        """Test sports-related conversions."""
        # Runner ran 5 miles, how many kilometers?
        miles = 5
        kilometers = convert(miles, "mile", "kilometer")
        assert abs(kilometers - 8.04672) < 0.0001

    def test_travel_distance_conversion(self) -> None:
        """Test travel distance conversions."""
        # Car has 200 mile range, what's that in kilometers?
        miles = 200
        kilometers = convert(miles, "mile", "kilometer")
        assert abs(kilometers - 321.869) < 0.001

    def test_weather_temperature_conversion(self) -> None:
        """Test weather-related temperature conversions."""
        # Weather says 25°C, what's that in Fahrenheit?
        celsius = 25
        fahrenheit = convert(celsius, "celsius", "fahrenheit")
        assert abs(fahrenheit - 77.0) < 0.0001

    def test_weight_conversion_healthcare(self) -> None:
        """Test healthcare weight conversions."""
        # Patient weighs 75 kg, what's that in pounds?
        kilograms = 75
        pounds = convert(kilograms, "kilogram", "pound")
        assert abs(pounds - 165.346) < 0.001
