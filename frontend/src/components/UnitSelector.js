/**
 * UnitSelector component for selecting conversion units.
 *
 * Provides a grouped dropdown for unit selection with search capability.
 */

/**
 * Unit categories and their units
 */
const UNIT_CATEGORIES = {
    'Distance': {
        units: ['meter', 'kilometer', 'mile', 'foot', 'inch', 'yard', 'centimeter', 'millimeter'],
        symbols: {
            'meter': 'm',
            'kilometer': 'km',
            'mile': 'mi',
            'foot': 'ft',
            'inch': 'in',
            'yard': 'yd',
            'centimeter': 'cm',
            'millimeter': 'mm',
        },
    },
    'Mass': {
        units: ['kilogram', 'gram', 'pound', 'ounce', 'ton', 'milligram'],
        symbols: {
            'kilogram': 'kg',
            'gram': 'g',
            'pound': 'lb',
            'ounce': 'oz',
            'ton': 't',
            'milligram': 'mg',
        },
    },
    'Temperature': {
        units: ['celsius', 'fahrenheit', 'kelvin'],
        symbols: {
            'celsius': '°C',
            'fahrenheit': '°F',
            'kelvin': 'K',
        },
    },
    'Volume': {
        units: ['liter', 'milliliter', 'gallon', 'quart', 'pint', 'cup'],
        symbols: {
            'liter': 'L',
            'milliliter': 'mL',
            'gallon': 'gal',
            'quart': 'qt',
            'pint': 'pt',
            'cup': 'cup',
        },
    },
};

/**
 * Create a unit selector with search
 * @param {string} id - The element ID
 * @param {string} label - The label text
 * @returns {HTMLElement} The unit selector container
 */
function createUnitSelector(id, label) {
    const container = document.createElement('div');
    container.className = 'unit-selector-container';

    // Label
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.className = 'form-label';
    labelElement.textContent = label;

    // Select element
    const select = document.createElement('select');
    select.id = id;
    select.className = 'form-input unit-selector';
    select.setAttribute('aria-label', label);

    // Populate with units
    populateUnitSelector(select);

    // Container for elements
    container.appendChild(labelElement);
    container.appendChild(select);

    return container;
}

/**
 * Populate a unit selector with units grouped by category
 * @param {HTMLSelectElement} selectElement - The select element to populate
 */
function populateUnitSelector(selectElement) {
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select a unit --';
    defaultOption.disabled = true;
    selectElement.appendChild(defaultOption);

    // Add units grouped by category
    for (const [category, data] of Object.entries(UNIT_CATEGORIES)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;

        data.units.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;

            // Format display text with symbol
            const symbol = data.symbols[unit] || unit;
            option.textContent = `${capitalize(unit)} (${symbol})`;
            option.setAttribute('data-symbol', symbol);
            optgroup.appendChild(option);
        });

        selectElement.appendChild(optgroup);
    }

    // Set default selections
    if (selectElement.id === 'from-unit') {
        selectElement.value = 'kilometer';
    } else if (selectElement.id === 'to-unit') {
        selectElement.value = 'mile';
    }
}

/**
 * Get all available units
 * @returns {Array<string>} Array of unit names
 */
function getAllUnits() {
    const units = [];
    for (const data of Object.values(UNIT_CATEGORIES)) {
        units.push(...data.units);
    }
    return units;
}

/**
 * Get units by category
 * @param {string} category - The category name
 * @returns {Array<string>} Array of units in that category
 */
function getUnitsByCategory(category) {
    return UNIT_CATEGORIES[category]?.units || [];
}

/**
 * Get the symbol for a unit
 * @param {string} unit - The unit name
 * @returns {string} The unit symbol
 */
function getUnitSymbol(unit) {
    for (const data of Object.values(UNIT_CATEGORIES)) {
        if (data.symbols[unit]) {
            return data.symbols[unit];
        }
    }
    return unit;
}

/**
 * Check if two units are in the same category
 * @param {string} unit1 - First unit
 * @param {string} unit2 - Second unit
 * @returns {boolean} True if units are in the same category
 */
function areSameCategory(unit1, unit2) {
    for (const data of Object.values(UNIT_CATEGORIES)) {
        const hasUnit1 = data.units.includes(unit1);
        const hasUnit2 = data.units.includes(unit2);
        if (hasUnit1 && hasUnit2) return true;
    }
    return false;
}

/**
 * Capitalize a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UNIT_CATEGORIES,
        createUnitSelector,
        populateUnitSelector,
        getAllUnits,
        getUnitsByCategory,
        getUnitSymbol,
        areSameCategory,
        capitalize,
    };
}
