from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
import re
from supabase.client import create_client, Client

load_dotenv()
app = Flask(__name__)
CORS(app)

# Initialize Groq AI
# Use a default model constant for easy updates later
MODEL_NAME = "llama-3.3-70b-versatile"
client = Groq(api_key=os.environ.get('GROQ_API_KEY'))

# Initialize Supabase
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY or SUPABASE_URL == 'your-supabase-url':
    raise ValueError("Missing Supabase credentials in .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def calculate_complexity(code, language):
    """Calculate code complexity metrics"""
    lines = code.split('\n')
    non_empty_lines = [line for line in lines if line.strip()]
    
    # Time complexity estimation (basic heuristic)
    time_complexity = "O(1)"
    if any(keyword in code.lower() for keyword in ['for', 'while', 'loop']):
        nested_loops = code.lower().count('for') + code.lower().count('while')
        if nested_loops >= 3:
            time_complexity = "O(n³)"
        elif nested_loops >= 2:
            time_complexity = "O(n²)"
        else:
            time_complexity = "O(n)"
    
    # Space complexity (basic heuristic)
    space_complexity = "O(1)"
    if any(keyword in code.lower() for keyword in ['array', 'list', 'dict', 'map', 'vector']):
        space_complexity = "O(n)"
    
    # Nesting depth
    max_depth = 0
    current_depth = 0
    for line in lines:
        stripped = line.lstrip()
        if stripped:
            indent = len(line) - len(stripped)
            depth = indent // 4 if language in ['python'] else indent // 2
            max_depth = max(max_depth, depth)
    
    # Cyclomatic complexity (simplified)
    decision_points = (
        code.lower().count('if ') +
        code.lower().count('elif ') +
        code.lower().count('else:') +
        code.lower().count('for ') +
        code.lower().count('while ') +
        code.lower().count('case ') +
        code.lower().count('&&') +
        code.lower().count('||')
    )
    cyclomatic_complexity = decision_points + 1
    
    return {
        'time_complexity': time_complexity,
        'space_complexity': space_complexity,
        'nesting_depth': max_depth,
        'cyclomatic_complexity': cyclomatic_complexity,
        'lines_of_code': len(non_empty_lines)
    }



@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password required'}), 400
        # Sign up with Supabase
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "username": username
                }
            }
        })
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': auth_response.user.id if auth_response.user else None
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/auth/signin', methods=['POST'])
def signin():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Sign in with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not auth_response.session or not auth_response.user:
            return jsonify({'success': False, 'error': 'Login failed'}), 401
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': auth_response.session.access_token,
            'user': {
            'id': auth_response.user.id,
            'email': auth_response.user.email,
            'username': auth_response.user.user_metadata.get('username', '')
    }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 401


@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        email = data.get('email')
        
        # Send password reset email
        supabase.auth.reset_password_email(email)
        
        return jsonify({
            'success': True,
            'message': 'Password reset email sent'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/analyze', methods=['POST'])
def analyze_code():
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', 'python')
        
        if not code:
            return jsonify({'error': 'No code provided'}), 400
        
        complexity = calculate_complexity(code, language.lower())
        
        prompt = f"""You are an expert code reviewer. Analyze the following {language} code and provide:
1. **Bugs & Issues**
2. **Performance Issues**
3. **Best Practice Violations**
4. **Security Concerns**
5. **Suggestions**

Code to analyze:
```{language}
{code}
```"""

        # Groq Call
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2048
        )
        
        return jsonify({
            'success': True,
            'analysis': response.choices[0].message.content,
            'complexity': complexity
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/refine', methods=['POST'])
def refine_code():
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', 'python')
        action = data.get('action', 'all')
        
        if not code:
            return jsonify({'error': 'No code provided'}), 400
        
        focus_options = {
            'bugs': "Fix all bugs and errors",
            'performance': "Optimize for better performance",
            'refactor': "Refactor for better code quality",
            'all': "Fix bugs, optimize performance, and improve code quality"
        }
        focus = focus_options.get(action, focus_options['all'])
        
        prompt = f"""You are an expert {language} developer. {focus} in the following code.
IMPORTANT: Return ONLY the raw code. No markdown, no triple backticks, no explanations.

Original code:
{code}"""

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )

        # Cleanup: removes ```python ... ``` and extra whitespace
        refined_code = response.choices[0].message.content.strip()
        refined_code = re.sub(r'^```\w*\n?|```$', '', refined_code).strip()
        
        return jsonify({
            'success': True,
            'refined_code': refined_code,
            'original_complexity': calculate_complexity(code, language.lower()),
            'refined_complexity': calculate_complexity(refined_code, language.lower())
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ... [signup, signin, reset-password, and health routes remain the same] ...
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)