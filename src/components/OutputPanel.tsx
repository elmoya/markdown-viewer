import type { OutputMode } from '../types'
import { CopyButton } from './CopyButton'
import { MarkdownPreview } from './MarkdownPreview'
import { RawOutput } from './RawOutput'
import './OutputPanel.css'

interface OutputPanelProps {
  markdown: string
  outputMode: OutputMode
  onOutputModeChange: (mode: OutputMode) => void
}

export function OutputPanel({ markdown, outputMode, onOutputModeChange }: OutputPanelProps) {
  return (
    <div className="output-panel">
      <div className="panel-header">
        <div className="output-controls">
          <span className="panel-title">Output</span>
          <div className="toggle-group" role="radiogroup" aria-label="Output mode">
            <button
              className={`toggle-btn ${outputMode === 'rendered' ? 'active' : ''}`}
              onClick={() => onOutputModeChange('rendered')}
              role="radio"
              aria-checked={outputMode === 'rendered'}
            >
              Rendered
            </button>
            <button
              className={`toggle-btn ${outputMode === 'raw' ? 'active' : ''}`}
              onClick={() => onOutputModeChange('raw')}
              role="radio"
              aria-checked={outputMode === 'raw'}
            >
              Raw
            </button>
          </div>
        </div>
        <CopyButton text={markdown} label="Copy" />
      </div>
      <div className="output-content">
        {outputMode === 'rendered' ? (
          <MarkdownPreview markdown={markdown} />
        ) : (
          <RawOutput markdown={markdown} />
        )}
      </div>
    </div>
  )
}
