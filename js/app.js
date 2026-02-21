// Main application module

class EmployeeDirectoryApplication {
    constructor() {
        this.searchModule = null;
        this.filterModule = null;
        this.isInitialized = false;
    }

    // Initialize app
    init() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return;
        }

        console.log('Initializing Employee Directory Application...');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    // Setup modules and listeners
    setup() {
        try {
            // Initialize modules
            this.initializeModules();

            // Setup coordinated filtering
            this.setupCoordinatedFiltering();

            // Add keyboard shortcuts
            this.setupKeyboardShortcuts();



            // Mark as initialized
            this.isInitialized = true;

console.log('Employee Directory Application ready');

        } catch (error) {
            console.error('Error initializing application:', error);
            this.handleInitError(error);
        }
    }

    // Initialize search and filter modules
    initializeModules() {
        // Initialize Search Module
        if (window.EmployeeSearch) {
            this.searchModule = new window.EmployeeSearch();
            this.searchModule.init();
        } else {
            console.warn('EmployeeSearch class not found');
        }

        // Initialize Filter Module
        if (window.EmployeeFilter) {
            this.filterModule = new window.EmployeeFilter();
            this.filterModule.init();
        } else {
            console.warn('EmployeeFilter class not found');
        }

        // Initialize Employee Manager Module
        if (window.EmployeeManager) {
            const employeeManager = new window.EmployeeManager();
            employeeManager.init();
        } else {
            console.warn('EmployeeManager class not found');
        }
    }

    // Setup coordinated filtering between modules
    setupCoordinatedFiltering() {
        // Listen for search events
        window.addEventListener('searchComplete', (e) => {
            console.log(`Search complete: "${e.detail.query}", ${e.detail.visibleCount} results`);
        });

        // Listen for filter events
        window.addEventListener('filterApplied', (e) => {
            console.log('Filters applied:', e.detail.filters);

            // Refresh search after filters are applied
            if (this.searchModule) {
                this.searchModule.refresh();
            }
        });

        // Listen for filter reset
        window.addEventListener('filtersReset', () => {
            console.log('Filters reset');

            // Refresh search after reset
            if (this.searchModule) {
                this.searchModule.refresh();
            }
        });

        // Listen for employee data changes
        window.addEventListener('employeeDataChanged', () => {
            console.log('Employee data updated');
            if (this.filterModule) {
                this.filterModule.refresh();
            }
            if (this.searchModule) {
                this.searchModule.refresh();
            }
        });
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Ctrl/Cmd + R: Reset filters
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                if (this.filterModule) {
                    this.filterModule.resetFilters();
                }
                if (this.searchModule) {
                    this.searchModule.clearSearch();
                }
            }

            // Escape: Clear search and focus out
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('searchInput');
                if (searchInput && searchInput === document.activeElement) {
                    searchInput.blur();
                }
            }
        });

        console.log('Keyboard shortcuts: Ctrl+K (search), Ctrl+R (reset), Escape (clear)');
    }



    // Handle initialization errors
    handleInitError(error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error';
        errorMessage.innerHTML = `
            <h2>Application Error</h2>
            <p>Failed to initialize the directory.</p>
            <div class="error-details">
                <strong>Error:</strong> ${error.message}
            </div>
        `;

        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorMessage, container.firstChild);
        }
    }

    /**
     * Get application statistics
     * @returns {Object}
     */
    getStatistics() {
        const stats = {
            isInitialized: this.isInitialized,
            modules: {
                search: !!this.searchModule,
                filter: !!this.filterModule
            }
        };

        if (this.filterModule) {
            stats.employees = this.filterModule.getStatistics();
        }

        if (this.searchModule) {
            stats.currentSearch = this.searchModule.getCurrentQuery();
        }

        if (this.filterModule) {
            stats.activeFilters = this.filterModule.getActiveFilters();
        }

        return stats;
    }


}

// Initialize application
let appInstance = null;

// Wait for the directory to be ready (after XSLT transformation)
window.addEventListener('employeeDirectoryReady', () => {
    appInstance = new EmployeeDirectoryApplication();
    appInstance.init();
});

// Also try to initialize on DOMContentLoaded (fallback)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!appInstance) {
            setTimeout(() => {
                appInstance = new EmployeeDirectoryApplication();
                appInstance.init();
            }, 500);
        }
    });
} else {
    // DOM already loaded
    setTimeout(() => {
        if (!appInstance) {
            appInstance = new EmployeeDirectoryApplication();
            appInstance.init();
        }
    }, 500);
}

// Export for global access
if (typeof window !== 'undefined') {
    window.EmployeeDirectoryApp = appInstance;
    window.getDirectoryStats = () => appInstance?.getStatistics();
}
