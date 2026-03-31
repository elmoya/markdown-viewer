import type { Layout } from '../types'
import './ThemeToggle.css'

interface LayoutToggleProps {
  layout: Layout
  onLayoutChange: (layout: Layout) => void
}

const options: { value: Layout; label: string }[] = [
  { value: 'split', label: 'Split' },
  { value: 'tabbed', label: 'Tabbed' },
]

export function LayoutToggle({ layout, onLayoutChange }: LayoutToggleProps) {
  return (
    <div className="toggle-group" role="radiogroup" aria-label="Layout">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`toggle-btn ${layout === opt.value ? 'active' : ''}`}
          onClick={() => onLayoutChange(opt.value)}
          role="radio"
          aria-checked={layout === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
