"""
Unit tests for statistical functions.

Tests mean, median, mode, standard deviation, and variance calculations.
"""

import pytest

from src.scientific_calculator.functions import mean, median, mode, stdev, variance
from src.scientific_calculator.exceptions import DomainError


class TestMeanFunction:
    """Test arithmetic mean function."""

    def test_mean_single_value(self) -> None:
        """Test mean([5]) = 5."""
        result = mean([5])
        assert abs(result - 5) < 1e-6

    def test_mean_two_values(self) -> None:
        """Test mean([2, 4]) = 3."""
        result = mean([2, 4])
        assert abs(result - 3) < 1e-6

    def test_mean_basic_list(self) -> None:
        """Test mean([1, 2, 3, 4, 5]) = 3."""
        result = mean([1, 2, 3, 4, 5])
        assert abs(result - 3) < 1e-6

    def test_mean_decimals(self) -> None:
        """Test mean([1.5, 2.5, 3.5]) = 2.5."""
        result = mean([1.5, 2.5, 3.5])
        assert abs(result - 2.5) < 1e-6

    def test_mean_negative_numbers(self) -> None:
        """Test mean([-2, -1, 0, 1, 2]) = 0."""
        result = mean([-2, -1, 0, 1, 2])
        assert abs(result - 0) < 1e-6

    def test_mean_mixed_positive_negative(self) -> None:
        """Test mean([-10, 10]) = 0."""
        result = mean([-10, 10])
        assert abs(result - 0) < 1e-6

    def test_mean_large_dataset(self) -> None:
        """Test mean of 1000 values."""
        data = list(range(1, 1001))
        result = mean(data)
        assert abs(result - 500.5) < 1e-6


class TestMedianFunction:
    """Test median function."""

    def test_median_single_value(self) -> None:
        """Test median([5]) = 5."""
        result = median([5])
        assert abs(result - 5) < 1e-6

    def test_median_odd_length_list(self) -> None:
        """Test median([1, 3, 5]) = 3."""
        result = median([1, 3, 5])
        assert abs(result - 3) < 1e-6

    def test_median_even_length_list(self) -> None:
        """Test median([1, 2, 3, 4]) = 2.5."""
        result = median([1, 2, 3, 4])
        assert abs(result - 2.5) < 1e-6

    def test_median_unsorted_list(self) -> None:
        """Test median([3, 1, 4, 1, 5, 9]) = 3.5."""
        result = median([3, 1, 4, 1, 5, 9])
        assert abs(result - 3.5) < 1e-6

    def test_median_negative_numbers(self) -> None:
        """Test median([-5, -3, 0, 3, 5]) = 0."""
        result = median([-5, -3, 0, 3, 5])
        assert abs(result - 0) < 1e-6

    def test_median_decimals(self) -> None:
        """Test median([0.5, 1.5, 2.5]) = 1.5."""
        result = median([0.5, 1.5, 2.5])
        assert abs(result - 1.5) < 1e-6

    def test_median_with_duplicates(self) -> None:
        """Test median([1, 2, 2, 2, 3]) = 2."""
        result = median([1, 2, 2, 2, 3])
        assert abs(result - 2) < 1e-6


class TestModeFunction:
    """Test mode (most frequent value) function."""

    def test_mode_single_value(self) -> None:
        """Test mode([5]) = 5."""
        result = mode([5])
        assert result == 5

    def test_mode_clear_mode(self) -> None:
        """Test mode([1, 2, 2, 3]) = 2."""
        result = mode([1, 2, 2, 3])
        assert result == 2

    def test_mode_multiple_occurrences(self) -> None:
        """Test mode([1, 1, 2, 2, 3]) returns one of the modes."""
        result = mode([1, 1, 2, 2, 3])
        assert result in [1, 2]  # Either is acceptable

    def test_mode_all_same(self) -> None:
        """Test mode([5, 5, 5, 5]) = 5."""
        result = mode([5, 5, 5, 5])
        assert result == 5

    def test_mode_with_negative(self) -> None:
        """Test mode([-1, -1, 0, 1]) = -1."""
        result = mode([-1, -1, 0, 1])
        assert result == -1

    def test_mode_with_decimals(self) -> None:
        """Test mode([1.5, 1.5, 2.5]) = 1.5."""
        result = mode([1.5, 1.5, 2.5])
        assert abs(result - 1.5) < 1e-6

    def test_mode_no_mode(self) -> None:
        """Test mode([1, 2, 3, 4]) with all unique values."""
        result = mode([1, 2, 3, 4])
        # Should return first/most common, or raise error
        assert result in [1, 2, 3, 4]


class TestStandardDeviationFunction:
    """Test sample standard deviation function."""

    def test_stdev_single_value_fails(self) -> None:
        """Test stdev([5]) requires at least 2 values."""
        with pytest.raises(DomainError):
            stdev([5])

    def test_stdev_two_values(self) -> None:
        """Test stdev([1, 3]) = sqrt(2) ≈ 1.414."""
        result = stdev([1, 3])
        expected = ((1 - 2)**2 + (3 - 2)**2) / 1  # n-1
        assert abs(result - (expected**0.5)) < 1e-6

    def test_stdev_identical_values(self) -> None:
        """Test stdev([5, 5, 5]) = 0."""
        result = stdev([5, 5, 5])
        assert abs(result - 0) < 1e-6

    def test_stdev_basic_dataset(self) -> None:
        """Test stdev([1, 2, 3, 4, 5]) ≈ 1.581."""
        result = stdev([1, 2, 3, 4, 5])
        mean_val = 3
        variance_val = ((1-3)**2 + (2-3)**2 + (3-3)**2 + (4-3)**2 + (5-3)**2) / 4
        expected = variance_val ** 0.5
        assert abs(result - expected) < 1e-6

    def test_stdev_negative_numbers(self) -> None:
        """Test stdev([-5, -3, -1]) ≈ 2."""
        result = stdev([-5, -3, -1])
        mean_val = -3
        variance_val = ((-5-(-3))**2 + (-3-(-3))**2 + (-1-(-3))**2) / 2
        expected = variance_val ** 0.5
        assert abs(result - expected) < 1e-6

    def test_stdev_large_spread(self) -> None:
        """Test stdev([0, 100]) ≈ 70.711."""
        result = stdev([0, 100])
        expected = 50  # ((0-50)^2 + (100-50)^2) / 1 = 5000, sqrt = 70.7
        assert abs(result - (5000**0.5)) < 1e-4


class TestVarianceFunction:
    """Test sample variance function."""

    def test_variance_single_value_fails(self) -> None:
        """Test variance([5]) requires at least 2 values."""
        with pytest.raises(DomainError):
            variance([5])

    def test_variance_two_values(self) -> None:
        """Test variance([1, 3]) = 2."""
        result = variance([1, 3])
        expected = ((1-2)**2 + (3-2)**2) / 1  # n-1
        assert abs(result - expected) < 1e-6

    def test_variance_identical_values(self) -> None:
        """Test variance([5, 5, 5]) = 0."""
        result = variance([5, 5, 5])
        assert abs(result - 0) < 1e-6

    def test_variance_basic_dataset(self) -> None:
        """Test variance([1, 2, 3, 4, 5]) = 2.5."""
        result = variance([1, 2, 3, 4, 5])
        mean_val = 3
        expected = ((1-3)**2 + (2-3)**2 + (3-3)**2 + (4-3)**2 + (5-3)**2) / 4
        assert abs(result - expected) < 1e-6

    def test_variance_negative_numbers(self) -> None:
        """Test variance([-5, -3, -1])."""
        result = variance([-5, -3, -1])
        mean_val = -3
        expected = ((-5-(-3))**2 + (-3-(-3))**2 + (-1-(-3))**2) / 2
        assert abs(result - expected) < 1e-6

    def test_variance_decimal_values(self) -> None:
        """Test variance([1.5, 2.5, 3.5])."""
        result = variance([1.5, 2.5, 3.5])
        mean_val = 2.5
        expected = ((1.5-2.5)**2 + (2.5-2.5)**2 + (3.5-2.5)**2) / 2
        assert abs(result - expected) < 1e-6


class TestStatisticalRelationships:
    """Test relationships between statistical functions."""

    def test_variance_equals_stdev_squared(self) -> None:
        """Test variance(x) = stdev(x)^2."""
        data = [1, 2, 3, 4, 5]
        var = variance(data)
        std = stdev(data)
        assert abs(var - std**2) < 1e-6

    def test_mean_of_identical_equals_value(self) -> None:
        """Test mean([x, x, x]) = x."""
        x = 3.14
        result = mean([x, x, x])
        assert abs(result - x) < 1e-6

    def test_median_vs_mean(self) -> None:
        """Test median and mean on symmetric dataset."""
        data = [1, 2, 3, 4, 5]
        m = mean(data)
        med = median(data)
        assert abs(m - med) < 1e-6  # Should be equal for symmetric

    def test_statistical_functions_with_large_dataset(self) -> None:
        """Test statistical functions on large dataset."""
        data = list(range(1, 1001))
        m = mean(data)
        med = median(data)
        var = variance(data)
        std = stdev(data)

        assert abs(m - 500.5) < 1e-6
        assert abs(med - 500.5) < 1e-6
        assert var > 0
        assert std > 0
        assert abs(var - std**2) < 1e-6
