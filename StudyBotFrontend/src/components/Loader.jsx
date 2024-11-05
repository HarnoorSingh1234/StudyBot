const Loader = ({ status = 'loading', size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3'
  };

  const statusMessages = {
    loading: 'Loading...',
    queued: 'In queue...',
    running: 'Running code...',
    compiling: 'Compiling...',
    processing: 'Processing...'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3">
        {/* Spinner */}
        <div className={`
          animate-spin rounded-full
          border-b-transparent border-white
          ${sizeClasses[size]}
        `} />
        
        {/* Status Text */}
        <span className="text-gray-300 text-sm font-medium">
          {statusMessages[status] || statusMessages.loading}
        </span>
      </div>

      {/* Optional Status Description */}
      {status === 'queued' && (
        <p className="text-xs text-gray-500 mt-2">Your code is waiting to be processed</p>
      )}
      {status === 'running' && (
        <p className="text-xs text-gray-500 mt-2">Executing your code</p>
      )}
      {status === 'compiling' && (
        <p className="text-xs text-gray-500 mt-2">Preparing your code for execution</p>
      )}
    </div>
  );
};

export default Loader; 