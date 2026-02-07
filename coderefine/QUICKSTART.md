# CodeRefine - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Get Your API Keys (2 minutes)

#### Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

#### Supabase Credentials
1. Go to https://supabase.com
2. Create account (if needed)
3. Click "New Project"
4. Fill in project details
5. Wait for setup to complete (~1 minute)
6. Go to Settings → API
7. Copy:
   - Project URL
   - anon/public key

### Step 2: Setup Backend (1 minute)

```bash
cd backend
pip install flask flask-cors google-generativeai supabase python-dotenv
```

Create `.env` file:
```env
GEMINI_API_KEY=your-gemini-key-here
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=your-anon-key-here
```

### Step 3: Run Backend

```bash
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

### Step 4: Run Frontend (30 seconds)

Open a new terminal:

```bash
cd frontend
python -m http.server 8000
```

### Step 5: Use the App!

1. Open browser: http://localhost:8000
2. Click "Sign Up"
3. Create account
4. Login
5. Paste code and click "Analyze Code"!

## 🎯 Test with Sample Code

Copy this Python code to test:

```python
def calculate_sum(numbers):
    result = 0
    for i in range(len(numbers)):
        result = result + numbers[i]
    return result

numbers = [1, 2, 3, 4, 5]
print(calculate_sum(numbers))
```

Click "Analyze Code" or "Improve Performance" to see the magic!

## ⚠️ Troubleshooting

**Can't login?**
- Check Supabase URL and key in `.env`
- Make sure backend is running

**Analysis not working?**
- Verify Gemini API key
- Check backend terminal for errors

**Port already in use?**
```bash
# Use different port for frontend
python -m http.server 3000
```

## 📱 What Works

✅ Signup/Login/Logout
✅ Code Analysis (AI-powered)
✅ Bug Fixing
✅ Performance Optimization
✅ Code Refactoring
✅ Complexity Analysis
✅ Before/After Comparison
✅ Download TXT/PDF
✅ Share Code

## 🎨 Supported Languages

- Python
- JavaScript
- Java
- C++
- Go

Select from dropdown before analyzing!

---

**Need help?** Check the full README.md for detailed documentation.
