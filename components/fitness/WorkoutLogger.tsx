import React, { useState } from 'react';
import { Workout } from '../../types';

interface WorkoutLoggerProps {
    onLog: (workout: Omit<Workout, 'id'>) => void;
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ onLog }) => {
    const [name, setName] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numSets = parseInt(sets, 10);
        const numReps = parseInt(reps, 10);
        const numWeight = parseFloat(weight);

        if (name.trim() && !isNaN(numSets) && !isNaN(numReps) && !isNaN(numWeight)) {
            onLog({ 
                name: name.trim(), 
                sets: numSets, 
                reps: numReps, 
                weight: numWeight 
            });
            setName('');
            setSets('');
            setReps('');
            setWeight('');
        }
    };

    const isValid = name.trim() && sets && reps && weight;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Log a Workout</h3>
            <div>
                <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-300 mb-1">Exercise Name</label>
                <input
                    id="exerciseName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Bench Press"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label htmlFor="sets" className="block text-sm font-medium text-gray-300 mb-1">Sets</label>
                    <input
                        id="sets"
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        placeholder="3"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                 <div>
                    <label htmlFor="reps" className="block text-sm font-medium text-gray-300 mb-1">Reps</label>
                    <input
                        id="reps"
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder="10"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                 <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">Weight (kg)</label>
                    <input
                        id="weight"
                        type="number"
                        step="0.5"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="50"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
            </div>
             <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                disabled={!isValid}
            >
                Log Workout
            </button>
        </form>
    );
};

export default WorkoutLogger;