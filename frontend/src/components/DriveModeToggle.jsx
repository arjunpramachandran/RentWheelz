import React from 'react';

const DriveModeToggle = ({ isDriverRequired, onToggle }) => {
    
    
  return (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-medium ${isDriverRequired ? 'text-gray-400' : 'text-black'}`}>
        Self Drive
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isDriverRequired}
          onChange={onToggle}
        />
        <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
        <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></div>
      </label>
      <span className={`text-sm font-medium ${isDriverRequired ? 'text-black' : 'text-gray-400'}`}>
        With Driver
      </span>
    </div>
  );
};

export default DriveModeToggle;
