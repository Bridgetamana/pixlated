# pixlated

[![NPM Version](https://img.shields.io/npm/v/pixlated?style=flat)](https://www.npmjs.com/package/pixlated)
![Contributors](https://img.shields.io/github/contributors/Bridgetamana/pixlated.svg?style=flat)
![NPM Downloads](https://img.shields.io/npm/dw/pixlated?style=flat)
![Repo Stars](https://img.shields.io/github/stars/Bridgetamana/pixlated?style=flat)
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

## Effect Preview

See the subtle, high-performance film grain effect `pixlated` adds to an image.

<!-- markdownlint-disable MD033 -->
| Before (Original) | After (With `<pixlated-image>`) |
| :---: | :---: |
| <img src="./assets/images/annie.jpg" alt="Original image without grain effect" width="450" height="310"> | <img src="./assets/images/annie-pixlated.PNG" alt="Image with pixlated grain effect applied" width="450" height="310"> |
<!-- markdownlint-enable MD033 -->

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

License under [Apache-2.0](LICENSE)

## Links

- [Documentation](https://github.com/Bridgetamana/pixlated/blob/main/README.md)
- [Issues](https://github.com/Bridgetamana/pixlated/issues)
- [NPM Package](https://www.npmjs.com/package/pixlated)
