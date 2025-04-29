import { useEffect, useState } from 'react';
import { Crepe, CrepeFeature } from '@milkdown/crepe';
import { MilkdownProvider, Milkdown, useEditor } from '@milkdown/react';
import { oneDark } from '@codemirror/theme-one-dark';

// Debugging
console.log("MilkdownEditor component loaded");

// Import local CSS
import './MilkdownEditor.css';

interface MilkdownEditorProps {
  defaultValue?: string;
  onChange?: (markdown: string) => void;
  readOnly?: boolean;
}

export const MilkdownEditor = ({ 
  defaultValue = '', 
  onChange,
  readOnly = false 
}: MilkdownEditorProps) => {
  const [markdown, setMarkdown] = useState(defaultValue);
  const [editorReady, setEditorReady] = useState(false);

  // Simple editor hook for debugging
  const { loading, get } = useEditor((root) => {
    // Debug message
    console.log("Creating editor instance with root:", root);
    
    try {
      const crepe = new Crepe({
        root,
        defaultValue,
        features: {
          // Enable common features only for initial testing
          [CrepeFeature.CodeMirror]: true,
          [CrepeFeature.BlockEdit]: true,
          [CrepeFeature.Placeholder]: true,
        },
        featureConfigs: {
          [CrepeFeature.Placeholder]: {
            text: 'Type / for commands...'
          },
          [CrepeFeature.CodeMirror]: {
            theme: oneDark
          }
        }
      });

      console.log("Crepe instance created successfully");
      return crepe;
    } catch (error) {
      console.error("Error creating Crepe instance:", error);
      return null;
    }
  });

  useEffect(() => {
    if (!loading && get()) {
      console.log("Editor loaded and ready");
      const editor = get() as Crepe;
      setEditorReady(true);
      
      // Set readonly based on prop
      editor.setReadonly(readOnly);
      
      // Setup event listener for markdown updates
      editor.on((listener) => {
        listener.markdownUpdated((_, md) => {
          console.log("Markdown updated:", md.substring(0, 100) + "...");
          setMarkdown(md);
          onChange?.(md);
        });
      });
    }
  }, [loading, get, onChange, readOnly]);

  return (
    <div className="milkdown-editor-container">
      <MilkdownProvider>
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            position: 'relative' 
          }}
        >
          {loading && (
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.1)',
              zIndex: 10
            }}>
              Loading editor...
            </div>
          )}
          <Milkdown />
        </div>
      </MilkdownProvider>
    </div>
  );
};