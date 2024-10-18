import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'fallback-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///ai_chat.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    OPENAI_API_BASE = os.environ.get('OPENAI_API_BASE')

    @staticmethod
    def init_app(app):
        if not os.environ.get('SECRET_KEY'):
            print("Warning: SECRET_KEY not set in .env file. Using fallback key.")
        if not os.environ.get('OPENAI_API_KEY'):
            print("Error: OPENAI_API_KEY not set in .env file. AI responses will not work.")
        if not os.environ.get('OPENAI_API_BASE'):
            print("Warning: OPENAI_API_BASE not set in .env file. Using default OpenAI API endpoint.")
