"""
Unit system integration with Pint for dimensional analysis.

Provides:
- Unit registry wrapper with singleton pattern
- Base and derived unit definitions (distance, mass, temperature, volume, derived)
- Unit conversion functions
- Temperature conversion with offset handling
- Mathematical constants (π, e)
"""

from __future__ import annotations

import math

from pint import UnitRegistry

from scientific_calculator.exceptions import DimensionalityError, UnitError

# Module-level singleton instance
_registry: UnitRegistry | None = None


def get_registry() -> UnitRegistry:
    """
    Get or create the global unit registry.

    Returns:
        The Pint UnitRegistry singleton.
    """
    global _registry
    if _registry is None:
        _registry = UnitRegistry()
        _setup_units()
    return _registry


def _setup_units() -> None:
    """Initialize all base and derived units in the registry."""
    registry = _registry
    assert registry is not None

    # Register base units (SI base units are already in Pint)
    # Distance: meter, kilometer, mile, foot, inch, yard
    registry.define("mile = 1.609344 * kilometer")
    registry.define("foot = 0.3048 * meter")
    registry.define("inch = 2.54 * centimeter")
    registry.define("yard = 3 * foot")

    # Mass: kilogram, gram, pound, ounce, ton
    registry.define("pound = 0.45359237 * kilogram")
    registry.define("ounce = pound / 16")
    registry.define("ton = 1000 * kilogram")

    # Temperature: handled separately (see convert function)

    # Volume: liter, milliliter, gallon, quart, pint
    registry.define("liter = 1000 * centimeter ** 3")
    registry.define("milliliter = liter / 1000")
    registry.define("gallon = 3.78541 * liter")
    registry.define("quart = gallon / 4")
    registry.define("pint = quart / 2")

    # Derived units
    # Velocity: m/s, km/h, mph
    registry.define("velocity = [length] / [time]")

    # Force: Newton, pound-force
    registry.define("pound_force = 4.44822 * newton")

    # Pressure: Pascal, atmosphere, bar, psi
    registry.define("bar = 100000 * pascal")
    registry.define("psi = 6894.757 * pascal")

    # Energy: Joule, kilowatt-hour, calorie
    registry.define("kilowatt_hour = 3.6e6 * joule")
    registry.define("calorie = 4.184 * joule")

    # Power: Watt, kilowatt, horsepower
    registry.define("horsepower = 745.7 * watt")

    # Magnetic flux: Tesla, Weber
    # (Already in Pint as base units)

    # Mathematical constants
    registry.define("pi = 1 * dimensionless")
    registry.define("e = 1 * dimensionless")

    # Set PI and E values
    _registry.pi = math.pi
    _registry.e = math.e


def convert(value: float, from_unit: str, to_unit: str) -> float:
    """
    Convert a value from one unit to another.

    Args:
        value: The numerical value to convert
        from_unit: Source unit
        to_unit: Target unit

    Returns:
        Converted value

    Raises:
        UnitError: If units are unknown or invalid
        DimensionalityError: If units are incompatible for conversion
    """
    registry = get_registry()

    # Special handling for temperature (has offset)
    if from_unit.lower() in ("celsius", "c") and to_unit.lower() in ("fahrenheit", "f"):
        return value * 9/5 + 32

    if from_unit.lower() in ("fahrenheit", "f") and to_unit.lower() in ("celsius", "c"):
        return (value - 32) * 5/9

    if from_unit.lower() in ("celsius", "c") and to_unit.lower() in ("kelvin", "k"):
        return value + 273.15

    if from_unit.lower() in ("kelvin", "k") and to_unit.lower() in ("celsius", "c"):
        return value - 273.15

    if from_unit.lower() in ("fahrenheit", "f") and to_unit.lower() in ("kelvin", "k"):
        celsius = (value - 32) * 5/9
        return celsius + 273.15

    if from_unit.lower() in ("kelvin", "k") and to_unit.lower() in ("fahrenheit", "f"):
        celsius = value - 273.15
        return celsius * 9/5 + 32

    # Use Pint for non-temperature units
    try:
        quantity = value * registry(from_unit)
        result = quantity.to(to_unit)
        return float(result.magnitude)
    except UndefinedUnitError as e:
        raise UnitError(
            f"Unknown unit",
            {"invalid_unit": str(e)},
        ) from e
    except DimensionalityError as e:
        raise DimensionalityError(
            f"Cannot convert {from_unit} to {to_unit}: incompatible dimensions",
            {"from_unit": from_unit, "to_unit": to_unit},
        ) from e


def is_compatible(from_unit: str, to_unit: str) -> bool:
    """
    Check if two units are dimensionally compatible.

    Args:
        from_unit: First unit
        to_unit: Second unit

    Returns:
        True if units can be converted to each other

    Raises:
        UnitError: If either unit is invalid
    """
    registry = get_registry()

    # Special case for temperature conversions
    temp_units = {"celsius", "c", "fahrenheit", "f", "kelvin", "k"}
    from_lower = from_unit.lower()
    to_lower = to_unit.lower()

    if from_lower in temp_units and to_lower in temp_units:
        return True

    try:
        from_qty = registry(from_unit)
        to_qty = registry(to_unit)
        # Check if units have same dimensionality
        return from_qty.dimensionality == to_qty.dimensionality
    except Exception as e:
        raise UnitError(
            "Invalid unit",
            {"from_unit": from_unit, "to_unit": to_unit, "error": str(e)},
        ) from e


def get_conversion_factor(from_unit: str, to_unit: str) -> float:
    """
    Get the raw conversion factor between two units.

    Args:
        from_unit: Source unit
        to_unit: Target unit

    Returns:
        Conversion factor (to_unit per from_unit)

    Raises:
        UnitError: If units are invalid
        DimensionalityError: If units are incompatible
    """
    if not is_compatible(from_unit, to_unit):
        raise DimensionalityError(
            f"Cannot get conversion factor: {from_unit} and {to_unit} are incompatible",
            {"from_unit": from_unit, "to_unit": to_unit},
        )

    # Convert 1 unit to get the factor
    return convert(1.0, from_unit, to_unit)


# Import Pint exceptions for proper error handling
try:
    from pint.errors import UndefinedUnitError  # type: ignore
except ImportError:
    UndefinedUnitError = Exception  # Fallback
