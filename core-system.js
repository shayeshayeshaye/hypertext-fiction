
// ============================================
// CORE SYSTEM: localStorage Manager & Claude API
// File: core-system.js
// ============================================

class HypertextFictionCore {
  constructor() {
    this.apiKey = null; // Not needed when using proxy
    // Toggle between proxy (local/production) and direct API
    this.useProxy = true;
    this.proxyEndpoint = 'http://localhost:3000/api/generate'; // For local testing
    // this.proxyEndpoint = 'https://your-aws-api.amazonaws.com/api/generate'; // For production
    this.apiEndpoint = 'https://api.anthropic.com/v1/messages'; // Direct API (fallback)
    this.sessionId = this.getOrCreateSessionId();
    this.initializeStorage();
  }

  // ==================== SESSION MANAGEMENT ====================
  
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'USER_' + Math.floor(Math.random() * (259140 - 235140) + 235140);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  initializeStorage() {
    if (!localStorage.getItem('userPath')) {
      localStorage.setItem('userPath', JSON.stringify([]));
    }
    if (!localStorage.getItem('sessionStart')) {
      localStorage.setItem('sessionStart', new Date().toISOString());
    }
  }

  // ==================== PATH & TIME TRACKING ====================
  
  trackPageVisit(pageName) {
    const path = JSON.parse(localStorage.getItem('userPath') || '[]');
    const visit = {
      page: pageName,
      timestamp: new Date().toISOString(),
      timeSpent: 0
    };
    path.push(visit);
    localStorage.setItem('userPath', JSON.stringify(path));
    localStorage.setItem('currentPage', pageName);
    localStorage.setItem('pageStartTime', Date.now().toString());
  }

  updateTimeSpent() {
    const startTime = parseInt(localStorage.getItem('pageStartTime') || Date.now());
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    const path = JSON.parse(localStorage.getItem('userPath') || '[]');
    if (path.length > 0) {
      path[path.length - 1].timeSpent = timeSpent;
      localStorage.setItem('userPath', JSON.stringify(path));
    }
    
    return timeSpent;
  }

  getTotalTimeSpent() {
    const path = JSON.parse(localStorage.getItem('userPath') || '[]');
    return path.reduce((total, visit) => total + (visit.timeSpent || 0), 0);
  }

  // ==================== USER DATA STORAGE ====================
  
  saveUserData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getUserData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Specific data setters
  setUserGoals(goals) {
    this.saveUserData('userGoals', goals);
  }

  setUserInterests(interests) {
    this.saveUserData('userInterests', interests);
  }

  setUserFavourites(favourites) {
    this.saveUserData('userFavourites', favourites);
  }

  setUserRole(role) {
    this.saveUserData('userRole', role);
  }

  // Specific data getters
  getUserGoals() {
    return this.getUserData('userGoals') || '';
  }

  getUserInterests() {
    return this.getUserData('userInterests') || [];
  }

  getUserFavourites() {
    return this.getUserData('userFavourites') || [];
  }

  getUserRole() {
    return this.getUserData('userRole') || '';
  }

  // ==================== CLAUDE API INTEGRATION ====================
  
  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('claudeApiKey', key);
  }

  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('claudeApiKey');
    }
    return this.apiKey;
  }

  async callClaudeAPI(prompt, systemPrompt = '') {
    try {
      if (this.useProxy) {
        // Use proxy server (no API key needed client-side)
        const response = await fetch(this.proxyEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: prompt,
            systemPrompt: systemPrompt
          })
        });

        if (!response.ok) {
          throw new Error(`Proxy request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.text;
        
      } else {
        // Direct API call (requires API key)
        const apiKey = this.getApiKey();
        if (!apiKey) {
          console.error('Claude API key not set. Use core.setApiKey("your-key")');
          return null;
        }

        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            system: systemPrompt,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
      }
    } catch (error) {
      console.error('Claude API Error:', error);
      return null;
    }
  }

  // ==================== CONTENT GENERATION ====================
  
  async generateArticlePreview(articleType, userGoals, userInterests) {
    const titles = {
      1: `Why ${userInterests[0] || 'Your Interest'} Fans Struggle With ${userGoals}`,
      2: `10 Signs You're Avoiding ${userGoals} (But Don't Know It Yet)`,
      3: `If You're a Fan of ${userInterests[0] || 'Your Interest'} and Can't ${userGoals}, Read This`
    };

    const prompt = `Generate a 1-sentence compelling hook for an article titled: "${titles[articleType]}"
    
The hook should be slightly unnerving and make the reader feel personally called out. Keep it under 25 words.`;

    const hook = await this.callClaudeAPI(prompt);
    
    const preview = {
      title: titles[articleType],
      hook: hook || 'This article knows more about you than you think.',
      author: this.generateAuthorName(userInterests),
      url: `article-${articleType}.html`
    };

    return preview;
  }

  generateAuthorName(interests) {
    const firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Taylor', 'Sam', 'Drew'];
    const lastNames = ['Chen', 'Rodriguez', 'Kim', 'Patel', 'Johnson', 'Martinez', 'Lee', 'Santos'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  async generateListicleContent(userGoals, userInterests) {
    const prompt = `Generate 10 listicle items about procrastination and ${userGoals}.
    
Items 1-3: Normal, relatable advice
Item 4: Getting specific to someone interested in ${userInterests.join(', ')}
Item 6: Uncomfortably specific about Filipino college students
Items 8-9: Back to normal
Item 10: Reference sitting in Arete building at Ateneo de Manila University

Format each as: Title | Description (max 3 sentences, slightly unnerving tone)`;

    const content = await this.callClaudeAPI(prompt);
    return content;
  }

  async generateProductListings(userGoals, userInterests, userFavourites) {
    const prompt = `Generate 10 product listings that get progressively more invasive:
    
1-2: Related to ${userInterests[0]}, ${userInterests[1]}
3: Mentions "Filipino college student"
4: Uses specific user statistics, addresses in first person
5: Combines "${userGoals}" with interests
6: Quotes user goal verbatim, mentions Metro Manila
7: Product bundle of user's exact interests
8: Product name is literally their goal
9: "Premium Data Package" selling user profiles
10: "Your Complete Profile" with session data

Each listing needs: Title | Description | Review | Price`;

    const content = await this.callClaudeAPI(prompt);
    return content;
  }

  // ==================== VARIABLE INJECTION ====================
  
  injectVariables(htmlString) {
    const replacements = {
      '{{PAGE_TITLE}}': this.getUserData('currentPageTitle') || 'Page',
      '{{SITE_NAME}}': 'RetroNet',
      '{{YEAR}}': new Date().getFullYear(),
      '{{AUTHOR}}': this.generateAuthorName(this.getUserInterests()),
      '{{DATE}}': new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      '{{USER_ID}}': this.sessionId,
      '{{SESSION_START}}': localStorage.getItem('sessionStart'),
      '{{ADMIN_TITLE}}': 'Database Admin Panel',
      '{{DB_SERVER}}': 'localhost:3306',
      '{{DB_NAME}}': 'user_profiles',
      '{{ADMIN_USER}}': 'admin',
      '{{TABLE_COUNT}}': '12',
      '{{TOTAL_ROWS}}': '847294',
      '{{DB_SIZE}}': '2.4 GB',
      '{{CURRENT_TABLE}}': 'user_sessions'
    };

    let result = htmlString;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key, 'g'), value);
    }

    return result;
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  clearAllData() {
    const keysToKeep = ['claudeApiKey'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    this.sessionId = this.getOrCreateSessionId();
    this.initializeStorage();
  }

  exportData() {
    return {
      sessionId: this.sessionId,
      userGoals: this.getUserGoals(),
      userInterests: this.getUserInterests(),
      userFavourites: this.getUserFavourites(),
      userRole: this.getUserRole(),
      userPath: JSON.parse(localStorage.getItem('userPath') || '[]'),
      totalTimeSpent: this.getTotalTimeSpent(),
      sessionStart: localStorage.getItem('sessionStart')
    };
  }
}

// Initialize global instance
window.HypertextCore = new HypertextFictionCore();

// Auto-update time spent every 5 seconds
setInterval(() => {
  if (window.HypertextCore) {
    window.HypertextCore.updateTimeSpent();
  }
}, 5000);

// Track page unload
window.addEventListener('beforeunload', () => {
  if (window.HypertextCore) {
    window.HypertextCore.updateTimeSpent();
  }
});
