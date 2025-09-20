// Figma Automation Script for X Algorithm Architecture Diagram
// This script automatically generates the architecture diagram in Figma

// ======================
// CONFIGURATION
// ======================

const config = {
  // Canvas settings
  canvasWidth: 1920,
  canvasHeight: 1080,
  padding: 50,

  // Component dimensions
  boxWidth: 200,
  boxHeight: 80,
  cornerRadius: 12,
  spacing: 20,

  // Layer colors
  colors: {
    client: '#E3F2FD',
    api: '#FFFFFF',
    product: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    mixer: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    ml: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    data: '#F5F5F5'
  },

  // Typography
  fonts: {
    title: { family: 'Inter', size: 18, weight: 700 },
    component: { family: 'Inter', size: 14, weight: 500 },
    layer: { family: 'Inter', size: 16, weight: 600 }
  }
};

// ======================
// ARCHITECTURE DATA
// ======================

const architecture = {
  layers: [
    {
      name: "Client Layer",
      color: "client",
      components: [
        { name: "Twitter App/Web", id: "twitter-app" },
        { name: "Mobile Clients", id: "mobile-clients" }
      ],
      position: { x: 50, y: 50 }
    },
    {
      name: "API Layer",
      color: "api",
      components: [
        { name: "HTTP Controller", id: "http-controller" },
        { name: "Thrift Controller", id: "thrift-controller" }
      ],
      position: { x: 400, y: 50 }
    },
    {
      name: "Product Pipeline Layer",
      color: "product",
      components: [
        { name: "ForYou Pipeline", id: "foryou-pipeline" },
        { name: "Following Pipeline", id: "following-pipeline" },
        { name: "ListTweets Pipeline", id: "listtweets-pipeline" }
      ],
      position: { x: 50, y: 200 }
    },
    {
      name: "Mixer Pipeline Layer",
      color: "mixer",
      components: [
        { name: "ForYou Mixer", id: "foryou-mixer" },
        { name: "Following Mixer", id: "following-mixer" },
        { name: "ListTweets Mixer", id: "listtweets-mixer" }
      ],
      position: { x: 400, y: 200 }
    },
    {
      name: "Candidate Sources",
      color: "data",
      components: [
        { name: "Earlybird Search", id: "earlybird-search" },
        { name: "Tweet Mixer", id: "tweet-mixer" },
        { name: "FRS Service", id: "frs-service" },
        { name: "User Entity Graph", id: "user-entity-graph" },
        { name: "RealTime Graph", id: "realtime-graph" },
        { name: "Timeline Service", id: "timeline-service" },
        { name: "Ads Service", id: "ads-service" }
      ],
      position: { x: 750, y: 50 }
    },
    {
      name: "ML & Feature Layer",
      color: "ml",
      components: [
        { name: "Feature Store", id: "feature-store" },
        { name: "ML Models", id: "ml-models" },
        { name: "Scoring Pipelines", id: "scoring-pipelines" },
        { name: "Feature Hydrators", id: "feature-hydrators" }
      ],
      position: { x: 1100, y: 50 }
    },
    {
      name: "Data Sources",
      color: "data",
      components: [
        { name: "Search Index", id: "search-index" },
        { name: "User Graph", id: "user-graph" },
        { name: "Engagement Data", id: "engagement-data" },
        { name: "RealTime Signals", id: "realtime-signals" },
        { name: "Cache Stores", id: "cache-stores" }
      ],
      position: { x: 1100, y: 350 }
    }
  ],

  connections: [
    // Client to API
    { from: "twitter-app", to: "http-controller" },
    { from: "mobile-clients", to: "http-controller" },

    // API to Product Pipelines
    { from: "http-controller", to: "foryou-pipeline" },
    { from: "http-controller", to: "following-pipeline" },
    { from: "http-controller", to: "listtweets-pipeline" },

    // Product Pipelines to Mixers
    { from: "foryou-pipeline", to: "foryou-mixer" },
    { from: "following-pipeline", to: "following-mixer" },
    { from: "listtweets-pipeline", to: "listtweets-mixer" },

    // Mixers to Candidate Sources
    { from: "foryou-mixer", to: "earlybird-search" },
    { from: "foryou-mixer", to: "tweet-mixer" },
    { from: "foryou-mixer", to: "frs-service" },
    { from: "foryou-mixer", to: "user-entity-graph" },

    { from: "following-mixer", to: "earlybird-search" },
    { from: "following-mixer", to: "timeline-service" },

    { from: "listtweets-mixer", to: "timeline-service" },

    // Mixers to ML Layer
    { from: "foryou-mixer", to: "feature-hydrators" },
    { from: "following-mixer", to: "feature-hydrators" },
    { from: "listtweets-mixer", to: "feature-hydrators" },

    // Candidate Sources to Data Sources
    { from: "earlybird-search", to: "search-index" },
    { from: "tweet-mixer", to: "user-graph" },
    { from: "frs-service", to: "engagement-data" },
    { from: "user-entity-graph", to: "user-graph" },
    { from: "realtime-graph", to: "realtime-signals" },
    { from: "timeline-service", to: "search-index" },

    // ML Layer internal connections
    { from: "feature-hydrators", to: "feature-store" },
    { from: "feature-hydrators", to: "scoring-pipelines" },
    { from: "scoring-pipelines", to: "ml-models" }
  ]
};

// ======================
// HELPER FUNCTIONS
// ======================

function createLayerContainer(layer, index) {
  const container = figma.createFrame();
  container.name = layer.name;
  container.resize(
    config.boxWidth + 40,
    (layer.components.length * (config.boxHeight + config.spacing)) + 60
  );

  // Set position
  container.x = layer.position.x;
  container.y = layer.position.y;

  // Add background
  container.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98, a: 1 } }];
  container.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.1 }, weight: 1 }];
  container.cornerRadius = config.cornerRadius;

  // Add layer title
  const title = figma.createText();
  title.characters = layer.name;
  title.fontSize = config.fonts.layer.size;
  title.fontWeight = config.fonts.layer.weight;
  title.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }];
  title.textAlignHorizontal = 'CENTER';
  title.textAlignVertical = 'CENTER';
  title.resize(config.boxWidth, 30);
  title.x = 20;
  title.y = 20;

  container.appendChild(title);

  return container;
}

function createComponentBox(component, layerColor, index) {
  const box = figma.createRectangle();
  box.name = component.name;
  box.resize(config.boxWidth, config.boxHeight);
  box.cornerRadius = config.cornerRadius;

  // Apply layer-specific styling
  applyLayerStyling(box, layerColor);

  // Add component label
  const label = figma.createText();
  label.characters = component.name;
  label.fontSize = config.fonts.component.size;
  label.fontWeight = config.fonts.component.weight;
  label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.8 } }];
  label.textAlignHorizontal = 'CENTER';
  label.textAlignVertical = 'CENTER';
  label.resize(config.boxWidth - 20, config.boxHeight);

  // Position label in center of box
  label.x = 10;
  label.y = 0;

  // Group box and label
  const group = figma.group([box, label], figma.currentPage);
  group.name = component.name;
  group.setPluginData('componentId', component.id);

  return group;
}

function applyLayerStyling(element, layerColor) {
  switch (layerColor) {
    case 'client':
      element.fills = [{ type: 'SOLID', color: { r: 0.89, g: 0.95, b: 0.99, a: 1 } }];
      element.strokes = [{ type: 'SOLID', color: { r: 0.33, g: 0.67, b: 0.93, a: 0.3 }, weight: 1 }];
      break;
    case 'api':
      element.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }];
      element.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.8 }, weight: 2 }];
      break;
    case 'product':
      element.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientStops: [
          { position: 0, color: { r: 0.4, g: 0.49, b: 0.92, a: 1 } },
          { position: 1, color: { r: 0.46, g: 0.29, b: 0.64, a: 1 } }
        ]
      }];
      element.strokes = [];
      break;
    case 'mixer':
      element.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientStops: [
          { position: 0, color: { r: 0.46, g: 0.29, b: 0.64, a: 1 } },
          { position: 1, color: { r: 0.4, g: 0.49, b: 0.92, a: 1 } }
        ]
      }];
      element.strokes = [];
      break;
    case 'ml':
      element.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientStops: [
          { position: 0, color: { r: 0.94, g: 0.58, b: 0.98, a: 1 } },
          { position: 1, color: { r: 0.96, g: 0.34, b: 0.42, a: 1 } }
        ]
      }];
      element.strokes = [];
      break;
    case 'data':
      element.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.96, a: 1 } }];
      element.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.1 }, weight: 1 }];
      break;
  }

  // Add subtle shadow
  element.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4
  }];
}

function createConnection(fromComponent, toComponent) {
  // Find components in the page
  const fromNode = findComponentById(fromComponent);
  const toNode = findComponentById(toComponent);

  if (!fromNode || !toNode) {
    console.log(`Could not find components for connection: ${fromComponent} -> ${toComponent}`);
    return null;
  }

  // Calculate connection points
  const fromPoint = getConnectionPoint(fromNode, 'right');
  const toPoint = getConnectionPoint(toNode, 'left');

  // Create connection line
  const line = figma.createLine();
  line.strokeWeight = 2;
  line.strokeCap = 'ROUND';
  line.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.6 } }];

  // Set line points
  line.x = fromPoint.x;
  line.y = fromPoint.y;
  line.resize(toPoint.x - fromPoint.x, toPoint.y - fromPoint.y);

  // Send to back
  line.relativeParent = figma.currentPage;
  line.toBack();

  return line;
}

function findComponentById(componentId) {
  const nodes = figma.currentPage.findAll(n =>
    n.getPluginData('componentId') === componentId
  );
  return nodes.length > 0 ? nodes[0] : null;
}

function getConnectionPoint(node, direction) {
  const bounds = node.absoluteBoundingBox;
  switch (direction) {
    case 'right':
      return { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 };
    case 'left':
      return { x: bounds.x, y: bounds.y + bounds.height / 2 };
    case 'top':
      return { x: bounds.x + bounds.width / 2, y: bounds.y };
    case 'bottom':
      return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height };
    default:
      return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  }
}

// ======================
// MAIN FUNCTION
// ======================

function createArchitectureDiagram() {
  // Clear existing content
  figma.currentPage.children.forEach(node => node.remove());

  // Create main frame
  const mainFrame = figma.createFrame();
  mainFrame.name = "X Algorithm Architecture";
  mainFrame.resize(config.canvasWidth, config.canvasHeight);
  mainFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98, a: 1 } }];

  // Store component references for connections
  const componentMap = new Map();

  // Create layers
  architecture.layers.forEach((layer, layerIndex) => {
    const layerContainer = createLayerContainer(layer, layerIndex);
    mainFrame.appendChild(layerContainer);

    // Create components within layer
    layer.components.forEach((component, componentIndex) => {
      const componentBox = createComponentBox(component, layer.color, componentIndex);
      componentBox.x = 20;
      componentBox.y = 50 + (componentIndex * (config.boxHeight + config.spacing));

      componentMap.set(component.id, componentBox);
      layerContainer.appendChild(componentBox);
    });
  });

  // Create connections
  setTimeout(() => {
    architecture.connections.forEach(connection => {
      createConnection(connection.from, connection.to);
    });
  }, 100);

  // Select the main frame
  figma.currentPage.selection = [mainFrame];
  figma.viewport.scrollAndZoomIntoView([mainFrame]);

  // Show success message
  figma.notify('X Algorithm Architecture Diagram created successfully!');
}

// ======================
// RUN THE SCRIPT
// ======================

createArchitectureDiagram();

// Close the plugin (optional)
figma.closePlugin();