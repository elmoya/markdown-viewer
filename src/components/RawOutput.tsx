import './RawOutput.css'

interface RawOutputProps {
  markdown: string
}

export function RawOutput({ markdown }: RawOutputProps) {
  return (
    <div className="raw-output">
      <pre className="raw-pre">{markdown}</pre>
    </div>
  )
}
