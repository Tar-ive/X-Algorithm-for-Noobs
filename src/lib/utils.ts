import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function useCopyToClipboard(timeout = 2000): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    } catch (error) {
      console.error('Failed to copy:', error)
      setCopied(false)
    }
  }

  return [copied, copyToClipboard]
}