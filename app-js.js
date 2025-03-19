/**
 * Main Application logic
 */

// Initialize all modules when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation first
    if (window.Navigation) {
        window.Navigation.init();
    }
    
    // Initialize chat interface
    if (window.ChatInterface) {
        window.ChatInterface.init();
    }
    
    // Set up page change listener
    document.addEventListener('pageChanged', function(e) {
        if (e.detail.page === 'explorer') {
            // Initialize Energy Explorer when that page is shown
            if (window.EnergyExplorerComponent) {
                window.EnergyExplorerComponent.init();
            }
        }
    });
    
    console.log('AI Energy Explorer Application Initialized');
});
