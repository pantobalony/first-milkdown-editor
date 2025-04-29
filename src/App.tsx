import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Crepe } from '@milkdown/crepe';

function App() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crepeInstance, setCrepeInstance] = useState<Crepe | null>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force editor container to adapt to new window size
      if (editorRef.current) {
        const container = editorRef.current.parentElement;
        if (container) {
          // Force a reflow
          container.style.height = `${window.innerHeight - 100}px`; // Approximate space for header
          container.style.width = `${window.innerWidth - 20}px`;
          
          // Return to flex sizing
          setTimeout(() => {
            container.style.height = '';
            container.style.width = '';
          }, 0);
        }
      }
    };

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Call once to initialize
    handleResize();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [editorReady]);

  // This useEffect will set up a MutationObserver to keep the toolbar visible
  useEffect(() => {
    if (editorReady && editorRef.current) {
      // Function to ensure the toolbar stays visible
      const ensureToolbarVisible = () => {
        // Find toolbar elements
        const toolbars = document.querySelectorAll('.toolbar, [data-milkdown-toolbar], [data-type="toolbar"]');
        
        // Force them to be visible
        toolbars.forEach(toolbar => {
          if (toolbar instanceof HTMLElement) {
            toolbar.style.display = 'flex';
            toolbar.style.visibility = 'visible';
            toolbar.style.opacity = '1';
          }
        });
      };

      // Set up a MutationObserver to watch for DOM changes
      const observer = new MutationObserver((mutations) => {
        // For any DOM change, check if the toolbar might be hidden
        ensureToolbarVisible();
      });

      // Start observing
      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // Also set an interval as a fallback
      const interval = setInterval(ensureToolbarVisible, 1000);

      // Call it immediately
      ensureToolbarVisible();

      // Clean up
      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, [editorReady]);

  useEffect(() => {
    // Only run once when component mounts
    if (editorRef.current) {
      try {
        console.log('Initializing Milkdown Crepe editor...');
        
        // Create the editor with a more focused set of features
        const crepe = new Crepe({
          root: editorRef.current,
          defaultValue: '# Hello Milkdown!\n\nThis is a simple editor powered by Milkdown Crepe.\n\n## Features\n\n- WYSIWYG Markdown editing\n- Plugin-based architecture\n- Customizable themes\n\n## Try me out\n\n1. Click on toolbar buttons to format text\n2. Type `/` to open the command menu\n3. Toggle read-only mode with the checkbox above',
          // Enable core features but disable potentially problematic ones
          features: {
            [Crepe.Feature.Placeholder]: true,
            [Crepe.Feature.Toolbar]: true,  // Make sure toolbar is enabled
            [Crepe.Feature.BlockEdit]: true,
            [Crepe.Feature.ListItem]: true,
            // Disable features that might cause layout issues
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
              // Configure the slash menu and block handles
              slashMenuTextGroupLabel: 'Text',
              slashMenuTextLabel: 'Paragraph',
              slashMenuH1Label: 'Heading 1',
              slashMenuH2Label: 'Heading 2',
              // Enable addable blocks for the + button
              addableBlocks: true
            }
          }
        });

        // Initialize editor
        crepe.create()
          .then(() => {
            console.log('Milkdown editor created successfully');
            setEditorReady(true);
            setCrepeInstance(crepe);
          })
          .catch((err) => {
            console.error('Error creating editor:', err);
            setError('Failed to initialize editor: ' + (err.message || 'Unknown error'));
          });

        // Cleanup on unmount
        return () => {
          crepe.destroy().catch(console.error);
        };
      } catch (err: any) {
        console.error('Error setting up editor:', err);
        setError('Error setting up editor: ' + (err.message || 'Unknown error'));
      }
    }
  }, []);

  // No longer needed - removed read-only functionality

  // Get the markdown content
  const getMarkdown = () => {
    if (crepeInstance) {
      const markdown = crepeInstance.getMarkdown();
      console.log('Current markdown:', markdown);
      alert('Current markdown content is in the console');
    }
  };
  
  // Show the toolbar if it disappears
  const fixToolbar = () => {
    // Find toolbar elements
    const toolbars = document.querySelectorAll('.toolbar, [data-milkdown-toolbar], [data-type="toolbar"]');
    
    // Force them to be visible
    toolbars.forEach(toolbar => {
      if (toolbar instanceof HTMLElement) {
        toolbar.style.display = 'flex';
        toolbar.style.visibility = 'visible';
        toolbar.style.opacity = '1';
        toolbar.style.position = 'sticky';
        toolbar.style.bottom = '0';
      }
    });
    
    alert('Toolbar visibility restored. If you still cannot see it, try the Reset button.');
  };

  // Reset the editor with default content
  const resetEditor = () => {
    if (crepeInstance) {
      try {
        // First destroy the current instance
        crepeInstance.destroy()
          .then(() => {
            setCrepeInstance(null);
            setEditorReady(false);
            
            // Force reload the page for a clean start
            window.location.reload();
          })
          .catch(err => {
            console.error('Error destroying editor:', err);
          });
      } catch (err) {
        console.error('Error resetting editor:', err);
      }
    }
  };

  return (
    <div className="app-container">
      <h1>Milkdown Crepe Editor</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="controls">
        <button 
          onClick={getMarkdown} 
          disabled={!editorReady}
        >
          Get Markdown
        </button>
        
        <button 
          onClick={fixToolbar} 
          disabled={!editorReady}
          className="fix-button"
        >
          Fix Toolbar
        </button>
        
        <button 
          onClick={resetEditor} 
          disabled={!editorReady}
          className="reset-button"
        >
          Reset Editor
        </button>
      </div>
      
      <div className="editor-container">
        {!editorReady && !error && (
          <div className="loading">Loading editor...</div>
        )}
        <div 
          ref={editorRef} 
          className="editor"
        />
      </div>
    </div>
  );
}

export default App;