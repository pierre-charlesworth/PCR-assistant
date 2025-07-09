import React from 'react';
import type { ThermocyclerProgram, Primer, PrimerCombination } from '../types';
import { ThermometerIcon } from './IconComponents';

interface ThermocyclerProgramDisplayProps {
    programs: ThermocyclerProgram[];
    primers: Primer[];
    primerCombinations: PrimerCombination[];
}

const ThermocyclerProgramDisplay: React.FC<ThermocyclerProgramDisplayProps> = ({ programs, primers, primerCombinations }) => {
    
    const getProgramForCombination = (comboId: string) => {
        return programs.find(p => p.combinationId === comboId);
    }
    
    const renderEmptyState = () => (
        <div className="text-center py-10 px-6">
            <div className="mx-auto h-12 w-12 text-gray-400">
                 <i className="fa-solid fa-microchip fa-3x"></i>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Program Generated</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Define your primers, create combinations, and click "Generate Thermocycler Program".</p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg min-h-[300px]">
            <div className="flex items-center space-x-3 mb-4">
                <ThermometerIcon className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Thermocycler Program</h2>
            </div>

            <div className="space-y-6">
                {primerCombinations.length === 0 && programs.length === 0 ? renderEmptyState() : null}
                {primerCombinations.map(combo => {
                    const program = getProgramForCombination(combo.id);
                    const forwardPrimer = primers.find(p => p.id === combo.forwardPrimerId);
                    const reversePrimer = primers.find(p => p.id === combo.reversePrimerId);
                    
                    return (
                        <div key={combo.id}>
                            <h3 className="font-semibold text-md text-gray-800 dark:text-gray-200 mb-2 truncate">
                                {forwardPrimer?.name || '...'} / {reversePrimer?.name || '...'} ({combo.fragmentSize || '?'} bp)
                            </h3>
                            {program ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-4 py-2">Step</th>
                                                <th className="px-4 py-2">Temperature</th>
                                                <th className="px-4 py-2">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {program.program.map((p, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{p.step}</td>
                                                    <td className="px-4 py-2 font-mono text-orange-600 dark:text-orange-400">{p.temperature}</td>
                                                    <td className="px-4 py-2 font-mono text-indigo-600 dark:text-indigo-400">{p.duration}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                               <p className="text-sm text-gray-500 dark:text-gray-400 pl-4">Program not yet generated.</p>
                            )}
                        </div>
                    );
                })}
                    {programs.length > 0 && 
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                        <p><span className="font-bold">Note:</span> Annealing temperatures are calculated based on sequence. Always optimize this step in the lab, for example, using a gradient PCR.</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default ThermocyclerProgramDisplay;