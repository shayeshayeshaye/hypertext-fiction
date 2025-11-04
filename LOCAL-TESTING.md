# 🚀 LOCAL TESTING GUIDE

## Step-by-Step Instructions

### 1️⃣ Extract the ZIP
Unzip `hypertext-fiction.zip` to a folder

### 2️⃣ Open Terminal
- **Mac:** Applications → Utilities → Terminal
- **Windows:** Press Windows key, type "cmd", press Enter
- **Linux:** You know what to do 😉

### 3️⃣ Navigate to Your Folder
```bash
cd path/to/hypertext-fiction
# Example: cd Desktop/hypertext-fiction
```

### 4️⃣ Install Dependencies
```bash
npm install
```
Wait ~30 seconds. You'll see a progress bar.

### 5️⃣ Set Up Your API Key
```bash
# Mac/Linux:
cp .env.example .env

# Windows:
copy .env.example .env
```

Then open `.env` in any text editor (Notepad, TextEdit, VS Code, etc.) and add your Claude API key:
```
CLAUDE_API_KEY=sk-ant-api03-YOUR-ACTUAL-KEY-HERE
PORT=3000
```

**Get your Claude API key:** https://console.anthropic.com/

### 6️⃣ Start the Proxy Server
```bash
npm start
```

You should see:
```
Proxy server running on port 3000
```

✅ **Leave this terminal window open!**

### 7️⃣ Start the Frontend (New Terminal Window)
Open a NEW terminal/command prompt window and:

```bash
# Navigate to the same folder
cd path/to/hypertext-fiction

# Start a simple web server
python -m http.server 8000
```

If Python 3 doesn't work, try:
```bash
python3 -m http.server 8000
```

Or if you have Python 2:
```bash
python -m SimpleHTTPServer 8000
```

### 8️⃣ Open in Browser
Visit: **http://localhost:8000**

---

## ✅ What Should Happen

1. You see the ChatBOT welcome modal
2. Go through the onboarding (interests, goals, etc.)
3. When you reach the article generation, it calls your local proxy
4. The proxy calls Claude API with YOUR key
5. Articles generate with AI-powered hooks!

---

## 🐛 Troubleshooting

**"npm: command not found"**
- Node.js not installed properly. Reinstall from nodejs.org

**"EADDRINUSE: port 3000 already in use"**
- Change PORT in .env to 3001 or 3002

**"API request failed: 401"**
- Your API key is wrong. Check .env file

**Articles show "This article knows more about you than you think"**
- Proxy isn't running or frontend can't reach it
- Check both terminal windows are still open

**CORS error in browser console**
- Make sure you're using `http://localhost:8000` not `file:///`

---

## 📊 Check If It's Working

1. Open browser console (F12 or right-click → Inspect → Console)
2. Look for: `Proxy server running on port 3000` in terminal
3. Look for successful fetch requests in browser console
4. Articles should have unique, creepy AI-generated hooks!

---

## 🛑 When You're Done Testing

Press **Ctrl+C** in both terminal windows to stop the servers.

---

## ➡️ Next Steps

Once local testing works:
1. We'll deploy to AWS Lambda
2. Update `core-system.js` to use your AWS URL
3. Deploy frontend to GitHub Pages
4. Done! 🎉
