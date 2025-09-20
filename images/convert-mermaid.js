const fs = require('fs');
const path = require('path');

// Mermaid rendering using Node.js approach
const mermaidFiles = [
  '01-why-you-cant-stop-scrolling.mmd',
  '02-how-content-becomes-viral.mmd',
  '03-attention-economy-survival-guide.mmd',
  '04-twitter-algorithm-dating-simulator.mmd',
  '05-social-media-vs-productivity.mmd'
];

// Simple approach: Create HTML files that can be opened in browser to render as PNG
mermaidFiles.forEach(file => {
  const mermaidContent = fs.readFileSync(file, 'utf8');
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${file}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: white;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mermaid {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 20px;
      margin: 20px 0;
    }
    .title {
      text-align: center;
      color: #333;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .instructions {
      background: #f0f8ff;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      max-width: 800px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="title">${file.replace('.mmd', '').replace(/-/g, ' ').toUpperCase()}</div>
  <div class="mermaid">
${mermaidContent}
  </div>
  <div class="instructions">
    <h3>How to save as PNG:</h3>
    <p>1. Right-click on the diagram above</p>
    <p>2. Select "Save image as..." or take a screenshot</p>
    <p>3. Save as high-resolution PNG (1080x1080 recommended for social media)</p>
    <p>4. Use online tools like TinyPNG to optimize if needed</p>
  </div>

  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      themeVariables: {
        background: '#ffffff',
        primaryColor: '#007bff',
        primaryTextColor: '#333333',
        primaryBorderColor: '#0056b3',
        lineColor: '#666666',
        secondaryColor: '#f8f9fa',
        tertiaryColor: '#e9ecef'
      }
    });
  </script>
</body>
</html>`;

  const htmlFile = file.replace('.mmd', '.html');
  fs.writeFileSync(htmlFile, htmlContent);
  console.log(`Created ${htmlFile} - Open in browser to render diagram`);
});

console.log('\n🎯 Conversion Complete!');
console.log('📁 HTML files created in current directory');
console.log('🌐 Open each HTML file in a browser to render the mermaid diagram');
console.log('📸 Right-click and save as PNG for social media sharing');
console.log('🎨 Recommended size: 1080x1080 pixels for optimal social media display');