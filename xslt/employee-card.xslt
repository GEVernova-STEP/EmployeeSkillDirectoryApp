<?xml version="1.0" encoding="UTF-8"?>
<!-- Employee card template -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <!-- Employee card template -->
    <xsl:template name="employeeCard">
        <xsl:param name="employee" select="."/>
        
        <div class="employee-card">
            <xsl:attribute name="data-id">
                <xsl:value-of select="$employee/@id"/>
            </xsl:attribute>
            <xsl:attribute name="data-department">
                <xsl:value-of select="$employee/jobInfo/department"/>
            </xsl:attribute>
            <xsl:attribute name="data-experience">
                <xsl:value-of select="$employee/jobInfo/yearsOfExperience"/>
            </xsl:attribute>
            
            <xsl:call-template name="employeeBasicInfo">
                <xsl:with-param name="employee" select="$employee"/>
            </xsl:call-template>
            
            <xsl:call-template name="employeeSkills">
                <xsl:with-param name="employee" select="$employee"/>
            </xsl:call-template>
        </div>
    </xsl:template>
    
    <!-- Basic info section -->
    <xsl:template name="employeeBasicInfo">
        <xsl:param name="employee" select="."/>
        <div class="employee-info">
            <h2 class="employee-name">
                <xsl:value-of select="concat($employee/personalInfo/firstName, ' ', $employee/personalInfo/lastName)"/>
            </h2>
            <p class="employee-position">
                <xsl:value-of select="$employee/jobInfo/position"/>
            </p>
            <p class="employee-department">
                <xsl:value-of select="$employee/jobInfo/department"/>
            </p>
            <p class="employee-experience">
                💼 <xsl:value-of select="$employee/jobInfo/yearsOfExperience"/> years experience
            </p>
        </div>
    </xsl:template>
    
    <!-- Skills section -->
    <xsl:template name="employeeSkills">
        <xsl:param name="employee" select="."/>
        <div class="employee-skills">
            <h3>Skills</h3>
            <div class="skills-list">
                <xsl:for-each select="$employee/skills/skill">
                    <span class="skill-badge">
                        <xsl:attribute name="data-proficiency">
                            <xsl:value-of select="proficiency"/>
                        </xsl:attribute>
                        <xsl:attribute name="title">
                            <xsl:value-of select="concat(name, ' - ', proficiency, ' (', yearsUsed, ' years)')"/>
                        </xsl:attribute>
                        <xsl:value-of select="name"/>
                        <span class="skill-level">
                            <xsl:call-template name="skillStars">
                                <xsl:with-param name="proficiency" select="proficiency"/>
                            </xsl:call-template>
                        </span>
                    </span>
                </xsl:for-each>
            </div>
        </div>
    </xsl:template>
    
    <!-- Skill Stars Helper -->
    <xsl:template name="skillStars">
        <xsl:param name="proficiency"/>
        <xsl:choose>
            <xsl:when test="$proficiency='Expert'"> ⭐⭐⭐</xsl:when>
            <xsl:when test="$proficiency='Advanced'"> ⭐⭐</xsl:when>
            <xsl:otherwise> ⭐</xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
</xsl:stylesheet>
