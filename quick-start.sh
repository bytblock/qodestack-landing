#!/bin/bash

echo "🚀 Qodestack Landing Page - Quick Start"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

echo "🔧 Available commands:"
echo "  npm run dev   - Start development server"
echo "  npm run build - Build for production"
echo "  npm start     - Start production server"
echo ""

echo "📖 Documentation:"
echo "  README.md        - Full documentation"
echo "  DEPLOYMENT.md    - Deployment guide"
echo "  CHECKLIST.md     - Launch checklist"
echo "  SITE-OVERVIEW.md - Visual design overview"
echo ""

echo "🎯 Ready to start development?"
read -p "Run dev server now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting development server..."
    npm run dev
fi
