import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useLocalStorage } from './hooks/useLocalStorage'
import { convertEscapes } from './utils/markdown'
import { Header } from './components/Header'
import { MarkdownInput } from './components/MarkdownInput'
import { OutputPanel } from './components/OutputPanel'
import type { Layout, OutputMode, ActiveTab } from './types'
import './App.css'

function App() {
  const [inputText, setInputText] = useLocalStorage<string>('md-viewer-input', '')
  const [theme, setTheme] = useTheme()
  const [layout, setLayout] = useLocalStorage<Layout>('md-viewer-layout', 'split')
  const [outputMode, setOutputMode] = useLocalStorage<OutputMode>('md-viewer-output', 'rendered')
  const [activeTab, setActiveTab] = useState<ActiveTab>('input')

  const convertedMarkdown = convertEscapes(inputText)

  return (
    <div className="app">
      <Header
        theme={theme}
        onThemeChange={setTheme}
        layout={layout}
        onLayoutChange={setLayout}
      />
      <main className={`app-content layout-${layout}`}>
        {layout === 'split' ? (
          <>
            <div className="pane pane-left">
              <MarkdownInput value={inputText} onChange={setInputText} />
            </div>
            <div className="pane-divider" />
            <div className="pane pane-right">
              <OutputPanel
                markdown={convertedMarkdown}
                outputMode={outputMode}
                onOutputModeChange={setOutputMode}
              />
            </div>
          </>
        ) : (
          <>
            <div className="tab-bar">
              <button
                className={`tab-btn ${activeTab === 'input' ? 'active' : ''}`}
                onClick={() => setActiveTab('input')}
              >
                Input
              </button>
              <button
                className={`tab-btn ${activeTab === 'output' ? 'active' : ''}`}
                onClick={() => setActiveTab('output')}
              >
                Output
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'input' ? (
                <MarkdownInput value={inputText} onChange={setInputText} />
              ) : (
                <OutputPanel
                  markdown={convertedMarkdown}
                  outputMode={outputMode}
                  onOutputModeChange={setOutputMode}
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
