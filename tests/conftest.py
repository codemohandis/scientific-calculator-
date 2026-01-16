"""
Pytest configuration and fixtures for scientific calculator tests.

Provides fixtures for:
- Pint UnitRegistry mocking and testing
- Expression evaluator instances
- Test data and constants
"""

from __future__ import annotations

import pytest
from pint import UnitRegistry


@pytest.fixture
def unit_registry() -> UnitRegistry:
    """
    Provide a fresh Pint UnitRegistry for each test.

    This isolates tests and prevents unit definitions from persisting
    between test cases.

    Returns:
        UnitRegistry: A clean unit registry with base SI units.
    """
    registry = UnitRegistry()
    return registry


@pytest.fixture
def pint_quantity(unit_registry: UnitRegistry):
    """
    Provide a factory for creating Pint quantities in tests.

    Args:
        unit_registry: The unit registry fixture.

    Returns:
        A callable that creates quantities with the given registry.
    """
    def _make_quantity(value: float, unit: str):
        return value * unit_registry(unit)

    return _make_quantity


@pytest.fixture
def mock_expression_evaluator():
    """
    Provide a mock expression evaluator for integration tests.

    This fixture creates a stub evaluator that can be customized
    in individual tests.

    Returns:
        A mock evaluator instance.
    """
    class MockEvaluator:
        """Mock AST-based expression evaluator."""

        def __init__(self) -> None:
            self.last_expression: str | None = None
            self.last_result: float | None = None

        def evaluate(self, expression: str) -> float:
            """Mock evaluate method."""
            self.last_expression = expression
            # Stub implementation
            return 0.0

    return MockEvaluator()


@pytest.fixture
def sample_conversions() -> dict[str, tuple[float, str, str, float]]:
    """
    Provide sample conversion test data.

    Each entry is (value, from_unit, to_unit, expected_result).

    Returns:
        Dictionary of conversion test cases.
    """
    return {
        'km_to_miles': (5.0, 'km', 'miles', 3.10686),
        'fahrenheit_to_celsius': (32.0, 'fahrenheit', 'celsius', 0.0),
        'pounds_to_kg': (220.0, 'pounds', 'kg', 99.7904),
        'liters_to_gallons': (1.0, 'liters', 'gallons', 0.264172),
    }


@pytest.fixture
def sample_scientific_functions() -> dict[str, tuple[float, float]]:
    """
    Provide sample scientific function test data.

    Each entry is (input, expected_output).

    Returns:
        Dictionary of function test cases.
    """
    import math

    return {
        'sin_0': (0.0, 0.0),
        'cos_0': (0.0, 1.0),
        'tan_45': (45.0, math.tan(math.radians(45.0))),
        'log10_100': (100.0, 2.0),
        'ln_e': (math.e, 1.0),
        'exp_1': (1.0, math.e),
    }


# Pytest markers for test categorization
def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line('markers', 'unit: mark test as a unit test')
    config.addinivalue_line('markers', 'integration: mark test as an integration test')
    config.addinivalue_line('markers', 'slow: mark test as slow running')
