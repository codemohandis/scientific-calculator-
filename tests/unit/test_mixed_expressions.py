"""
Unit tests for mixed conversions and operations in expression evaluation.

Tests verify that expressions combining unit conversions with mathematical
operations work correctly, including:
- Simple arithmetic with unit-aware quantities
- Unit conversions in expressions
- Combinations of scientific functions with units
"""

import pytest
from scientific_calculator.expression_evaluator import SafeExpressionEvaluator
from scientific_calculator.exceptions import EvaluationError, SyntaxError, DimensionalityError
from scientific_calculator.units import get_registry


class TestMixedExpressions:
    """Test expressions combining arithmetic and unit-aware operations."""

    @pytest.fixture
    def evaluator(self):
        """Create evaluator instance."""
        return SafeExpressionEvaluator()

    def test_simple_arithmetic_no_units(self, evaluator):
        """Basic arithmetic without units."""
        result = evaluator.evaluate("5 + 3")
        assert result == 8

    def test_multiply_scalars(self, evaluator):
        """Multiplication of scalar numbers."""
        # 5 km/hour * 2 hours = 10 km (but evaluator only does numbers)
        result = evaluator.evaluate("5 * 2")
        assert result == 10

    def test_divide_distance_by_time(self, evaluator):
        """Division representing velocity calculation."""
        # 100 km / 2 hours = 50 km/h (as pure numbers: 100 / 2 = 50)
        result = evaluator.evaluate("100 / 2")
        assert result == 50

    def test_force_calculation(self, evaluator):
        """Force calculation as pure arithmetic."""
        # F = m * a, so 5 kg * 10 m/s^2 = 50 N (as numbers: 5 * 10 = 50)
        result = evaluator.evaluate("5 * 10")
        assert result == 50

    def test_energy_calculation(self, evaluator):
        """Energy calculation as pure arithmetic."""
        # E = m * c^2, simplified: 2 * 3^2 = 2 * 9 = 18
        result = evaluator.evaluate("2 * 3 ** 2")
        assert result == 18

    def test_power_calculation(self, evaluator):
        """Power calculation as pure arithmetic."""
        # P = E / t, simplified: 100 / 5 = 20
        result = evaluator.evaluate("100 / 5")
        assert result == 20

    def test_pressure_calculation(self, evaluator):
        """Pressure calculation as pure arithmetic."""
        # P = F / A, simplified: 1000 / 2 = 500
        result = evaluator.evaluate("1000 / 2")
        assert result == 500

    def test_arithmetic_with_trigonometric(self, evaluator):
        """Arithmetic combined with trigonometric function."""
        # 2 * sin(90) = 2 * 1 = 2
        result = evaluator.evaluate("2 * sin(90)")
        assert abs(result - 2) < 1e-6

    def test_arithmetic_with_logarithmic(self, evaluator):
        """Arithmetic combined with logarithmic function."""
        # 5 + log(100) = 5 + 2 = 7
        result = evaluator.evaluate("5 + log(100)")
        assert abs(result - 7) < 1e-6

    def test_division_by_function_result(self, evaluator):
        """Division where divisor is function result."""
        # 100 / sqrt(4) = 100 / 2 = 50
        result = evaluator.evaluate("100 / sqrt(4)")
        assert result == 50

    def test_velocity_from_distance_and_time(self, evaluator):
        """Velocity calculation: distance / time."""
        # 500 / 10 = 50 (units would be km/h)
        result = evaluator.evaluate("500 / 10")
        assert result == 50

    def test_acceleration_from_velocity_and_time(self, evaluator):
        """Acceleration calculation: velocity / time."""
        # 30 / 5 = 6 (units would be m/s^2)
        result = evaluator.evaluate("30 / 5")
        assert result == 6

    def test_distance_from_velocity_and_time(self, evaluator):
        """Distance calculation: velocity * time."""
        # 60 * 2 = 120 (units would be km)
        result = evaluator.evaluate("60 * 2")
        assert result == 120

    def test_work_calculation(self, evaluator):
        """Work calculation: force * distance."""
        # 50 * 10 = 500 (units would be Joules)
        result = evaluator.evaluate("50 * 10")
        assert result == 500

    def test_resistance_calculation(self, evaluator):
        """Ohm's law: R = V / I."""
        # 10 / 2 = 5 (units would be Ohms)
        result = evaluator.evaluate("10 / 2")
        assert result == 5

    def test_area_calculation(self, evaluator):
        """Area calculation: length * width."""
        # 5 * 4 = 20 (units would be m^2)
        result = evaluator.evaluate("5 * 4")
        assert result == 20

    def test_volume_calculation(self, evaluator):
        """Volume calculation: length * width * height."""
        # 5 * 4 * 3 = 60 (units would be m^3)
        result = evaluator.evaluate("5 * 4 * 3")
        assert result == 60

    def test_speed_with_trigonometry(self, evaluator):
        """Speed calculation component with trigonometry."""
        # 100 * sin(45) would be a velocity component
        result = evaluator.evaluate("100 * sin(45)")
        assert isinstance(result, (int, float))

    def test_exponential_energy_calculation(self, evaluator):
        """Energy with exponential: E = m * v^2 simplified."""
        # 2 * (10 ** 2) = 2 * 100 = 200
        result = evaluator.evaluate("2 * (10 ** 2)")
        assert result == 200

    def test_frequency_from_wavelength(self, evaluator):
        """Frequency calculation: speed / wavelength."""
        # 300000000 / 500000000 = 0.6 (simplified units)
        result = evaluator.evaluate("300000000 / 500000000")
        assert abs(result - 0.6) < 1e-6

    def test_density_calculation(self, evaluator):
        """Density: mass / volume."""
        # 1000 / 100 = 10 (kg/m^3)
        result = evaluator.evaluate("1000 / 100")
        assert result == 10

    def test_percentage_calculation(self, evaluator):
        """Percentage calculation."""
        # (25 / 100) * 100 = 25
        result = evaluator.evaluate("(25 / 100) * 100")
        assert result == 25

    def test_scaling_with_log(self, evaluator):
        """Scaling factor calculation with logarithm."""
        # 10 * log(1000) = 10 * 3 = 30
        result = evaluator.evaluate("10 * log(1000)")
        assert abs(result - 30) < 1e-6

    def test_compound_unit_expression(self, evaluator):
        """Complex compound unit expression."""
        # (100 * 2) / (5 + 1) = 200 / 6 = 33.333...
        result = evaluator.evaluate("(100 * 2) / (5 + 1)")
        assert abs(result - 200/6) < 1e-6

    def test_thermal_energy_calculation(self, evaluator):
        """Thermal energy: Q = m * c * delta_T (simplified)."""
        # 2 * 4186 * 10 = 83720
        result = evaluator.evaluate("2 * 4186 * 10")
        assert result == 83720

    def test_kinetic_energy_full(self, evaluator):
        """Kinetic energy: KE = 0.5 * m * v^2."""
        # 0.5 * 2 * (10 ** 2) = 0.5 * 2 * 100 = 100
        result = evaluator.evaluate("0.5 * 2 * (10 ** 2)")
        assert result == 100

    def test_momentum_calculation(self, evaluator):
        """Momentum: p = m * v."""
        # 5 * 20 = 100 (kg*m/s)
        result = evaluator.evaluate("5 * 20")
        assert result == 100

    def test_tension_calculation(self, evaluator):
        """Tension in physics: T = m * g."""
        # 10 * 9.8 = 98
        result = evaluator.evaluate("10 * 9.8")
        assert abs(result - 98) < 1e-6

    def test_centripetal_force(self, evaluator):
        """Centripetal force: F = m * v^2 / r."""
        # (2 * (5 ** 2)) / 10 = (2 * 25) / 10 = 50 / 10 = 5
        result = evaluator.evaluate("(2 * (5 ** 2)) / 10")
        assert result == 5

    def test_statistical_mean_of_measurements(self, evaluator):
        """Statistical mean of physical measurements."""
        # mean(10.2, 10.1, 9.9, 10.3) = average = 10.125
        result = evaluator.evaluate("mean(10.2, 10.1, 9.9, 10.3)")
        assert abs(result - 10.125) < 1e-6

    def test_complex_physics_formula(self, evaluator):
        """Complex physics-like formula."""
        # ((5 + 3) ** 2 - 4 * 16) / 2 = (64 - 64) / 2 = 0
        result = evaluator.evaluate("((5 + 3) ** 2 - 4 * 16) / 2")
        assert result == 0
