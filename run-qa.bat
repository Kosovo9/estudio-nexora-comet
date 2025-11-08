@echo off
REM Studio Nexora Comet - QA Runner Script (Windows)
REM Multi-platform QA test runner with report generation

echo 🚀 Starting Studio Nexora Comet QA Tests...
echo ==========================================

REM Run full E2E tests
echo 📊 Running E2E tests...
call npm run test:e2e:full

REM Generate report
echo 📄 Generating QA report...
call npm run test:report

REM Open report
echo 📂 Opening report...
start ./cypress/reports/html/mochawesome.html

echo ✅ QA Tests completed!
echo 📊 Report available at: ./cypress/reports/html/mochawesome.html
pause

