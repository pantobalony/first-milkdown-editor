# Technical Documentation

## Project Architecture

This Milkdown editor implementation is built with React and uses the Milkdown Crepe package to provide WYSIWYG Markdown editing capabilities.

### Core Components

#### `App.tsx`
The main application component that:
- Manages application state
- Handles window resizing
- Sets up toolbar monitoring
- Provides editor controls

#### `MilkdownEditor.tsx`
The React wrapper for the Milkdown Crepe editor:
- Initializes Crepe instance
- Configures editor features
- Handles state changes
- Manages events

### State Management

The editor uses React's `useState` and `useEffect` hooks to manage:
- Editor readiness state
- Error handling
- Editor instance reference

### Key Features Implementation

#### Toolbar Visibility Fix
The toolbar disappearance issue is addressed using multiple strategies:

1. **CSS Overrides**:
```css
.milkdown-toolbar,
[data-milkdown-toolbar],
div[data-type="toolbar"] {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: sticky !important;
  bottom: 0 !important;
}
```

2. **MutationObserver**:
```javascript
const observer = new MutationObserver((mutations) => {
  // For any DOM change, check if the toolbar might be hidden
  ensureToolbarVisible();
});

observer.observe(editorRef.current, {
  childList: true,
  subtree: true,
  attributes: true
});
```

3. **Manual Fix Button**:
```javascript
const fixToolbar = () => {
  const toolbars = document.querySelectorAll('.toolbar, [data-milkdown-toolbar], [data-type="toolbar"]');
  
  toolbars.forEach(toolbar => {
    if (toolbar instanceof HTMLElement) {
      toolbar.style.display = 'flex';
      toolbar.style.visibility = 'visible';
      toolbar.style.opacity = '1';
    }
  });
};
```

#### Block Handle Positioning
The block handles (drag handles and add buttons) are positioned correctly using:

```css
.milkdown .ProseMirror .handle {
  position: absolute !important;
  left: -28px !important;
  transform: none !important;
  display: flex !important;
  align-items: center !important;
}

/* Add button implementation */
.milkdown .ProseMirror .handle::before {
  content: "+" !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 16px !important;
  height: 16px !important;
  background-color: #4a90e2 !important;
  color: white !important;
  border-radius: 50% !important;
}
```

#### Responsive Layout
The editor fills the entire viewport and responds to window size changes:

```javascript
const handleResize = () => {
  if (editorRef.current) {
    const container = editorRef.current.parentElement;
    if (container) {
      // Force a reflow
      container.style.height = `${window.innerHeight - 100}px`;
      container.style.width = `${window.innerWidth - 20}px`;
      
      // Return to flex sizing
      setTimeout(() => {
        container.style.height = '';
        container.style.width = '';
      }, 0);
    }
  }
};

window.addEventListener('resize', handleResize);
```

### Crepe Configuration

The Milkdown Crepe editor is configured with:

```javascript
const crepe = new Crepe({
  root: editorRef.current,
  defaultValue: '# Hello Milkdown!...',
  features: {
    [Crepe.Feature.Placeholder]: true,
    [Crepe.Feature.Toolbar]: true,
    [Crepe.Feature.BlockEdit]: true,
    [Crepe.Feature.ListItem]: true,
    [Crepe.Feature.CodeMirror]: false,
    [Crepe.Feature.ImageBlock]: false,
    [Crepe.Feature.Table]: false,
    [Crepe.Feature.Latex]: false
  },
  featureConfigs: {
    [Crepe.Feature.Placeholder]: {
      text: 'Type / for commands or start typing...'
    },
    [Crepe.Feature.BlockEdit]: {
      slashMenuTextGroupLabel: 'Text',
      slashMenuTextLabel: 'Paragraph',
      slashMenuH1Label: 'Heading 1',
      slashMenuH2Label: 'Heading 2',
      addableBlocks: true
    }
  }
});
```

### CSS Structure

The project's CSS is organized into several files:

1. **index.css** - Base styling and layout
2. **App.css** - Application-specific styling
3. **MilkdownEditor.css** - Editor component styling
4. **milkdown-fixes.css** - Toolbar and menu fixes
5. **handle-fixes.css** - Block handle and add button fixes

### Event Handling

The editor uses several event handlers:

1. **Window resize**:
```javascript
window.addEventListener('resize', handleResize);
```

2. **Markdown content retrieval**:
```javascript
crepe.on((listener) => {
  listener.markdownUpdated((_, md) => {
    setMarkdown(md);
    onChange?.(md);
  });
});
```

3. **DOM mutation observation**:
```javascript
observer.observe(editorRef.current, {
  childList: true,
  subtree: true,
  attributes: true
});
```

## Build and Deployment

The project uses Vite for building and development:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Dependencies

- React 19.0.0
- Vite 6.3.1
- @milkdown/crepe 7.9.0
- @milkdown/react 7.9.0
- @milkdown/core 7.9.0
- @milkdown/ctx 7.9.0
- @milkdown/kit 7.9.0
- @codemirror/state 6.5.2
- @codemirror/theme-one-dark 6.1.2
- @codemirror/view 6.36.6

## Browser Compatibility

The editor has been tested on:
- Chromium-based browsers (Chrome, Edge)
- Firefox
- Safari

## Known Issues and Limitations

1. Toolbar may occasionally disappear (use the "Fix Toolbar" button)
2. Add button (+) click behavior depends on Milkdown implementation
3. Some advanced features (tables, code blocks with syntax highlighting) are disabled for simplicity