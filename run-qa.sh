#!/bin/bash

# Studio Nexora Comet - QA Runner Script
# Multi-platform QA test runner with report generation

echo "🚀 Starting Studio Nexora Comet QA Tests..."
echo "=========================================="

# Run full E2E tests
echo "📊 Running E2E tests..."
npm run test:e2e:full

# Generate report
echo "📄 Generating QA report..."
npm run test:report

# Open report based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "📂 Opening report on macOS..."
    open ./cypress/reports/html/mochawesome.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "📂 Opening report on Linux..."
    xdg-open ./cypress/reports/html/mochawesome.html
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash)
    echo "📂 Opening report on Windows..."
    start ./cypress/reports/html/mochawesome.html
fi

echo "✅ QA Tests completed!"
echo "📊 Report available at: ./cypress/reports/html/mochawesome.html"

