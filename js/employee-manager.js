// Employee Manager Module
// Handles adding and editing employee data

class EmployeeManager {
    constructor() {
        this.modal = null;
        this.form = null;
        this.isEditMode = false;
        this.currentEmployeeId = null;
        this.employees = [];
        this.nextId = 'E001';
    }

    // Initialize the employee manager
    init() {
        console.log('Initializing Employee Manager...');
        this.loadEmployees();
        this.createModal();
        this.attachEventListeners();
    }

    // Load employees from the DOM
    loadEmployees() {
        const cards = document.querySelectorAll('.employee-card');
        let maxId = 0;

        cards.forEach(card => {
            const id = card.getAttribute('data-id');
            const idNum = parseInt(id.replace('E', ''));
            if (idNum > maxId) {
                maxId = idNum;
            }
            this.employees.push(id);
        });

        this.nextId = 'E' + String(maxId + 1).padStart(3, '0');
    }

    // Create modal HTML
    createModal() {
        const modalHTML = `
            <div id="employeeModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modalTitle">Add New Employee</h2>
                        <button class="modal-close" id="closeModal">&times;</button>
                    </div>
                    <form id="employeeForm" class="employee-form">
                        <div class="form-group">
                            <label for="firstName">First Name *</label>
                            <input type="text" id="firstName" name="firstName" required/>
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" required/>
                        </div>
                        <div class="form-group">
                            <label for="department">Department *</label>
                            <select id="department" name="department" required>
                                <option value="">Select Department</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Design">Design</option>
                                <option value="Product Management">Product Management</option>
                                <option value="Security">Security</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="position">Position *</label>
                            <input type="text" id="position" name="position" required/>
                        </div>
                        <div class="form-group">
                            <label for="role">Role *</label>
                            <input type="text" id="role" name="role" required/>
                        </div>
                        <div class="form-group">
                            <label for="yearsOfExperience">Years of Experience *</label>
                            <input type="number" id="yearsOfExperience" name="yearsOfExperience" min="0" max="60" required/>
                        </div>
                        <div class="form-group">
                            <label>Skills (comma-separated with proficiency)</label>
                            <div id="skillsContainer">
                                <div class="skill-input-group">
                                    <input type="text" placeholder="Skill name" class="skill-name"/>
                                    <select class="skill-proficiency">
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                    <input type="number" placeholder="Years" class="skill-years" min="0" max="60"/>
                                    <button type="button" class="remove-skill-btn">Remove</button>
                                </div>
                            </div>
                            <button type="button" id="addSkillBtn" class="add-skill-btn">Add Skill</button>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">Save Employee</button>
                            <button type="button" id="cancelBtn" class="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('employeeModal');
        this.form = document.getElementById('employeeForm');
    }

    // Attach event listeners
    attachEventListeners() {
        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());

        // Skills
        document.getElementById('addSkillBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.addSkillInput();
        });

        document.getElementById('skillsContainer').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-skill-btn')) {
                e.preventDefault();
                e.target.parentElement.remove();
            }
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        // Add Employee button (from header)
        const addBtn = document.getElementById('addEmployeeBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        // Edit on card click
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.employee-card');
            if (card && e.target.classList.contains('edit-btn')) {
                const id = card.getAttribute('data-id');
                this.openEditModal(id);
            }
        });
    }

    // Add skill input row
    addSkillInput() {
        const skillHTML = `
            <div class="skill-input-group">
                <input type="text" placeholder="Skill name" class="skill-name"/>
                <select class="skill-proficiency">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                </select>
                <input type="number" placeholder="Years" class="skill-years" min="0" max="60"/>
                <button type="button" class="remove-skill-btn">Remove</button>
            </div>
        `;
        document.getElementById('skillsContainer').insertAdjacentHTML('beforeend', skillHTML);
    }

    // Open add employee modal
    openAddModal() {
        this.isEditMode = false;
        this.currentEmployeeId = null;
        document.getElementById('modalTitle').textContent = 'Add New Employee';
        this.form.reset();
        this.resetSkills();
        this.modal.style.display = 'flex';
    }

    // Open edit employee modal
    openEditModal(employeeId) {
        this.isEditMode = true;
        this.currentEmployeeId = employeeId;
        document.getElementById('modalTitle').textContent = 'Edit Employee';

        const card = document.querySelector(`[data-id="${employeeId}"]`);
        if (!card) return;

        // Extract data from card
        const name = card.querySelector('.employee-name').textContent.split(' ');
        const firstName = name[0];
        const lastName = name.slice(1).join(' ');
        const department = card.getAttribute('data-department');
        const position = card.querySelector('.employee-position').textContent;
        const years = card.getAttribute('data-experience');

        // Fill form
        document.getElementById('firstName').value = firstName;
        document.getElementById('lastName').value = lastName;
        document.getElementById('department').value = department;
        document.getElementById('position').value = position;
        document.getElementById('yearsOfExperience').value = years;

        // Extract and fill skills
        this.resetSkills();
        const skillBadges = card.querySelectorAll('.skill-badge');
        if (skillBadges.length > 0) {
            skillBadges.forEach((badge, index) => {
                const skillName = badge.textContent.replaceAll('*', '').trim();
                const proficiency = badge.getAttribute('data-proficiency');
                if (index === 0) {
                    document.querySelector('.skill-name').value = skillName;
                    document.querySelector('.skill-proficiency').value = proficiency;
                }
            });
        }

        this.modal.style.display = 'flex';
    }

    // Reset skills section
    resetSkills() {
        const container = document.getElementById('skillsContainer');
        container.innerHTML = `
            <div class="skill-input-group">
                <input type="text" placeholder="Skill name" class="skill-name"/>
                <select class="skill-proficiency">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                </select>
                <input type="number" placeholder="Years" class="skill-years" min="0" max="60"/>
                <button type="button" class="remove-skill-btn">Remove</button>
            </div>
        `;
    }

    // Save employee
    saveEmployee() {
        const formData = new FormData(this.form);

        const employeeData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            department: formData.get('department'),
            position: formData.get('position'),
            role: formData.get('role'),
            yearsOfExperience: formData.get('yearsOfExperience')
        };

        // Validate required fields
        if (!employeeData.firstName || !employeeData.lastName || !employeeData.department) {
            alert('Please fill in all required fields');
            return;
        }

        // Create or update card
        if (this.isEditMode) {
            this.updateEmployeeCard(this.currentEmployeeId, employeeData);
        } else {
            this.createEmployeeCard(employeeData);
        }

        this.closeModal();
        console.log('Employee saved:', employeeData);
        this.notifyModules();
    }

    // Create new employee card
    createEmployeeCard(data) {
        const grid = document.getElementById('employeeGrid');
        const newId = this.nextId;
        
        const cardHTML = `
            <div class="employee-card" data-id="${newId}" data-department="${data.department}" data-experience="${data.yearsOfExperience}">
                <div class="employee-info">
                    <h2 class="employee-name">${data.firstName} ${data.lastName}</h2>
                    <p class="employee-position">${data.position}</p>
                    <p class="employee-department">${data.department}</p>
                </div>
                <div class="employee-skills">
                    <h3>Skills</h3>
                    <div class="skills-list">
                        <span class="skill-badge" data-proficiency="Beginner" title="Sample skill">
                            Sample Skill
                            <span class="skill-level">*</span>
                        </span>
                    </div>
                </div>
                <button class="edit-btn">Edit</button>
            </div>
        `;

        grid.insertAdjacentHTML('beforeend', cardHTML);
        this.nextId = 'E' + String(parseInt(newId.replace('E', '')) + 1).padStart(3, '0');
    }

    // Update existing employee card
    updateEmployeeCard(id, data) {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (!card) return;

        card.setAttribute('data-department', data.department);
        card.setAttribute('data-experience', data.yearsOfExperience);

        card.querySelector('.employee-name').textContent = `${data.firstName} ${data.lastName}`;
        card.querySelector('.employee-position').textContent = data.position;
        card.querySelector('.employee-department').textContent = data.department;
    }

    // Close modal
    closeModal() {
        this.modal.style.display = 'none';
        this.form.reset();
    }

    // Notify other modules of changes
    notifyModules() {
        globalThis.dispatchEvent(new Event('employeeDataChanged'));
    }
}

// Export for global access
if (typeof globalThis !== 'undefined') {
    globalThis.EmployeeManager = EmployeeManager;
}
