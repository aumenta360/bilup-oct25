import * as React from "react"

export interface ToastProps {
  open?: boolean
  show?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  title?: string
  description?: React.ReactNode
  duration?: number
}

export type ToastActionElement = React.ReactElement

export function Toast({
  open,
  show,
  onOpenChange,
  title,
  description,
  className = "",
}: ToastProps) {
  // Check either open or show prop for visibility
  const isVisible = open ?? show ?? false;

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 min-w-[300px] rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 ${className}`}
      role="alert"
    >
      {title && (
        <div className="mb-1 font-semibold text-gray-900 dark:text-white">
          {title}
        </div>
      )}
      {description && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </div>
      )}
      <button
        onClick={() => onOpenChange?.(false)}
        className="absolute right-2 top-2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}
