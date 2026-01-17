/**
 * Main entry point for the Scientific Calculator frontend application.
 * Initializes the calculator application when the DOM is ready.
 *
 * Layout: Unified multi-column grid layout showing all calculators simultaneously
 * Replaces previous tab-based navigation with responsive CSS Grid
 */

import { createConversionForm } from './components/ConversionForm.js';
import { createFunctionInput } from './components/FunctionInput.js';
import { createExpressionInput } from './components/ExpressionInput.js';
import { createCalculatorLayout } from './components/CalculatorLayout.js';
import { createCalculatorSection } from './components/CalculatorSection.js';

// Initialize the calculator application
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('calculator-app');
    if (app) {
        // Create main calculator layout (CSS Grid container)
        const layout = createCalculatorLayout();

        // Create and append calculator sections
        // Section 1: Unit Conversions
        const conversionSection = createCalculatorSection(
            'Unit Conversions',
            createConversionForm()
        );
        layout.appendChild(conversionSection);

        // Section 2: Scientific Functions
        const functionSection = createCalculatorSection(
            'Scientific Functions',
            createFunctionInput()
        );
        layout.appendChild(functionSection);

        // Section 3: Expression Evaluator
        const expressionSection = createCalculatorSection(
            'Expression Evaluator',
            createExpressionInput()
        );
        layout.appendChild(expressionSection);

        // Append layout to app container
        app.appendChild(layout);

        console.log('Scientific Calculator initialized with unified multi-column layout');
        console.log('Layout: Mobile (1 col) → Tablet (2 cols) → Desktop (3 cols)');
    }
});
