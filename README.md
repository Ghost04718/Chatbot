# AI Chat Website

This project is a web application that provides an AI-powered chat interface similar to Claude or GPT. It uses Flask as the web framework, SQLite3 for the database, and the OpenAI API for generating AI responses.

## Features

- User registration and login
- Create and delete chat sessions
- User memory (chat history)
- Display AI responses in markdown format
- Fancy and appealing UI

## Setup

1. Clone the repository
2. Install the required packages: `pip install -r requirements.txt`
3. Create a `.env` file in the project root directory with the following content:   ```
   SECRET_KEY=your_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here   ```
   Replace `your_secret_key_here` with a secure random string and `your_openai_api_key_here` with your actual OpenAI API key.
4. Run the application: `python app.py`

## Technologies Used

- Flask
- SQLite3
- OpenAI API
- HTML/CSS/JavaScript
- Markdown rendering

## License

This project is open-source and available under the MIT License.
