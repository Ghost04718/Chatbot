from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(64), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128))
    chats = relationship('Chat', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Chat(db.Model):
    __tablename__ = 'chats'
    id = Column(Integer, primary_key=True)
    title = Column(String(100))
    user_id = Column(Integer, ForeignKey('users.id'))
    messages = relationship('Message', backref='chat', lazy='dynamic')

class Message(db.Model):
    __tablename__ = 'messages'
    id = Column(Integer, primary_key=True)
    content = Column(Text)
    is_user = Column(Boolean, default=True)
    chat_id = Column(Integer, ForeignKey('chats.id'))
    timestamp = Column(DateTime, index=True)
