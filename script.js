let currentTab = 'company';
let assessmentData = {
    company: {},
    tools: [],
    factors: {}
};

function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
    currentTab = tabId;

    updateProgress();
}

function nextTab() {
    const tabs = ['company', 'tools', 'assessment', 'results'];
    const currentIndex = tabs.indexOf(currentTab);

    if (currentIndex < tabs.length - 1) {
        const nextTab = tabs[currentIndex + 1];
        document.querySelectorAll('.nav-tab')[currentIndex + 1].click();
    }
}

function updateProgress() {
    const tabs = ['company', 'tools', 'assessment', 'results'];
    const currentIndex = tabs.indexOf(currentTab);
    const progress = ((currentIndex + 1) / tabs.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function toggleCheckbox(element) {
    const checkbox = element.querySelector('input[type="checkbox"], input[type="radio"]');
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        if (checkbox.type === 'checkbox') {
            element.classList.toggle('selected', checkbox.checked);
        }
    }
}

function toggleCategory(element) {
    const content = element.nextElementSibling;
    const arrow = element.querySelector('span:last-child');

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        arrow.textContent = '▼';
    } else {
        content.classList.add('expanded');
        arrow.textContent = '▲';
    }
}

function updateSliderValue(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);

    if (sliderId === 'securityBudget') {
        valueDisplay.textContent = slider.value + '%';
    } else if (sliderId === 'securityStaffCount' || sliderId === 'totalEmployeeCount') {
        calculateStaffRatio();
    } else {
        valueDisplay.textContent = slider.value;
    }
}

// Helper functions for safe value display
function getSafeDisplayValue(elementId, defaultValue = 5) {
    const element = document.getElementById(elementId);
    return element ? parseInt(element.value) || defaultValue : defaultValue;
}

function getSafeDisplayText(elementId, defaultText = 'Not selected') {
    const element = document.getElementById(elementId);
    return element && element.selectedOptions[0] ? element.selectedOptions[0].text : defaultText;
}

function getTrainingFrequencyText() {
    const value = getSafeDisplayValue('trainingFrequency');
    const texts = ['Never', 'Rarely (<1/year)', 'Occasionally (1-2/year)', 'Regularly (2-4/year)', 'Frequently (4-6/year)', 'Very Frequently (6+/year)', 'Continuous'];
    return texts[value] || 'Not selected';
}

function getComplianceText() {
    const value = getSafeDisplayValue('complianceComplexity');
    const texts = ['Very Simple', 'Simple', 'Moderate', 'Complex', 'Very Complex', 'Extremely Complex'];
    return texts[value] || 'Not selected';
}

function calculateStaffRatio() {
    const securityStaff = parseInt(document.getElementById('securityStaffCount').value) || 0;
    const totalEmployees = parseInt(document.getElementById('totalEmployeeCount').value) || 1;
    const ratio = (securityStaff / totalEmployees) * 1000;

    document.getElementById('staffRatioValue').textContent = ratio.toFixed(1);
    return ratio;
}

function calculateResults() {
    // Collect assessment data with proper validation
    const companyName = document.getElementById('companyName').value || 'Your Organization';

    // Helper function to get numeric value safely
    const getSafeValue = (elementId, defaultValue = 5) => {
        const element = document.getElementById(elementId);
        const value = parseInt(element?.value) || defaultValue;
        return Math.max(0, Math.min(10, value)); // Clamp between 0-10
    };

    // Factor scores (normalized to 0-10) - with proper validation
    const itAccessibility = getSafeValue('itAccessibility');
    const irMaturity = getSafeValue('irMaturity');
    const managementSupport = getSafeValue('managementSupport');
    const remoteSecurity = getSafeValue('remoteSecurity');
    const tprm = getSafeValue('tprm');
    const securityCulture = getSafeValue('securityCulture');
    const policyApproachability = getSafeValue('policyApproachability');
    const communicationAtmosphere = getSafeValue('communicationAtmosphere');
    const crossDepartmentCollaboration = getSafeValue('crossDepartmentCollaboration');
    const securityGovernance = getSafeValue('securityGovernance');
    const changeManagement = getSafeValue('changeManagement');

    // Special handling for dropdown values
    const trainingElement = document.getElementById('trainingFrequency');
    const trainingFrequency = trainingElement ? parseInt(trainingElement.value) || 5 : 5;

    const complianceElement = document.getElementById('complianceComplexity');
    const complianceComplexity = complianceElement ? parseInt(complianceElement.value) || 5 : 5;

    // Get numeric form values
    const securityBudgetPercent = getSafeValue('securityBudget', 5) * 2; // Convert 0-10 scale back to percentage
    const staffRatio = calculateStaffRatio();

    // Normalize budget to 0-10 scale (industry standard: 12-18% is good)
    let budgetScore;
    if (securityBudgetPercent < 5) budgetScore = securityBudgetPercent * 0.5; // Very low budget
    else if (securityBudgetPercent < 10) budgetScore = 2.5 + ((securityBudgetPercent - 5) * 0.3); // Below average
    else if (securityBudgetPercent < 12) budgetScore = 4 + ((securityBudgetPercent - 10) * 0.5); // Getting better
    else if (securityBudgetPercent < 15) budgetScore = 5 + ((securityBudgetPercent - 12) * 1); // Good range
    else if (securityBudgetPercent < 20) budgetScore = 8 + ((securityBudgetPercent - 15) * 0.4); // Excellent
    else budgetScore = 10; // Outstanding

    // Normalize staff ratio to 0-10 scale (industry standard: 10-20 per 1000 employees)
    let staffScore;
    if (staffRatio < 5) staffScore = staffRatio * 0.8; // Very understaffed
    else if (staffRatio < 10) staffScore = 4 + ((staffRatio - 5) * 0.8); // Below average
    else if (staffRatio < 15) staffScore = 8 + ((staffRatio - 10) * 0.4); // Good range
    else if (staffRatio < 25) staffScore = 10; // Excellent
    else staffScore = 10 - Math.min((staffRatio - 25) * 0.05, 2); // Diminishing returns

    // Enhanced normalization for training frequency (0-10 scale)
    let normalizedTraining;
    if (trainingFrequency === 0) normalizedTraining = 1; // Never trained
    else if (trainingFrequency <= 2) normalizedTraining = trainingFrequency * 2; // Rare training
    else if (trainingFrequency <= 4) normalizedTraining = 4 + ((trainingFrequency - 2) * 1.5); // Improving
    else if (trainingFrequency <= 6) normalizedTraining = 7 + ((trainingFrequency - 4) * 1); // Good
    else normalizedTraining = 9 + Math.min((trainingFrequency - 6) * 0.5, 1); // Excellent+

    // Enhanced normalization for compliance complexity (reverse scale - less complexity = higher score)
    let normalizedCompliance;
    if (complianceComplexity <= 2) normalizedCompliance = 9; // Simple compliance
    else if (complianceComplexity <= 4) normalizedCompliance = 7 + ((4 - complianceComplexity) * 0.5); // Moderate
    else if (complianceComplexity <= 6) normalizedCompliance = 5 + ((6 - complianceComplexity) * 1); // Complex
    else normalizedCompliance = Math.max(1, 5 - ((complianceComplexity - 6) * 0.8)); // Very complex

    // Enhanced factor weights (more balanced and realistic)
    const weights = {
        irMaturity: 0.16,              // Most critical factor
        managementSupport: 0.12,       // Executive buy-in crucial
        securityCulture: 0.10,         // Human factor very important
        budgetScore: 0.10,             // Resource availability
        staffScore: 0.09,              // Human resources
        itAccessibility: 0.08,         // Technical foundation
        trainingFrequency: 0.08,       // Human awareness
        remoteSecurity: 0.07,          // Modern work environment
        complianceComplexity: 0.06,    // Regulatory burden
        tprm: 0.05,                    // Third-party risk
        policyApproachability: 0.03,   // Policy accessibility
        communicationAtmosphere: 0.03, // Cultural aspect
        crossDepartmentCollaboration: 0.02, // Cross-functional
        securityGovernance: 0.01,      // Formal structure
        changeManagement: 0.01         // Process maturity
    };

    // Calculate composite score with all normalized values
    const compositeScore =
        irMaturity * weights.irMaturity +
        managementSupport * weights.managementSupport +
        securityCulture * weights.securityCulture +
        budgetScore * weights.budgetScore +
        staffScore * weights.staffScore +
        itAccessibility * weights.itAccessibility +
        normalizedTraining * weights.trainingFrequency +
        remoteSecurity * weights.remoteSecurity +
        normalizedCompliance * weights.complianceComplexity +
        tprm * weights.tprm +
        policyApproachability * weights.policyApproachability +
        communicationAtmosphere * weights.communicationAtmosphere +
        crossDepartmentCollaboration * weights.crossDepartmentCollaboration +
        securityGovernance * weights.securityGovernance +
        changeManagement * weights.changeManagement;

    // Validate the final score
    const finalScore = Math.max(0, Math.min(10, compositeScore));

    // Determine threat detection level
    let threatLevel, levelClass, levelDescription;
    if (finalScore < 2.5) {
        threatLevel = 'L0';
        levelClass = 'level-l0';
        levelDescription = 'Ad hoc - Unstructured, reactive, heavy reliance on improvisation';
    } else if (finalScore < 4.5) {
        threatLevel = 'L1';
        levelClass = 'level-l1';
        levelDescription = 'Defined - Core policies exist; processes partially followed; limited automation';
    } else if (finalScore < 6.8) {
        threatLevel = 'L2';
        levelClass = 'level-l2';
        levelDescription = 'Managed - Documented processes; exercises; risk-based coverage; measurable outcomes';
    } else if (finalScore < 8.5) {
        threatLevel = 'L3';
        levelClass = 'level-l3';
        levelDescription = 'Quantitatively Managed - Metrics-driven; continuous validation; orchestration; cross-functional response';
    } else {
        threatLevel = 'L4';
        levelClass = 'level-l4';
        levelDescription = 'Predictive, Automated, Optimized - AI-assisted detection and response; continuous improvement; proactive threat modeling';
    }

    // Generate recommendations with enhanced context
    const recommendations = generateRecommendations(threatLevel, finalScore, {
        itAccessibility, budgetScore, staffScore, irMaturity,
        trainingFrequency: normalizedTraining,
        managementSupport, complianceComplexity: normalizedCompliance,
        remoteSecurity, tprm, securityCulture,
        policyApproachability, communicationAtmosphere, crossDepartmentCollaboration,
        securityGovernance, changeManagement,
        rawValues: {
            budgetPercent: securityBudgetPercent,
            staffRatio: staffRatio,
            trainingFreq: trainingFrequency,
            complianceLevel: complianceComplexity
        }
    });

    // Display results
    displayResults(companyName, finalScore, threatLevel, levelClass, levelDescription, recommendations);

    // Show results tab
    document.querySelectorAll('.nav-tab')[3].click();
}

function generateRecommendations(level, score, factors) {
    const recommendations = [];

    // Priority based on current level with more nuanced thresholds
    if (level === 'L0' || score < 3) {
        recommendations.push({
            priority: 'high',
            title: 'Establish Basic IR Policy and Playbooks',
            description: 'Document incident response policies and create playbooks for common scenarios. This is foundational for moving beyond ad hoc responses.',
            impact: 'High',
            effort: 'Medium',
            timeframe: '2-4 weeks'
        });

        recommendations.push({
            priority: 'high',
            title: 'Implement SIEM and EDR Coverage',
            description: 'Deploy basic SIEM for critical assets and EDR for endpoints to gain visibility into security events.',
            impact: 'High',
            effort: 'High',
            timeframe: '3-6 months'
        });
    }

    // Enhanced IR maturity recommendations
    if (factors.irMaturity < 6) {
        recommendations.push({
            priority: 'high',
            title: 'Enhance Incident Response Capabilities',
            description: 'Conduct regular tabletop exercises, validate detections, and establish clear escalation paths.',
            impact: 'High',
            effort: 'Medium',
            timeframe: '1-3 months'
        });
    }

    // Budget-specific recommendations with actual percentages
    if (factors.rawValues.budgetPercent < 8) {
        recommendations.push({
            priority: 'high',
            title: 'Urgent: Increase Security Budget Allocation',
            description: `Your current security budget (${factors.rawValues.budgetPercent}% of IT budget) is critically low. Aim for 12-18% to support essential tools and staffing.`,
            impact: 'High',
            effort: 'High',
            timeframe: '6-12 months'
        });
    } else if (factors.rawValues.budgetPercent < 12) {
        recommendations.push({
            priority: 'medium',
            title: 'Increase Security Budget Allocation',
            description: `Your security budget (${factors.rawValues.budgetPercent}% of IT budget) is below industry standard. Target 12-18% for optimal security posture.`,
            impact: 'High',
            effort: 'High',
            timeframe: '6-12 months'
        });
    }

    // Staffing-specific recommendations
    if (factors.rawValues.staffRatio < 8) {
        recommendations.push({
            priority: 'high',
            title: 'Critical: Expand Security Team',
            description: `Your security staffing ratio (${factors.rawValues.staffRatio.toFixed(1)} per 1000 employees) is critically low. Target 10-20 security FTEs per 1,000 employees.`,
            impact: 'High',
            effort: 'High',
            timeframe: '6-18 months'
        });
    } else if (factors.rawValues.staffRatio < 15) {
        recommendations.push({
            priority: 'medium',
            title: 'Right-Size Security Team',
            description: `Consider expanding your security team from ${factors.rawValues.staffRatio.toFixed(1)} to 15-20 security FTEs per 1,000 employees.`,
            impact: 'High',
            effort: 'High',
            timeframe: '6-18 months'
        });
    }

    // Training frequency recommendations
    if (factors.rawValues.trainingFreq <= 2) {
        recommendations.push({
            priority: 'high',
            title: 'Implement Regular Security Training',
            description: `Current training frequency (${factors.rawValues.trainingFreq} times/year) is insufficient. Implement quarterly training with phishing simulations.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '2-3 months'
        });
    } else if (factors.rawValues.trainingFreq < 4) {
        recommendations.push({
            priority: 'medium',
            title: 'Enhance Training Program',
            description: `Increase training frequency from ${factors.rawValues.trainingFreq} to 4+ times per year with role-based content.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '2-3 months'
        });
    }

    // Compliance complexity recommendations
    if (factors.rawValues.complianceLevel > 7) {
        recommendations.push({
            priority: 'medium',
            title: 'Address High Compliance Complexity',
            description: `High compliance complexity (${factors.rawValues.complianceLevel}/8) requires dedicated compliance automation and policy management tools.`,
            impact: 'Medium',
            effort: 'High',
            timeframe: '4-6 months'
        });
    }

    if (factors.managementSupport < 7) {
        recommendations.push({
            priority: 'high',
            title: 'Strengthen Executive Security Engagement',
            description: `Management support score (${factors.managementSupport}/10) needs improvement. Establish regular security briefings with executive leadership.`,
            impact: 'High',
            effort: 'Medium',
            timeframe: '1-2 months'
        });
    }

    if (factors.securityCulture < 6) {
        recommendations.push({
            priority: 'medium',
            title: 'Implement Security Culture Program',
            description: `Security culture score (${factors.securityCulture}/10) needs improvement. Deploy regular security awareness campaigns and positive reinforcement programs.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '2-4 months'
        });
    }

    // Enhanced specific recommendations for other factors
    if (factors.itAccessibility < 6) {
        recommendations.push({
            priority: 'medium',
            title: 'Improve IT-Security Collaboration',
            description: `IT accessibility score (${factors.itAccessibility}/10) indicates need for better integration between IT and security teams.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '2-3 months'
        });
    }

    if (factors.remoteSecurity < 6) {
        recommendations.push({
            priority: 'medium',
            title: 'Enhance Remote Work Security',
            description: `Remote security score (${factors.remoteSecurity}/10) requires immediate attention. Implement MFA, ZTNA/VPN, and comprehensive EDR/MDM coverage.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '2-3 months'
        });
    }

    if (factors.policyApproachability < 6) {
        recommendations.push({
            priority: 'low',
            title: 'Improve Policy Accessibility',
            description: `Policy approachability score (${factors.policyApproachability}/10) needs improvement. Create user-friendly policy portals and clear communication channels.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '1-3 months'
        });
    }

    if (factors.communicationAtmosphere < 6) {
        recommendations.push({
            priority: 'high',
            title: 'Foster Open Security Communication',
            description: `Communication atmosphere score (${factors.communicationAtmosphere}/10) requires immediate attention for effective security culture.`,
            impact: 'High',
            effort: 'Medium',
            timeframe: '1-2 months'
        });
    }

    if (factors.crossDepartmentCollaboration < 6) {
        recommendations.push({
            priority: 'medium',
            title: 'Enhance Cross-Department Security Collaboration',
            description: `Cross-department collaboration score (${factors.crossDepartmentCollaboration}/10) needs improvement for comprehensive security coverage.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '2-3 months'
        });
    }

    if (factors.securityGovernance < 6) {
        recommendations.push({
            priority: 'medium',
            title: 'Strengthen Security Governance Structure',
            description: `Security governance score (${factors.securityGovernance}/10) requires formalization of roles and decision-making frameworks.`,
            impact: 'High',
            effort: 'Medium',
            timeframe: '2-4 months'
        });
    }

    if (factors.tprm < 6) {
        recommendations.push({
            priority: 'low',
            title: 'Establish Third-Party Risk Management',
            description: `TPRM maturity score (${factors.tprm}/10) indicates need for vendor risk assessment and continuous monitoring programs.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '3-6 months'
        });
    }

    if (factors.changeManagement < 6) {
        recommendations.push({
            priority: 'low',
            title: 'Implement Structured Change Management',
            description: `Change management score (${factors.changeManagement}/10) needs improvement for secure technology deployment processes.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '3-5 months'
        });
    }

    // Level-specific advanced recommendations
    if (level === 'L3' || level === 'L4') {
        recommendations.push({
            priority: 'low',
            title: 'Implement Advanced Threat Detection',
            description: 'Consider XDR platforms, threat intelligence integration, and automated response capabilities for enhanced detection.',
            impact: 'High',
            effort: 'High',
            timeframe: '6-12 months'
        });
    }

    // Sort recommendations by priority and limit to top 8 most impactful
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return recommendations
        .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        .slice(0, 8);
}

function displayResults(companyName, score, level, levelClass, levelDescription, recommendations) {
    const resultsHTML = `
                <div class="threat-level ${levelClass}">
                    <h3>${companyName} Security Assessment Results</h3>
                    <div class="score-display">${score.toFixed(1)}/10</div>
                    <h2>Threat Detection Level: ${level}</h2>
                    <p>${levelDescription}</p>
                </div>
                
                <div class="results-section">
                    <h3>Factor Breakdown</h3>
                    <div class="factor-score">
                        <span class="factor-name">IT Department Accessibility</span>
                        <span class="factor-value">${getSafeDisplayValue('itAccessibility')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Security Budget Allocation</span>
                        <span class="factor-value">${(getSafeDisplayValue('securityBudget') * 2).toFixed(0)}% of IT budget</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Security Staffing Ratio</span>
                        <span class="factor-value">${document.getElementById('staffRatioValue').textContent} per 1,000 employees</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Incident Response Maturity</span>
                        <span class="factor-value">${getSafeDisplayValue('irMaturity')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Training Frequency</span>
                        <span class="factor-value">${getSafeDisplayText('trainingFrequency')} (${getTrainingFrequencyText()})</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Management Support</span>
                        <span class="factor-value">${getSafeDisplayValue('managementSupport')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Compliance Complexity</span>
                        <span class="factor-value">${getSafeDisplayText('complianceComplexity')} (${getComplianceText()})</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Remote Work Security</span>
                        <span class="factor-value">${getSafeDisplayValue('remoteSecurity')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">TPRM Maturity</span>
                        <span class="factor-value">${getSafeDisplayValue('tprm')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Security Culture</span>
                        <span class="factor-value">${getSafeDisplayValue('securityCulture')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Policy Approachability</span>
                        <span class="factor-value">${getSafeDisplayValue('policyApproachability')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Communication Atmosphere</span>
                        <span class="factor-value">${getSafeDisplayValue('communicationAtmosphere')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Cross-Department Collaboration</span>
                        <span class="factor-value">${getSafeDisplayValue('crossDepartmentCollaboration')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Security Governance</span>
                        <span class="factor-value">${getSafeDisplayValue('securityGovernance')}/10</span>
                    </div>
                    <div class="factor-score">
                        <span class="factor-name">Change Management</span>
                        <span class="factor-value">${getSafeDisplayValue('changeManagement')}/10</span>
                    </div>
                </div>
                
                <div class="recommendations">
                    <h3>Priority Recommendations</h3>
                    <p>Based on your comprehensive 15-factor assessment results, here are prioritized actions to advance your threat detection maturity:</p>
                    
                    ${recommendations.map(rec => `
                        <div class="recommendation-item priority-${rec.priority}">
                            <h4>${rec.title}</h4>
                            <p>${rec.description}</p>
                            <div style="margin-top: 10px; font-size: 0.9em; color: #6b7280;">
                                <strong>Impact:</strong> ${rec.impact} | 
                                <strong>Effort:</strong> ${rec.effort} | 
                                <strong>Timeframe:</strong> ${rec.timeframe}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="alert alert-info">
                    <h4>Next Steps</h4>
                    <p>Use this assessment as a baseline for your security maturity journey. Re-assess quarterly to track progress and adjust priorities based on emerging threats and business changes.</p>
                </div>
                
                <button class="btn btn-primary" onclick="window.print()">Print Results</button>
                <button class="btn btn-secondary" onclick="exportResults()">Export to PDF</button>
            `;

    document.getElementById('resultsContent').innerHTML = resultsHTML;
}

function exportResults() {
    window.print();
}

function toggleDarkMode() {
    const body = document.body;
    const toggleButton = document.getElementById('darkModeToggle');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☀️ Light Mode';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggleButton.textContent = '🌙 Dark Mode';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Load dark mode preference from localStorage
function loadDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    const body = document.body;
    const toggleButton = document.getElementById('darkModeToggle');

    if (darkModePreference === 'enabled') {
        body.classList.add('dark-mode');
        toggleButton.textContent = '☀️ Light Mode';
    }
}

// Initialize
updateProgress();
loadDarkModePreference();

// Auto-expand first category for better UX
document.addEventListener('DOMContentLoaded', function () {
    const firstCategory = document.querySelector('.category-header');
    if (firstCategory) {
        firstCategory.click();
    }
});