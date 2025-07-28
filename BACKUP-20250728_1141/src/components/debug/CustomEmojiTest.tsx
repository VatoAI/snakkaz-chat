import React, { useEffect, useState } from 'react';
import { useCustomEmojis } from '../../hooks/useCustomEmojis';

export const CustomEmojiTest: React.FC = () => {
  const { customEmojis, isLoading, error, addCustomEmoji } = useCustomEmojis();
  const [testStatus, setTestStatus] = useState<string>('Initializing...');

  useEffect(() => {
    const testDatabase = async () => {
      try {
        setTestStatus('Testing database connection...');
        
        // This will trigger the database query
        if (error) {
          setTestStatus(`Database Error: ${error.message}`);
        } else if (isLoading) {
          setTestStatus('Loading custom emojis...');
        } else {
          setTestStatus(`Database Connected! Found ${customEmojis.length} custom emojis`);
        }
      } catch (err) {
        setTestStatus(`Test Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    testDatabase();
  }, [customEmojis, isLoading, error]);

  const handleTestAddEmoji = async () => {
    try {
      setTestStatus('Testing emoji addition...');
      await addCustomEmoji({
        shortcode: 'test-emoji',
        name: 'Test Emoji',
        url: 'https://example.com/test.gif',
        category: 'test',
        isAnimated: true,
        isPublic: true
      });
      setTestStatus('Emoji added successfully!');
    } catch (err) {
      setTestStatus(`Add Emoji Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#fff', 
      border: '2px solid #ccc', 
      borderRadius: '8px',
      padding: '15px',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h3>Custom Emoji Debug</h3>
      <p><strong>Status:</strong> {testStatus}</p>
      <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
      <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
      <p><strong>Emojis Count:</strong> {customEmojis.length}</p>
      
      <button 
        onClick={handleTestAddEmoji}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Add Emoji
      </button>
      
      <div style={{ marginTop: '10px', maxHeight: '100px', overflow: 'auto' }}>
        <strong>Custom Emojis:</strong>
        {customEmojis.map((emoji, index) => (
          <div key={index}>
            :{emoji.shortcode}: - {emoji.name}
          </div>
        ))}
      </div>
    </div>
  );
};
