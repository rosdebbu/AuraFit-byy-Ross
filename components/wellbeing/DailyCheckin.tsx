import React, { useState } from 'react';
import { Mood } from '../../types';

interface DailyCheckinProps {
    onSave: (mood: Mood, journal: string, gratitude: string) => void;
}

const moodOptions: { mood: Mood; emoji: string; label: string }[] = [
    { mood: 1, emoji: '😞', label: 'Sad' },
    { mood: 2, emoji: '😐', label: 'Neutral' },
    { mood: 3, emoji: '🙂', label: 'Okay' },
    { mood: 4, emoji: '😊', label: 'Good' },
    { mood: 5, emoji: '😄', label: 'Great' },
];

const DailyCheckin: React.FC<DailyCheckinProps> = ({ onSave }) => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [journal, setJournal] = useState('');
    const [gratitude, setGratitude] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMood) return;
        onSave(selectedMood, journal, gratitude);
        setSelectedMood(null);
        setJournal('');
        setGratitude('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-lg font-semibold mb-3 text-gray-200">How are you feeling?</label>
                <div className="flex justify-around items-center bg-gray-700/50 p-3 rounded-lg">
                    {moodOptions.map(({ mood, emoji, label }) => (
                        <button
                            type="button"
                            key={mood}
                            onClick={() => setSelectedMood(mood)}
                            className={`p-2 rounded-full transition-transform duration-200 ease-in-out transform hover:scale-125 focus:outline-none ${selectedMood === mood ? 'ring-2 ring-emerald-400 scale-125' : ''}`}
                            aria-label={label}
                        >
                            <span className="text-3xl">{emoji}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="journal" className="block text-sm font-medium text-gray-300 mb-1">Journal Entry</label>
                <textarea
                    id="journal"
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    placeholder="What's on your mind today?"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 resize-none h-24"
                />
            </div>
            
            <div>
                <label htmlFor="gratitude" className="block text-sm font-medium text-gray-300 mb-1">Gratitude Log</label>
                 <textarea
                    id="gratitude"
                    value={gratitude}
                    onChange={(e) => setGratitude(e.target.value)}
                    placeholder="List three things you're grateful for..."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 resize-none h-24"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                disabled={!selectedMood}
            >
                Save Check-in
            </button>
        </form>
    );
};

export default DailyCheckin;
