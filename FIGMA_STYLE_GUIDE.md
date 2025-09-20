# X Algorithm Architecture - Figma Style Guide

## 🎨 Visual Design System

### Color Palette

#### Primary Colors (X-Inspired)
```css
:root {
  /* Core X Colors */
  --x-black: #000000;
  --x-white: #FFFFFF;
  --x-blue: #1DA1F2;
  --x-dark-blue: #14171A;
  --x-gray: #657786;
  --x-light-gray: #AAB8C2;
  --x-extra-light: #E1E8ED;

  /* Modern Accent Colors */
  --gradient-primary-start: #667eea;
  --gradient-primary-end: #764ba2;
  --gradient-secondary-start: #f093fb;
  --gradient-secondary-end: #f5576c;
  --gradient-tertiary-start: #4facfe;
  --gradient-tertiary-end: #00f2fe;

  /* Layer-Specific Colors */
  --layer-client: #E3F2FD;
  --layer-api: #FFFFFF;
  --layer-product: linear-gradient(135deg, var(--gradient-primary-start), var(--gradient-primary-end));
  --layer-mixer: linear-gradient(135deg, var(--gradient-primary-end), var(--gradient-primary-start));
  --layer-ml: linear-gradient(135deg, var(--gradient-secondary-start), var(--gradient-secondary-end));
  --layer-data: #F5F5F5;

  /* Status Colors */
  --status-success: #00D084;
  --status-warning: #FFC107;
  --status-error: #FF4757;
  --status-info: #2E86DE;
}
```

#### Gradient Definitions
```css
.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-tertiary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-client {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.gradient-data {
  background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%);
}
```

---

## 📐 Typography

### Font Stack
```css
.font-primary {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.font-secondary {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
}
```

### Type Scale
```css
/* Display */
.display-1 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.display-2 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.display-3 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
}

/* Body */
.body-large {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

.body-medium {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
}

.body-small {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
}

/* Labels */
.label-large {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.label-medium {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.label-small {
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
}
```

---

## 🎯 Component Library

### System Box Component

#### Default State
```figma
{
  "type": "rectangle",
  "width": 200,
  "height": 80,
  "cornerRadius": 12,
  "fills": [{
    "type": "SOLID",
    "color": {"r": 0.96, "g": 0.96, "b": 0.96, "a": 1}
  }],
  "strokes": [{
    "type": "SOLID",
    "color": {"r": 0, "g": 0, "b": 0, "a": 0.1},
    "weight": 1
  }],
  "effects": [{
    "type": "DROP_SHADOW",
    "color": {"r": 0, "g": 0, "b": 0, "a": 0.1},
    "offset": {"x": 0, "y": 2},
    "radius": 4
  }]
}
```

#### Layer Variants

**Client Layer**
```css
.background: var(--layer-client);
.border: 1px solid #BBDEFB;
.shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
```

**API Layer**
```css
.background: var(--layer-api);
.border: 2px solid var(--x-black);
.shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
```

**Product Pipeline Layer**
```css
.background: var(--layer-product);
.border: none;
.shadow: 0 6px 16px rgba(118, 75, 162, 0.2);
```

**Mixer Pipeline Layer**
```css
.background: var(--layer-mixer);
.border: none;
.shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
```

**ML & Feature Layer**
```css
.background: var(--layer-ml);
.border: none;
.shadow: 0 6px 16px rgba(245, 87, 108, 0.2);
```

**Data Sources Layer**
```css
.background: var(--layer-data);
.border: 1px solid #E0E0E0;
.shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
```

### Connector Component

#### Arrow Styles
```figma
{
  "type": "line",
  "strokeWeight": 2,
  "strokeCap": "ROUND",
  "strokeJoin": "ROUND",
  "strokeDashes": [],
  "strokeStyle": "SOLID",
  "color": {"r": 0, "g": 0, "b": 0, "a": 0.8}
}
```

#### Flow Animations
```css
/* Pulse Animation for Active Flow */
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.connector-active {
  animation: pulse 2s infinite;
  stroke-width: 3;
  filter: drop-shadow(0 0 6px rgba(102, 126, 234, 0.4));
}
```

---

## 📐 Layout System

### Grid System
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  padding: 24px;
  max-width: 1920px;
  margin: 0 auto;
}

.grid-item {
  border-radius: 12px;
  padding: 16px;
  min-height: 80px;
}
```

### Spacing Scale
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
}
```

### Layer Spacing
```css
/* Vertical spacing between layers */
.layer-spacing {
  margin-bottom: var(--spacing-2xl);
}

/* Horizontal spacing within layers */
.component-spacing {
  margin-right: var(--spacing-md);
}

/* Padding around content */
.content-padding {
  padding: var(--spacing-lg);
}
```

---

## 🎨 Interactive States

### Hover Effects
```css
.system-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.connector:hover {
  stroke-width: 3;
  filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.6));
}
```

### Active States
```css
.system-box.active {
  border-color: var(--x-blue);
  box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.2);
}

.connector.active {
  stroke: var(--x-blue);
  stroke-width: 3;
}
```

### Focus States
```css
.system-box:focus-within {
  outline: 2px solid var(--x-blue);
  outline-offset: 2px;
}
```

---

## 🌊 Data Flow Visualization

### Animated Flow Lines
```javascript
// Figma Prototype Animation
function createFlowAnimation(fromNode, toNode) {
  return {
    type: "SMART_ANIMATE",
    duration: 0.8,
    easing: "EASE_IN_OUT",
    trigger: {
      type: "ON_CLICK",
      nodeId: fromNode.id
    },
    actions: [
      {
        type: "NODE_OPACITY",
        nodeId: toNode.id,
        value: 1,
        duration: 0.3
      }
    ]
  };
}
```

### Flow Indicators
```css
.flow-indicator {
  width: 8px;
  height: 8px;
  background: var(--status-info);
  border-radius: 50%;
  position: absolute;
  animation: flowMove 2s linear infinite;
}

@keyframes flowMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(100px); }
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  .system-box {
    width: 100%;
    min-height: 60px;
  }

  .layer-title {
    font-size: 16px;
  }

  .component-label {
    font-size: 12px;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(8, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .grid-container {
    grid-template-columns: repeat(12, 1fr);
  }
}
```

### Mobile-First Layout
```css
/* Stack vertically on mobile */
.architecture-layer {
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Horizontal on desktop */
@media (min-width: 1025px) {
  .architecture-layer {
    flex-direction: row;
    gap: var(--spacing-lg);
  }
}
```

---

## ♿ Accessibility

### Color Contrast
```css
/* High Contrast Mode */
@media (prefers-contrast: high) {
  .system-box {
    border-width: 2px;
    border-color: var(--x-black);
  }

  .connector {
    stroke-width: 3;
    stroke: var(--x-black);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Support
```html
<!-- ARIA Labels -->
<div class="system-box" role="region"
     aria-label="Client Layer containing Twitter App and Mobile Clients">
  <div class="layer-title" aria-level="2">Client Layer</div>
  <div class="component" role="listitem">Twitter App</div>
  <div class="component" role="listitem">Mobile Clients</div>
</div>
```

### Keyboard Navigation
```css
/* Focus Indicators */
*:focus {
  outline: 2px solid var(--x-blue);
  outline-offset: 2px;
}

/* Tab Order */
.keyboard-nav {
  position: relative;
}

.keyboard-nav:focus {
  z-index: 1000;
}
```

---

## 🚀 Performance Optimization

### Component Optimization
```javascript
// Auto Layout Constraints
const autoLayoutConstraints = {
  layoutMode: "VERTICAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  counterAxisSpacing: 16,
  padding: 16
};

// Component Variants
const componentVariants = {
  small: { width: 160, height: 60 },
  medium: { width: 200, height: 80 },
  large: { width: 240, height: 100 }
};
```

### Export Optimization
```css
/* Web Optimization */
.export-web {
  format: "SVG",
  quality: 100,
  compression: 9
}

/* Print Optimization */
.export-print {
  format: "PDF",
  resolution: 300,
  colorSpace: "CMYK"
}

/* Social Media */
.export-social {
  format: "PNG",
  width: 1080,
  height: 1080,
  quality: 90
}
```

---

## 📝 Usage Guidelines

### Best Practices
1. **Consistency**: Use component variants for consistency
2. **Hierarchy**: Maintain clear visual hierarchy
3. **Accessibility**: Follow WCAG 2.1 guidelines
4. **Performance**: Optimize for target platform
5. **Maintainability**: Document design decisions

### Common Patterns
```css
/* Layer Container */
.architecture-layer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: 12px;
  background: var(--layer-background);
}

/* Component Grid */
.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

/* Flow Container */
.flow-container {
  position: relative;
  padding: var(--spacing-md);
}

/* Legend Container */
.legend-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--x-white);
  border-radius: 8px;
}
```

---

## 🎯 Deliverables Checklist

### Required Files
- [ ] Main architecture diagram
- [ ] Mobile-responsive version
- [ ] Component library
- [ ] Style guide documentation
- [ ] Interactive prototype
- [ ] Export variants (web, print, social)

### Quality Assurance
- [ ] Color contrast validation
- [ ] Responsive testing
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Cross-browser compatibility
- [ ] Documentation completeness

This style guide provides a comprehensive foundation for creating professional, accessible, and visually appealing Figma diagrams for the X Algorithm architecture.