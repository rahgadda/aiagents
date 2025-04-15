import { BaseComponent } from '../base/base.js';

class AIAgentHeader extends BaseComponent {
    constructor() {
        super('aiagent-header'); 
    }

    connectedCallback() {
        super.connectedCallback().catch(error => {
            console.error('Error in AIAgentHeader connectedCallback:', error);
        });
    }
}

customElements.define('aiagent-header', AIAgentHeader);