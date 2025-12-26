import { useState, useEffect } from 'react';
import JsonTreeViewer from './JsonTreeViewer';

import * as yaml from 'js-yaml';

interface JsonFormatterProps
{
  darkMode: boolean;
}

const JsonFormatter = ({ darkMode }: JsonFormatterProps) =>
{
  const [input, setInput] = useState(() => localStorage.getItem('json_input') || '');
  const [input2, setInput2] = useState('');
  const [yamlInput, setYamlInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  // Charger depuis localStorage
  // (handled in useState initializer)

  useEffect(() =>
  {
    localStorage.setItem('json_input', input);
  }, [input]);

  const handleFormat = () =>
  {
    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setFormatted(pretty);
      setError('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError('❌ JSON invalide : ' + message);
      setFormatted('');
    }
  };

  const handleCopy = async () =>
  {
    if (formatted) {
      await navigator.clipboard.writeText(formatted);
      alert('📋 JSON copié dans le presse-papiers');
    }
  };

  const handleExport = () =>
  {
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMinify = () =>
  {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setFormatted(minified);
      setError('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError('❌ JSON invalide : ' + message);
      setFormatted('');
    }
  };

  const handleCompare = () =>
  {
    try {
      const obj1 = JSON.parse(input);
      const obj2 = JSON.parse(input2);
      setComparisonResult(
        JSON.stringify(obj1) === JSON.stringify(obj2)
          ? '✅ Les deux JSON sont identiques.'
          : '❌ Les deux JSON sont différents.'
      );
    } catch {
      setComparisonResult('⚠️ Veuillez coller deux JSON valides.');
    }
  };

  const handleYamlConvert = () =>
  {
    try {
      const result = yaml.load(yamlInput);
      const converted = JSON.stringify(result, null, 2);
      setFormatted(converted);
      setError('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError('❌ YAML invalide : ' + message);
      setFormatted('');
    }
  };

  return (
    <div className="json-formatter">
      <textarea
        placeholder="Collez votre JSON ici..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleFormat}>Valider / Formater</button>
        <button onClick={handleMinify} style={{ marginLeft: '0.5rem' }}>
          Minifier
        </button>
        <button onClick={handleCopy} style={{ marginLeft: '0.5rem' }}>
          Copier
        </button>
        <button onClick={handleExport} style={{ marginLeft: '0.5rem' }}>
          Exporter .json
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {formatted && (
        <div style={{ marginTop: '1rem' }}>
          <h3>📄 Résultat :</h3>
          <div style={{ padding: '1rem', backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5', borderRadius: '6px' }}>
            <JsonTreeViewer data={JSON.parse(formatted)} />
          </div>
        </div>
      )}

      <h3 style={{ marginTop: '2rem' }}>🔍 Comparaison JSON</h3>
      <textarea
        placeholder="Deuxième JSON à comparer..."
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      <button onClick={handleCompare} style={{ marginTop: '0.5rem' }}>
        Comparer les deux JSON
      </button>
      {comparisonResult && <p style={{ marginTop: '0.5rem' }}>{comparisonResult}</p>}

      <h3 style={{ marginTop: '2rem' }}>🔄 YAML → JSON</h3>
      <textarea
        placeholder="Coller du YAML ici..."
        value={yamlInput}
        onChange={(e) => setYamlInput(e.target.value)}
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      <button onClick={handleYamlConvert} style={{ marginTop: '0.5rem' }}>
        Convertir YAML → JSON
      </button>
    </div>
  );
};

export default JsonFormatter;
