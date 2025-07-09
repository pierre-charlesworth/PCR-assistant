import React from 'react';
import type { Primer, PrimerCombination } from '../types';
import { PlusIcon, TrashIcon } from './IconComponents';
import { calculateTm } from '../utils/pcrCalculations';

interface PrimerInputProps {
    primers: Primer[];
    setPrimers: React.Dispatch<React.SetStateAction<Primer[]>>;
    primerCombinations: PrimerCombination[];
    setPrimerCombinations: React.Dispatch<React.SetStateAction<PrimerCombination[]>>;
}

const PrimerInput: React.FC<PrimerInputProps> = ({ primers, setPrimers, primerCombinations, setPrimerCombinations }) => {

    // Primer List Management
    const handleAddPrimer = () => {
        setPrimers([...primers, { id: crypto.randomUUID(), name: `Primer ${primers.length + 1}`, sequence: '' }]);
    };

    const handleRemovePrimer = (id: string) => {
        if (primers.length <= 2) return; // Prevent deleting below the minimum
        setPrimers(primers.filter(p => p.id !== id));
    };

    const handlePrimerChange = <K extends keyof Omit<Primer, 'id'>>(id: string, field: K, value: Primer[K]) => {
        setPrimers(primers.map(p => (p.id === id ? { ...p, [field]: value } : p)));
    };

    // Primer Combination Management
    const handleAddCombination = () => {
        if (primers.length < 2) return;
        setPrimerCombinations([...primerCombinations, { 
            id: crypto.randomUUID(), 
            forwardPrimerId: primers[0].id, 
            reversePrimerId: primers[1].id, 
            fragmentSize: 0,
            numReactions: 8,
        }]);
    };

    const handleRemoveCombination = (id: string) => {
        setPrimerCombinations(primerCombinations.filter(c => c.id !== id));
    };

    const handleCombinationChange = <K extends keyof Omit<PrimerCombination, 'id'>>(id: string, field: K, value: PrimerCombination[K]) => {
        setPrimerCombinations(primerCombinations.map(c => {
            if (c.id === id) {
                // Prevent selecting the same primer for fwd and rev
                if (field === 'forwardPrimerId' && value === c.reversePrimerId) return c;
                if (field === 'reversePrimerId' && value === c.forwardPrimerId) return c;
                return { ...c, [field]: value };
            }
            return c;
        }));
    };

    return (
        <div className="space-y-6">
            {/* Primer Definition Section */}
            <div>
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Primer List</h3>
                <div className="space-y-4">
                    {primers.map((primer, index) => (
                        <div key={primer.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 flex items-start space-x-3">
                            <span className="mt-2.5 text-sm font-bold text-gray-500 dark:text-gray-400">{index + 1}.</span>
                            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Primer Name"
                                    value={primer.name}
                                    onChange={(e) => handlePrimerChange(primer.id, 'name', e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
                                />
                                <input
                                    type="text"
                                    placeholder="Primer Sequence (e.g., ATGC...)"
                                    value={primer.sequence}
                                    onChange={(e) => handlePrimerChange(primer.id, 'sequence', e.target.value.toUpperCase().replace(/[^ATGC]/g, ''))}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition font-mono"
                                />
                            </div>
                            <button
                                onClick={() => handleRemovePrimer(primer.id)}
                                disabled={primers.length <= 2}
                                className="mt-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1.5 rounded-full disabled:text-gray-400 disabled:cursor-not-allowed"
                                aria-label="Remove primer"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button onClick={handleAddPrimer} className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-400 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Primer</span>
                    </button>
                </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700"/>

            {/* Primer Combination Section */}
            <div>
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Primer Combinations</h3>
                <div className="space-y-4">
                    {primerCombinations.map(combo => {
                        const forwardPrimer = primers.find(p => p.id === combo.forwardPrimerId);
                        const reversePrimer = primers.find(p => p.id === combo.reversePrimerId);

                        const tmDetails = (sequence: string) => {
                            const seq = sequence.toUpperCase().replace(/[^ATGC]/g, '');
                            const len = seq.length;
                            if (len === 0) return { formula: 'N/A', tm: 0 };

                            if (len < 14) {
                                const countA = (seq.match(/A/g) || []).length;
                                const countT = (seq.match(/T/g) || []).length;
                                const countG = (seq.match(/G/g) || []).length;
                                const countC = (seq.match(/C/g) || []).length;
                                const formula = `Tm = (${countA}+${countT})*2 + (${countG}+${countC})*4`;
                                return { formula, tm: calculateTm(seq) };
                            }
                            const gcCount = (seq.match(/[GC]/g) || []).length;
                            const formula = `Tm = 64.9 + 41*(${gcCount}-16.4)/${len}`;
                            return { formula, tm: calculateTm(seq) };
                        };

                        const fwdTm = forwardPrimer ? tmDetails(forwardPrimer.sequence) : null;
                        const revTm = reversePrimer ? tmDetails(reversePrimer.sequence) : null;

                        return (
                        <div key={combo.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                           <div className="flex items-center space-x-3">
                             <div className="flex-grow space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Forward Primer</label>
                                            <select value={combo.forwardPrimerId} onChange={e => handleCombinationChange(combo.id, 'forwardPrimerId', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition">
                                                {primers.map((p, i) => <option key={p.id} value={p.id} disabled={p.id === combo.reversePrimerId}>{i + 1}. {p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Reverse Primer</label>
                                            <select value={combo.reversePrimerId} onChange={e => handleCombinationChange(combo.id, 'reversePrimerId', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition">
                                                {primers.map((p, i) => <option key={p.id} value={p.id} disabled={p.id === combo.forwardPrimerId}>{i + 1}. {p.name}</option>)}
                                            </select>
                                        </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Fragment Size (bp)</label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 500"
                                                value={combo.fragmentSize || ''}
                                                onChange={e => handleCombinationChange(combo.id, 'fragmentSize', parseInt(e.target.value) || 0)}
                                                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300"># Reactions</label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 8"
                                                value={combo.numReactions || ''}
                                                onChange={e => handleCombinationChange(combo.id, 'numReactions', parseInt(e.target.value) || 1)}
                                                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
                                                min="1"
                                            />
                                        </div>
                                  </div>
                           </div>
                           <button
                                onClick={() => handleRemoveCombination(combo.id)}
                                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1.5 rounded-full h-fit"
                                aria-label="Remove combination"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                           </div>

                           {(fwdTm || revTm) && (
                               <div className="bg-white/60 dark:bg-gray-800/40 rounded-md p-2 text-xs text-gray-700 dark:text-gray-300 border border-dashed border-gray-300 dark:border-gray-600">
                                   {fwdTm && (
                                       <p><span className="font-semibold">Fwd Tm:</span> {fwdTm.formula} = <span className="font-mono">{fwdTm.tm.toFixed(1)}°C</span></p>
                                   )}
                                   {revTm && (
                                       <p><span className="font-semibold">Rev Tm:</span> {revTm.formula} = <span className="font-mono">{revTm.tm.toFixed(1)}°C</span></p>
                                   )}
                               </div>
                           )}
                        </div>
                        );
                    })}
                     <button onClick={handleAddCombination} className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-400 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Combination</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrimerInput;