import { setup, tw } from 'https://cdn.skypack.dev/twind/shim';
import { virtualSheet } from 'https://cdn.skypack.dev/twind/sheets';

export class BaseComponent extends HTMLElement {
    constructor(templateName, shadowMode = 'open') {
        super();
        this.templateName = templateName;
        this.shadowMode = shadowMode;

        // Setup Twind with a virtual sheet for shadow DOM
        this.sheet = virtualSheet();
        setup({ 
            sheet: this.sheet,
            preflight: false // Disable preflight to avoid conflicts
        });
    }

    connectedCallback() {
        return new Promise((resolve, reject) => {
            fetch(`./src/ui/components/${this.templateName.toLowerCase()}/${this.templateName.toLowerCase()}.html`)
                .then(response => response.text())
                .then(html => {
                    try {
                        // Create shadow DOM
                        const shadowRoot = this.attachShadow({ mode: this.shadowMode });

                        // Load HTML
                        const template = document.createElement('template');
                        template.innerHTML = html;

                        // Process Tailwind classes before adding to shadow DOM
                        const processNode = (node) => {
                            if (node.nodeType === 1) { // Element node
                                // Process element classes
                                if (node.hasAttribute('class')) {
                                    const classes = node.getAttribute('class');
                                    node.setAttribute('class', tw(classes));
                                }
                                
                                // Process children
                                Array.from(node.childNodes).forEach(child => {
                                    processNode(child);
                                });
                            }
                        };

                        const fragment = template.content.cloneNode(true);
                        Array.from(fragment.childNodes).forEach(node => {
                            processNode(node);
                        });
                        
                        shadowRoot.appendChild(fragment);

                        // Apply Twind styles
                        const styleTag = document.createElement('style');
                        styleTag.textContent = this.sheet.target.join('');
                        shadowRoot.appendChild(styleTag);

                        resolve();
                        this.componentReady();

                    } catch (error) {
                        console.error('Error setting up component:', error);
                        reject(error);
                    }
                })
                .catch(error => {
                    console.error('Error loading component files:', error);
                    reject(error);
                });
        });
    }

    componentReady() {
        // Default implementation (can be empty)
    }
}