/**
 * Pixlated Background Web Component
 * Adds film grain and noise textures to backgrounds using Canvas API
 */

function applyNoiseToBg(imageData, intensity) {
    const data = imageData.data;
    const clampedIntensity = Math.max(0, Math.min(1, intensity));

    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 255 * clampedIntensity;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    return imageData;
}

function clampBgIntensity(value, defaultValue) {
    if (defaultValue === undefined) defaultValue = 0.1;
    if (value === null || value === undefined || isNaN(value)) {
        return defaultValue;
    }
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
}

class PixlatedBg extends HTMLElement {
    static DEBUG = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        if (!this.ctx) {
            console.error('<pixlated-bg>: Canvas 2D context not supported');
            return;
        }

        this.styleEl = document.createElement('style');
        this.styleEl.textContent = `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
      }
      canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .content {
        position: relative;
        z-index: 1;
      }
    `;

        this.contentSlot = document.createElement('div');
        this.contentSlot.className = 'content';
        this.contentSlot.innerHTML = '<slot></slot>';

        this.shadowRoot.append(this.styleEl, this.canvas, this.contentSlot);
    }

    static get observedAttributes() {
        return ['color', 'intensity', 'width', 'height'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case 'color':
            case 'intensity':
                if (this.isConnected) this.drawGrainyBackground();
                break;
            case 'width':
            case 'height':
                this.updateCanvasSize();
                if (this.isConnected) this.drawGrainyBackground();
                break;
        }
    }

    connectedCallback() {
        this.updateCanvasSize();
        this.drawGrainyBackground();

        this.resizeObserver = new ResizeObserver(() => {
            this.updateCanvasSize();
            this.drawGrainyBackground();
        });
        this.resizeObserver.observe(this);
    }

    disconnectedCallback() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    updateCanvasSize() {
        const width = this.getAttribute('width');
        const height = this.getAttribute('height');

        if (width && height) {
            const w = parseInt(width, 10);
            const h = parseInt(height, 10);
            const dpr = window.devicePixelRatio || 1;

            this.canvas.width = w * dpr;
            this.canvas.height = h * dpr;
            this.canvas.style.width = `${w}px`;
            this.canvas.style.height = `${h}px`;
            this.ctx.scale(dpr, dpr);
        } else {
            const rect = this.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.ctx.scale(dpr, dpr);
        }
    }

    drawGrainyBackground() {
        if (!this.ctx) return;

        const color = this.getAttribute('color') || '#09090b';
        const rawIntensity = parseFloat(this.getAttribute('intensity'));
        const intensity = clampBgIntensity(rawIntensity, 0.1);

        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        if (intensity > 0) {
            const imageData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            const noisyData = applyNoiseToBg(imageData, intensity);
            this.ctx.putImageData(noisyData, 0, 0);
        }
    }

    reload() {
        this.drawGrainyBackground();
    }

    getConfig() {
        const rawIntensity = parseFloat(this.getAttribute('intensity'));
        return {
            color: this.getAttribute('color') || '#09090b',
            intensity: clampIntensity(rawIntensity, 0.1),
            width: this.canvas.width,
            height: this.canvas.height
        };
    }
}

customElements.define('pixlated-bg', PixlatedBg);
