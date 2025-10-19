import React from 'react';
import { Checkin, Mood } from '../../types';

interface CheckinHistoryProps {
    checkins: Checkin[];
}

const moodEmojiMap: { [key in Mood]: string } = {
    1: '😞',
    2: '😐',
    3: '🙂',
    4: '😊',
    5: '😄',
};

const CheckinHistory: React.FC<CheckinHistoryProps> = ({ checkins }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-200">Recent Check-ins</h3>
            <div className="space-y-3 max-h-[26.5rem] overflow-y-auto pr-2 custom-scrollbar">
                {checkins.length === 0 ? (
                    <div className="flex items-center justify-center h-full bg-gray-700/30 rounded-lg">
                        <p className="text-gray-400 text-center py-8">No check-ins yet.</p>
                    </div>
                ) : (
                    [...checkins].reverse().map((checkin) => (
                        <div key={checkin.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                           <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{moodEmojiMap[checkin.mood]}</span>
                                    <div>
                                        <p className="font-bold text-gray-200">Check-in</p>
                                        <p className="text-xs text-gray-400">{checkin.date}</p>
                                    </div>
                                </div>
                           </div>
                           {checkin.journal && (
                                <div className="mt-3">
                                    <p className="text-sm font-semibold text-gray-300">Journal:</p>
                                    <p className="text-sm text-gray-400 italic line-clamp-2">"{checkin.journal}"</p>
                                </div>
                           )}
                           {checkin.gratitude && (
                                <div className="mt-3">
                                    <p className="text-sm font-semibold text-gray-300">Grateful for:</p>
                                    <p className="text-sm text-gray-400 italic line-clamp-2">"{checkin.gratitude}"</p>
                                </div>
                           )}
                        </div>
                    ))
                )}
            </div>
             <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #374151; /* gray-700 */
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #10b981; /* emerald-500 */
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #059669; /* emerald-600 */
                }
            `}</style>
        </div>
    );
};

export default CheckinHistory;
