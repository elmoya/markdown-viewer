import { useRef, useState } from 'react'
import { CopyButton } from './CopyButton'
import './MarkdownInput.css'

interface MarkdownInputProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownInput({ value, onChange }: MarkdownInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [pasteError, setPasteError] = useState(false)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      onChange(text)
      setPasteError(false)
    } catch {
      // Fallback: focus the textarea so user can Ctrl+V
      setPasteError(true)
      textareaRef.current?.focus()
      setTimeout(() => setPasteError(false), 2000)
    }
  }

  const handleClear = () => {
    onChange('')
    textareaRef.current?.focus()
  }

  return (
    <div className="input-panel">
      <div className="panel-header">
        <span className="panel-title">Input</span>
        <div className="input-actions">
          {value && <button className="copy-btn" onClick={handleClear}>Clear</button>}
          <CopyButton text={value} label="Copy" />
          <button
            className={`copy-btn ${pasteError ? 'paste-error' : ''}`}
            onClick={handlePaste}
          >
            {pasteError ? 'Use Ctrl+V' : 'Paste'}
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="markdown-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={'Paste your markdown string here...\n\nUse the Paste button or Ctrl+V'}
        spellCheck={false}
      />
    </div>
  )
}
