import { useEffect, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';

// Simplified implementation based directly on the examples
export function BasicEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);

  useEffect(() => {
    // Only run once when component mounts
    if (editorRef.current && !crepeRef.current) {
      console.log('Initializing basic editor...');
      
      // Create the editor
      const crepe = new Crepe({
        root: editorRef.current,
        defaultValue: '# Hello Milkdown!\n\nType here to edit...',
        // Minimal feature set for testing
        features: {
          [Crepe.Feature.Placeholder]: true,
        },
      });

      // Save reference
      crepeRef.current = crepe;

      // Initialize
      crepe.create()
        .then(() => {
          console.log('Basic editor created successfully');
        })
        .catch((error) => {
          console.error('Error creating basic editor:', error);
        });
    }

    // Cleanup on unmount
    return () => {
      if (crepeRef.current) {
        crepeRef.current.destroy().catch(console.error);
        crepeRef.current = null;
      }
    };
  }, []);

  return (
    <div className="basic-editor-wrapper" style={{ padding: '20px' }}>
      <h3>Basic Crepe Editor</h3>
      <div 
        ref={editorRef} 
        style={{ 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          padding: '10px',
          minHeight: '200px',
          backgroundColor: '#f9f9f9'
        }}
      />
    </div>
  );
}