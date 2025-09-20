import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Point {
  x: number
  y: number
}

interface Connection {
  from: Point
  to: Point
  opacity: number
}

const BackgroundPaths: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [connections, setConnections] = React.useState<Connection[]>([])
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })

  // Handle resize and generate connections
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setDimensions({ width, height })

      // Generate random connections
      const newConnections: Connection[] = []
      const numConnections = Math.floor((width * height) / 50000) // Adjust density

      for (let i = 0; i < numConnections; i++) {
        newConnections.push({
          from: {
            x: Math.random() * width,
            y: Math.random() * height,
          },
          to: {
            x: Math.random() * width,
            y: Math.random() * height,
          },
          opacity: Math.random() * 0.3 + 0.1, // Between 0.1 and 0.4
        })
      }

      setConnections(newConnections)
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Draw connections on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Draw connections
    connections.forEach(connection => {
      ctx.beginPath()
      ctx.moveTo(connection.from.x, connection.from.y)

      // Create curved path using quadratic curve
      const midX = (connection.from.x + connection.to.x) / 2
      const midY = (connection.from.y + connection.to.y) / 2 - 50 // Add curve
      ctx.quadraticCurveTo(midX, midY, connection.to.x, connection.to.y)

      ctx.strokeStyle = `rgba(139, 92, 246, ${connection.opacity})` // Purple with opacity
      ctx.lineWidth = 1
      ctx.stroke()
    })
  }, [connections, dimensions])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.5 }}
      />

      {/* Animated glowing dots */}
      {connections.map((connection, index) => (
        <React.Fragment key={index}>
          <motion.div
            className="absolute w-1 h-1 bg-purple-500 rounded-full pointer-events-none"
            style={{
              left: connection.from.x,
              top: connection.from.y,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
          <motion.div
            className="absolute w-1 h-1 bg-purple-500 rounded-full pointer-events-none"
            style={{
              left: connection.to.x,
              top: connection.to.y,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export default BackgroundPaths