const API_BASE = 'http://localhost:8000/api';

// Éléments DOM
const urlsInput = document.getElementById('urlsInput');
const verifyBtn = document.getElementById('verifyBtn');
const ingestBtn = document.getElementById('ingestBtn');
const clearBtn = document.getElementById('clearBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const resultsContainer = document.getElementById('resultsContainer');
const summary = document.getElementById('summary');
const logsDiv = document.getElementById('logs');
const vectorCount = document.getElementById('vectorCount');
const urlCount = document.getElementById('urlCount');

// Variables pour les statistiques
let stats = {
    vectors: 0,
    urls: 0,
    success: 0,
    errors: 0
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    updateLog('Système initialisé. Prêt à recevoir des URLs.', 'info');
    
    // Ajouter les événements aux boutons
    verifyBtn.addEventListener('click', handleVerify);
    ingestBtn.addEventListener('click', handleIngest);
    clearBtn.addEventListener('click', handleClear);
    
    // Actualiser les stats toutes les 30 secondes
    setInterval(updateStats, 30000);
});

// Fonctions de log
function updateLog(message, type = 'info') {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    const typeClass = {
        'info': 'log-info',
        'success': 'log-success',
        'error': 'log-error',
        'warning': 'log-warning'
    }[type] || 'log-info';
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-time">[${timeStr}]</span>
        <span class="${typeClass}"> ${message}</span>
    `;
    
    logsDiv.appendChild(logEntry);
    
    // Défiler vers le bas
    logsDiv.scrollTop = logsDiv.scrollHeight;
}

function clearLogs() {
    logsDiv.innerHTML = `
        <div class="log-entry">
            <span class="log-time">[${new Date().toTimeString().split(' ')[0]}]</span>
            <span class="log-info"> Journal effacé.</span>
        </div>
    `;
}

// Mettre à jour les statistiques
async function updateStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        if (response.ok) {
            const data = await response.json();
            stats.vectors = data.total_vectors || 0;
            stats.urls = data.chunks_count || 0;
            
            // Mettre à jour l'affichage
            vectorCount.textContent = stats.vectors;
            urlCount.textContent = stats.urls;
        }
    } catch (error) {
        console.log('Erreur de connexion aux stats:', error);
    }
}

// Charger des exemples d'URLs
function loadExamples() {
    urlsInput.value = `https://example.com
https://fr.wikipedia.org/wiki/Python
https://docs.python.org/3/tutorial/
https://fr.wikipedia.org/wiki/Intelligence_artificielle
https://httpbin.org/html`;
    
    updateLog('Exemples d\'URLs chargés.', 'info');
}

// Vérifier les URLs
async function handleVerify() {
    const urls = getUrlsFromInput();
    if (urls.length === 0) {
        alert('Veuillez entrer au moins une URL.');
        return;
    }
    
    // Désactiver le bouton pendant la vérification
    verifyBtn.disabled = true;
    const originalText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Vérification...';
    
    updateLog(`Vérification de ${urls.length} URL(s)...`, 'info');
    
    try {
        const response = await fetch(`${API_BASE}/verify-urls`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ urls: urls })
        });
        
        if (response.ok) {
            const results = await response.json();
            displayVerificationResults(results);
            updateLog(`Vérification terminée: ${results.length} URL(s) analysées.`, 'success');
        } else {
            const errorText = await response.text();
            throw new Error(`Erreur ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('Erreur de vérification:', error);
        updateLog(`Erreur: ${error.message}`, 'error');
        alert('Impossible de vérifier les URLs. Vérifiez votre connexion et que le serveur est démarré.');
    } finally {
        // Réactiver le bouton
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = originalText;
    }
}

// Indexer les URLs
async function handleIngest() {
    const urls = getUrlsFromInput();
    if (urls.length === 0) {
        alert('Veuillez entrer au moins une URL.');
        return;
    }
    
    // Désactiver les boutons
    verifyBtn.disabled = true;
    ingestBtn.disabled = true;
    const originalIngestText = ingestBtn.innerHTML;
    ingestBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Indexation...';
    
    // Afficher la barre de progression
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    
    updateLog(`Début de l'indexation de ${urls.length} URL(s)...`, 'info');
    
    try {
        // Simuler la progression (première partie)
        simulateProgress(50);
        
        const response = await fetch(`${API_BASE}/ingest`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ urls: urls })
        });
        
        // Terminer la simulation de progression
        simulateProgress(100, 50);
        
        if (response.ok) {
            const result = await response.json();
            displayIngestionResults(result);
            updateLog(`Indexation terminée: ${result.successful}/${result.total_urls} URL(s) réussies.`, 'success');
        } else {
            const errorText = await response.text();
            throw new Error(`Erreur ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('Erreur d\'indexation:', error);
        updateLog(`Erreur d'indexation: ${error.message}`, 'error');
        alert('Erreur lors de l\'indexation. Voir le journal pour plus de détails.');
    } finally {
        // Réactiver les boutons
        verifyBtn.disabled = false;
        ingestBtn.disabled = false;
        ingestBtn.innerHTML = originalIngestText;
        
        // Mettre à jour les statistiques
        updateStats();
    }
}

// Simulation de progression
function simulateProgress(targetPercent, startFrom = 0) {
    let width = startFrom;
    const interval = setInterval(() => {
        if (width >= targetPercent) {
            clearInterval(interval);
            // Cacher la barre de progression après 2 secondes
            if (targetPercent >= 100) {
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                }, 2000);
            }
            return;
        }
        width += 5;
        progressBar.style.width = width + '%';
        progressPercent.textContent = width + '%';
    }, 100);
}

// Effacer tout
function handleClear() {
    if (urlsInput.value.trim() !== '') {
        if (confirm('Voulez-vous vraiment effacer toutes les URLs ?')) {
            urlsInput.value = '';
            resultsContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-1"></i>
                    <p class="mt-2">Aucun résultat pour le moment.<br>Ajoutez des URLs et cliquez sur "Indexer dans la base".</p>
                </div>
            `;
            summary.style.display = 'none';
            updateLog('Liste d\'URLs effacée.', 'info');
        }
    } else {
        alert('Il n\'y a aucune URL à effacer.');
    }
}

// Tester la connexion
async function testConnection() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            updateLog('Connexion API réussie.', 'success');
            alert('✅ Connexion au serveur réussie !');
        } else {
            throw new Error('API non disponible');
        }
    } catch (error) {
        updateLog('Impossible de se connecter à l\'API.', 'error');
        alert('❌ Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
    }
}

// Helper functions
function getUrlsFromInput() {
    return urlsInput.value
        .split('\n')
        .map(url => url.trim())
        .filter(url => {
            if (url.length === 0) return false;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                updateLog(`URL ignorée (doit commencer par http:// ou https://): ${url}`, 'warning');
                return false;
            }
            return true;
        });
}

function displayVerificationResults(results) {
    resultsContainer.innerHTML = '';
    summary.style.display = 'block';
    
    let accessibleCount = 0;
    
    // Vérifier si results est un tableau
    if (!Array.isArray(results)) {
        console.error('Les résultats ne sont pas un tableau:', results);
        resultsContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                Erreur: Les résultats ne sont pas au format attendu.
                <pre class="mt-2">${JSON.stringify(results, null, 2)}</pre>
            </div>
        `;
        return;
    }
    
    results.forEach((result, index) => {
        const isAccessible = result.accessible;
        if (isAccessible) accessibleCount++;
        
        const resultDiv = document.createElement('div');
        resultDiv.className = `result-item ${isAccessible ? 'result-success' : 'result-error'}`;
        
        resultDiv.innerHTML = `
            <div>
                <strong>${result.url}</strong>
                ${result.error ? `<div class="mt-1 small">${result.error}</div>` : ''}
            </div>
            <div class="status-badge ${isAccessible ? 'badge-success' : 'badge-error'}">
                ${isAccessible ? '✓ Accessible' : '✗ Inaccessible'}
            </div>
        `;
        
        resultsContainer.appendChild(resultDiv);
    });
    
    summary.innerHTML = `
        <div class="alert ${accessibleCount === results.length ? 'alert-success' : 'alert-warning'}">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <i class="bi bi-${accessibleCount === results.length ? 'check-circle' : 'exclamation-triangle'}"></i>
                    <strong>Résultat de la vérification :</strong>
                    ${accessibleCount} sur ${results.length} URLs accessibles
                </div>
                ${accessibleCount < results.length ? 
                    '<small>Certains sites peuvent bloquer les robots. Essayez avec d\'autres URLs.</small>' : 
                    '<small>Toutes les URLs sont accessibles. Vous pouvez procéder à l\'indexation.</small>'}
            </div>
        </div>
    `;
}

function displayIngestionResults(result) {
    resultsContainer.innerHTML = '';
    summary.style.display = 'block';
    
    // Vérifier la structure des résultats
    if (!result.results || !Array.isArray(result.results)) {
        resultsContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                Erreur: Résultats d'indexation non valides.
                <pre class="mt-2">${JSON.stringify(result, null, 2)}</pre>
            </div>
        `;
        return;
    }
    
    // Afficher les résultats individuels
    result.results.forEach((item, index) => {
        const isSuccess = item.status === 'success';
        
        const resultDiv = document.createElement('div');
        resultDiv.className = `result-item ${isSuccess ? 'result-success' : 'result-error'}`;
        resultDiv.style.opacity = '0';
        resultDiv.style.transform = 'translateY(20px)';
        resultDiv.style.transition = 'opacity 0.3s, transform 0.3s';
        
        const chunksInfo = item.chunks_added ? 
            `<span class="badge bg-info">${item.chunks_added} extraits</span>` : '';
        
        resultDiv.innerHTML = `
            <div>
                <strong>${item.url}</strong>
                <div class="mt-1 small">
                    ${chunksInfo}
                    ${item.reason ? `<div class="text-danger">${item.reason}</div>` : ''}
                </div>
            </div>
            <div class="status-badge ${isSuccess ? 'badge-success' : 'badge-error'}">
                ${isSuccess ? '✓ Indexé' : '✗ Échec'}
            </div>
        `;
        
        resultsContainer.appendChild(resultDiv);
        
        // Animation d'entrée
        setTimeout(() => {
            resultDiv.style.opacity = '1';
            resultDiv.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Afficher le résumé
    summary.innerHTML = `
        <div class="alert alert-info">
            <h5><i class="bi bi-graph-up"></i> Résumé de l'indexation</h5>
            <div class="row mt-3">
                <div class="col-md-6">
                    <p><strong>URLs totales :</strong> ${result.total_urls}</p>
                    <p><strong>Indexées avec succès :</strong> ${result.successful}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Vecteurs dans la base :</strong> ${result.total_vectors || 0}</p>
                    <p><strong>Statut :</strong> ${result.status}</p>
                </div>
            </div>
            <div class="mt-3">
                <button class="btn btn-sm btn-outline-primary" onclick="testQuestions()">
                    <i class="bi bi-chat-left-text"></i> Tester avec des questions
                </button>
            </div>
        </div>
    `;
    
    // Terminer la barre de progression
    progressBar.style.width = '100%';
    progressPercent.textContent = '100%';
}

// Tester avec des questions (ouvre l'interface client)
function testQuestions() {
    // Essaie de trouver le chemin vers l'interface client
    const clientPath = '../Frontend-Client/index.html';
    window.open(clientPath, '_blank');
}

// Fonction pour afficher les erreurs dans la console
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Erreur JavaScript:', msg, url, lineNo, error);
    updateLog(`Erreur JavaScript: ${msg}`, 'error');
    return false;
};