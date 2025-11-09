# pixlated

![NPM Version](https://img.shields.io/npm/v/pixlated?style=flat)
![npm bundle size](https://img.shields.io/bundlephobia/min/pixlated)

A lightweight web components that add film grain and noise textures to images and backgrounds using Canvas API.

## Features

- Two web components: `<pixlated-image>` and `<pixlated-bg>`
- Zero dependencies
- Built with native Web Components API
- High-performance Canvas rendering
- Responsive and accessible

## Demo

[View Live Demo](https://bridgetamana.github.io/pixlated/)

## Installation

### NPM

```bash
npm install pixlated
```

### CDN

```html
<script type="module" src="https://unpkg.com/pixlated/src/pixlated.js"></script>
<script type="module" src="https://unpkg.com/pixlated/src/pixlated-bg.js"></script>
```

## Usage

### Impact
Before
![Project Screenshot](./assets/images/annie.jpg)

After
![Project Screenshot](./assets/images/annie-grained.PNG)

### Image Grain Effect

Add noise texture to images:

```html
<pixlated-image
  src="photo.jpg"
  intensity="0.3"
  width="400"
  height="400"
  alt="Photo with grain effect"
>
</pixlated-image>
```

**Attributes:**

- `src` (required) - Image URL
- `intensity` (optional) - Noise intensity from 0 to 1 (default: 0.1)
- `width` (optional) - Canvas width in pixels (default: 400)
- `height` (optional) - Canvas height in pixels (default: 400)
- `alt` (optional) - Alternative text for accessibility

### Background Noise Effect

Add noise texture to backgrounds:

```html
<pixlated-bg intensity="0.15" color="#09090b">
  <h1>Your content here</h1>
  <p>Perfect for hero sections, cards, and more</p>
</pixlated-bg>
```

**Attributes:**

- `intensity` (optional) - Noise intensity from 0 to 1 (default: 0.1)
- `color` (optional) - Background color (default: #09090b)
- `width` (optional) - Fixed width in pixels (auto-sizes by default)
- `height` (optional) - Fixed height in pixels (auto-sizes by default)

### Styling

Style components with CSS:

```css
pixlated-image {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

pixlated-bg {
  padding: 2rem;
  border-radius: 8px;
}
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Apache-2.0 © [Bridget Amana](https://github.com/Bridgetamana)

## Links

- [Documentation](https://bridgetamana.github.io/pixlated/)
- [GitHub Repository](https://github.com/Bridgetamana/pixlated)
- [Issues](https://github.com/Bridgetamana/pixlated/issues)
- [NPM Package](https://www.npmjs.com/package/pixlated)