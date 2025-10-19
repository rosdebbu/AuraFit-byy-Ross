import React from 'react';
import { Workout } from '../../types';
import TrashIcon from '../icons/TrashIcon';

interface WorkoutHistoryProps {
    workouts: Workout[];
    onRemove: (id: string) => void;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workouts, onRemove }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-200">Today's Workouts</h3>
            <div className="space-y-3 max-h-[16.5rem] overflow-y-auto pr-2 custom-scrollbar">
                {workouts.length === 0 ? (
                    <div className="flex items-center justify-center h-full bg-gray-700/30 rounded-lg">
                        <p className="text-gray-400 text-center py-8">No workouts logged yet.</p>
                    </div>
                ) : (
                    [...workouts].reverse().map((workout) => (
                        <div key={workout.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600 group">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-gray-200 break-all pr-2">{workout.name}</p>
                                <button onClick={() => onRemove(workout.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400" aria-label="Delete workout">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">
                                {workout.sets} sets x {workout.reps} reps @ {workout.weight} kg
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkoutHistory;