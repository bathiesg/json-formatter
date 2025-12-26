import { useState } from 'react';
import JsonFormatter from './components/JsonFormatter';
import './index.css';

function App ()
{
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>🧪 JSON Formatter & Validator</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <JsonFormatter darkMode={darkMode} />
    </div>
  );
}

export default App;
