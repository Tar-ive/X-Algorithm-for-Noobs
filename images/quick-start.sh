#!/bin/bash

# 🚀 Viral Algorithm Flowcharts - Quick Start Script
# This script helps you quickly convert mermaid flowcharts to PNG images

echo "🎯 Viral Algorithm Flowcharts - Quick Start Guide"
echo "=================================================="

# Check if we're in the images directory
if [ ! -f "convert-mermaid.js" ]; then
    echo "❌ Error: Please run this script from the images/ directory"
    exit 1
fi

echo ""
echo "📁 Available Flowcharts:"
echo "1. Why You Can't Stop Scrolling"
echo "2. How Content Becomes Viral"
echo "3. Your Attention Economy Survival Guide"
echo "4. Twitter Algorithm Dating Simulator"
echo "5. Social Media vs. Your Productivity"
echo ""

# Method selection
echo "🔄 Available Conversion Methods:"
echo "1. Open HTML files in browser (Recommended)"
echo "2. Try automated conversion (experimental)"
echo "3. Show file list only"
echo ""

read -p "Select method (1-3): " method

case $method in
    1)
        echo "🌐 Opening HTML files in browser..."
        echo ""
        echo "📋 Instructions:"
        echo "1. Each HTML file will open in your default browser"
        echo "2. Wait for the diagram to render (2-3 seconds)"
        echo "3. Right-click on the diagram and select 'Save image as...'"
        echo "4. Save as PNG with 1080x1080 dimensions"
        echo ""
        echo "🎨 Starting browser..."

        # Try different browsers
        if command -v xdg-open &> /dev/null; then
            xdg-open 01-why-you-cant-stop-scrolling.html
            xdg-open 02-how-content-becomes-viral.html
            xdg-open 03-attention-economy-survival-guide.html
            xdg-open 04-twitter-algorithm-dating-simulator.html
            xdg-open 05-social-media-vs-productivity.html
        elif command -v google-chrome &> /dev/null; then
            google-chrome 01-why-you-cant-stop-scrolling.html &
            google-chrome 02-how-content-becomes-viral.html &
            google-chrome 03-attention-economy-survival-guide.html &
            google-chrome 04-twitter-algorithm-dating-simulator.html &
            google-chrome 05-social-media-vs-productivity.html &
        elif command -v firefox &> /dev/null; then
            firefox 01-why-you-cant-stop-scrolling.html &
            firefox 02-how-content-becomes-viral.html &
            firefox 03-attention-economy-survival-guide.html &
            firefox 04-twitter-algorithm-dating-simulator.html &
            firefox 05-social-media-vs-productivity.html &
        else
            echo "❌ No browser found. Please open HTML files manually:"
            echo "   - 01-why-you-cant-stop-scrolling.html"
            echo "   - 02-how-content-becomes-viral.html"
            echo "   - 03-attention-economy-survival-guide.html"
            echo "   - 04-twitter-algorithm-dating-simulator.html"
            echo "   - 05-social-media-vs-productivity.html"
        fi
        ;;
    2)
        echo "🤖 Attempting automated conversion..."
        echo "⚠️  Note: This may not work on all systems due to browser dependencies"
        echo ""

        # Check if Node.js is available
        if command -v node &> /dev/null; then
            echo "📦 Running conversion script..."
            node convert-to-png.js
        else
            echo "❌ Node.js not found. Please install Node.js first."
        fi
        ;;
    3)
        echo "📂 File Listing:"
        echo "================"
        ls -la *.mmd *.html *.js *.md 2>/dev/null | grep -v "^total"
        echo ""
        echo "📖 Documentation:"
        echo "- README-Image-Conversion-Guide.md - Detailed instructions"
        echo "- conversion-summary-report.md - Technical summary"
        ;;
    *)
        echo "❌ Invalid selection. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Quick start complete!"
echo ""
echo "📚 Additional Resources:"
echo "- README-Image-Conversion-Guide.md - Complete manual"
echo "- conversion-summary-report.md - Project summary"
echo ""
echo "🎯 Next Steps:"
echo "1. Convert flowcharts to PNG images"
echo "2. Optimize for social media (1080x1080)"
echo "3. Share on your preferred platforms"
echo ""
echo "🔗 For online conversion, visit:"
echo "- https://mermaid.live/"
echo "- https://mermaid.ink/"
echo ""