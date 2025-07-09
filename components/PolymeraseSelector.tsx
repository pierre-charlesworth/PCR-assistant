import React from 'react';
import { PolymeraseType } from '../types';
import { POLYMERASE_DISPLAY_NAMES } from '../constants';

interface PolymeraseSelectorProps {
    selected: PolymeraseType;
    onSelect: (polymerase: PolymeraseType) => void;
}

const PolymeraseSelector: React.FC<PolymeraseSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div>
            <label htmlFor="polymerase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Polymerase</label>
            <select
                id="polymerase"
                value={selected}
                onChange={(e) => onSelect(e.target.value as PolymeraseType)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
            >
                {Object.values(PolymeraseType).map(poly => (
                    <option key={poly} value={poly}>{POLYMERASE_DISPLAY_NAMES[poly]}</option>
                ))}
            </select>
        </div>
    );
};

export default PolymeraseSelector;