# 🎭 Hypertext Fiction: Surveillance Capitalism

An interactive 4-page hypertext fiction experience exploring algorithmic personalization and surveillance capitalism through a recursive narrative structure.

**⚠️ This project REQUIRES a Claude API key for the full experience.**

---

## 🚀 Deployment Options

### Option 1: User-Provided API Keys (GitHub Pages)

**Best for:** Open-source educational project where users provide their own keys

✅ **Pros:** 
- Free hosting on GitHub Pages
- No server costs
- Each user pays for their own usage (~$0.10-0.50/session)

❌ **Cons:**
- Users need to get their own Claude API key
- Slight friction at the start

**Setup:**
1. Deploy to GitHub Pages normally
2. Users enter their API key on first visit
3. Key is stored in browser localStorage (never leaves their computer)

### Option 2: Backend Proxy Server (Your Hosting + Your API Key)

**Best for:** If you want to pay for all users and provide seamless experience

✅ **Pros:**
- No user friction - works immediately
- You control the experience
- Your API key stays secure on the server

❌ **Cons:**
- Requires Node.js hosting (Heroku, Vercel, Railway, etc.)
- You pay for all API usage
- More complex deployment

**Cost estimate:** ~$0.10-0.50 per user session, $5-50/month depending on traffic

---

## 📁 Project Structure

```
hypertext-fiction/
├── index.html              # Act 1: The Chat
├── page2.html              # Act 2: The Article  
├── page3.html              # Act 3: The Shop
├── page4.html              # Act 4: The Data
├── core-system.js          # localStorage & API management
├── config.js               # Configuration
├── server.js               # Optional: Proxy server for Option 2
├── package.json            # Optional: Dependencies for Option 2
├── .env.example            # Optional: API key template
├── .gitignore              # Protects sensitive files
└── README.md               # This file
```

---

## 🔑 OPTION 1: GitHub Pages (User Keys)

### Quick Deploy

1. **Fork/Clone this repo**
```bash
git clone https://github.com/YOUR-USERNAME/hypertext-fiction.git
cd hypertext-fiction
```

2. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Source: main branch, / (root)
   - Save

4. **Share the link:** `https://YOUR-USERNAME.github.io/hypertext-fiction/`

### User Experience

When users visit your site:
1. They see a modal asking for Claude API key
2. They visit https://console.anthropic.com/ to get a free key ($5 credit)
3. They paste the key (starts with `sk-ant-api03-`)
4. Key is saved in localStorage
5. Full experience unlocks!

**Privacy:** The API key never leaves the user's browser except to call Anthropic's API directly.

---

## 🖥️ OPTION 2: Backend Proxy Server

### Prerequisites
- Node.js 14+ installed
- A hosting platform account (Vercel, Heroku, Railway, etc.)
- Your Claude API key

### Local Setup

1. **Clone and install dependencies**
```bash
git clone https://github.com/YOUR-USERNAME/hypertext-fiction.git
cd hypertext-fiction
npm install
```

2. **Create .env file**
```bash
cp .env.example .env
```

3. **Add your API key to .env**
```
CLAUDE_API_KEY=sk-ant-api03-YOUR-ACTUAL-KEY-HERE
PORT=3000
```

4. **Start the proxy server**
```bash
npm start
```

5. **Update core-system.js** to use your proxy:
```javascript
// Change this line in core-system.js:
this.apiEndpoint = 'http://localhost:3000/api/generate';  // For local testing
// Or for production:
this.apiEndpoint = 'https://your-app.herokuapp.com/api/generate';
```

6. **Test locally**
```bash
# In another terminal, serve the frontend:
python -m http.server 8000
# Open http://localhost:8000
```

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-hypertext-fiction

# Set environment variable
heroku config:set CLAUDE_API_KEY=sk-ant-api03-YOUR-KEY-HERE

# Deploy
git push heroku main

# Open your app
heroku open
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Add environment variable in Vercel dashboard:
   - Variable: `CLAUDE_API_KEY`
   - Value: `sk-ant-api03-YOUR-KEY-HERE`

### Deploy to Railway

1. Visit railway.app
2. Create new project from GitHub repo
3. Add environment variable: `CLAUDE_API_KEY`
4. Deploy automatically

---

## 💰 Cost Breakdown

### Claude API Pricing
- **Model:** Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Input:** ~$3 / million tokens
- **Output:** ~$15 / million tokens

### Per-Session Usage
Each user session generates ~3 article hooks:
- **Input tokens per hook:** ~100 tokens (your prompt)
- **Output tokens per hook:** ~50 tokens (AI response)
- **Total per session:** ~450 tokens
- **Cost:** ~$0.007-0.01 per session

**Free tier:** $5 credit = ~500-700 sessions

### Monthly Estimates
- 100 users/month: ~$1
- 1,000 users/month: ~$10
- 10,000 users/month: ~$100

---

## 🛠️ Development

### Modify API Endpoints

**For Option 1 (Direct API):**
No changes needed - users' keys go directly to Anthropic

**For Option 2 (Proxy):**
Update `core-system.js`:
```javascript
this.apiEndpoint = 'https://your-proxy-url.com/api/generate';
```

### Test Without API (Fallback)

The project includes fallback content if API fails:
```javascript
let hook = `This article knows more about you than you think.`;
```

To test fallback mode, don't set any API key.

---

## 🔒 Security Best Practices

### ✅ DO:
- Use Option 1 for open-source projects
- Use Option 2 if you control deployment
- Keep .env in .gitignore
- Rotate API keys periodically
- Monitor API usage in Anthropic console

### ❌ DON'T:
- Commit API keys to GitHub
- Share your .env file
- Use your personal key in client-side code for production
- Forget to set usage limits in Anthropic console

---

## 🎓 Educational Context

This project was created for a creative writing/digital art course exploring:
- Surveillance capitalism (Shoshana Zuboff)
- Algorithmic personalization
- Data privacy and digital rights
- Interactive narrative techniques
- Meta-commentary on technology

### Academic References
- Zuboff, S. (2019). *The Age of Surveillance Capitalism*
- Bernays, E. (1928). *Propaganda*
- Mandel, E.S.J. (2022). *Sea of Tranquility*
- Crouch, B. (2019). *Recursion*

---

## 🤔 Which Option Should I Choose?

### Choose Option 1 (User Keys) if:
- ✅ This is for a class/educational project
- ✅ You want to deploy for free on GitHub Pages
- ✅ You don't mind users needing to get an API key
- ✅ You want maximum transparency

### Choose Option 2 (Proxy Server) if:
- ✅ You want a seamless user experience
- ✅ You're willing to pay hosting + API costs
- ✅ You want to track/monitor usage
- ✅ This is a production/portfolio piece

---

## 📞 Support

**Getting Claude API Key:**
- Visit: https://console.anthropic.com/
- Sign up (free $5 credit)
- Create API key in Settings

**Hosting Help:**
- GitHub Pages: https://pages.github.com/
- Heroku: https://www.heroku.com/
- Vercel: https://vercel.com/
- Railway: https://railway.app/

---

## 📄 License

This project is open source and available for educational use.

---

## 👤 Author

Created by [Your Name] for [Course Name] at Ateneo de Manila University

**Last Updated:** November 2024
