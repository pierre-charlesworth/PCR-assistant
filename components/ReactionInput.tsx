import React from 'react';

interface ReactionInputProps {
    numReactions: number;
    setNumReactions: (value: number) => void;
    finalVolume: number;
    setFinalVolume: (value: number) => void;
    isAdvancedMode: boolean;
}

const ReactionInput: React.FC<ReactionInputProps> = ({ numReactions, setNumReactions, finalVolume, setFinalVolume, isAdvancedMode }) => {
    return (
        <>
            <div className={isAdvancedMode ? 'opacity-50' : ''}>
                <label htmlFor="numReactions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Reactions</label>
                <input
                    type="number"
                    id="numReactions"
                    value={numReactions}
                    onChange={(e) => setNumReactions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
                    min="1"
                    disabled={isAdvancedMode}
                />
            </div>
            <div>
                <label htmlFor="finalVolume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Final Volume (µL)</label>
                <input
                    type="number"
                    id="finalVolume"
                    value={finalVolume}
                    onChange={(e) => setFinalVolume(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
                    min="1"
                />
            </div>
        </>
    );
};

export default ReactionInput;