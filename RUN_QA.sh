#!/bin/bash

echo "========================================"
echo "Studio Nexora Comet - QA Runner"
echo "========================================"
echo ""

echo "Running full E2E test suite..."
npm run test:e2e:full

echo ""
echo "========================================"
echo "QA Tests Complete!"
echo "========================================"
echo ""
echo "Reports available in: cypress/reports/html/"
echo ""

