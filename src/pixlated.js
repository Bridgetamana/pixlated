class PixlatedImage extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

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
        this.img.onload = () => this.drawGrainyImage();
        this.img.onerror = () => this.drawPlaceholder();
        this.altText = '';
    }

    // When these attributes change, attributeChangedCallback will be called.
    static get observedAttributes() {
        return ['src', 'intensity', 'width', 'height', 'alt'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                this.img.src = newValue;
                break;
            case 'intensity':
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'width':
                this.canvas.width = parseInt(newValue, 10) || 300;
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'height':
                this.canvas.height = parseInt(newValue, 10) || 200;
                if (this.isConnected) this.drawGrainyImage();
                break;
            case 'alt':
                this.altText = newValue;
                this.updateAriaAttributes();
                break;
        }
    }

    connectedCallback() {
        this.canvas.width = parseInt(this.getAttribute('width'), 10) || 300;
        this.canvas.height = parseInt(this.getAttribute('height'), 10) || 200;

        this.altText = this.getAttribute('alt') || '';
        this.updateAriaAttributes();

        const src = this.getAttribute('src');
        if (src) {
            this.img.src = src;
        } else {
            console.warn('<pixlated-image>: "src" attribute is required.');
            this.drawPlaceholder();
        }
    }

    drawPlaceholder() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#666';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('No Image (src missing)', this.canvas.width / 2, this.canvas.height / 2);
    }

    drawGrainyImage() {
        if (!this.img.complete || !this.img.naturalWidth) {
            this.drawPlaceholder();
            return;
        }

        const intensity = parseFloat(this.getAttribute('intensity')) || 0.1;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.drawImage(this.img, 0, 0, canvasWidth, canvasHeight);

        const imageData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 255 * intensity;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
        }
        this.ctx.putImageData(imageData, 0, 0);
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
}
