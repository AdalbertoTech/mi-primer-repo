const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
