import type { Theme, Layout } from '../types'
import { ThemeToggle } from './ThemeToggle'
import { LayoutToggle } from './LayoutToggle'
import './Header.css'

interface HeaderProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  layout: Layout
  onLayoutChange: (layout: Layout) => void
}

export function Header({ theme, onThemeChange, layout, onLayoutChange }: HeaderProps) {
  return (
    <header className="app-header">
      <h1 className="app-title">Markdown Viewer</h1>
      <div className="header-controls">
        <LayoutToggle layout={layout} onLayoutChange={onLayoutChange} />
        <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
      </div>
    </header>
  )
}
