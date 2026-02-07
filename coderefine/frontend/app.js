// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// State Management
let currentUser = null;
let currentCode = '';
let refinedCodeGlobal = '';

// DOM Elements
const authContainer = document.getElementById('authContainer');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginFormElement');
const signupForm = document.getElementById('signupFormElement');
const forgotPasswordForm = document.getElementById('forgotPasswordFormElement');
const codeEditor = document.getElementById('codeEditor');
const lineNumbers = document.getElementById('lineNumbers');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const analysisResults = document.getElementById('analysisResults');
const comparisonSection = document.getElementById('comparisonSection');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    initializeEditor();
    initializeEventListeners();
});

// Authentication Functions
function initializeAuth() {
    const storedUser = localStorage.getItem('coderefine_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showApp();
    }
}

function showApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'flex';
    document.getElementById('userEmail').textContent = currentUser.email;
}

function showAuth() {
    authContainer.style.display = 'flex';
    appContainer.style.display = 'none';
}

// Form Switching
document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('showForgotPassword').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
});

document.getElementById('backToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success)
         {
            currentUser = data.user;
            localStorage.setItem('coderefine_user', JSON.stringify(data.user));
            localStorage.setItem('coderefine_token', data.access_token);
            showToast('Login successful!', 'success');
            showApp();
        } else {
            showToast(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
    }
});

// Signup Handler
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success){
            showToast('Account created! Please sign in.', 'success');
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('loginEmail').value = email;
        } else {
            showToast(data.error || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showToast('Network error. Please try again.', 'error');
    }
});

// Forgot Password Handler
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success)
        {
            showToast('Password reset email sent!', 'success');
            document.getElementById('forgotPasswordForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        } else {
            showToast(data.error || 'Reset failed', 'error');
        }
    } catch (error) {
        console.error('Reset error:', error);
        showToast('Network error. Please try again.', 'error');
    }
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('coderefine_user');
    localStorage.removeItem('coderefine_token');
    currentUser = null;
    showAuth();
    showToast('Logged out successfully', 'info');
});

// Editor Functions
function initializeEditor() {
    updateLineNumbers();
    updateStats();
}

function updateLineNumbers() {
    const lines = codeEditor.value.split('\n').length;
    const maxLines = 500;
    
    if (lines > maxLines) {
        const truncated = codeEditor.value.split('\n').slice(0, maxLines).join('\n');
        codeEditor.value = truncated;
        showToast(`Code limited to ${maxLines} lines`, 'info');
    }
    
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
}

function updateStats() {
    const code = codeEditor.value;
    const lines = code.split('\n').length;
    const chars = code.length;
    
    document.getElementById('lineCount').textContent = `Lines: ${lines}`;
    document.getElementById('charCount').textContent = `Characters: ${chars}`;
}

function initializeEventListeners() {
    // Editor events
    codeEditor.addEventListener('input', () => {
        updateLineNumbers();
        updateStats();
        currentCode = codeEditor.value;
    });
    
    codeEditor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = codeEditor.scrollTop;
    });
    
    // Tab key support
    codeEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = codeEditor.selectionStart;
            const end = codeEditor.selectionEnd;
            const value = codeEditor.value;
            
            codeEditor.value = value.substring(0, start) + '    ' + value.substring(end);
            codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
            
            updateLineNumbers();
            updateStats();
        }
    });
    
    // Action buttons
    document.getElementById('analyzeBtn').addEventListener('click', analyzeCode);
    document.getElementById('fixBugsBtn').addEventListener('click', () => refineCode('bugs'));
    document.getElementById('improvePerformanceBtn').addEventListener('click', () => refineCode('performance'));
    document.getElementById('refactorBtn').addEventListener('click', () => refineCode('refactor'));
    
    // Result actions
    document.getElementById('applyChangesBtn').addEventListener('click', applyChanges);
    document.getElementById('downloadTxtBtn').addEventListener('click', downloadTxt);
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
    document.getElementById('shareBtn').addEventListener('click', shareCode);
}

// Analyze Code
async function analyzeCode() {
    const code = codeEditor.value.trim();
    
    if (!code) {
        showToast('Please enter some code to analyze', 'error');
        return;
    }
    
    const language = document.getElementById('languageSelect').value;
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            displayComplexity(data.complexity);
            displayAnalysis(data.analysis);
            resultsSection.style.display = 'block';
            showToast('Analysis complete!', 'success');
        } else {
            showToast(data.error || 'Analysis failed', 'error');
        }
    } catch (error) {
        console.error('Analysis error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Refine Code
async function refineCode(action) {
    const code = codeEditor.value.trim();
    
    if (!code) {
        showToast('Please enter some code to refine', 'error');
        return;
    }
    
    const language = document.getElementById('languageSelect').value;
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/refine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language, action }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            refinedCodeGlobal = data.refined_code;
            displayComparison(code, data.refined_code, data.original_complexity, data.refined_complexity);
            resultsSection.style.display = 'block';
            comparisonSection.style.display = 'block';
            showToast('Code refined successfully!', 'success');
        } else {
            showToast(data.error || 'Refinement failed', 'error');
        }
    } catch (error) {
        console.error('Refinement error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Display Functions
function displayComplexity(complexity) {
    document.getElementById('timeComplexity').textContent = complexity.time_complexity;
    document.getElementById('spaceComplexity').textContent = complexity.space_complexity;
    document.getElementById('nestingDepth').textContent = complexity.nesting_depth;
    document.getElementById('cyclomaticComplexity').textContent = complexity.cyclomatic_complexity;
}

function displayAnalysis(analysis) {
    document.getElementById('analysisContent').textContent = analysis;
    analysisResults.style.display = 'block';
}

function displayComparison(original, refined, origComplexity, refComplexity) {
    document.getElementById('originalCode').textContent = original;
    document.getElementById('refinedCode').textContent = refined;
    
    document.getElementById('originalComplexityDisplay').textContent = 
        `Time: ${origComplexity.time_complexity} | Cyclomatic: ${origComplexity.cyclomatic_complexity}`;
    
    document.getElementById('refinedComplexityDisplay').textContent = 
        `Time: ${refComplexity.time_complexity} | Cyclomatic: ${refComplexity.cyclomatic_complexity}`;
}

// Apply Changes
function applyChanges() {
    if (refinedCodeGlobal) {
        codeEditor.value = refinedCodeGlobal;
        updateLineNumbers();
        updateStats();
        comparisonSection.style.display = 'none';
        showToast('Changes applied to editor!', 'success');
    }
}

// Download TXT
function downloadTxt() {
    if (!refinedCodeGlobal) {
        showToast('No refined code to download', 'error');
        return;
    }
    
    const blob = new Blob([refinedCodeGlobal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `refined_code_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Code downloaded as TXT!', 'success');
}

// Download PDF
function downloadPdf() {
    if (!refinedCodeGlobal) {
        showToast('No refined code to download', 'error');
        return;
    }
    
    // Create a simple PDF using browser's print functionality
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>CodeRefine - Optimized Code</title>
            <style>
                body {
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    background: white;
                    color: black;
                }
                h1 {
                    font-family: Arial, sans-serif;
                    color: #667eea;
                }
                pre {
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                }
                .header {
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>CodeRefine - Optimized Code</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p>Language: ${document.getElementById('languageSelect').value.toUpperCase()}</p>
            </div>
            <pre>${escapeHtml(refinedCodeGlobal)}</pre>
            <div class="footer">
                <p>Generated by CodeRefine - AI-Powered Code Optimization</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
        showToast('Opening print dialog for PDF...', 'info');
    }, 250);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Share Code
function shareCode() {
    if (!refinedCodeGlobal) {
        showToast('No refined code to share', 'error');
        return;
    }
    
    // Create a shareable link (in production, this would save to a database and generate a unique ID)
    const encodedCode = btoa(encodeURIComponent(refinedCodeGlobal));
    const shareUrl = `${window.location.origin}?code=${encodedCode.substring(0, 50)}...`;
    
    document.getElementById('shareLink').value = shareUrl;
    document.getElementById('shareModal').style.display = 'flex';
}

// Copy Link
document.getElementById('copyLinkBtn').addEventListener('click', () => {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    showToast('Link copied to clipboard!', 'success');
});

// Close Modal
document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('shareModal').style.display = 'none';
});

document.getElementById('shareModal').addEventListener('click', (e) => {
    if (e.target.id === 'shareModal') {
        document.getElementById('shareModal').style.display = 'none';
    }
});

// Utility Functions
function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Check if shared code in URL
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCode = urlParams.get('code');
    
    if (sharedCode && currentUser) {
        try {
            const decoded = decodeURIComponent(atob(sharedCode));
            codeEditor.value = decoded;
            updateLineNumbers();
            updateStats();
            showToast('Shared code loaded!', 'success');
        } catch (error) {
            console.error('Error loading shared code:', error);
        }
    }
});
