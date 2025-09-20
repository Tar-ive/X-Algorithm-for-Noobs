import { motion } from "framer-motion"

const BackgroundPaths = () => {
  const paths = [
    "M-20,-20C50,-20 50,20 120,20",
    "M-20,20C50,20 50,60 120,60",
    "M-20,60C50,60 50,100 120,100",
    "M-20,100C50,100 50,140 120,140",
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-gray-200 dark:text-gray-800"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default BackgroundPaths