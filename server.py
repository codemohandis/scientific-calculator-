#!/usr/bin/env python3
"""
Flask API server for the Scientific Calculator
Serves REST API endpoints for calculations
Runs on port 8000, Vite dev server (port 5173) proxies /api/* requests to this server
"""

import sys
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from scientific_calculator.api import (
    evaluate_expression,
    convert_units,
    list_units,
    list_functions,
    evaluate_function,
)

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# API Routes
# Note: Vite proxy rewrites /api/* to /* so routes don't include /api prefix

@app.route('/convert', methods=['POST'])
def api_convert():
    """Convert units endpoint"""
    try:
        data = request.get_json()
        value = data.get('value')
        from_unit = data.get('from_unit')
        to_unit = data.get('to_unit')

        if value is None or from_unit is None or to_unit is None:
            return jsonify({'error': 'Missing required fields: value, from_unit, to_unit'}), 400

        result = convert_units(value, from_unit, to_unit)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/evaluate', methods=['POST'])
def api_evaluate():
    """Evaluate expression endpoint"""
    try:
        data = request.get_json()
        expression = data.get('expression')
        context = data.get('context', {})

        if not expression:
            return jsonify({'error': 'Missing required field: expression'}), 400

        result = evaluate_expression(expression, context)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/functions', methods=['GET'])
def api_functions():
    """Get list of available functions"""
    try:
        result = list_functions()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/functions', methods=['POST'])
def api_evaluate_function():
    """Evaluate a function endpoint"""
    try:
        data = request.get_json()
        function_name = data.get('function')
        arguments = data.get('arguments', [])

        if not function_name:
            return jsonify({'error': 'Missing required field: function'}), 400

        result = evaluate_function(function_name, arguments)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/units', methods=['GET'])
def api_units():
    """Get list of available units"""
    try:
        result = list_units()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'API server is running'}), 200

if __name__ == '__main__':
    print("\n" + "="*70)
    print("  Scientific Calculator API Server")
    print("="*70)
    print("\nServer starting on http://localhost:8000/")
    print("\nAPI Endpoints (proxied via Vite from /api/*):")
    print("  POST /api/convert    -> /convert      - Convert between units")
    print("  POST /api/evaluate   -> /evaluate     - Evaluate mathematical expressions")
    print("  GET  /api/functions  -> /functions    - List available functions")
    print("  POST /api/functions  -> /functions    - Evaluate a function")
    print("  GET  /api/units      -> /units        - List available units")
    print("  GET  /api/health     -> /health       - Health check")
    print("\nFrontend:")
    print("  Access via http://localhost:5173/ (Vite dev server)")
    print("  Vite will automatically proxy /api/* requests to http://localhost:8000/*")
    print("\nTo use the calculator:")
    print("  1. Keep this API server running (localhost:8000)")
    print("  2. Frontend is already running on localhost:5173")
    print("  3. Open http://localhost:5173 in your browser")
    print("\n" + "="*70 + "\n")

    app.run(debug=True, port=8000, host='127.0.0.1')
