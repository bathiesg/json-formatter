/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

interface JsonTreeViewerProps
{
    data: any;
    level?: number;
}

const INDENT = 16;

const JsonTreeViewer = ({ data, level = 0 }: JsonTreeViewerProps) =>
{
    const [collapsed, setCollapsed] = useState(false);

    const isObject = (val: any) => typeof val === 'object' && val !== null;
    const isArray = Array.isArray(data);
    const entries = isObject(data) ? Object.entries(data) : [];

    const toggle = () => setCollapsed(!collapsed);

    const getTypeStyle = (val: any): React.CSSProperties =>
    {
        const type = typeof val;
        if (val === null) return { color: '#999', fontStyle: 'italic' };
        if (type === 'string') return { color: '#ce9178' };
        if (type === 'number') return { color: '#b5cea8' };
        if (type === 'boolean') return { color: '#569cd6' };
        if (type === 'undefined') return { color: '#999', fontStyle: 'italic' };
        return {};
    };

    if (!isObject(data)) {
        return (
            <span style={getTypeStyle(data)}>
                {typeof data === 'string' ? `"${data}"` : String(data)}
            </span>
        );
    }

    return (
        <div style={{ marginLeft: level * INDENT, fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggle}>
                <span style={{ width: 16 }}>{collapsed ? '▶' : '▼'}</span>
                <span style={{ color: '#9cdcfe' }}>
                    {isArray ? 'Array' : 'Object'} {isArray ? `[${entries.length}]` : `{${entries.length}}`}
                </span>
            </div>

            {!collapsed && (
                <div>
                    <div>{isArray ? '[' : '{'}</div>
                    <div style={{ marginLeft: INDENT }}>
                        {entries.map(([key, value], index) => (
                            <div key={key}>
                                {!isArray && (
                                    <span style={{ color: '#dcdcaa' }}>"{key}"</span>
                                )}
                                {!isArray && <span>: </span>}
                                <JsonTreeViewer data={value} level={level + 1} />
                                {index < entries.length - 1 ? ',' : ''}
                            </div>
                        ))}
                    </div>
                    <div>{isArray ? ']' : '}'}</div>
                </div>
            )}
        </div>
    );
};

export default JsonTreeViewer;
