const Alert = ({ type = 'info', message, onClose }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  if (!message) return null

  return (
    <div className={`border rounded-lg p-4 mb-4 flex items-start ${typeStyles[type]}`}>
      <span className="text-xl mr-3 flex-shrink-0">{icons[type]}</span>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-lg hover:opacity-70"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Alert
