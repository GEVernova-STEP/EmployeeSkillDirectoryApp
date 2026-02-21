<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    
    <!-- Main template -->
    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title><xsl:value-of select="employeeDirectory/metadata/title"/></title>
                <link rel="stylesheet" href="css/styles.css"/>
                <link rel="stylesheet" href="css/cards.css"/>
                <link rel="stylesheet" href="css/filters.css"/>
            </head>
            <body>
                <div class="container">
                    <!-- Header -->
                    <header class="header">
                        <h1><xsl:value-of select="employeeDirectory/metadata/title"/></h1>
                        <p class="subtitle">
                            <xsl:value-of select="employeeDirectory/metadata/organization"/>
                            <span class="divider">|</span>
                            <xsl:value-of select="employeeDirectory/metadata/totalEmployees"/> Employees
                        </p>
                    </header>

                    <!-- Search and Filter Controls -->
                    <div class="controls">
                        <div class="controls-top">
                            <div class="search-box">
                                <input 
                                    type="text" 
                                    id="searchInput" 
                                    placeholder="Search employees by name, skills, or department..."
                                    aria-label="Search employees"
                                />
                            </div>
                            <button id="addEmployeeBtn" class="add-employee-btn">Add Employee</button>
                        </div>
                        
                        <div class="filters">
                            <select id="departmentFilter" aria-label="Filter by department">
                                <option value="">All Departments</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Design">Design</option>
                                <option value="Product Management">Product Management</option>
                                <option value="Security">Security</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                            
                            <select id="experienceFilter" aria-label="Filter by experience">
                                <option value="">All Experience Levels</option>
                                <option value="0-3">Entry Level (0-3 years)</option>
                                <option value="4-7">Mid Level (4-7 years)</option>
                                <option value="8-100">Senior Level (8+ years)</option>
                            </select>
                            
                            <button id="resetFilters" class="reset-btn">Reset Filters</button>
                        </div>
                    </div>

                    <!-- Statistics Bar -->
                    <div class="stats-bar">
                        <div class="stat-item">
                            <span class="stat-label">Total Employees:</span>
                            <span class="stat-value" id="totalCount">
                                <xsl:value-of select="count(employeeDirectory/employees/employee)"/>
                            </span>
                        </div>
                    </div>

                    <!-- Employee Cards Grid -->
                    <div class="employee-grid" id="employeeGrid">
                        <xsl:apply-templates select="employeeDirectory/employees/employee">
                            <xsl:sort select="personalInfo/lastName" order="ascending"/>
                        </xsl:apply-templates>
                    </div>

                    <!-- No Results Message (Hidden by default) -->
                    <div id="noResults" class="no-results" style="display: none;">
                        <p>No employees found matching your criteria.</p>
                    </div>
                </div>

                <!-- Load JavaScript modules -->
                <script src="js/search.js"></script>
                <script src="js/filter.js"></script>
                <script src="js/app.js"></script>
            </body>
        </html>
    </xsl:template>

    <!-- Employee Card Template -->
    <xsl:template match="employee">
        <div class="employee-card">
            <xsl:attribute name="data-id">
                <xsl:value-of select="@id"/>
            </xsl:attribute>
            <xsl:attribute name="data-department">
                <xsl:value-of select="jobInfo/department"/>
            </xsl:attribute>
            <xsl:attribute name="data-experience">
                <xsl:value-of select="jobInfo/yearsOfExperience"/>
            </xsl:attribute>

            <!-- Personal Info -->
            <div class="employee-info">
                <h2 class="employee-name">
                    <xsl:value-of select="concat(personalInfo/firstName, ' ', personalInfo/lastName)"/>
                </h2>
                <p class="employee-position">
                    <xsl:value-of select="jobInfo/position"/>
                </p>
                <p class="employee-department">
                    <xsl:value-of select="jobInfo/department"/>
                </p>
            </div>

            <!-- Skills Section -->
            <div class="employee-skills">
                <h3>Skills</h3>
                <div class="skills-list">
                    <xsl:for-each select="skills/skill">
                        <span class="skill-badge">
                            <xsl:attribute name="data-proficiency">
                                <xsl:value-of select="proficiency"/>
                            </xsl:attribute>
                            <xsl:attribute name="title">
                                <xsl:value-of select="concat(name, ' - ', proficiency, ' (', yearsUsed, ' years)')"/>
                            </xsl:attribute>
                            <xsl:value-of select="name"/>
                            <span class="skill-level">
                                <xsl:choose>
                                    <xsl:when test="proficiency='Expert'">***</xsl:when>
                                    <xsl:when test="proficiency='Advanced'">**</xsl:when>
                                    <xsl:otherwise>*</xsl:otherwise>
                                </xsl:choose>
                            </span>
                        </span>
                    </xsl:for-each>
                </div>
            </div>

            <button class="edit-btn">Edit</button>

        </div>
    </xsl:template>

</xsl:stylesheet>
