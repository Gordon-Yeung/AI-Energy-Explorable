/**
 * Navigation module - handles page transitions
 */

const Navigation = {
    // Elements that serve as "pages"
    pages: {
        landing: document.getElementById('landing-page'),
        chat: document.getElementById('chat-interface'),
        explorer: document.getElementById('explorer-page')
    },
    
    // Initialize navigation
    init: function() {
        // Show landing page initially
        this.showPage('landing');
        
        // Set up event listeners
        this.setupEventListeners();
    },
    
    // Show a specific page
    showPage: function(pageName) {
        // Hide all pages
        Object.values(this.pages).forEach(page => {
            if (page) page.classList.add('hidden');
        });
        
        // Show the requested page
        if (this.pages[pageName]) {
            this.pages[pageName].classList.remove('hidden');
            
            // Fire event when page changes
            const event = new CustomEvent('pageChanged', { 
                detail: { page: pageName } 
            });
            document.dispatchEvent(event);
        }
    },
    
    // Setup navigation event listeners
    setupEventListeners: function() {
        // Begin button takes you to the chat interface
        const beginButton = document.getElementById('beginButton');
        if (beginButton) {
            beginButton.addEventListener('click', () => {
                this.showPage('chat');
                
                // Trigger chat sequence
                if (window.ChatInterface) {
                    window.ChatInterface.startQuestionSequence();
                }
            });
        }
        
        // Suggestions also take you to the chat interface
        const suggestions = document.querySelectorAll('.suggestion');
        suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                if (beginButton) beginButton.click();
            });
        });
        
        // Back button returns to landing page
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.showPage('landing');
                
                // Reset chat UI
                if (window.ChatInterface) {
                    window.ChatInterface.resetInterface();
                }
            });
        }
        
        // Explorer button takes you to the energy explorer
        const exploreButton = document.getElementById('exploreButton');
        if (exploreButton) {
            exploreButton.addEventListener('click', () => {
                this.showPage('explorer');
                
                // Initialize the Energy Explorer if it's not already
                if (window.EnergyExplorerComponent && typeof window.EnergyExplorerComponent.init === 'function') {
                    window.EnergyExplorerComponent.init();
                }
            });
        }
        
        // Back to chat button
        const backToChatButton = document.getElementById('backToChatButton');
        if (backToChatButton) {
            backToChatButton.addEventListener('click', () => {
                this.showPage('chat');
            });
        }
    }
};

// Make Navigation globally available
window.Navigation = Navigation;
