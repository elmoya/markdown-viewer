const escapeMap: Record<string, string> = {
  '\\n': '\n',
  '\\t': '\t',
  '\\\\': '\\',
}

export function convertEscapes(input: string): string {
  return input.replace(/\\\\|\\n|\\t/g, (match) => escapeMap[match])
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
