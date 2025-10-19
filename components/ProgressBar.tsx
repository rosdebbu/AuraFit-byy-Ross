
import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max, unit, color }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-xs font-semibold text-gray-400">
          {Math.round(value)}{unit} / {max}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
