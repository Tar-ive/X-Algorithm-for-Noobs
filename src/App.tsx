import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import BackgroundPaths from '@/components/BackgroundPaths'

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <BackgroundPaths />

      <div className="relative z-10 min-h-screen bg-background/80 backdrop-blur-sm">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.h1
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              X Algorithm for Noobs
            </motion.h1>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="ml-4"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to the Algorithm Platform
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore cutting-edge algorithms and interactive visualizations.
              Built with React, TypeScript, and modern web technologies.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </motion.section>

          <motion.section
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              {
                title: "Interactive Learning",
                description: "Hands-on approach to understanding complex algorithms",
                icon: "🎯"
              },
              {
                title: "Real-time Visualization",
                description: "See algorithms in action with dynamic visual feedback",
                icon: "📊"
              },
              {
                title: "Modern Architecture",
                description: "Built with React, TypeScript, and Tailwind CSS",
                icon: "⚡"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.section>

          <motion.section
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-muted/50 rounded-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Component Showcase</h3>
              <p className="text-muted-foreground mb-6">
                Experience the power of modern React components with animations and responsive design.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🎨</Button>
              </div>
            </div>
          </motion.section>
        </main>

        <footer className="border-t border-border mt-16">
          <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
            <p>&copy; 2024 X Algorithm for Noobs. Built with React, TypeScript, and Tailwind CSS.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App