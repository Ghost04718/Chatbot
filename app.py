from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from database import db, User, Chat, Message
from config import Config
from openai import OpenAI
from datetime import datetime
from markdown import markdown
from markdown.extensions.fenced_code import FencedCodeExtension
from markdown.extensions.codehilite import CodeHiliteExtension

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
with app.app_context():
    db.create_all() # Commnet out if in production mode
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Set up OpenAI API
client = OpenAI(
    base_url=Config.OPENAI_API_BASE,
    api_key=Config.OPENAI_API_KEY,
)

MODEL_NAME = "gpt-4o-mini"
MODEL_PROMPT = "You are a helpful assistant for students in The Chinese University of Hong Kong, Shenzhen. Answer short and concise."

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return redirect(url_for('register'))
        
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        flash('Registration successful')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('chat'))
        else:
            flash('Invalid username or password')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/chat')
@login_required
def chat():
    chats = Chat.query.filter_by(user_id=current_user.id).all()
    active_chat = chats[0] if chats else None
    active_chat_id = active_chat.id if active_chat else None
    return render_template('chat.html', chats=chats, active_chat_id=active_chat_id)

@app.route('/get_chat_history/<int:chat_id>')
@login_required
def get_chat_history(chat_id):
    chat = Chat.query.get_or_404(chat_id)
    if chat.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp).all()
    history = [
        {
            'content': msg.content,
            'is_user': msg.is_user,
            'timestamp': msg.timestamp.isoformat()
        } for msg in messages
    ]
    return jsonify(history)

@app.route('/create_chat', methods=['POST'])
@login_required
def create_chat():
    title = request.form['title']
    new_chat = Chat(title=title, user_id=current_user.id)
    db.session.add(new_chat)
    db.session.commit()
    return jsonify({'success': True, 'chat_id': new_chat.id, 'title': new_chat.title})

@app.route('/delete_chat/<int:chat_id>', methods=['POST'])
@login_required
def delete_chat(chat_id):
    chat = Chat.query.get_or_404(chat_id)
    if chat.user_id != current_user.id:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    db.session.delete(chat)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/send_message', methods=['POST'])
@login_required
def send_message():
    chat_id = request.form['chat_id']
    user_message = request.form['message']
    
    chat = Chat.query.get_or_404(chat_id)
    if chat.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    chat_history = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp.desc()).limit(5).all()
    
    messages = [
        {"role": "system", "content": MODEL_PROMPT}
    ]
    
    for msg in reversed(chat_history):
        role = "user" if msg.is_user else "assistant"
        messages.append({"role": role, "content": msg.content})
    
    messages.append({"role": "user", "content": user_message})
    
    user_msg = Message(content=user_message, is_user=True, chat_id=chat_id, timestamp=datetime.utcnow())
    db.session.add(user_msg)
    
    try:
        response = client.chat.completions.create(
            messages=messages,
            temperature=1.0,
            top_p=1.0,
            max_tokens=1000,
            model=MODEL_NAME
        )
        ai_message = response.choices[0].message.content
        
        ai_msg = Message(content=ai_message, is_user=False, chat_id=chat_id, timestamp=datetime.utcnow())
        db.session.add(ai_msg)
        db.session.commit()
        
        html_content = markdown(ai_message, extensions=[FencedCodeExtension(), CodeHiliteExtension()])
        
        return jsonify({
            'user_message': user_message,
            'ai_message': html_content
        })
    except Exception as e:
        app.logger.error(f"Error generating AI response: {e}")
        return jsonify({'error': 'Failed to generate AI response'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
