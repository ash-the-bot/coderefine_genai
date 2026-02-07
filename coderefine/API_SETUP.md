# API Configuration Guide

## Setting Up Google Gemini API

### Step 1: Get API Key



2. **Sign in with Google Account**
   - Use any Google account

3. **Create API Key**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy the generated key

4. **Important Notes**
   - Free tier: 60 requests per minute
   - No credit card required
   - Key format: `AIzaSy...` (39 characters)

### Step 2: Test Your Key

```bash
curl \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  -X POST 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY'
```

Should return JSON response with generated text.

---

## Setting Up Supabase

### Step 1: Create Account

1. **Visit Supabase**
   - Go to: https://supabase.com
   - Click "Start your project"

2. **Sign Up**
   - Use GitHub, Google, or email
   - Verify email if required

### Step 2: Create Project

1. **New Project**
   - Click "New Project"
   - Choose organization (or create one)

2. **Project Settings**
   - **Name**: CodeRefine (or any name)
   - **Database Password**: Strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing**: Free tier is sufficient

3. **Wait for Setup**
   - Takes ~2 minutes
   - Don't close the page

### Step 3: Enable Email Authentication

1. **Go to Authentication**
   - Click "Authentication" in sidebar
   - Click "Providers"

2. **Configure Email Provider**
   - Enable "Email"
   - Settings:
     - ✅ Enable Email provider
     - ✅ Confirm email (optional for development)
     - ✅ Secure email change (recommended)

3. **Email Templates** (Optional)
   - Customize signup/reset emails
   - Use default templates for quick start

### Step 4: Get API Credentials

1. **Go to Project Settings**
   - Click gear icon (⚙️) → Project Settings
   - Click "API" in sidebar

2. **Copy Credentials**
   
   **Project URL:**
   ```
   https://xxxxxxxxxxx.supabase.co
   ```
   
   **Anon/Public Key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Important**
   - Use `anon public` key (NOT service_role)
   - Never commit these to public repos

### Step 5: Test Connection

```python
from supabase import create_client

url = "https://your-project.supabase.co"
key = "your-anon-key"
supabase = create_client(url, key)

# Test
response = supabase.auth.sign_up({
    "email": "test@example.com",
    "password": "testpassword123"
})
print(response)
```

---

## Environment Variables Setup

### Create .env File

In `backend/.env`:

```env
# Google Gemini API
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE1NTc2MDAwfQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Security Best Practices

1. **Never commit .env**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use environment variables in production**
   - Railway: Add in "Variables" tab
   - Render: Add in "Environment" section
   - Heroku: Use `heroku config:set`

3. **Rotate keys regularly**
   - Gemini: Generate new in AI Studio
   - Supabase: Regenerate in project settings

---

## Troubleshooting

### Gemini API Issues

**Error: "API key not valid"**
- Check key is copied correctly
- Ensure no extra spaces
- Verify API is enabled in Google Cloud Console

**Error: "Quota exceeded"**
- Free tier: 60 requests/minute
- Wait 1 minute and retry
- Consider upgrading to paid tier

**Error: "Model not found"**
- Use `gemini-pro` (not `gemini-1.5-pro`)
- Check model availability in your region

### Supabase Issues

**Error: "Invalid API key"**
- Use `anon public` key, not `service_role`
- Check URL has `https://`
- Verify project is fully deployed

**Error: "Email not confirmed"**
- Check spam folder
- Disable email confirmation in development:
  - Auth → Providers → Email → Disable "Confirm email"

**Error: "User already registered"**
- Use different email
- Delete user in Auth → Users
- Or use sign-in instead

**Connection timeout**
- Check internet connection
- Verify Supabase project is running
- Check firewall settings

---

## Testing Your Setup

### Test Script

Create `backend/test_config.py`:

```python
import os
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client

load_dotenv()

# Test Gemini
print("Testing Gemini API...")
try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello")
    print("✅ Gemini API working:", response.text[:50])
except Exception as e:
    print("❌ Gemini API error:", str(e))

# Test Supabase
print("\nTesting Supabase...")
try:
    supabase = create_client(
        os.getenv('SUPABASE_URL'),
        os.getenv('SUPABASE_KEY')
    )
    # Test connection
    print("✅ Supabase connected")
except Exception as e:
    print("❌ Supabase error:", str(e))
```

Run:
```bash
python test_config.py
```

Expected output:
```
Testing Gemini API...
✅ Gemini API working: Hello! How can I help you today?

Testing Supabase...
✅ Supabase connected
```

---

## Rate Limits & Quotas

### Gemini Free Tier
- **Requests**: 60 per minute
- **Tokens**: 1M per month
- **Models**: gemini-pro, gemini-pro-vision

### Supabase Free Tier
- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 5 GB
- **Monthly Active Users**: Unlimited
- **Auth**: Email, OAuth included

Both services are sufficient for development and moderate production use!

---

## Quick Reference

### Gemini API Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Supabase Auth Endpoints
```
POST /auth/v1/signup
POST /auth/v1/token?grant_type=password
POST /auth/v1/recover
```

### Need Help?

- **Gemini**: https://ai.google.dev/docs
- **Supabase**: https://supabase.com/docs
- **This Project**: Check README.md
