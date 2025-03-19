/**
 * Chat Interface module - handles the chat UI functionality
 */

const ChatInterface = {
    // Chat elements
    elements: {
        typingContainer: document.getElementById('typing-container'),
        questionText: document.getElementById('question-text'),
        userMessage: document.getElementById('user-message'),
        optionsContainer: document.getElementById('options-container'),
        correctAnswer: document.getElementById('correct-answer'),
        nextSection: document.getElementById('next-section')
    },
    
    // Initialize chat interface
    init: function() {
        this.setupEventListeners();
    },
    
    // Start the question sequence
    startQuestionSequence: function() {
        // Show typing animation first
        this.showTypingAnimation();
        
        // After delay, show the question and options
        setTimeout(() => {
            this.hideTypingAnimation();
            this.showQuestion();
            
            // Show user options after a brief delay
            setTimeout(() => {
                this.showUserOptions();
            }, 1000);
        }, 2000);
    },
    
    // Show typing animation
    showTypingAnimation: function() {
        if (this.elements.typingContainer) {
            this.elements.typingContainer.classList.remove('hidden');
        }
        if (this.elements.questionText) {
            this.elements.questionText.classList.add('hidden');
        }
    },
    
    // Hide typing animation
    hideTypingAnimation: function() {
        if (this.elements.typingContainer) {
            this.elements.typingContainer.classList.add('hidden');
        }
    },
    
    // Show the question
    showQuestion: function() {
        if (this.elements.questionText) {
            this.elements.questionText.classList.remove('hidden');
        }
    },
    
    // Show user message with options
    showUserOptions: function() {
        if (this.elements.userMessage) {
            this.elements.userMessage.classList.remove('hidden');
        }
    },
    
    // Show the correct answer and next button
    showCorrectAnswer: function() {
        if (this.elements.correctAnswer) {
            this.elements.correctAnswer.style.display = 'block';
        }
        if (this.elements.nextSection) {
            this.elements.nextSection.style.display = 'block';
        }
    },
    
    // Reset the chat interface
    resetInterface: function() {
        // Reset typing and question
        this.showTypingAnimation();
        if (this.elements.questionText) {
            this.elements.questionText.classList.add('hidden');
        }
        
        // Hide user message
        if (this.elements.userMessage) {
            this.elements.userMessage.classList.add('hidden');
        }
        
        // Hide correct answer and next section
        if (this.elements.correctAnswer) {
            this.elements.correctAnswer.style.display = 'none';
        }
        if (this.elements.nextSection) {
            this.elements.nextSection.style.display = 'none';
        }
        
        // Reset option button styling
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach(btn => {
            btn.style.backgroundColor = '#ffffff';
            btn.style.borderColor = '#e5e5e5';
        });
    },
    
    // Setup chat event listeners
    setupEventListeners: function() {
        // Option button click handling
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const option = e.target.getAttribute('data-option');
                
                // Reset all buttons to default style
                optionButtons.forEach(btn => {
                    btn.style.backgroundColor = '#ffffff';
                    btn.style.borderColor = '#e5e5e5';
                });
                
                // Style based on correctness
                if (option === 'D') {
                    // Correct answer
                    e.target.style.backgroundColor = '#edfdf8';
                    e.target.style.borderColor = '#10a37f';
                    this.showCorrectAnswer();
                } else {
                    // Wrong answer
                    e.target.style.backgroundColor = '#fff7f7';
                    e.target.style.borderColor = '#ff6b6b';
                    alert('That\'s not correct. Try again!');
                }
            });
        });
    }
};

// Make ChatInterface globally available
window.ChatInterface = ChatInterface;
