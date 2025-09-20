import React, { useState } from 'react'
import { Button } from './components/ui/button'
import BackgroundPaths from './components/BackgroundPaths'
import { useCopyToClipboard, getInitials } from './lib/utils'

function App() {
  const [copied, copyToClipboard] = useCopyToClipboard()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <BackgroundPaths />

      <div className="relative min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold">X Algorithm for Noobs</span>
              </a>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a
                  href="#"
                  className="transition-colors hover:text-foreground/80 text-foreground"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Components
                </a>
                <a
                  href="#"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Docs
                </a>
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
              </div>
              <nav className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="mr-2"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard('Hello from X Algorithm!')}
                >
                  {copied ? 'Copied!' : 'Copy Text'}
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <section className="flex flex-col items-center justify-center space-y-4 py-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to X Algorithm
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              A modern React component library built with TypeScript, Tailwind CSS, and shadcn/ui.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-2xl font-bold mb-6">Component Showcase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-4">Button Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-4">Button Sizes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">📎</Button>
                </div>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-4">Utility Functions</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>getInitials:</strong> "{getInitials('John Doe')}"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>useCopyToClipboard:</strong> {copied ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t py-6 md:px-8 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <span className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with React, TypeScript, and Tailwind CSS.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App