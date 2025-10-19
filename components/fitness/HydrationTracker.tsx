import React from 'react';

interface HydrationTrackerProps {
    current: number; // in ml
    goal: number; // in ml
    onUpdate: (amount: number) => void;
}

const WATER_INCREMENT = 250; // 250ml per cup

const HydrationTracker: React.FC<HydrationTrackerProps> = ({ current, goal, onUpdate }) => {
    const glasses = Math.floor(goal / WATER_INCREMENT);
    const glassesFilled = Math.floor(current / WATER_INCREMENT);

    return (
        <div>
            <div className="flex justify-between items-baseline mb-3">
                <h3 className="text-lg font-bold text-sky-400">Hydration</h3>
                <span className="text-sm font-semibold text-gray-400">
                    {(current / 1000).toFixed(2)}L / {(goal / 1000).toFixed(1)}L
                </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-grow flex flex-wrap gap-2 items-center">
                    {Array.from({ length: glasses }).map((_, index) => (
                        <svg key={index} className={`w-8 h-8 transition-colors duration-300 ${index < glassesFilled ? 'text-sky-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" fillRule="evenodd"></path>
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 10a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" transform="translate(0 -1)" />
                            <path fillRule="evenodd" d="M13.213 11.84A.5.5 0 0013 11.5V10a3 3 0 00-6 0v1.5a.5.5 0 00.213.424l2.5 1.875a.5.5 0 00.574 0l2.5-1.875zM10 3a7 7 0 100 14 7 7 0 000-14zM9 10a1 1 0 112 0v1.086l.95.712A1.5 1.5 0 0112 13.5V10a2 2 0 10-4 0v3.5a1.5 1.5 0 01.05-.202l.95-.712V10z" clipRule="evenodd" />
                        </svg>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onUpdate(-WATER_INCREMENT)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-bold transition-colors"
                        aria-label="Decrease water intake"
                    >
                        -
                    </button>
                    <button
                        onClick={() => onUpdate(WATER_INCREMENT)}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-md text-white font-bold transition-colors"
                        aria-label="Increase water intake"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HydrationTracker;