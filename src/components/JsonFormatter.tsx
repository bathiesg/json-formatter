/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import JsonTreeViewer from './JsonTreeViewer';
import * as yaml from 'js-yaml';
import './JsonFormatter.css';

interface JsonFormatterProps
{
  darkMode: boolean;
}

const JsonFormatter = ({ darkMode }: JsonFormatterProps) =>
{
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'text' | 'tree'>('text');
  const [yamlInput, setYamlInput] = useState('');

  // Valider le JSON dès qu'on tape
  // moved logic to handleInputChange
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
  {
    const value = e.target.value;
    setInput(value);
    try {
      const result = JSON.parse(value);
      setParsed(result);
      setError(null);
    } catch (err: any) {
      setParsed(null);
      setError('❌ JSON invalide : ' + err.message);
    }
  };

  // Changer de mode (Text / Tree)
  const handleModeChange = (newMode: 'text' | 'tree') =>
  {
    setMode(newMode);
  };

  const handleCopy = async () =>
  {
    try {
      await navigator.clipboard.writeText(JSON.stringify(parsed ?? input, null, 2));
      alert('📋 Copié dans le presse-papiers');
    } catch {
      alert('❌ Impossible de copier');
    }
  };

  const handleExport = () =>
  {
    if (!parsed) return;
    const blob = new Blob([JSON.stringify(parsed, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleYamlConvert = () =>
  {
    try {
      const result = yaml.load(yamlInput);
      const json = JSON.stringify(result, null, 2);
      setInput(json);
      setYamlInput('');
    } catch (err: any) {
      alert('❌ YAML invalide : ' + err.message);
    }
  };

  return (
    <div className={`json-formatter ${darkMode ? 'dark-theme' : ''}`}>
      {/* Switch boutons */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => handleModeChange('text')}
          style={{ marginRight: '0.5rem', backgroundColor: mode === 'text' ? '#007bff' : '#ccc', color: '#fff' }}
        >
          Text
        </button>
        <button
          onClick={() => handleModeChange('tree')}
          style={{ marginRight: '1rem', backgroundColor: mode === 'tree' ? '#007bff' : '#ccc', color: '#fff' }}
        >
          Tree
        </button>

        <button onClick={handleCopy} style={{ marginRight: '0.5rem' }}>
          📋 Copier
        </button>
        <button onClick={handleExport}>
          💾 Télécharger
        </button>
      </div>

      {mode === 'text' ? (
        <>
          <textarea
            placeholder="Collez ou écrivez votre JSON ici..."
            value={input}
            onChange={handleInputChange}
            rows={20}
            style={{ width: '100%', fontFamily: 'monospace', padding: '1rem' }}
          />
          {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        </>
      ) : (
        <div
          style={{
            padding: '1rem',
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
            fontFamily: 'monospace',
            borderRadius: '6px',
          }}
        >
          {parsed ? (
            <JsonTreeViewer data={parsed} />
          ) : (
            <p style={{ color: 'red' }}>{error || 'JSON invalide'}</p>
          )}
        </div>
      )}

      {/* YAML converter */}
      <div style={{ marginTop: '2rem' }}>
        <h3>🔄 Convertir YAML → JSON</h3>
        <textarea
          placeholder="Collez ici du YAML..."
          value={yamlInput}
          onChange={(e) => setYamlInput(e.target.value)}
          rows={10}
          style={{ width: '100%', fontFamily: 'monospace', padding: '1rem' }}
        />
        <button onClick={handleYamlConvert} style={{ marginTop: '0.5rem' }}>
          ➡️ Convertir
        </button>
      </div>
    </div>
  );
};

export default JsonFormatter;
