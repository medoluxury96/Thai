
import React from 'react';
import { QualityOption } from '../types';

interface QualitySelectorProps {
  options: QualityOption[];
  selectedOption: QualityOption;
  onSelectOption: (option: QualityOption) => void;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({ options, selectedOption, onSelectOption }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelectOption(option)}
          className={`p-4 rounded-lg text-center font-semibold transition-all duration-300 ease-in-out border-2 
            ${selectedOption.id === option.id 
              ? 'bg-cyan-500/20 border-cyan-500 text-white' 
              : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default QualitySelector;
