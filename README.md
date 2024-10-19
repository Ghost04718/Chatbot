# AI Chat Application

This is a Flask-based AI chat application that uses OpenAI's API to generate responses. It's designed for students at The Chinese University of Hong Kong, Shenzhen.

## Features

- User registration and authentication
- Multiple chat sessions per user
- Real-time AI responses using OpenAI's API
- Markdown rendering for code blocks with syntax highlighting

## Dependencies

- Flask
- Flask-Login
- Flask-SQLAlchemy
- OpenAI
- Markdown

## Installation

1. Clone the repository:   ```
   git clone https://github.com/yourusername/ai-chat-app.git
   cd ai-chat-app   ```

2. Install the required packages:   ```
   pip install flask flask-login flask-sqlalchemy openai markdown   ```

3. Set up your environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:     ```
     OPENAI_API_KEY=your_openai_api_key
     OPENAI_API_BASE=your_openai_api_base_url
     SECRET_KEY=your_secret_key     ```

4. Initialize the database:   ```
   flask db init
   flask db migrate
   flask db upgrade   ```

5. Run the application:   ```
   python app.py   ```

## Usage

1. Open a web browser and navigate to `http://localhost:5000`
2. Register a new account or log in
3. Create a new chat or select an existing one
4. Start chatting with the AI!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
