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
    const tabs = ['company', 'tools', 'assessment', 'ai-assessment', 'results'];
    const currentIndex = tabs.indexOf(currentTab);

    if (currentIndex < tabs.length - 1) {
        const nextTab = tabs[currentIndex + 1];
        document.querySelectorAll('.nav-tab')[currentIndex + 1].click();
    }
}

function updateProgress() {
    const tabs = ['company', 'tools', 'assessment', 'ai-assessment', 'results'];
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
    } else if (sliderId === 'aiBudgetAllocation') {
        valueDisplay.textContent = slider.value + '%';
    } else if (sliderId === 'securityStaffCount' || sliderId === 'totalEmployeeCount') {
        calculateStaffRatio();
    } else if (sliderId === 'aiTrainedProfessionals' || sliderId === 'totalEmployeesAI') {
        calculateAIStaffRatio();
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

// AI Assessment Helper Functions
function getAISafeValue(elementId, defaultValue = 5) {
    const element = document.getElementById(elementId);
    return element ? parseInt(element.value) || defaultValue : defaultValue;
}

function getAISafeDisplayText(elementId, defaultText = 'Not selected') {
    const element = document.getElementById(elementId);
    return element && element.selectedOptions[0] ? element.selectedOptions[0].text : defaultText;
}

function getAIImplementationTimelineText() {
    const value = getAISafeValue('aiImplementationTimeline');
    const texts = ['Not Planned', 'Exploring (12+ months)', 'Planning (6-12 months)', 'Implementing (3-6 months)', 'Early Deployment (0-3 months)', 'Mature Program (18+ months)'];
    return texts[value - 1] || 'Not selected';
}

function getAIToolEvaluationText() {
    const value = getAISafeValue('aiToolEvaluation');
    const texts = ['Vendor Claims Only', 'Basic POC Testing', 'Comprehensive Evaluation', 'Continuous Monitoring', 'Advanced Benchmarking'];
    return texts[value - 2] || 'Not selected';
}

function calculateStaffRatio() {
    const securityStaff = parseInt(document.getElementById('securityStaffCount').value) || 0;
    const totalEmployees = parseInt(document.getElementById('totalEmployeeCount').value) || 1;
    const ratio = (securityStaff / totalEmployees) * 1000;

    document.getElementById('staffRatioValue').textContent = ratio.toFixed(1);
    return ratio;
}

function calculateAIStaffRatio() {
    const aiTrainedStaff = parseInt(document.getElementById('aiTrainedProfessionals').value) || 0;
    const totalEmployees = parseInt(document.getElementById('totalEmployeesAI').value) || 1;
    const ratio = (aiTrainedStaff / totalEmployees) * 1000;

    document.getElementById('aiStaffRatioValue').textContent = ratio.toFixed(1);
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

    // Traditional 15-factor scores (normalized to 0-10) - with proper validation
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
    if (securityBudgetPercent < 5) budgetScore = securityBudgetPercent * 0.5;
    else if (securityBudgetPercent < 10) budgetScore = 2.5 + ((securityBudgetPercent - 5) * 0.3);
    else if (securityBudgetPercent < 12) budgetScore = 4 + ((securityBudgetPercent - 10) * 0.5);
    else if (securityBudgetPercent < 15) budgetScore = 5 + ((securityBudgetPercent - 12) * 1);
    else if (securityBudgetPercent < 20) budgetScore = 8 + ((securityBudgetPercent - 15) * 0.4);
    else budgetScore = 10;

    // Normalize staff ratio to 0-10 scale
    let staffScore;
    if (staffRatio < 5) staffScore = staffRatio * 0.8;
    else if (staffRatio < 10) staffScore = 4 + ((staffRatio - 5) * 0.8);
    else if (staffRatio < 15) staffScore = 8 + ((staffRatio - 10) * 0.4);
    else if (staffRatio < 25) staffScore = 10;
    else staffScore = 10 - Math.min((staffRatio - 25) * 0.05, 2);

    // Enhanced normalization for training frequency
    let normalizedTraining;
    if (trainingFrequency === 0) normalizedTraining = 1;
    else if (trainingFrequency <= 2) normalizedTraining = trainingFrequency * 2;
    else if (trainingFrequency <= 4) normalizedTraining = 4 + ((trainingFrequency - 2) * 1.5);
    else if (trainingFrequency <= 6) normalizedTraining = 7 + ((trainingFrequency - 4) * 1);
    else normalizedTraining = 9 + Math.min((trainingFrequency - 6) * 0.5, 1);

    // Enhanced normalization for compliance complexity
    let normalizedCompliance;
    if (complianceComplexity <= 2) normalizedCompliance = 9;
    else if (complianceComplexity <= 4) normalizedCompliance = 7 + ((4 - complianceComplexity) * 0.5);
    else if (complianceComplexity <= 6) normalizedCompliance = 5 + ((6 - complianceComplexity) * 1);
    else normalizedCompliance = Math.max(1, 5 - ((complianceComplexity - 6) * 0.8));

    // Enhanced factor weights (more balanced and realistic)
    const weights = {
        irMaturity: 0.16,
        managementSupport: 0.12,
        securityCulture: 0.10,
        budgetScore: 0.10,
        staffScore: 0.09,
        itAccessibility: 0.08,
        trainingFrequency: 0.08,
        remoteSecurity: 0.07,
        complianceComplexity: 0.06,
        tprm: 0.05,
        policyApproachability: 0.03,
        communicationAtmosphere: 0.03,
        crossDepartmentCollaboration: 0.02,
        securityGovernance: 0.01,
        changeManagement: 0.01
    };

    // Calculate traditional composite score
    const traditionalScore =
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

    // AI Assessment Scores (1-10 scale)
    const aiThreatDetection = getAISafeValue('aiThreatDetection');
    const aiBehavioralAnalytics = getAISafeValue('aiBehavioralAnalytics');
    const aiAnomalyDetection = getAISafeValue('aiAnomalyDetection');
    const aiFalsePositiveReduction = getAISafeValue('aiFalsePositiveReduction');
    const aiIncidentResponse = getAISafeValue('aiIncidentResponse');
    const aiOrchestration = getAISafeValue('aiOrchestration');
    const aiThreatHunting = getAISafeValue('aiThreatHunting');
    const aiWorkflowAutomation = getAISafeValue('aiWorkflowAutomation');
    const aiModelGovernance = getAISafeValue('aiModelGovernance');
    const aiExplainability = getAISafeValue('aiExplainability');
    const aiBiasMitigation = getAISafeValue('aiBiasMitigation');
    const aiComplianceMonitoring = getAISafeValue('aiComplianceMonitoring');
    const aiDataPipeline = getAISafeValue('aiDataPipeline');
    const aiModelLifecycle = getAISafeValue('aiModelLifecycle');
    const aiPlatformIntegration = getAISafeValue('aiPlatformIntegration');
    const aiDataFlow = getAISafeValue('aiDataFlow');
    const aiStrategyPlanning = getAISafeValue('aiStrategyPlanning');
    const aiBudgetAllocation = getAISafeValue('aiBudgetAllocation') / 5; // Convert 0-50% to 0-10 scale
    const aiStaffRatio = calculateAIStaffRatio();
    const aiImplementationTimeline = getAISafeValue('aiImplementationTimeline');
    const aiToolEvaluation = getAISafeValue('aiToolEvaluation');

    // Calculate AI Maturity Score using weighted average
    const aiCapabilityScores = [
        aiThreatDetection, aiBehavioralAnalytics, aiAnomalyDetection, aiFalsePositiveReduction,
        aiIncidentResponse, aiOrchestration, aiThreatHunting, aiWorkflowAutomation,
        aiModelGovernance, aiExplainability, aiBiasMitigation, aiComplianceMonitoring,
        aiDataPipeline, aiModelLifecycle, aiPlatformIntegration, aiDataFlow,
        aiStrategyPlanning, aiBudgetAllocation, aiImplementationTimeline, aiToolEvaluation
    ];

    // Normalize AI staff ratio to 0-10 scale (industry standard: 5-15 per 1000 employees)
    let normalizedAiStaffScore;
    if (aiStaffRatio < 2) normalizedAiStaffScore = aiStaffRatio * 2;
    else if (aiStaffRatio < 5) normalizedAiStaffScore = 4 + ((aiStaffRatio - 2) * 1.2);
    else if (aiStaffRatio < 10) normalizedAiStaffScore = 7.6 + ((aiStaffRatio - 5) * 0.4);
    else normalizedAiStaffScore = 9.6 + Math.min((aiStaffRatio - 10) * 0.04, 0.4);

    // Replace the raw AI staff ratio with normalized score
    aiCapabilityScores[18] = normalizedAiStaffScore;

    // Calculate AI Maturity Score
    const aiMaturityScore = aiCapabilityScores.reduce((sum, score) => sum + score, 0) / aiCapabilityScores.length;

    // Calculate AI Maturity Multiplier
    const aiMaturityMultiplier = 1 + ((aiMaturityScore - 2.5) / 10) * 0.5;

    // Calculate AI-Enhanced Score
    const aiEnhancedScore = traditionalScore * aiMaturityMultiplier;

    // Calculate Final Composite Score
    const finalCompositeScore = (traditionalScore * 0.7) + (aiEnhancedScore * 0.3);

    // Determine traditional threat detection level
    let threatLevel, levelClass, levelDescription;
    if (traditionalScore < 2.5) {
        threatLevel = 'L0';
        levelClass = 'level-l0';
        levelDescription = 'Ad hoc - Unstructured, reactive, heavy reliance on improvisation';
    } else if (traditionalScore < 4.5) {
        threatLevel = 'L1';
        levelClass = 'level-l1';
        levelDescription = 'Defined - Core policies exist; processes partially followed; limited automation';
    } else if (traditionalScore < 6.8) {
        threatLevel = 'L2';
        levelClass = 'level-l2';
        levelDescription = 'Managed - Documented processes; exercises; risk-based coverage; measurable outcomes';
    } else if (traditionalScore < 8.5) {
        threatLevel = 'L3';
        levelClass = 'level-l3';
        levelDescription = 'Quantitatively Managed - Metrics-driven; continuous validation; orchestration; cross-functional response';
    } else {
        threatLevel = 'L4';
        levelClass = 'level-l4';
        levelDescription = 'Predictive, Automated, Optimized - AI-assisted detection and response; continuous improvement; proactive threat modeling';
    }

    // Determine AI maturity level
    let aiMaturityLevel, aiLevelClass, aiLevelDescription;
    if (aiMaturityScore < 1.5) {
        aiMaturityLevel = 'L0';
        aiLevelClass = 'level-l0';
        aiLevelDescription = 'Manual Operations - No AI automation, signature-based detection only';
    } else if (aiMaturityScore < 3.5) {
        aiMaturityLevel = 'L1';
        aiLevelClass = 'level-l1';
        aiLevelDescription = 'Automation Rules - Basic automation and rule-based AI features';
    } else if (aiMaturityScore < 5.5) {
        aiMaturityLevel = 'L2';
        aiLevelClass = 'level-l2';
        aiLevelDescription = 'AI Assistance - AI assists analysts with recommendations and automated triage';
    } else if (aiMaturityScore < 7.5) {
        aiMaturityLevel = 'L3';
        aiLevelClass = 'level-l3';
        aiLevelDescription = 'AI Collaboration - Human-AI collaboration with AI handling routine tasks';
    } else {
        aiMaturityLevel = 'L4';
        aiLevelClass = 'level-l4';
        aiLevelDescription = 'AI Delegation - AI handles most operations autonomously with strategic oversight';
    }

    // Calculate Combined Maturity Level
    const avgMaturityLevel = (traditionalScore + aiMaturityScore) / 2;
    let combinedLevel, combinedClass, combinedDescription;
    if (avgMaturityLevel < 2.5) {
        combinedLevel = 'L0';
        combinedClass = 'level-l0';
        combinedDescription = 'Manual Foundation - Building basic security processes with minimal automation';
    } else if (avgMaturityLevel < 4.5) {
        combinedLevel = 'L1';
        combinedClass = 'level-l1';
        combinedDescription = 'Structured Approach - Established processes with basic automation and AI exploration';
    } else if (avgMaturityLevel < 6.8) {
        combinedLevel = 'L2';
        combinedClass = 'level-l2';
        combinedDescription = 'Integrated Security - Comprehensive processes with AI assistance and measurable outcomes';
    } else if (avgMaturityLevel < 8.5) {
        combinedLevel = 'L3';
        combinedClass = 'level-l3';
        combinedDescription = 'Advanced Integration - Metrics-driven with AI collaboration and automated response';
    } else {
        combinedLevel = 'L4';
        combinedClass = 'level-l4';
        combinedDescription = 'Autonomous Security - AI-driven security with predictive capabilities and self-optimization';
    }

    // Generate combined recommendations
    const recommendations = generateCombinedRecommendations(
        threatLevel, aiMaturityLevel, combinedLevel,
        traditionalScore, aiMaturityScore, finalCompositeScore,
        {
            traditional: {
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
            },
            ai: {
                aiThreatDetection, aiBehavioralAnalytics, aiAnomalyDetection, aiFalsePositiveReduction,
                aiIncidentResponse, aiOrchestration, aiThreatHunting, aiWorkflowAutomation,
                aiModelGovernance, aiExplainability, aiBiasMitigation, aiComplianceMonitoring,
                aiDataPipeline, aiModelLifecycle, aiPlatformIntegration, aiDataFlow,
                aiStrategyPlanning, aiBudgetAllocation: aiBudgetAllocation * 5, // Convert back to percentage
                aiStaffRatio: normalizedAiStaffScore,
                aiImplementationTimeline, aiToolEvaluation
            }
        }
    );

    // Display enhanced results
    displayEnhancedResults(
        companyName,
        traditionalScore, aiMaturityScore, finalCompositeScore,
        threatLevel, aiMaturityLevel, combinedLevel,
        levelClass, aiLevelClass, combinedClass,
        levelDescription, aiLevelDescription, combinedDescription,
        recommendations,
        {
            aiThreatDetection, aiBehavioralAnalytics, aiAnomalyDetection, aiFalsePositiveReduction,
            aiIncidentResponse, aiOrchestration, aiThreatHunting, aiWorkflowAutomation,
            aiModelGovernance, aiExplainability, aiBiasMitigation, aiComplianceMonitoring,
            aiDataPipeline, aiModelLifecycle, aiPlatformIntegration, aiDataFlow,
            aiStrategyPlanning, aiBudgetAllocation: aiBudgetAllocation * 5,
            aiStaffRatio: normalizedAiStaffScore,
            aiImplementationTimeline, aiToolEvaluation
        }
    );

    // Show results tab
    document.querySelectorAll('.nav-tab')[4].click();
}

function generateCombinedRecommendations(traditionalLevel, aiLevel, combinedLevel, traditionalScore, aiScore, compositeScore, factors) {
    const recommendations = [];

    // Traditional security recommendations
    if (traditionalLevel === 'L0' || traditionalScore < 3) {
        recommendations.push({
            priority: 'high',
            category: 'traditional',
            title: 'Establish Basic IR Policy and Playbooks',
            description: 'Document incident response policies and create playbooks for common scenarios. This is foundational for moving beyond ad hoc responses.',
            impact: 'High',
            effort: 'Medium',
            timeframe: '2-4 weeks'
        });

        recommendations.push({
            priority: 'high',
            category: 'traditional',
            title: 'Implement SIEM and EDR Coverage',
            description: 'Deploy basic SIEM for critical assets and EDR for endpoints to gain visibility into security events.',
            impact: 'High',
            effort: 'High',
            timeframe: '3-6 months'
        });
    }

    // AI-specific recommendations based on AI maturity
    if (aiLevel === 'L0' || aiScore < 2) {
        recommendations.push({
            priority: 'high',
            category: 'ai',
            title: 'Develop AI Strategy and Roadmap',
            description: 'Create a comprehensive AI strategy for security operations, including use cases, requirements, and implementation timeline.',
            impact: 'High',
            effort: 'Medium',
            timeframe: '4-6 weeks'
        });

        recommendations.push({
            priority: 'high',
            category: 'ai',
            title: 'Begin AI Tool Evaluation',
            description: 'Start evaluating AI-enhanced security tools for threat detection, incident response, and security orchestration.',
            impact: 'High',
            effort: 'Medium',
            timeframe: '2-3 months'
        });
    } else if (aiLevel === 'L1' || aiScore < 4) {
        recommendations.push({
            priority: 'medium',
            category: 'ai',
            title: 'Enhance AI-Powered Detection',
            description: 'Upgrade to AI-enhanced threat detection capabilities with machine learning algorithms for better accuracy.',
            impact: 'High',
            effort: 'High',
            timeframe: '3-6 months'
        });
    } else if (aiLevel === 'L2' || aiScore < 6) {
        recommendations.push({
            priority: 'medium',
            category: 'ai',
            title: 'Implement AI Orchestration',
            description: 'Deploy AI-powered security orchestration platforms to automate response workflows and reduce analyst workload.',
            impact: 'High',
            effort: 'High',
            timeframe: '4-8 months'
        });
    } else if (aiLevel === 'L3' || aiScore < 8) {
        recommendations.push({
            priority: 'low',
            category: 'ai',
            title: 'Achieve AI-Human Collaboration',
            description: 'Refine human-AI collaboration models, ensuring AI handles routine tasks while humans focus on strategic decisions.',
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '6-12 months'
        });
    }

    // Specific AI capability recommendations
    if (factors.ai.aiThreatDetection < 6) {
        recommendations.push({
            priority: 'high',
            category: 'ai',
            title: 'Upgrade AI Threat Detection',
            description: `Current AI threat detection score (${factors.ai.aiThreatDetection}/10) needs improvement. Implement advanced ML/AI detection engines.`,
            impact: 'High',
            effort: 'High',
            timeframe: '3-6 months'
        });
    }

    if (factors.ai.aiIncidentResponse < 6) {
        recommendations.push({
            priority: 'medium',
            category: 'ai',
            title: 'Automate AI Incident Response',
            description: `Current AI incident response score (${factors.ai.aiIncidentResponse}/10) indicates need for automated response capabilities.`,
            impact: 'High',
            effort: 'High',
            timeframe: '4-8 months'
        });
    }

    if (factors.ai.aiModelGovernance < 6) {
        recommendations.push({
            priority: 'medium',
            category: 'ai',
            title: 'Establish AI Governance Framework',
            description: `AI governance score (${factors.ai.aiModelGovernance}/10) requires comprehensive AI model oversight and compliance procedures.`,
            impact: 'Medium',
            effort: 'Medium',
            timeframe: '2-4 months'
        });
    }

    if (factors.ai.aiDataPipeline < 6) {
        recommendations.push({
            priority: 'medium',
            category: 'ai',
            title: 'Improve AI Data Management',
            description: `AI data pipeline score (${factors.ai.aiDataPipeline}/10) indicates need for structured data management for AI systems.`,
            impact: 'Medium',
            effort: 'High',
            timeframe: '3-6 months'
        });
    }

    // Budget and staffing recommendations
    if (factors.traditional.rawValues.budgetPercent < 8) {
        recommendations.push({
            priority: 'high',
            category: 'traditional',
            title: 'Increase Security Budget',
            description: `Security budget (${factors.traditional.rawValues.budgetPercent}% of IT budget) is critically low. Target 12-18% for optimal security posture.`,
            impact: 'High',
            effort: 'High',
            timeframe: '6-12 months'
        });
    }

    if (factors.ai.aiBudgetAllocation < 15) {
        recommendations.push({
            priority: 'medium',
            category: 'ai',
            title: 'Increase AI Investment',
            description: `AI budget allocation (${factors.ai.aiBudgetAllocation.toFixed(0)}% of security budget) should increase to 20-30% for competitive AI adoption.`,
            impact: 'High',
            effort: 'High',
            timeframe: '6-18 months'
        });
    }

    // Combined maturity progression recommendations
    if (combinedLevel === 'L0' || combinedLevel === 'L1') {
        recommendations.push({
            priority: 'high',
            category: 'combined',
            title: 'Foundation Building Phase',
            description: 'Focus on establishing basic security processes while exploring AI opportunities. Target L2 maturity within 12-18 months.',
            impact: 'High',
            effort: 'High',
            timeframe: '12-18 months'
        });
    } else if (combinedLevel === 'L2') {
        recommendations.push({
            priority: 'medium',
            category: 'combined',
            title: 'AI Integration Phase',
            description: 'Integrate AI capabilities into existing security processes. Focus on AI assistance and automation. Target L3 maturity within 18-24 months.',
            impact: 'High',
            effort: 'High',
            timeframe: '18-24 months'
        });
    } else if (combinedLevel === 'L3') {
        recommendations.push({
            priority: 'low',
            category: 'combined',
            title: 'Optimization Phase',
            description: 'Optimize AI-human collaboration and move toward autonomous security operations. Target L4 maturity within 24+ months.',
            impact: 'Medium',
            effort: 'High',
            timeframe: '24+ months'
        });
    }

    // Sort recommendations by priority and limit to top 10 most impactful
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return recommendations
        .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        .slice(0, 10);
}

function displayEnhancedResults(
    companyName, traditionalScore, aiScore, compositeScore,
    traditionalLevel, aiLevel, combinedLevel,
    traditionalClass, aiClass, combinedClass,
    traditionalDesc, aiDesc, combinedDesc,
    recommendations, aiFactors
) {
    const resultsHTML = `
                <div class="threat-level ${combinedClass}">
                    <h3>${companyName} - Comprehensive Security & AI Assessment Results</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.8em; font-weight: 700;">${traditionalScore.toFixed(1)}/10</div>
                            <div style="font-size: 1.2em; margin: 5px 0;">Traditional Score</div>
                            <div style="font-size: 1em; opacity: 0.9;">Level: ${traditionalLevel}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.8em; font-weight: 700;">${aiScore.toFixed(1)}/10</div>
                            <div style="font-size: 1.2em; margin: 5px 0;">AI Maturity Score</div>
                            <div style="font-size: 1em; opacity: 0.9;">Level: ${aiLevel}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2.2em; font-weight: 700;">${compositeScore.toFixed(1)}/10</div>
                            <div style="font-size: 1.2em; margin: 5px 0;">Combined Score</div>
                            <div style="font-size: 1em; opacity: 0.9;">Level: ${combinedLevel}</div>
                        </div>
                    </div>
                    <h2>Overall Maturity Level: ${combinedLevel}</h2>
                    <p>${combinedDesc}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;">
                    <div class="results-section">
                        <h3>Traditional Security Assessment</h3>
                        <div class="factor-score">
                            <span class="factor-name">Traditional Maturity Level</span>
                            <span class="factor-value">${traditionalLevel}</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">Security Score</span>
                            <span class="factor-value">${traditionalScore.toFixed(1)}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">Level Description</span>
                            <span style="font-size: 0.9em; color: #6b7280;">${traditionalDesc}</span>
                        </div>
                    </div>
                    
                    <div class="results-section">
                        <h3>AI Maturity Assessment</h3>
                        <div class="factor-score">
                            <span class="factor-name">AI Maturity Level</span>
                            <span class="factor-value">${aiLevel}</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">AI Capability Score</span>
                            <span class="factor-value">${aiScore.toFixed(1)}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">Level Description</span>
                            <span style="font-size: 0.9em; color: #6b7280;">${aiDesc}</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-section">
                    <h3>AI Capability Breakdown</h3>
                    <div class="form-row">
                        <div class="factor-score">
                            <span class="factor-name">AI Threat Detection</span>
                            <span class="factor-value">${aiFactors.aiThreatDetection}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">AI Behavioral Analytics</span>
                            <span class="factor-value">${aiFactors.aiBehavioralAnalytics}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">AI Incident Response</span>
                            <span class="factor-value">${aiFactors.aiIncidentResponse}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">AI Orchestration</span>
                            <span class="factor-value">${aiFactors.aiOrchestration}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">AI Model Governance</span>
                            <span class="factor-value">${aiFactors.aiModelGovernance}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">AI Data Pipeline</span>
                            <span class="factor-value">${aiFactors.aiDataPipeline}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">AI Strategy & Planning</span>
                            <span class="factor-value">${aiFactors.aiStrategyPlanning}/10</span>
                        </div>
                        <div class="factor-score">
                            <span class="factor-name">AI Budget Allocation</span>
                            <span class="factor-value">${aiFactors.aiBudgetAllocation.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-section">
                    <h3>Traditional Security Factor Breakdown</h3>
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
                    <h3>Priority Recommendations (Traditional + AI)</h3>
                    <p>Based on your comprehensive assessment results across both traditional security and AI capabilities, here are prioritized actions to advance your maturity:</p>
                    
                    ${recommendations.map(rec => `
                        <div class="recommendation-item priority-${rec.priority}">
                            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                                <h4>${rec.title}</h4>
                                <span style="margin-left: auto; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; background: ${rec.category === 'traditional' ? '#3b82f6' : rec.category === 'ai' ? '#10b981' : '#8b5cf6'}; color: white;">
                                    ${rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
                                </span>
                            </div>
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
                    <h4>AI Maturity Insights</h4>
                    <p><strong>Current AI Maturity (${aiLevel}):</strong> ${aiDesc}</p>
                    <p><strong>Next Level Target:</strong> ${getNextAIMaturityTarget(aiLevel)}</p>
                    <p><strong>Key Focus Areas:</strong> ${getAIFocusAreas(aiFactors)}</p>
                </div>
                
                <div class="alert alert-success">
                    <h4>Combined Maturity Journey</h4>
                    <p>Your organization is at <strong>${combinedLevel}</strong> combined maturity level, indicating ${combinedDesc.toLowerCase()}.</p>
                    <p><strong>AI Integration Opportunity:</strong> ${getAIIntegrationAdvice(traditionalLevel, aiLevel)}</p>
                </div>
                
                <button class="btn btn-primary" onclick="window.print()">Print Results</button>
                <button class="btn btn-secondary" onclick="exportResults()">Export to PDF</button>
            `;

    document.getElementById('resultsContent').innerHTML = resultsHTML;
}

function getNextAIMaturityTarget(currentLevel) {
    const targets = {
        'L0': 'Move to L1 (Automation Rules) by implementing basic AI automation in security tools',
        'L1': 'Advance to L2 (AI Assistance) by adding AI-powered threat detection and analysis',
        'L2': 'Progress to L3 (AI Collaboration) by achieving human-AI partnership in security operations',
        'L3': 'Reach L4 (AI Delegation) by implementing autonomous AI security operations',
        'L4': 'Maintain excellence and innovate with next-generation AI security capabilities'
    };
    return targets[currentLevel] || 'Continue advancing AI capabilities';
}

function getAIFocusAreas(aiFactors) {
    const lowScores = [];
    if (aiFactors.aiThreatDetection < 6) lowScores.push('AI threat detection');
    if (aiFactors.aiIncidentResponse < 6) lowScores.push('AI incident response');
    if (aiFactors.aiModelGovernance < 6) lowScores.push('AI governance');
    if (aiFactors.aiDataPipeline < 6) lowScores.push('AI data management');
    if (aiFactors.aiStrategyPlanning < 6) lowScores.push('AI strategy');

    return lowScores.length > 0 ? lowScores.join(', ') : 'Strong across all AI capability areas';
}

function getAIIntegrationAdvice(traditionalLevel, aiLevel) {
    if (traditionalLevel === 'L0' || traditionalLevel === 'L1') {
        if (aiLevel === 'L0' || aiLevel === 'L1') {
            return 'Focus on building traditional security foundation while exploring AI opportunities';
        } else {
            return 'Balance AI capabilities with traditional security process maturity';
        }
    } else if (traditionalLevel === 'L2' || traditionalLevel === 'L3') {
        if (aiLevel === 'L0' || aiLevel === 'L1') {
            return 'Excellent traditional foundation - prioritize AI capability development';
        } else {
            return 'Strong position for advanced AI integration and automation';
        }
    } else {
        return 'Mature traditional security - optimize AI collaboration and autonomous operations';
    }
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