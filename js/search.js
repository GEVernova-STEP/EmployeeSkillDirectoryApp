// Search module for filtering employees

class EmployeeSearch {
    constructor() {
        this.searchInput = null;
        this.employeeCards = [];
        this.debounceTimer = null;
        this.debounceDelay = 300; // milliseconds
    }

    // Initialize the search module
    init() {
        this.searchInput = document.getElementById('searchInput');
        
        if (!this.searchInput) {
            console.warn('Search input element not found');
            return;
        }
        
        this.employeeCards = Array.from(document.querySelectorAll('.employee-card'));
        this.attachEventListeners();
        
        console.log('Search module initialized');
    }

    // Attach event listeners
    attachEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Clear search on Escape key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    // Handle search with debouncing
    handleSearch(query) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, this.debounceDelay);
    }

    // Perform the actual search
    performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        let visibleCount = 0;
        
        this.employeeCards.forEach(card => {
            const isMatch = this.matchesSearchQuery(card, searchTerm);
            
            if (isMatch) {
                card.style.display = '';
                card.classList.add('showing');
                card.classList.remove('hiding');
                visibleCount++;
            } else {
                card.classList.add('hiding');
                card.classList.remove('showing');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        this.updateResultCount(visibleCount);
        this.toggleNoResultsMessage(visibleCount === 0);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('searchComplete', {
            detail: { query: searchTerm, visibleCount }
        }));
    }

    // Check if a card matches the search query
    matchesSearchQuery(card, searchTerm) {
        if (!searchTerm) return true; // Show all if search is empty
        
        // Get searchable text content
        const name = card.querySelector('.employee-name')?.textContent.toLowerCase() || '';
        const position = card.querySelector('.employee-position')?.textContent.toLowerCase() || '';
        const department = card.querySelector('.employee-department')?.textContent.toLowerCase() || '';
        
        // Get skills
        const skillBadges = card.querySelectorAll('.skill-badge');
        const skills = Array.from(skillBadges).map(badge => 
            badge.textContent.toLowerCase()
        ).join(' ');
        
        // Get mentor specialization if available
        const mentorSpec = card.querySelector('.mentor-specialization')?.textContent.toLowerCase() || '';
        
        // Combine all searchable text
        const searchableText = `${name} ${position} ${department} ${skills} ${mentorSpec}`;
        
        return searchableText.includes(searchTerm);
    }

    // Update the visible employee count
    updateResultCount(count) {
        const countElement = document.getElementById('totalCount');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    // Toggle the "No Results" message
    toggleNoResultsMessage(show) {
        const noResultsElement = document.getElementById('noResults');
        if (noResultsElement) {
            noResultsElement.style.display = show ? 'block' : 'none';
        }
    }

    // Clear the search
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.performSearch('');
        }
    }

    // Get current search query
    getCurrentQuery() {
        return this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
    }

    // Refresh the card list
    refresh() {
        this.employeeCards = Array.from(document.querySelectorAll('.employee-card'));
        const currentQuery = this.getCurrentQuery();
        if (currentQuery) {
            this.performSearch(currentQuery);
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EmployeeSearch = EmployeeSearch;
}
