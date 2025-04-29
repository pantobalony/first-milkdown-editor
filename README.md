# Milkdown React Editor

A React implementation of the Milkdown Crepe WYSIWYG Markdown editor.

![Milkdown Editor Screenshot](screenshot.png)

## Features

- 🖋️ **WYSIWYG Editing** - Rich text interface for Markdown
- 🧩 **Block Editing** - Drag to reorder content blocks
- ➕ **Add Button** - Easily add new content blocks
- 🎨 **Modern UI** - Clean, responsive design

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/my-milkdown-editor.git
cd my-milkdown-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

The editor provides a WYSIWYG interface for editing Markdown content. Key features:

- Use the toolbar at the bottom for formatting options
- Hover over blocks to see the drag handle (six dots) and add button (+)
- Use the "Get Markdown" button to retrieve the raw markdown content
- The "Fix Toolbar" button restores the toolbar if it disappears
- The "Reset Editor" button reloads the editor if needed

## Technical Details

This project uses:

- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Milkdown](https://milkdown.dev/) - Markdown editor framework
- [Crepe](https://milkdown.dev/docs/api/crepe) - Preconfigured Milkdown editor

## License

MIT

## Acknowledgements

- [Milkdown](https://milkdown.dev/) - The core editor framework
- [Crepe](https://github.com/Milkdown/milkdown/tree/main/packages/crepe) - The pre-configured Milkdown editor