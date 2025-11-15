/**
 * Pixlated Image Web Component
 * Adds film grain and noise textures to images using Canvas API
 */

import { applyNoise, clampIntensity } from './utils.js';

interface PixlatedImageConfig {
    src: string | null;
    intensity: number;
    width: number;
    height: number;
    alt: string;
}

interface PixlatedLoadedEventDetail {
    src: string | null;
    width: number;
    height: number;
}

interface PixlatedErrorEventDetail {
    src: string | null;
    error: string;
    message: string;
}

class PixlatedImage extends HTMLElement {
    static DEBUG = false; // Set to true for verbose logging

    private canvas!: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private styleEl!: HTMLStyleElement;
    private img!: HTMLImageElement;
    private altText: string = '';
    private errorMessage: string = '';

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
        this.shadowRoot!.append(this.styleEl, this.canvas);

        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.onload = () => this._handleImageLoad();
        this.img.onerror = (e) => this._handleImageError(e);
    }

    // When these attributes change, attributeChangedCallback will be called.
    static get observedAttributes(): string[] {
        return ['src', 'intensity', 'width', 'height', 'alt'];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                this.errorMessage = '';
                this.img.src = newValue || '';
                break;
            case 'intensity':
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'width':
                const width = this._validateDimension(newValue, 400, 'width');
                const dpr = window.devicePixelRatio || 1;
                this.canvas.width = width * dpr;
                this.canvas.style.width = `${width}px`;
                this.ctx!.scale(dpr, dpr);
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'height':
                const height = this._validateDimension(newValue, 400, 'height');
                const dprH = window.devicePixelRatio || 1;
                this.canvas.height = height * dprH;
                this.canvas.style.height = `${height}px`;
                this.ctx!.scale(dprH, dprH);
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'alt':
                this.altText = newValue || '';
                this.updateAriaAttributes();
                break;
        }
    }

    connectedCallback(): void {
        const width = this._validateDimension(this.getAttribute('width'), 400, 'width');
        const height = this._validateDimension(this.getAttribute('height'), 400, 'height');

        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.ctx!.scale(dpr, dpr);

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

    drawPlaceholder(): void {
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

    drawGrainyImage(): void {
        if (!this.ctx) return;

        if (!this.img.complete || !this.img.naturalWidth) {
            this.drawPlaceholder();
            return;
        }

        const rawIntensity = parseFloat(this.getAttribute('intensity') || '0.1');
        const intensity = clampIntensity(rawIntensity, 0.1);
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.drawImage(this.img, 0, 0, canvasWidth, canvasHeight);

        if (intensity > 0) {
            const imageData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            const noisyData = applyNoise(imageData, intensity);
            this.ctx.putImageData(noisyData, 0, 0);
        }
    }

    // Update ARIA attributes for better accessibility
    updateAriaAttributes(): void {
        if (this.altText) {
            this.canvas.setAttribute('role', 'img');
            this.canvas.setAttribute('aria-label', this.altText);
        } else {
            this.canvas.removeAttribute('role');
            this.canvas.removeAttribute('aria-label');
        }
    }

    private _handleImageLoad(): void {
        this.errorMessage = '';
        this.drawGrainyImage();
        this.dispatchEvent(new CustomEvent<PixlatedLoadedEventDetail>('pixlated:loaded', {
            detail: {
                src: this.getAttribute('src'),
                width: this.img.naturalWidth,
                height: this.img.naturalHeight
            },
            bubbles: true,
            composed: true
        }));
    }

    private _handleImageError(error: Event | string): void {
        this.errorMessage = 'Failed to load image';
        this.drawPlaceholder();
        this.dispatchEvent(new CustomEvent<PixlatedErrorEventDetail>('pixlated:error', {
            detail: {
                src: this.getAttribute('src'),
                error: typeof error === 'string' ? error : (error as ErrorEvent).type || 'Unknown error',
                message: this.errorMessage
            },
            bubbles: true,
            composed: true
        }));
        console.error(`<pixlated-image>: Failed to load image from "${this.getAttribute('src')}"`);
    }

    private _validateDimension(value: string | null, defaultValue: number, dimName: string): number {
        const parsed = parseInt(value || '', 10);
        if (isNaN(parsed) || parsed <= 0) {
            if (value !== null && value !== undefined && value !== '') {
                this._log('debug', `Invalid ${dimName} "${value}", using ${defaultValue}`);
            }
            return defaultValue;
        }
        return parsed;
    }

    private _log(level: 'error' | 'warn' | 'debug', message: string): void {
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

    reload(): void {
        if (this.img.src && this.img.complete) {
            this.drawGrainyImage();
        } else if (this.img.src) {
            this.img.src = this.img.src;
        }
    }

    getConfig(): PixlatedImageConfig {
        const rawIntensity = parseFloat(this.getAttribute('intensity') || '0.1');
        return {
            src: this.getAttribute('src'),
            intensity: clampIntensity(rawIntensity, 0.1),
            width: this.canvas.width,
            height: this.canvas.height,
            alt: this.altText
        };
    }
}

customElements.define('pixlated-image', PixlatedImage);
