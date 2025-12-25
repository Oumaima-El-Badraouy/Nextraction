const API_BASE = 'http://localhost:8000/api';

// Éléments DOM
const chatMessages = document.getElementById('chatMessages');
const questionInput = document.getElementById('questionInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const themeToggle = document.getElementById('themeToggle');
const knowledgeSize = document.getElementById('knowledgeSize');
const responseTime = document.getElementById('responseTime');
const messageCount = document.getElementById('messageCount');
const apiStatus = document.getElementById('apiStatus');
const connectionStatus = document.getElementById('connectionStatus');
const welcomeTime = document.getElementById('welcomeTime');

// Variables
let messageCounter = 0;
let isTyping = false;
let isDarkMode = true;

// Initialiser la page
function initPage() {
    // Heure du message de bienvenue
    const now = new Date();
    welcomeTime.textContent = formatTime(now);
    
    // Thème
    loadTheme();
    themeToggle.addEventListener('click', toggleTheme);
    
    // Gestionnaire d'input
    questionInput.addEventListener('input', () => {
        sendBtn.disabled = questionInput.value.trim().length === 0;
    });
    
    // Entrée pour envoyer
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !sendBtn.disabled) {
            sendQuestion();
        }
    });
    
    // Focus sur l'input
    questionInput.focus();
    
    // Animations de particules
    createParticles();
    
    // Mettre à jour les stats
    updateStats();
    
    // Vérifier la connexion
    checkConnection();
    
    // Effet de chargement initial
    animateLogo();
}

// Animations de particules
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Taille aléatoire
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position aléatoire
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animation delay
        particle.style.animationDelay = `${Math.random() * 15}s`;
        
        // Opacité aléatoire
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        particlesContainer.appendChild(particle);
    }
}

// Animation du logo
function animateLogo() {
    const logoIcon = document.querySelector('.logo-icon');
    anime({
        targets: logoIcon,
        rotate: [0, 360],
        duration: 2000,
        easing: 'easeInOutSine',
        delay: 500
    });
}

// Changer de thème
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('theme-light', !isDarkMode);
    themeToggle.classList.toggle('active', !isDarkMode);
    
    // Sauvegarder la préférence
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Animation du toggle
    anime({
        targets: themeToggle,
        scale: [1, 1.1, 1],
        duration: 300,
        easing: 'spring(1, 80, 10, 0)'
    });
}

// Charger le thème
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    isDarkMode = savedTheme === 'dark';
    document.body.classList.toggle('theme-light', !isDarkMode);
    themeToggle.classList.toggle('active', !isDarkMode);
}

// Mettre à jour les stats
async function updateStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        if (response.ok) {
            const data = await response.json();
            const totalVectors = data.total_vectors || 0;
            
            // Animation du compteur
            animateCounter(knowledgeSize, totalVectors);
            
            // Mettre à jour le compteur de messages
            updateMessageCount();
            
        } else {
            knowledgeSize.innerHTML = '<span class="text-danger">Erreur</span>';
        }
    } catch (error) {
        knowledgeSize.innerHTML = '<span class="text-warning">Offline</span>';
    }
}

// Animation de compteur
function animateCounter(element, targetValue) {
    const current = parseInt(element.textContent) || 0;
    const duration = 1000;
    const steps = 60;
    const increment = (targetValue - current) / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
        currentStep++;
        const value = Math.round(current + (increment * currentStep));
        element.textContent = value;
        
        if (currentStep >= steps) {
            clearInterval(timer);
            element.textContent = targetValue;
        }
    }, duration / steps);
}

// Vérifier la connexion
async function checkConnection() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Connecté';
            connectionStatus.className = 'badge bg-success';
            apiStatus.textContent = '✓';
            apiStatus.parentElement.style.color = '#00c9b7';
        } else {
            throw new Error('API non disponible');
        }
    } catch (error) {
        connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Déconnecté';
        connectionStatus.className = 'badge bg-danger';
        apiStatus.textContent = '✗';
        apiStatus.parentElement.style.color = '#ff4757';
    }
}

// Envoyer une question
async function sendQuestion() {
    const question = questionInput.value.trim();
    if (!question || isTyping) return;
    
    askQuestion(question);
}

// Poser une question
async function askQuestion(questionText) {
    // Mettre à jour l'input
    questionInput.value = questionText;
    sendBtn.disabled = true;
    
    // Ajouter le message utilisateur
    addUserMessage(questionText);
    
    // Effacer l'input
    questionInput.value = '';
    
    // Afficher l'indicateur de frappe
    showTypingIndicator();
    
    // Enregistrer le temps de début
    const startTime = Date.now();
    
    try {
        const response = await fetch(`${API_BASE}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: questionText })
        });
        
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;
        
        if (response.ok) {
            const data = await response.json();
            
            hideTypingIndicator();
            addAiMessage(data.answer, timeTaken);
            
            // Animation du temps de réponse
            animateResponseTime(timeTaken);
            
            // Mettre à jour les stats
            updateStats();
            
        } else {
            throw new Error(`Erreur: ${response.status}`);
        }
        
    } catch (error) {
        hideTypingIndicator();
        addAiMessage(`Désolé, une erreur est survenue. Veuillez réessayer.`, 0);
        console.error('Erreur:', error);
    }
}

// Ajouter un message utilisateur
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-user';
    
    const now = new Date();
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${escapeHtml(text)}</div>
            <div class="message-meta">
                <span class="message-time">${formatTime(now)}</span>
                <span class="message-type">Vous</span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    incrementMessageCount();
    
    // Animation
    anime({
        targets: messageDiv,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutCubic'
    });
}

// Ajouter un message AI
function addAiMessage(text, responseTime = 0) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-ai';
    
    const now = new Date();
    const timeText = responseTime > 0 ? 
        `${formatTime(now)} • ${responseTime.toFixed(1)}s` : 
        formatTime(now);
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${formatAiResponse(text)}</div>
            <div class="message-meta">
                <span class="message-time">${timeText}</span>
                <span class="message-type">Assistant</span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Animation
    anime({
        targets: messageDiv,
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 500,
        easing: 'spring(1, 80, 10, 0)'
    });
}

// Formater la réponse de l'IA
function formatAiResponse(text) {
    let formatted = escapeHtml(text);
    
    // Mise en forme markdown simple
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/^### (.*$)/gm, '<h4>$1</h4>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/\n/g, '<br>');
    formatted = formatted.replace(/^- (.*$)/gm, '• $1');
    formatted = formatted.replace(/^(\d+)\. (.*$)/gm, '$1. $2');
    
    return formatted;
}

// Afficher l'indicateur de frappe
function showTypingIndicator() {
    isTyping = true;
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

// Cacher l'indicateur de frappe
function hideTypingIndicator() {
    isTyping = false;
    typingIndicator.style.display = 'none';
}

// Défiler vers le bas
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Formater l'heure
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Incrémenter le compteur de messages
function incrementMessageCount() {
    messageCounter++;
    updateMessageCount();
}

// Mettre à jour le compteur de messages
function updateMessageCount() {
    messageCount.textContent = messageCounter;
    
    // Animation
    anime({
        targets: messageCount,
        scale: [1, 1.2, 1],
        duration: 300,
        easing: 'spring(1, 80, 10, 0)'
    });
}

// Animation du temps de réponse
function animateResponseTime(time) {
    const target = responseTime;
    target.textContent = `${time.toFixed(1)}s`;
    
    anime({
        targets: target,
        color: ['#00c9b7', '#fff', '#00c9b7'],
        duration: 1000,
        easing: 'easeInOutSine'
    });
}

// Effacer le chat
function clearChat() {
    if (chatMessages.children.length <= 1) return;
    
    if (confirm('Voulez-vous vraiment effacer toute la conversation ?')) {
        const welcomeMsg = chatMessages.children[0];
        chatMessages.innerHTML = '';
        chatMessages.appendChild(welcomeMsg);
        
        messageCounter = 0;
        updateMessageCount();
        
        // Animation de confirmation
        anime({
            targets: chatMessages,
            opacity: [0, 1],
            duration: 500
        });
    }
}

// Input vocal (fonctionnalité future)
function voiceInput() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.start();
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            questionInput.value = transcript;
            sendBtn.disabled = false;
        };
        
        recognition.onerror = () => {
            alert('Microphone non disponible. Veuillez taper votre question.');
        };
    } else {
        alert('Reconnaissance vocale non supportée par votre navigateur.');
    }
}

// Échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialiser
document.addEventListener('DOMContentLoaded', initPage);

// Actualiser les stats toutes les 30 secondes
setInterval(updateStats, 30000);
setInterval(checkConnection, 10000);