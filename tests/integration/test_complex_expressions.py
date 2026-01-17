"""
Integration tests for complex expression evaluation workflows.

Tests verify end-to-end complex expression parsing and evaluation,
including combinations of multiple features from Phase 5 (User Story 3).
"""

import pytest
import math
from scientific_calculator.api import evaluate_expression
from scientific_calculator.expression_evaluator import SafeExpressionEvaluator


class TestComplexExpressionWorkflows:
    """Test end-to-end complex expression workflows."""

    @pytest.fixture
    def evaluator(self):
        """Create evaluator instance."""
        return SafeExpressionEvaluator()

    def test_end_to_end_simple_expression(self):
        """Test simple expression through API."""
        result = evaluate_expression("2 + 3")
        assert result["error"] is None
        assert result["result"] == 5

    def test_end_to_end_complex_expression(self):
        """Test complex expression through API."""
        result = evaluate_expression("(2 + 3) * 4 - 5")
        assert result["error"] is None
        assert result["result"] == 15  # (5 * 4) - 5 = 20 - 5 = 15

    def test_end_to_end_with_functions(self):
        """Test expression with functions through API."""
        result = evaluate_expression("sin(90) + cos(0)")
        assert result["error"] is None
        assert abs(result["result"] - 2) < 1e-6

    def test_end_to_end_error_handling(self):
        """Test error handling through API."""
        result = evaluate_expression("1 / 0")
        assert result["error"] is not None
        assert result["result"] is None

    def test_physics_velocity_calculation(self, evaluator):
        """Complete velocity calculation: distance / time."""
        # 100 km / 2 hours = 50 km/h
        result = evaluator.evaluate("100 / 2")
        assert result == 50

    def test_physics_distance_calculation(self, evaluator):
        """Complete distance calculation: velocity * time."""
        # 60 km/h * 3 hours = 180 km
        result = evaluator.evaluate("60 * 3")
        assert result == 180

    def test_physics_acceleration_calculation(self, evaluator):
        """Complete acceleration calculation: (v_f - v_i) / t."""
        # (20 - 0) / 5 = 4 m/s^2
        result = evaluator.evaluate("(20 - 0) / 5")
        assert result == 4

    def test_physics_force_calculation(self, evaluator):
        """Complete force calculation: F = m * a."""
        # F = 10 kg * 5 m/s^2 = 50 N
        result = evaluator.evaluate("10 * 5")
        assert result == 50

    def test_physics_kinetic_energy(self, evaluator):
        """Complete kinetic energy: KE = 0.5 * m * v^2."""
        # KE = 0.5 * 2 * (10 ** 2) = 100 J
        result = evaluator.evaluate("0.5 * 2 * (10 ** 2)")
        assert result == 100

    def test_physics_potential_energy(self, evaluator):
        """Complete potential energy: PE = m * g * h."""
        # PE = 5 * 9.8 * 20 = 980 J
        result = evaluator.evaluate("5 * 9.8 * 20")
        assert abs(result - 980) < 0.01

    def test_physics_work_calculation(self, evaluator):
        """Complete work calculation: W = F * d."""
        # W = 100 N * 5 m = 500 J
        result = evaluator.evaluate("100 * 5")
        assert result == 500

    def test_physics_power_calculation(self, evaluator):
        """Complete power calculation: P = W / t."""
        # P = 500 J / 10 s = 50 W
        result = evaluator.evaluate("500 / 10")
        assert result == 50

    def test_physics_density_calculation(self, evaluator):
        """Complete density calculation: ρ = m / V."""
        # ρ = 1000 kg / 1 m^3 = 1000 kg/m^3
        result = evaluator.evaluate("1000 / 1")
        assert result == 1000

    def test_math_quadratic_formula(self, evaluator):
        """Quadratic formula component: b^2 - 4ac."""
        # For a=1, b=3, c=2: discriminant = 9 - 8 = 1
        result = evaluator.evaluate("3 ** 2 - 4 * 1 * 2")
        assert result == 1

    def test_math_triangle_pythagorean(self, evaluator):
        """Pythagorean theorem: c = sqrt(a^2 + b^2)."""
        # c = sqrt(3^2 + 4^2) = sqrt(25) = 5
        result = evaluator.evaluate("sqrt(3 ** 2 + 4 ** 2)")
        assert result == 5

    def test_math_triangle_area(self, evaluator):
        """Triangle area: A = 0.5 * base * height."""
        # A = 0.5 * 10 * 5 = 25
        result = evaluator.evaluate("0.5 * 10 * 5")
        assert result == 25

    def test_math_circle_area(self, evaluator):
        """Circle area: A = π * r^2."""
        # A = pi * 5^2 = pi * 25
        result = evaluator.evaluate("pi * 5 ** 2")
        assert abs(result - math.pi * 25) < 0.01

    def test_math_circle_circumference(self, evaluator):
        """Circle circumference: C = 2 * π * r."""
        # C = 2 * pi * 5
        result = evaluator.evaluate("2 * pi * 5")
        assert abs(result - 10 * math.pi) < 0.01

    def test_statistics_mean_of_data(self, evaluator):
        """Statistical mean calculation."""
        # mean(10, 20, 30, 40, 50) = 30
        result = evaluator.evaluate("mean(10, 20, 30, 40, 50)")
        assert result == 30

    def test_statistics_mean_in_expression(self, evaluator):
        """Statistical mean used in larger expression."""
        # mean(1, 2, 3) = 2, then 2 * 5 = 10
        result = evaluator.evaluate("mean(1, 2, 3) * 5")
        assert result == 10

    def test_temperature_conversion_calculation(self, evaluator):
        """Temperature conversion formula: C = (F - 32) * 5/9."""
        # 32°F = 0°C: (32 - 32) * 5/9 = 0
        result = evaluator.evaluate("(32 - 32) * 5 / 9")
        assert abs(result) < 1e-10

    def test_temperature_conversion_fahrenheit(self, evaluator):
        """Temperature conversion: 212°F to Celsius."""
        # (212 - 32) * 5/9 = 180 * 5/9 = 100°C
        result = evaluator.evaluate("(212 - 32) * 5 / 9")
        assert abs(result - 100) < 1e-6

    def test_percent_calculation(self, evaluator):
        """Percentage of total: (part / whole) * 100."""
        # 25 out of 100 = (25 / 100) * 100 = 25%
        result = evaluator.evaluate("(25 / 100) * 100")
        assert result == 25

    def test_percent_increase(self, evaluator):
        """Percent increase formula: ((new - old) / old) * 100."""
        # From 100 to 150: ((150 - 100) / 100) * 100 = 50%
        result = evaluator.evaluate("((150 - 100) / 100) * 100")
        assert result == 50

    def test_compound_interest_approximation(self, evaluator):
        """Compound interest approximation."""
        # A = P * (1 + r)^t, P=100, r=0.05, t=1: 100 * 1.05 = 105
        result = evaluator.evaluate("100 * (1 + 0.05) ** 1")
        assert abs(result - 105) < 0.01

    def test_resonance_frequency(self, evaluator):
        """Resonance frequency formula component."""
        # f = 1 / (2 * π * sqrt(L*C))
        # Simplified with L=1, C=1: 1 / (2 * pi * 1)
        result = evaluator.evaluate("1 / (2 * pi * 1)")
        assert abs(result - 1 / (2 * math.pi)) < 0.01

    def test_error_propagation_calculation(self, evaluator):
        """Error propagation in measurements."""
        # Total error = sqrt(err1^2 + err2^2)
        # = sqrt(0.1^2 + 0.2^2) = sqrt(0.05) ≈ 0.224
        result = evaluator.evaluate("sqrt(0.1 ** 2 + 0.2 ** 2)")
        assert abs(result - math.sqrt(0.05)) < 1e-6

    def test_scientific_notation_approximation(self, evaluator):
        """Large number calculation."""
        # 1.5 * 10^6 * 2 = 3 * 10^6 = 3000000
        result = evaluator.evaluate("1.5 * 10 ** 6 * 2")
        assert abs(result - 3000000) < 1

    def test_complex_nested_expression_api(self):
        """Complex nested expression through API."""
        result = evaluate_expression("(sin(30) + cos(0)) * sqrt(16) / 2")
        assert result["error"] is None
        assert isinstance(result["result"], (int, float))

    def test_error_in_complex_expression_api(self):
        """Error handling in complex expression through API."""
        result = evaluate_expression("(2 + 3) / (5 - 5)")
        assert result["error"] is not None
        assert "zero" in result["error"].lower() or "division" in result["error"].lower()

    def test_function_composition_workflow(self, evaluator):
        """Complete workflow with composed functions."""
        # sin(asin(0.5)) = 0.5
        result = evaluator.evaluate("sin(asin(0.5))")
        assert abs(result - 0.5) < 1e-6

    def test_trigonometric_identity(self, evaluator):
        """Test trigonometric identity: sin^2 + cos^2 = 1."""
        # (sin(45))^2 + (cos(45))^2 ≈ 1
        result = evaluator.evaluate("sin(45) ** 2 + cos(45) ** 2")
        assert abs(result - 1) < 1e-6

    def test_logarithm_property(self, evaluator):
        """Test logarithm property: log(a*b) = log(a) + log(b)."""
        # log(2 * 5) should equal log(2) + log(5)
        result1 = evaluator.evaluate("log(2 * 5)")
        result2 = evaluator.evaluate("log(2) + log(5)")
        assert abs(result1 - result2) < 1e-6

    def test_exponential_logarithm_inverse(self, evaluator):
        """Test that exp and ln are inverses: ln(e^x) = x."""
        # ln(e ** 2) = 2
        result = evaluator.evaluate("ln(e ** 2)")
        assert abs(result - 2) < 1e-6

    def test_product_of_reciprocals(self, evaluator):
        """Verify product of reciprocals equals 1."""
        # (5/3) * (3/5) = 1
        result = evaluator.evaluate("(5/3) * (3/5)")
        assert abs(result - 1) < 1e-6
