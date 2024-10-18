// Function to handle Markdown code blocks
function handleMarkdownCodeBlocks(markdown) {
  try {
    // Split the markdown into lines
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let language = '';
    let codeBlock = [];
    const result = [];

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          console.log('Ending code block:', language);
          result.push(formatCodeBlock(codeBlock.join('\n'), language));
          inCodeBlock = false;
          language = '';
          codeBlock = [];
        } else {
          // Start of code block
          inCodeBlock = true;
          language = line.trim().slice(3).toLowerCase();
          console.log('Starting code block:', language);
        }
      } else if (inCodeBlock) {
        codeBlock.push(line);
      } else {
        result.push(line);
      }
    }

    // Handle case where code block is not closed
    if (inCodeBlock) {
      console.log('Unclosed code block:', language);
      result.push(formatCodeBlock(codeBlock.join('\n'), language));
    }

    return result.join('\n');
  } catch (error) {
    console.error('Error in handleMarkdownCodeBlocks:', error);
    return markdown; // Return original markdown if there's an error
  }
}

// Helper function to format code block
function formatCodeBlock(code, language) {
  try {
    const escapedCode = escapeHtml(code.trim());
    const languageClass = language ? ` class="language-${language}"` : '';
    const languageDisplay = language ? `<div class="language-tag">${language}</div>` : '';
    return `
<div class="code-block-wrapper">
  ${languageDisplay}
  <pre><code${languageClass}>${escapedCode}</code></pre>
</div>`;
  } catch (error) {
    console.error('Error in formatCodeBlock:', error);
    return `<pre><code>${escapeHtml(code)}</code></pre>`; // Fallback formatting
  }
}

// Helper function to escape HTML special characters
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Export the function for use as a module
module.exports = {
  handleMarkdownCodeBlocks
};

// Example usage (uncomment for testing)
/*
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
*/
