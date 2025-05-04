import { useState, useCallback, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileText, Eye, Copy, Download, Undo, Upload, Sun, Moon } from 'lucide-react'

const initialMarkdown = `# Welcome to your Markdown Editor

Start typing to see live preview.

- Supports **bold**, *italic*, and \`code\`
- Add [links](https://example.com) or images
- Use \`##\` for subheadings

## Example
This is a **bold** text and this is *italic*.

### Code Example
\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### List Example
1. First item
2. Second item
3. Third item
`


function App() {
  const [markdown, setMarkdown] = useState(initialMarkdown)
  const [history, setHistory] = useState([initialMarkdown])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const handleChange = (value: string) => {
    setMarkdown(value)
    setHistory([...history.slice(0, currentIndex + 1), value])
    setCurrentIndex(currentIndex + 1)
  }

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setMarkdown(history[currentIndex - 1])
    }
  }

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      alert('Content copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [markdown])

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }, [markdown])

  const handleUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        handleChange(content)
      }
      reader.readAsText(file)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Markdown Editor
          </h1>

          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Undo className="h-4 w-4 mr-2" />
              Undo
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>

            <label className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload
              <input
                type="file"
                accept=".md,.markdown"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <FileText className="h-4 w-4" />
              <span>Editor</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm"
              placeholder="Type your markdown here..."
            />
          </div>

          <div className="h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </div>
            <div className="w-full h-full p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 overflow-y-auto shadow-sm">
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App