// Filter module for department and experience filters

class EmployeeFilter {
    constructor() {
        this.departmentFilter = null;
        this.experienceFilter = null;
        this.resetButton = null;
        this.employeeCards = [];
        this.activeFilters = {};
    }

    // Initialize the filter module
    init() {
        this.departmentFilter = document.getElementById('departmentFilter');
        this.experienceFilter = document.getElementById('experienceFilter');
        this.resetButton = document.getElementById('resetFilters');
        
        if (!this.departmentFilter || !this.experienceFilter) {
            console.warn('Filter elements not found');
            return;
        }
        
        this.employeeCards = Array.from(document.querySelectorAll('.employee-card'));
        this.attachEventListeners();
        
        console.log('Filter module initialized');
    }

    // Attach event listeners
    attachEventListeners() {
        this.departmentFilter.addEventListener('change', () => this.applyFilters());
        this.experienceFilter.addEventListener('change', () => this.applyFilters());
        
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetFilters());
        }
    }

    // Apply all active filters
    applyFilters() {
        const department = this.departmentFilter.value;
        const experience = this.experienceFilter.value;
        
        this.activeFilters = {
            department,
            experience
        };
        
        let visibleCount = 0;
        
        this.employeeCards.forEach(card => {
            const matchesDepartment = this.filterByDepartment(card, department);
            const matchesExperience = this.filterByExperience(card, experience);
            
            const isVisible = matchesDepartment && matchesExperience;
            
            if (isVisible) {
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
        window.dispatchEvent(new CustomEvent('filterApplied', {
            detail: { filters: this.activeFilters, visibleCount }
        }));
    }

    // Filter by department
    filterByDepartment(card, department) {
        if (!department) return true;
        const cardDepartment = card.getAttribute('data-department');
        return cardDepartment === department;
    }

    // Filter by years of experience
    filterByExperience(card, experienceRange) {
        if (!experienceRange) return true;
        
        const years = parseInt(card.getAttribute('data-experience')) || 0;
        const [min, max] = experienceRange.split('-').map(Number);
        
        return years >= min && years <= max;
    }

    // Reset all filters
    resetFilters() {
        if (this.departmentFilter) this.departmentFilter.value = '';
        if (this.experienceFilter) this.experienceFilter.value = '';
        
        this.activeFilters = {};
        this.applyFilters();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('filtersReset'));
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

    // Get active filters
    getActiveFilters() {
        return { ...this.activeFilters };
    }

    // Set specific filter programmatically
    setFilter(filterType, value) {
        switch (filterType) {
            case 'department':
                if (this.departmentFilter) this.departmentFilter.value = value;
                break;
            case 'mentor':
                if (this.mentorFilter) this.mentorFilter.value = value;
                break;
            case 'experience':
                if (this.experienceFilter) this.experienceFilter.value = value;
                break;
        }
        this.applyFilters();
    }

    // Refresh the card list
    refresh() {
        this.employeeCards = Array.from(document.querySelectorAll('.employee-card'));
        this.applyFilters();
    }

    // Get filter statistics
    getStatistics() {
        const stats = {
            total: this.employeeCards.length,
            byDepartment: {},
            byExperience: {
                entry: 0,
                mid: 0,
                senior: 0
            }
        };
        
        this.employeeCards.forEach(card => {
            const dept = card.getAttribute('data-department');
            stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
            
            const years = parseInt(card.getAttribute('data-experience')) || 0;
            if (years <= 3) {
                stats.byExperience.entry++;
            } else if (years <= 7) {
                stats.byExperience.mid++;
            } else {
                stats.byExperience.senior++;
            }
        });
        
        return stats;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EmployeeFilter = EmployeeFilter;
}
