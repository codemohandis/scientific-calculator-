# Scientific Calculator 🧮

A powerful, production-ready scientific calculator web application built with React, Vite, and Flask. Features a modern responsive UI, comprehensive mathematical functions, and an RESTful API ready for monetization.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)

> **Perfect for:** Students, Engineers, Data Scientists, Businesses, and Developers

## ✨ Features

### 🧮 Core Calculators
- **Unit Conversions**: 50+ units across distance, mass, temperature, volume, and more
- **Scientific Functions**: Trigonometric, logarithmic, exponential, and statistical functions
- **Expression Evaluator**: Advanced mathematical expression parsing with full operator support
- **Copy to Clipboard**: Quick results sharing and data export
- **Responsive Design**: Works seamlessly on Mobile, Tablet, and Desktop

### 🔧 Technical Features
- ⚡ **Fast Computation**: <100ms for most operations
- 🔒 **Secure**: Safe expression evaluation, no `eval()`
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 📱 **Mobile Optimized**: Responsive multi-column layout
- 🎨 **Modern UI**: Clean, intuitive interface
- 📊 **Production Ready**: Error handling, validation, logging
- 💾 **Stateless API**: RESTful endpoints for easy integration

## Project Structure

```
scientific-calculator/
├── src/
│   └── scientific_calculator/
│       ├── __init__.py              # Package initialization
│       ├── expression_evaluator.py  # AST-based expression evaluator
│       ├── units.py                 # Pint integration and unit registry
│       ├── functions.py             # Scientific function registry
│       ├── exceptions.py            # Custom exception classes
│       └── api.py                   # REST/GraphQL API layer
├── frontend/
│   ├── index.html                   # Entry point
│   ├── src/
│   │   ├── main.js                  # Application entry
│   │   ├── components/              # UI components
│   │   ├── styles/                  # CSS with accessibility focus
│   │   ├── services/                # API client
│   │   └── utils/                   # Utilities and helpers
│   └── tests/
│       ├── unit/                    # Component unit tests
│       └── accessibility/           # WCAG 2.1 AA compliance tests
├── tests/
│   ├── unit/                        # Backend unit tests
│   ├── integration/                 # Integration tests
│   └── conftest.py                  # Pytest configuration and fixtures
├── pyproject.toml                   # Python project configuration
├── frontend/package.json            # Node.js dependencies
└── README.md                        # This file
```

## 💰 Monetization Ready

This calculator is built for commercial deployment:

- ✅ **Freemium Model**: Free tier with premium features
- ✅ **API Access**: Developer tier pricing
- ✅ **White-Label Ready**: Easy to customize branding
- ✅ **Analytics**: Ready for usage tracking and insights
- ✅ **User Accounts**: Built for authentication integration (Auth0)
- ✅ **Subscription Support**: Stripe-ready payment integration

**Recommended Revenue Model:**
- Free tier with ads
- Pro ($4.99/month): Unlimited saves, PDF export, no ads
- Business ($19.99/month): API access + team features

See [MONETIZATION.md](MONETIZATION.md) for detailed business plan.

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/codemohandis/scientific-calculator.git
cd scientific-calculator
```

2. **Backend Setup (Flask)**
```bash
# Install Python dependencies
pip install flask flask-cors

# Run Flask API server
python server.py
# API runs on http://localhost:8000
```

3. **Frontend Setup (React/Vite)**
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:5173
```

4. **Access the app**
```
http://localhost:5173
```

## Running Tests

### Backend Tests

```bash
# Run all backend tests
pytest

# Run with coverage
pytest --cov=src/scientific_calculator --cov-report=html

# Run specific test file
pytest tests/unit/test_conversions.py

# Run with verbose output
pytest -v
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run accessibility tests
npm run test:a11y

# Run with coverage
npm run test:coverage
```

## Code Quality

### Python Backend

```bash
# Format code with black
black src/ tests/

# Lint with ruff
ruff check src/ tests/

# Type check with mypy
mypy src/

# Run all checks
black src/ tests/ && ruff check src/ tests/ && mypy src/
```

### JavaScript Frontend

```bash
cd frontend

# Format code
npm run format

# Lint
npm run lint

# Check formatting
npm run format:check
```

## Development Workflow

### Test-Driven Development (TDD)

1. **Red**: Write a failing test that describes the desired behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Clean up the implementation while keeping tests passing

All features must follow TDD discipline:
- Write tests first
- Implement functionality
- Verify ≥85% test coverage
- Maintain type safety (mypy --strict)

### Accessibility Requirements

All UI components must:
- Follow WCAG 2.1 AA standards
- Include proper ARIA labels and roles
- Support keyboard navigation
- Maintain color contrast ratios (4.5:1 for normal text)
- Be testable with axe-core

### Type Safety

- 100% type hints required for Python code
- `mypy --strict` compliance mandatory
- No `Any` types without explicit justification

## Architecture

### Backend (Python)

The backend uses a custom AST-based expression evaluator integrated with Pint for unit-aware computation:

- **Expression Evaluator**: Safe evaluation using Python's `ast` module (no `eval()`)
- **Unit System**: Pint `UnitRegistry` for dimensional analysis
- **Function Registry**: Whitelisted mathematical and statistical functions
- **Error Handling**: Custom exception hierarchy with domain validation

### Frontend (JavaScript/HTML/CSS)

The frontend provides an accessible, responsive UI:

- **Components**: Reusable calculator, input, and results display components
- **Accessibility**: WCAG 2.1 AA compliance with ARIA labels and keyboard support
- **API Client**: Axios-based service for backend communication
- **Styling**: CSS with accessible color contrasts and responsive design

## API Reference

### Backend Endpoints

#### POST /api/evaluate
Evaluate an expression.

**Request:**
```json
{
  "expression": "5 km in miles"
}
```

**Response:**
```json
{
  "result": 3.10686,
  "unit": "miles",
  "error": null
}
```

#### GET /api/units
List available units.

**Response:**
```json
{
  "distance": ["km", "miles", "meter", "foot"],
  "mass": ["kg", "pounds", "gram"],
  "temperature": ["celsius", "fahrenheit", "kelvin"],
  "volume": ["liter", "gallon"],
  "derived": ["velocity", "force", "pressure", "energy", "power"]
}
```

#### GET /api/functions
List available functions.

**Response:**
```json
{
  "trigonometric": ["sin", "cos", "tan"],
  "logarithmic": ["log", "ln"],
  "exponential": ["exp", "pow"],
  "statistical": ["mean", "median", "stdev"]
}
```

## Performance Goals

- Expression evaluation: <100ms
- Typical case: <5ms
- UI response time: <200ms
- Memory footprint: <10MB

## Constitution

This project follows the Scientific Calculator Constitution (v1.1.0), which mandates:

1. **Type Safety (NON-NEGOTIABLE)**: All code must use explicit type hints with `mypy --strict`
2. **Test-First Development (NON-NEGOTIABLE)**: TDD discipline with ≥85% coverage
3. **Pure Functions & Immutability**: AST processing with no global state
4. **Explicit Error Handling**: Custom exception hierarchy with context
5. **UI/UX-First Design**: Responsive, accessible interface (WCAG 2.1 AA)
6. **Semantic Versioning**: Version tracking in `pyproject.toml`

## 📚 API Documentation

### Available Endpoints

#### Convert Units
```bash
POST /api/convert
Content-Type: application/json

{
  "value": 10,
  "from_unit": "kilometer",
  "to_unit": "mile"
}
```

#### Evaluate Expression
```bash
POST /api/evaluate
Content-Type: application/json

{
  "expression": "2 + 3 * 4"
}
```

#### Evaluate Function
```bash
POST /api/functions
Content-Type: application/json

{
  "function": "sin",
  "arguments": [30]
}
```

#### Get Available Units
```bash
GET /api/units
```

#### Get Available Functions
```bash
GET /api/functions
```

#### Health Check
```bash
GET /api/health
```

## 🌐 Deployment

### Deploy to Vercel (Frontend)
```bash
cd frontend
npm install
# Connect to Vercel and deploy automatically
```

### Deploy to Railway/Render (Backend)
1. Push code to GitHub
2. Connect repository to Railway or Render
3. Set Python version to 3.8+
4. Deploy automatically

**Hosting Cost Estimates:**
- Frontend (Vercel): FREE - $20/month
- Backend (Railway): FREE - $7/month
- Domain: $12/year
- **Total: ~$7-27/month**

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 👥 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/codemohandis/scientific-calculator/issues)
- **Email**: support@example.com
- **Author**: [Code Mohandis](https://github.com/codemohandis)

## 🙏 Acknowledgments

- Flask and React communities
- Pint for unit conversions
- Open source contributors

---

**Made with ❤️ by Code Mohandis**

⭐ If you find this useful, please star the repository!

💰 **Ready to monetize? Check out [MONETIZATION.md](MONETIZATION.md)**