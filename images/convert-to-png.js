const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const mermaidFiles = [
  { file: '01-why-you-cant-stop-scrolling.mmd', title: 'Why You Can\'t Stop Scrolling' },
  { file: '02-how-content-becomes-viral.mmd', title: 'How Content Becomes Viral' },
  { file: '03-attention-economy-survival-guide.mmd', title: 'Your Attention Economy Survival Guide' },
  { file: '04-twitter-algorithm-dating-simulator.mmd', title: 'Twitter Algorithm Dating Simulator' },
  { file: '05-social-media-vs-productivity.mmd', title: 'Social Media vs. Your Productivity' }
];

async function convertMermaidToPNG() {
  console.log('🚀 Starting mermaid to PNG conversion...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to 1080x1080 for social media optimization
  await page.setViewport({ width: 1080, height: 1080 });

  for (const { file, title } of mermaidFiles) {
    console.log(`📊 Converting ${title}...`);

    const mermaidContent = fs.readFileSync(file, 'utf8');
    const pngFile = file.replace('.mmd', '.png');

    // Create HTML with mermaid content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 40px;
      background: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 30px;
      text-align: center;
      line-height: 1.3;
    }
    .subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 40px;
      text-align: center;
      max-width: 800px;
    }
    .mermaid-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      padding: 30px;
      width: 100%;
      max-width: 1000px;
    }
    .mermaid {
      background: white;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
</head>
<body>
  <div class="title">${title}</div>
  <div class="subtitle">The psychological tricks that keep you scrolling</div>
  <div class="mermaid-container">
    <div class="mermaid">
${mermaidContent}
    </div>
  </div>
  <div class="footer">
    Algorithm Exposed • X Algorithm for Noobs
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
        tertiaryColor: '#e9ecef',
        clusterBkg: 'white',
        clusterBorder: '#007bff',
        titleColor: '#333333',
        edgeLabelBackground: 'white',
        fontSize: '14px',
        nodeTextColor: '#333333',
        mainBkg: 'white',
        secondBkg: '#f8f9fa',
        lineColor: '#666666',
        tertiaryTextColor: '#666666'
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis'
      }
    });
  </script>
</body>
</html>`;

    // Set page content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Wait for mermaid to render
    await page.waitForSelector('.mermaid', { visible: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take screenshot
    await page.screenshot({
      path: pngFile,
      type: 'png',
      quality: 100,
      fullPage: true
    });

    console.log(`✅ Created ${pngFile}`);
  }

  await browser.close();
  console.log('\n🎉 All conversions completed!');
  console.log('📁 PNG files are ready for social media sharing');
}

// Run the conversion
convertMermaidToPNG().catch(console.error);