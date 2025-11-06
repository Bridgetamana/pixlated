class PixlatedImage extends HTMLElement {
    static DEBUG = false; // Set to true for verbose logging

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        if (!this.ctx) {
            console.error('<pixlated-image>: Canvas 2D context not supported');
            return;
        }

        this.styleEl = document.createElement('style');
        this.styleEl.textContent = `
        :host {
            display: inline-block;
            line-height: 0;
        }
        canvas {
            max-width: 100%;
            height: auto;
            display: block;
        }
        `;
        this.shadowRoot.append(this.styleEl, this.canvas);

        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.onload = () => this._handleImageLoad();
        this.img.onerror = (e) => this._handleImageError(e);
        this.altText = '';
        this.errorMessage = '';
    }

    // When these attributes change, attributeChangedCallback will be called.
    static get observedAttributes() {
        return ['src', 'intensity', 'width', 'height', 'alt'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                this.errorMessage = '';
                this.img.src = newValue;
                break;
            case 'intensity':
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'width':
                const width = this._validateDimension(newValue, 400, 'width');
                this.canvas.width = width;
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'height':
                const height = this._validateDimension(newValue, 400, 'height');
                this.canvas.height = height;
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'alt':
                this.altText = newValue;
                this.updateAriaAttributes();
                break;
        }
    }

    connectedCallback() {
        const width = this._validateDimension(this.getAttribute('width'), 300, 'width');
        const height = this._validateDimension(this.getAttribute('height'), 400, 'height');
        this.canvas.width = width;
        this.canvas.height = height;

        this.altText = this.getAttribute('alt') || '';
        this.updateAriaAttributes();

        const src = this.getAttribute('src');
        if (src) {
            this.img.src = src;
        } else {
            this.errorMessage = 'Missing src attribute';
            this._log('error', '"src" attribute is required.');
            this.drawPlaceholder();
        }
    }

    drawPlaceholder() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#666';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        if (this.errorMessage) {
            this.ctx.fillStyle = '#d32f2f';
            this.ctx.fillText('⚠ Error', centerX, centerY - 20);
            this.ctx.fillStyle = '#666';
            this.ctx.font = '14px Arial';
            this.ctx.fillText(this.errorMessage, centerX, centerY + 10);
        } else {
            this.ctx.fillText('No Image', centerX, centerY - 10);
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = '#999';
            this.ctx.fillText('src attribute required', centerX, centerY + 15);
        }
    }

    drawGrainyImage() {
        if (!this.ctx) return;

        if (!this.img.complete || !this.img.naturalWidth) {
            this.drawPlaceholder();
            return;
        }

        const rawIntensity = parseFloat(this.getAttribute('intensity'));
        const intensity = this._clampIntensity(rawIntensity);
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.drawImage(this.img, 0, 0, canvasWidth, canvasHeight);

        if (intensity > 0) {
            const imageData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 255 * intensity;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
            }
            this.ctx.putImageData(imageData, 0, 0);
        }
    }

    // Update ARIA attributes for better accessibility
    updateAriaAttributes() {
        if (this.altText) {
            this.canvas.setAttribute('role', 'img');
            this.canvas.setAttribute('aria-label', this.altText);
        } else {
            this.canvas.removeAttribute('role');
            this.canvas.removeAttribute('aria-label');
        }
    }

    _handleImageLoad() {
        this.errorMessage = '';
        this.drawGrainyImage();
        this.dispatchEvent(new CustomEvent('pixlated:loaded', {
            detail: {
                src: this.getAttribute('src'),
                width: this.img.naturalWidth,
                height: this.img.naturalHeight
            },
            bubbles: true,
            composed: true
        }));
    }

    _handleImageError(error) {
        this.errorMessage = 'Failed to load image';
        this.drawPlaceholder();
        this.dispatchEvent(new CustomEvent('pixlated:error', {
            detail: {
                src: this.getAttribute('src'),
                error: error.type || 'Unknown error',
                message: this.errorMessage
            },
            bubbles: true,
            composed: true
        }));
        console.error(`<pixlated-image>: Failed to load image from "${this.getAttribute('src')}"`);
    }

    _clampIntensity(value) {
        const defaultIntensity = 0.1;
        if (value === null || value === undefined || isNaN(value)) {
            return defaultIntensity;
        }
        if (value < 0) {
            this._log('debug', `Intensity ${value} clamped to 0`);
            return 0;
        }
        if (value > 1) {
            this._log('debug', `Intensity ${value} clamped to 1`);
            return 1;
        }
        return value;
    }

    _validateDimension(value, defaultValue, dimName) {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed <= 0) {
            if (value !== null && value !== undefined && value !== '') {
                this._log('debug', `Invalid ${dimName} "${value}", using ${defaultValue}`);
            }
            return defaultValue;
        }
        return parsed;
    }

    _log(level, message) {
        if (!PixlatedImage.DEBUG && level === 'debug') return;

        const prefix = '<pixlated-image>:';
        switch (level) {
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`);
                break;
            case 'debug':
                console.log(`${prefix} [DEBUG] ${message}`);
                break;
        }
    }

    reload() {
        if (this.img.src && this.img.complete) {
            this.drawGrainyImage();
        } else if (this.img.src) {
            this.img.src = this.img.src;
        }
    }

    getConfig() {
        const rawIntensity = parseFloat(this.getAttribute('intensity'));
        return {
            src: this.getAttribute('src'),
            intensity: this._clampIntensity(rawIntensity),
            width: this.canvas.width,
            height: this.canvas.height,
            alt: this.altText
        };
    }
}

customElements.define('pixlated-image', PixlatedImage);
