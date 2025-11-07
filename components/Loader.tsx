import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p className="ml-3 text-lg text-blue-600">考え中...</p>
    </div>
  );
};

export default Loader;
