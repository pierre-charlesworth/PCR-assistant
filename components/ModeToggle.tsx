import React from 'react';
import { SwitchIcon } from './IconComponents';

interface ModeToggleProps {
  isAdvanced: boolean;
  setIsAdvanced: (value: boolean) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ isAdvanced, setIsAdvanced }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm font-medium ${!isAdvanced ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500'}`}>Simple</span>
      <button
        type="button"
        onClick={() => setIsAdvanced(!isAdvanced)}
        className={`${
          isAdvanced ? 'bg-cyan-600' : 'bg-gray-300 dark:bg-gray-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:ring-offset-gray-800`}
        role="switch"
        aria-checked={isAdvanced}
      >
        <span
          aria-hidden="true"
          className={`${
            isAdvanced ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
      <span className={`text-sm font-medium ${isAdvanced ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500'}`}>
        <SwitchIcon className="inline-block h-4 w-4 mr-1"/>
        Advanced
      </span>
    </div>
  );
};

export default ModeToggle;