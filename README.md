# pixlated

[![NPM Version](https://img.shields.io/npm/v/pixlated?style=flat)](https://www.npmjs.com/package/pixlated)
[![Contributors](https://img.shields.io/github/contributors/Bridgetamana/pixlated.svg?style=flat)](https://github.com/Bridgetamana/pixlated/graphs/contributors)
![NPM Downloads](https://img.shields.io/npm/dw/pixlated?style=flat)
[![Repo Stars](https://img.shields.io/github/stars/Bridgetamana/pixlated?style=flat)](https://github.com/Bridgetamana/pixlated/stargazers)
![npm bundle size](https://img.shields.io/bundlephobia/min/pixlated)

A lightweight web components that add film grain and noise textures to images and backgrounds using Canvas API.
[View Live Demo](https://bridgetamana.github.io/pixlated/)

## Features

- Two web components: `<pixlated-image>` and `<pixlated-bg>`
- Zero dependencies
- Built with native Web Components API
- High-performance Canvas rendering
- Responsive and accessible

## Installation

### NPM

```bash
npm install pixlated
```

### CDN

```html
<!-- Load both components -->
<script src="https://unpkg.com/pixlated/src/pixlated.js"></script>
<script src="https://unpkg.com/pixlated/src/pixlated-bg.js"></script>
```

Or load individually:

```html
<!-- Just image component -->
<script src="https://unpkg.com/pixlated/src/pixlated.js"></script>

<!-- Or just background component -->
<script src="https://unpkg.com/pixlated/src/pixlated-bg.js"></script>
```

## Usage

### With Bundlers (Vite, Webpack, etc)

```javascript
import 'pixlated';
// Now you can use <pixlated-image> in your HTML
```

### Plain HTML (No Bundler)

```html

<script src="./node_modules/pixlated/src/pixlated.js"></script>
```

### Using the Components

## Effect Preview

See the subtle, high-performance film grain effect `pixlated` adds to an image.

<!-- markdownlint-disable MD033 -->
| Before (Original) | After (With `<pixlated-image>`) |
| :---: | :---: |
| <img src="./assets/images/annie.webp" alt="Original image without grain effect" width="450" height="310"> | <img src="./assets/images/annie-pixlated.webp" alt="Image with pixlated grain effect applied" width="450" height="310"> |
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

| Attribute | Default | Description |
|-----------|---------|-------------|
| `src`  | required | Image URL|
| `intensity`  | 0.1 | Noise intensity from 0 to 1 |
| `width`  | 400 | Canvas width in pixels |
| `height`  | 400 | Canvas height in pixels |
| `alt`  | optional | Alternative text for accessibility |

### Background Noise Effect

Add noise texture to backgrounds:

```html
<pixlated-bg intensity="0.15" color="#09090b">
  <h1>Your content here</h1>
  <p>Perfect for hero sections, cards, and more</p>
</pixlated-bg>
```

**Attributes:**

| Attribute | Default | Description |
|-----------|---------|-------------|
| `intensity` | 0.1 | Noise intensity from 0 to 1
| `color` | #09090b | Background color
| `width` | auto-sizes | Fixed width in pixels |
| `height` | auto-sizes | Fixed height in pixels 

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

- [Issues](https://github.com/Bridgetamana/pixlated/issues)
- [NPM Package](https://www.npmjs.com/package/pixlated)

Give the repo a star if you haven't already
