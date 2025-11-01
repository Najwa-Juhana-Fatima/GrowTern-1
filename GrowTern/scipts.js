// script.js

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeModal();
    initializeFilters();
    initializeSmoothScrolling();
    initializeSkillAssessment();
    initializeCourseRecommendations();
    initializeDashboardStats();
    initializeNotificationSystem();
    initializeResumeAnalyzer();
    initializeProgressTracking();
    initializeMentorConnect();
});

// Modal functionality for internship details
function initializeModal() {
    const modal = document.getElementById('internshipModal');
    const closeModal = document.querySelector('.close-modal');
    const viewDetailsButtons = document.querySelectorAll('.internship-footer .btn-outline');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const internshipCard = this.closest('.internship-card');
            const internshipTitle = internshipCard.querySelector('h3').textContent;
            const companyName = internshipCard.querySelector('.company').textContent;
            const tags = internshipCard.querySelectorAll('.tag');
            const matchPercentage = internshipCard.querySelector('.meter-label span:last-child').textContent;
            const missingSkills = Array.from(internshipCard.querySelectorAll('.missing-skills li')).map(li => li.textContent);
            
            // Populate modal with internship data
            populateModal(internshipTitle, companyName, tags, matchPercentage, missingSkills);
            modal.style.display = 'flex';
        });
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function populateModal(title, company, tags, matchPercentage, missingSkills) {
    const modal = document.getElementById('internshipModal');
    
    // Update modal content
    modal.querySelector('h2').textContent = title;
    modal.querySelector('.company').textContent = company;
    
    // Update tags
    const tagsContainer = modal.querySelector('.tags');
    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
        tagsContainer.appendChild(tag.cloneNode(true));
    });
    
    // Update skill meter
    const meterFill = modal.querySelector('.meter-fill');
    const meterLabel = modal.querySelector('.meter-label span:last-child');
    meterFill.style.width = matchPercentage;
    meterLabel.textContent = matchPercentage;
    
    // Update missing skills
    const missingSkillsList = modal.querySelector('.missing-skills ul');
    missingSkillsList.innerHTML = '';
    missingSkills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        missingSkillsList.appendChild(li);
    });
    
    // Generate personalized learning path based on missing skills
    const learningPath = generateLearningPath(missingSkills);
    const learningPathList = modal.querySelector('.missing-skills ol');
    learningPathList.innerHTML = '';
    learningPath.forEach(course => {
        const li = document.createElement('li');
        li.textContent = course;
        learningPathList.appendChild(li);
    });
}

// Filter functionality for internships
function initializeFilters() {
    const categoryFilter = document.getElementById('category');
    const locationFilter = document.getElementById('location');
    const stipendFilter = document.getElementById('stipend');
    const internshipCards = document.querySelectorAll('.internship-card');
    
    [categoryFilter, locationFilter, stipendFilter].forEach(filter => {
        filter.addEventListener('change', () => {
            filterInternships();
        });
    });
    
    function filterInternships() {
        const categoryValue = categoryFilter.value;
        const locationValue = locationFilter.value;
        const stipendValue = stipendFilter.value;
        
        internshipCards.forEach(card => {
            let showCard = true;
            
            // Category filter
            if (categoryValue !== 'all') {
                const categoryTag = card.querySelector('.tag:not(.tag-remote):not(.tag-paid)');
                if (!categoryTag || !categoryTag.textContent.toLowerCase().includes(categoryValue)) {
                    showCard = false;
                }
            }
            
            // Location filter
            if (locationValue !== 'all') {
                if (locationValue === 'remote') {
                    const remoteTag = card.querySelector('.tag-remote');
                    if (!remoteTag) showCard = false;
                } else {
                    const locationTags = card.querySelectorAll('.tag:not(.tag-remote):not(.tag-paid)');
                    let hasLocation = false;
                    locationTags.forEach(tag => {
                        if (tag.textContent.toLowerCase().includes(locationValue)) {
                            hasLocation = true;
                        }
                    });
                    if (!hasLocation) showCard = false;
                }
            }
            
            // Stipend filter
            if (stipendValue !== 'all') {
                const paidTag = card.querySelector('.tag-paid');
                if (stipendValue === 'paid' && !paidTag) {
                    showCard = false;
                } else if (stipendValue === 'unpaid' && paidTag) {
                    showCard = false;
                }
            }
            
            // Show or hide card based on filters
            card.style.display = showCard ? 'block' : 'none';
        });
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Skill Assessment functionality
function initializeSkillAssessment() {
    const skillAssessmentBtn = document.querySelector('.btn-outline[style*="color: white"]');
    
    if (skillAssessmentBtn) {
        skillAssessmentBtn.addEventListener('click', function() {
            // Create skill assessment modal
            createSkillAssessmentModal();
        });
    }
}

function createSkillAssessmentModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'skillAssessmentModal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Skill Assessment</h2>
            <p>Take this quick assessment to help us recommend the best internships for you.</p>
            
            <div id="assessmentQuestions">
                <!-- Questions will be dynamically added here -->
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button id="submitAssessment" class="btn btn-primary">Submit Assessment</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add questions to the assessment
    const questionsContainer = document.getElementById('assessmentQuestions');
    const questions = [
        {
            question: "Which field are you most interested in?",
            options: ["Web Development", "Data Science", "Digital Marketing", "UI/UX Design", "Mobile App Development"]
        },
        {
            question: "What is your experience level?",
            options: ["Beginner", "Intermediate", "Advanced"]
        },
        {
            question: "Which programming languages are you familiar with?",
            options: ["HTML/CSS", "JavaScript", "Python", "Java", "C++", "None of the above"]
        },
        {
            question: "What type of internship are you looking for?",
            options: ["Remote", "On-site", "Hybrid"]
        },
        {
            question: "What is your availability?",
            options: ["Full-time", "Part-time", "Flexible"]
        }
    ];
    
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'assessment-question';
        questionDiv.innerHTML = `
            <h3>${index + 1}. ${q.question}</h3>
            <div class="options">
                ${q.options.map(option => `
                    <label class="option">
                        <input type="radio" name="question${index}" value="${option}">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
        questionsContainer.appendChild(questionDiv);
    });
    
    // Add styles for assessment
    const style = document.createElement('style');
    style.textContent = `
        .assessment-question {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border: 1px solid #eee;
            border-radius: 8px;
        }
        .assessment-question h3 {
            margin-bottom: 1rem;
            color: var(--secondary);
        }
        .options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        .option:hover {
            background-color: #f5f5f5;
        }
        .option input {
            margin: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
    
    // Submit assessment
    const submitBtn = document.getElementById('submitAssessment');
    submitBtn.addEventListener('click', () => {
        // Collect answers
        const answers = {};
        questions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            answers[`question${index}`] = selectedOption ? selectedOption.value : null;
        });
        
        // In a real app, you would send this data to a server
        // For this demo, we'll just show a success message
        alert('Assessment submitted! We will now personalize your internship recommendations.');
        
        // Close modal
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.head.removeChild(style);
        
        // Update dashboard with assessment completion
        updateDashboardAfterAssessment();
    });
}

// Course recommendations based on missing skills
function initializeCourseRecommendations() {
    const viewLearningPathButtons = document.querySelectorAll('.missing-skills .btn-primary');
    
    viewLearningPathButtons.forEach(button => {
        button.addEventListener('click', function() {
            const internshipCard = this.closest('.internship-card');
            const missingSkills = Array.from(internshipCard.querySelectorAll('.missing-skills li')).map(li => li.textContent);
            
            // Show course recommendations modal
            showCourseRecommendations(missingSkills);
        });
    });
}

function showCourseRecommendations(missingSkills) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'courseRecommendationsModal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Personalized Learning Path</h2>
            <p>Based on your skill gaps, here's a recommended learning path:</p>
            
            <div id="courseList">
                <!-- Courses will be dynamically added here -->
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button id="startLearningPath" class="btn btn-primary">Start Learning Path</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add courses based on missing skills
    const courseList = document.getElementById('courseList');
    const learningPath = generateLearningPath(missingSkills);
    
    learningPath.forEach((course, index) => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-item';
        courseDiv.innerHTML = `
            <h3>${index + 1}. ${course}</h3>
            <div class="course-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">0% complete</span>
            </div>
            <button class="btn btn-outline start-course">Start Course</button>
        `;
        courseList.appendChild(courseDiv);
    });
    
    // Add styles for courses
    const style = document.createElement('style');
    style.textContent = `
        .course-item {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border: 1px solid #eee;
            border-radius: 8px;
        }
        .course-item h3 {
            margin-bottom: 1rem;
            color: var(--secondary);
        }
        .course-progress {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .progress-bar {
            flex: 1;
            height: 8px;
            background-color: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background-color: var(--success);
            border-radius: 4px;
            transition: width 0.3s;
        }
        .progress-text {
            font-size: 0.9rem;
            color: #666;
            min-width: 70px;
        }
    `;
    document.head.appendChild(style);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
    
    // Start course buttons
    const startCourseButtons = document.querySelectorAll('.start-course');
    startCourseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseItem = this.closest('.course-item');
            const courseTitle = courseItem.querySelector('h3').textContent;
            
            // Update progress
            const progressFill = courseItem.querySelector('.progress-fill');
            const progressText = courseItem.querySelector('.progress-text');
            
            // Simulate course progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${progress}% complete`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    this.textContent = 'Course Completed';
                    this.disabled = true;
                    this.classList.remove('btn-outline');
                    this.classList.add('btn-primary');
                    
                    // Update overall progress in dashboard
                    updateCourseProgress();
                }
            }, 500);
        });
    });
    
    // Start learning path button
    const startLearningPathBtn = document.getElementById('startLearningPath');
    startLearningPathBtn.addEventListener('click', () => {
        // Start the first course
        const firstCourseBtn = document.querySelector('.start-course');
        if (firstCourseBtn) {
            firstCourseBtn.click();
        }
    });
}

// Generate learning path based on missing skills
function generateLearningPath(missingSkills) {
    const courseMap = {
        'React.js': 'React.js Crash Course (5 hours)',
        'JavaScript ES6+': 'JavaScript ES6+ Fundamentals (3 hours)',
        'Responsive Design': 'Responsive Web Design (2 hours)',
        'SQL': 'SQL for Beginners (4 hours)',
        'Python (Pandas)': 'Python Data Analysis with Pandas (6 hours)',
        'Data Visualization': 'Data Visualization with Tableau (4 hours)',
        'Statistics': 'Statistics for Data Science (5 hours)',
        'Prototyping (Figma)': 'Figma for UI/UX Design (3 hours)'
    };
    
    return missingSkills.map(skill => courseMap[skill] || `${skill} Course (3 hours)`);
}

// Dashboard statistics and progress tracking
function initializeDashboardStats() {
    // Update profile strength based on user actions
    updateProfileStrength();
    
    // Set up progress rings
    setupProgressRings();
}

function updateProfileStrength() {
    // In a real app, this would be calculated based on user data
    // For demo, we'll set a default value
    const profileStrength = 70; // Percentage
    
    const profileStrengthElement = document.querySelector('.stat-card .stat-value');
    if (profileStrengthElement) {
        profileStrengthElement.textContent = `${profileStrength}%`;
    }
    
    // Update the progress ring
    const progressRing = document.querySelector('.progress-ring circle:last-child');
    if (progressRing) {
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (profileStrength / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
    }
}

function setupProgressRings() {
    // This function sets up the circular progress indicators
    // The HTML already has the SVG structure, we just need to update it based on data
    updateProfileStrength(); // This updates the main profile strength ring
    
    // You could add more rings for other metrics here
}

function updateDashboardAfterAssessment() {
    // Update dashboard stats after skill assessment
    const internshipsApplied = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const skillsLearned = document.querySelector('.stat-card:nth-child(3) .stat-value');
    const coursesCompleted = document.querySelector('.stat-card:nth-child(4) .stat-value');
    
    // Increment values to show progress
    if (internshipsApplied) internshipsApplied.textContent = '13';
    if (skillsLearned) skillsLearned.textContent = '9';
    if (coursesCompleted) coursesCompleted.textContent = '6';
    
    // Update profile strength
    updateProfileStrength();
}

function updateCourseProgress() {
    // Update dashboard when a course is completed
    const coursesCompleted = document.querySelector('.stat-card:nth-child(4) .stat-value');
    const skillsLearned = document.querySelector('.stat-card:nth-child(3) .stat-value');
    
    if (coursesCompleted) {
        const currentCount = parseInt(coursesCompleted.textContent);
        coursesCompleted.textContent = (currentCount + 1).toString();
    }
    
    if (skillsLearned) {
        const currentCount = parseInt(skillsLearned.textContent);
        skillsLearned.textContent = (currentCount + 1).toString();
    }
    
    // Update profile strength
    updateProfileStrength();
}

// Notification system
function initializeNotificationSystem() {
    // Create notification bell in header
    const notificationBell = document.createElement('div');
    notificationBell.className = 'notification-bell';
    notificationBell.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="18" cy="6" r="3" fill="#ff4757"/>
        </svg>
    `;
    
    // Add notification bell to navbar
    const navbar = document.querySelector('.navbar');
    navbar.appendChild(notificationBell);
    
    // Add styles for notification bell
    const style = document.createElement('style');
    style.textContent = `
        .notification-bell {
            position: relative;
            cursor: pointer;
            color: var(--dark);
            margin-left: 1rem;
        }
        .notification-bell:hover {
            color: var(--primary);
        }
        .notification-bell circle {
            fill: #ff4757;
        }
    `;
    document.head.appendChild(style);
    
    // Notification bell click event
    notificationBell.addEventListener('click', showNotifications);
}

function showNotifications() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'notificationsModal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Notifications</h2>
            
            <div class="notifications-list">
                <div class="notification-item">
                    <div class="notification-icon">🎯</div>
                    <div class="notification-content">
                        <h4>New Internship Match</h4>
                        <p>A new Data Analyst internship matches 85% of your skills.</p>
                        <span class="notification-time">2 hours ago</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon">📚</div>
                    <div class="notification-content">
                        <h4>Course Reminder</h4>
                        <p>Your "JavaScript ES6+ Fundamentals" course is 50% complete.</p>
                        <span class="notification-time">1 day ago</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon">👥</div>
                    <div class="notification-content">
                        <h4>Mentor Available</h4>
                        <p>A senior Data Analyst is available for a session this week.</p>
                        <span class="notification-time">2 days ago</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notifications-list {
            margin-top: 1rem;
        }
        .notification-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid #eee;
        }
        .notification-item:last-child {
            border-bottom: none;
        }
        .notification-icon {
            font-size: 1.5rem;
        }
        .notification-content {
            flex: 1;
        }
        .notification-content h4 {
            margin-bottom: 0.5rem;
            color: var(--secondary);
        }
        .notification-time {
            font-size: 0.8rem;
            color: #666;
        }
    `;
    document.head.appendChild(style);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
}

// Resume Analyzer
function initializeResumeAnalyzer() {
    // This would typically be in a separate page, but for demo we'll add a button
    const resumeAnalyzerBtn = document.createElement('button');
    resumeAnalyzerBtn.className = 'btn btn-outline';
    resumeAnalyzerBtn.textContent = 'Analyze Resume';
    resumeAnalyzerBtn.style.marginTop = '1rem';
    
    // Add to dashboard or somewhere appropriate
    const dashboard = document.querySelector('.dashboard-content');
    if (dashboard) {
        dashboard.appendChild(resumeAnalyzerBtn);
        
        resumeAnalyzerBtn.addEventListener('click', showResumeAnalyzer);
    }
}

function showResumeAnalyzer() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'resumeAnalyzerModal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Resume Analyzer</h2>
            <p>Upload your resume to see how it matches with internship requirements.</p>
            
            <div style="margin: 2rem 0; text-align: center;">
                <div class="upload-area" id="uploadArea">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>Drag & drop your resume here or click to browse</p>
                    <input type="file" id="resumeUpload" accept=".pdf,.doc,.docx" style="display: none;">
                </div>
            </div>
            
            <div id="analysisResults" style="display: none;">
                <h3>Analysis Results</h3>
                <div class="skill-meter">
                    <div class="meter-label">
                        <span>Overall Match:</span>
                        <span>65%</span>
                    </div>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: 65%;"></div>
                    </div>
                </div>
                
                <div style="margin: 1.5rem 0;">
                    <h4>Strong Skills:</h4>
                    <div class="tags">
                        <span class="tag" style="background-color: #d4edda; color: #155724;">HTML</span>
                        <span class="tag" style="background-color: #d4edda; color: #155724;">CSS</span>
                        <span class="tag" style="background-color: #d4edda; color: #155724;">JavaScript</span>
                    </div>
                </div>
                
                <div style="margin: 1.5rem 0;">
                    <h4>Missing Skills:</h4>
                    <div class="tags">
                        <span class="tag" style="background-color: #f8d7da; color: #721c24;">React</span>
                        <span class="tag" style="background-color: #f8d7da; color: #721c24;">Node.js</span>
                        <span class="tag" style="background-color: #f8d7da; color: #721c24;">MongoDB</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="btn btn-primary">View Recommended Courses</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Upload area functionality
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('resumeUpload');
    const analysisResults = document.getElementById('analysisResults');
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = '#f0f0f0';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            analyzeResume();
        }
    });
    
    fileInput.addEventListener('change', analyzeResume);
    
    function analyzeResume() {
        // Simulate resume analysis
        uploadArea.innerHTML = '<p>Analyzing your resume...</p>';
        
        setTimeout(() => {
            analysisResults.style.display = 'block';
            uploadArea.style.display = 'none';
        }, 2000);
    }
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        }
    });
}

// Progress tracking for courses and skills
function initializeProgressTracking() {
    // This would track user progress across the platform
    // For demo purposes, we'll simulate some progress updates
    
    // Check if user has completed any actions and update progress accordingly
    updateProgressIndicators();
}

function updateProgressIndicators() {
    // Update various progress indicators on the page
    // This would typically pull data from a backend
    
    // For demo, we'll just ensure the profile strength is updated
    updateProfileStrength();
}

// Mentor Connect feature
function initializeMentorConnect() {
    // This would typically be on a separate page, but for demo we'll add a button
    const mentorConnectBtn = document.createElement('button');
    mentorConnectBtn.className = 'btn btn-outline';
    mentorConnectBtn.textContent = 'Connect with Mentors';
    mentorConnectBtn.style.marginTop = '1rem';
    
    // Add to dashboard or somewhere appropriate
    const dashboard = document.querySelector('.dashboard-content');
    if (dashboard) {
        dashboard.appendChild(mentorConnectBtn);
        
        mentorConnectBtn.addEventListener('click', showMentorConnect);
    }
}

function showMentorConnect() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'mentorConnectModal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Connect with Mentors</h2>
            <p>Get guidance from professionals who have been where you are.</p>
            
            <div class="mentors-list">
                <div class="mentor-card">
                    <div class="mentor-avatar">JS</div>
                    <div class="mentor-info">
                        <h3>John Smith</h3>
                        <p>Senior Web Developer at TechCorp</p>
                        <div class="mentor-skills">
                            <span class="tag">React</span>
                            <span class="tag">JavaScript</span>
                            <span class="tag">Node.js</span>
                        </div>
                    </div>
                    <button class="btn btn-primary">Request Session</button>
                </div>
                
                <div class="mentor-card">
                    <div class="mentor-avatar">SD</div>
                    <div class="mentor-info">
                        <h3>Sarah Davis</h3>
                        <p>Data Scientist at DataInsights</p>
                        <div class="mentor-skills">
                            <span class="tag">Python</span>
                            <span class="tag">SQL</span>
                            <span class="tag">Machine Learning</span>
                        </div>
                    </div>
                    <button class="btn btn-primary">Request Session</button>
                </div>
                
                <div class="mentor-card">
                    <div class="mentor-avatar">MJ</div>
                    <div class="mentor-info">
                        <h3>Michael Johnson</h3>
                        <p>UI/UX Designer at CreativeMinds</p>
                        <div class="mentor-skills">
                            <span class="tag">Figma</span>
                            <span class="tag">UI Design</span>
                            <span class="tag">Prototyping</span>
                        </div>
                    </div>
                    <button class="btn btn-primary">Request Session</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for mentors
    const style = document.createElement('style');
    style.textContent = `
        .mentors-list {
            margin-top: 1rem;
        }
        .mentor-card {
            display: flex;
            gap: 1rem;
            padding: 1.5rem;
            border: 1px solid #eee;
            border-radius: 8px;
            margin-bottom: 1rem;
            align-items: center;
        }
        .mentor-avatar {
            width: 60px;
            height: 60px;
            background-color: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2rem;
        }
        .mentor-info {
            flex: 1;
        }
        .mentor-info h3 {
            margin-bottom: 0.5rem;
            color: var(--secondary);
        }
        .mentor-info p {
            margin-bottom: 0.5rem;
            color: #666;
        }
        .mentor-skills {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
    `;
    document.head.appendChild(style);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Request session buttons
    const requestButtons = document.querySelectorAll('.mentor-card .btn');
    requestButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mentorCard = this.closest('.mentor-card');
            const mentorName = mentorCard.querySelector('h3').textContent;
            
            alert(`Session requested with ${mentorName}! They will contact you soon.`);
        });
    });
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
}

// Additional utility functions can be added here as needed