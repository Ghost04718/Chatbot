# Project Name

Brief description of the project.

## Installation

1. Clone the repository
2. Install the required packages: `npm install`
3. Create a `.env` file in the project root directory with the following content:   ```
   SECRET_KEY=your_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here   ```
   Replace `your_secret_key_here` with a secure random string and `your_openai_api_key_here` with your actual OpenAI API key.
4. Run the application: `npm start`

## Development

To run the application in development mode with hot reloading:

```bash
npm run dev
```

## Testing

To run tests:

```bash
npm test
```

## Linting

To run the linter:

```bash
npm run lint
```

## Technologies Used

- Node.js
- Express.js (assumed, based on the project structure)
- OpenAI API
- HTML/CSS/JavaScript
- Jest (for testing)
- ESLint (for linting)

## Features

- [List your project features here]

## Markdown Code Block Handler

This project now includes improved functionality to handle code blocks in Markdown format.

### Features

- Properly formats and displays Markdown code blocks
- Supports various programming languages
- Preserves indentation and line breaks within code blocks
- Handles nested code blocks and edge cases
- Displays the language of the code block

### Usage

To use the Markdown code block handler, simply include your code within triple backticks (```) in your Markdown text. You can also specify the language after the opening backticks for syntax highlighting and language display.

Example:

\`\`\`typescript
class Animal {
  constructor(public name: string) {}

  speak() {
    console.log(`My name is ${this.name}`);
  }
}

let dog = new Animal("Buddy");
dog.speak();
\`\`\`

The code above will be displayed with a "typescript" label above the code block, wrapped in a `<div class="language-tag">` element.

### Debugging

To test and debug the Markdown code block handler, follow these steps:

1. Open your browser's developer console (usually F12 or right-click and select "Inspect").
2. Copy and paste the following code into the console:

```javascript
const markdown = `
Here's an example of a Markdown code block:

\`\`\`typescript
class Animal {
  constructor(public name: string) {}

  speak() {
    console.log(\`My name is \${this.name}\`);
  }
}

let dog = new Animal("Buddy");
dog.speak();
\`\`\`

And here's some regular text.

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("World")
\`\`\`
`;

const formattedMarkdown = handleMarkdownCodeBlocks(markdown);
console.log('Formatted Markdown:');
console.log(formattedMarkdown);
```

3. Press Enter to run the code.
4. Check the console output for any error messages or the formatted Markdown.

If you encounter any issues, please report them along with the console output.

## Styling

To style the language tag and code block wrapper, add the following CSS to your stylesheet:

```css
.code-block-wrapper {
  position: relative;
  margin: 1em 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.language-tag {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f0f0f0;
  padding: 2px 6px;
  font-size: 0.8em;
  color: #333;
  border-bottom-left-radius: 4px;
}

pre {
  margin: 0;
  padding: 1em;
  background-color: #f5f5f5;
  overflow-x: auto;
}

code {
  font-family: 'Courier New', Courier, monospace;
}
```

This CSS will style the code blocks and make the language tag visible in the top-right corner of each code block.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open-source and available under the MIT License.

## Author

[Your Name] - Sophomore CS student at [Your University in Hong Kong]
