import React from 'react';
import type { Reagent, PolymeraseType, Primer, PrimerCombination } from '../types';
import { BeakerIcon } from './IconComponents';
import { POLYMERASE_DISPLAY_NAMES } from '../constants';

interface MasterMixDisplayProps {
    isAdvancedMode: boolean;
    finalVolume: number;
    polymerase: PolymeraseType;
    templateVolume: number;

    // Simple mode props
    simpleData?: (Reagent & { totalVolume: string })[];
    numReactions?: number;

    // Advanced mode props
    advancedData?: {
        combinationId: string;
        mix: (Reagent & { totalVolume: string })[];
        numReactions: number;
    }[];
    primers?: Primer[];
    primerCombinations?: PrimerCombination[];
}

const MasterMixTable: React.FC<{
    mixData: (Reagent & { totalVolume: string })[],
    instructions: React.ReactNode,
}> = ({ mixData, instructions }) => (
    <>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Component</th>
                        <th className="px-4 py-3">Final Conc.</th>
                        <th className="px-4 py-3 text-right">Volume (µL)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mixData.map((component, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{component.name}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{component.finalConcentration}</td>
                            <td className="px-4 py-3 text-right font-mono text-cyan-600 dark:text-cyan-400">{component.totalVolume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            {instructions}
        </div>
    </>
);


const MasterMixDisplay: React.FC<MasterMixDisplayProps> = (props) => {
    const { isAdvancedMode, finalVolume, polymerase, templateVolume, simpleData, numReactions, advancedData, primers, primerCombinations } = props;

    const renderSimpleMode = () => {
        if (!simpleData || numReactions === undefined) return null;
        
        const instructions = (
            <p>
                <span className="font-bold">Instructions:</span> Mix all components above, then aliquot. Add {templateVolume.toFixed(2)} µL of template DNA to each reaction tube separately to reach the final volume of {finalVolume} µL.
            </p>
        );

        return (
            <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Calculated for <span className="font-bold">{numReactions} reactions</span> (plus 10% overage) with a final volume of <span className="font-bold">{finalVolume}µL</span> using <span className="font-bold">{POLYMERASE_DISPLAY_NAMES[polymerase]}</span>.
                </p>
                <MasterMixTable mixData={simpleData} instructions={instructions} />
            </>
        )
    };

    const renderAdvancedMode = () => {
        if (!advancedData || !primers || !primerCombinations) return null;
        
        if (primerCombinations.length === 0) {
            return <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Add a primer combination to see its master mix recipe.</p>
        }

        return (
            <div className="space-y-6">
                {advancedData.map(data => {
                    const combo = primerCombinations.find(c => c.id === data.combinationId);
                    if (!combo) return null;

                    const forwardPrimer = primers.find(p => p.id === combo.forwardPrimerId);
                    const reversePrimer = primers.find(p => p.id === combo.reversePrimerId);
                    const title = `${forwardPrimer?.name || '...'} / ${reversePrimer?.name || '...'}`;
                    
                    const instructions = (
                         <p>
                            <span className="font-bold">Instructions:</span> Mix components, aliquot. Add {templateVolume.toFixed(2)} µL of template DNA to each of the {combo.numReactions} reactions to reach the final volume of {finalVolume} µL.
                        </p>
                    );

                    return (
                        <div key={data.combinationId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-semibold text-md text-gray-800 dark:text-gray-200 mb-2 truncate">{title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Calculated for <span className="font-bold">{data.numReactions} reactions</span> (plus 10% overage).
                            </p>
                            <MasterMixTable mixData={data.mix} instructions={instructions} />
                        </div>
                    );
                })}
            </div>
        )
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
                <BeakerIcon className="h-6 w-6 text-emerald-500" />
                <h2 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">Master Mix Recipe</h2>
            </div>
            {isAdvancedMode ? renderAdvancedMode() : renderSimpleMode()}
        </div>
    );
};

export default MasterMixDisplay;