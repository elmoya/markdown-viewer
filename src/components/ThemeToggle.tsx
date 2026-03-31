import type { Theme } from '../types'
import './ThemeToggle.css'

interface ThemeToggleProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

const options: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  return (
    <div className="toggle-group" role="radiogroup" aria-label="Theme">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`toggle-btn ${theme === opt.value ? 'active' : ''}`}
          onClick={() => onThemeChange(opt.value)}
          role="radio"
          aria-checked={theme === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
