import { useEffect, useState } from 'react';
import { Crepe, CrepeFeature } from '@milkdown/crepe';

interface SimpleEditorProps {
  defaultValue?: string;
}

export const SimpleEditor = ({ defaultValue = '# Hello Milkdown' }: SimpleEditorProps) => {
  const [editor, setEditor] = useState<Crepe | null>(null);

  useEffect(() => {
    // Find or create container
    let editorRoot = document.getElementById('milkdown-simple-root');
    if (!editorRoot) {
      editorRoot = document.createElement('div');
      editorRoot.id = 'milkdown-simple-root';
      document.getElementById('simple-editor-container')?.appendChild(editorRoot);
    }

    console.log('Initializing simple editor...');

    try {
      // Create editor instance
      const crepe = new Crepe({
        root: editorRoot,
        defaultValue,
        features: {
          [CrepeFeature.Placeholder]: true
        }
      });

      // Initialize editor
      crepe.create()
        .then(() => {
          console.log('Simple editor created successfully');
          setEditor(crepe);
        })
        .catch((error) => {
          console.error('Error creating simple editor:', error);
        });

      // Cleanup function
      return () => {
        crepe.destroy().catch(console.error);
      };
    } catch (error) {
      console.error('Error initializing editor:', error);
      return undefined;
    }
  }, [defaultValue]);

  return (
    <div 
      id="simple-editor-container"
      style={{ 
        width: '100%', 
        height: '300px', 
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        margin: '20px 0'
      }}
    >
      {/* Editor will be mounted here */}
      <p style={{ display: editor ? 'none' : 'block' }}>
        Loading simple editor...
      </p>
    </div>
  );
};