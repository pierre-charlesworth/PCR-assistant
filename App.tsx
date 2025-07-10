import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PolymeraseType, type Primer, type PrimerCombination, type ThermocyclerProgram } from './types';
import { POLYMERASE_RECIPES } from './constants';
import { generateThermocyclerProgram } from './utils/pcrCalculations';
import PolymeraseSelector from './components/PolymeraseSelector';
import ReactionInput from './components/ReactionInput';
import PrimerInput from './components/PrimerInput';
import MasterMixDisplay from './components/MasterMixDisplay';
import ThermocyclerProgramDisplay from './components/ThermocyclerProgramDisplay';
// logo image served from public root
import ModeToggle from './components/ModeToggle';

const App: React.FC = () => {
    const [polymerase, setPolymerase] = useState<PolymeraseType>(PolymeraseType.Taq);
    const [numReactions, setNumReactions] = useState<number>(8);
    const [finalVolume, setFinalVolume] = useState<number>(25);
    const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

    const initialPrimers: Primer[] = [
        { id: crypto.randomUUID(), name: 'Fwd Primer', sequence: 'AGAGTTTGATCCTGGCTCAG' },
        { id: crypto.randomUUID(), name: 'Rev Primer', sequence: 'GGTTACCTTGTTACGACTT' }
    ];
    
    const [primers, setPrimers] = useState<Primer[]>(initialPrimers);

    const [primerCombinations, setPrimerCombinations] = useState<PrimerCombination[]>([
        { id: crypto.randomUUID(), forwardPrimerId: initialPrimers[0].id, reversePrimerId: initialPrimers[1].id, fragmentSize: 500, numReactions: 8 }
    ]);
    
    const [thermocyclerPrograms, setThermocyclerPrograms] = useState<ThermocyclerProgram[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Ensure combinations are valid if primers are deleted
    useEffect(() => {
        setPrimerCombinations(currentCombinations => {
            return currentCombinations.filter(combo => 
                primers.some(p => p.id === combo.forwardPrimerId) &&
                primers.some(p => p.id === combo.reversePrimerId)
            );
        });
    }, [primers]);

    const handleGenerateProgram = useCallback(() => {
        if (primerCombinations.length === 0) {
            setError("Please define at least one primer combination.");
            return;
        }
        setError(null);
        try {
            const results = primerCombinations.map(combo => {
                const forwardPrimer = primers.find(p => p.id === combo.forwardPrimerId);
                const reversePrimer = primers.find(p => p.id === combo.reversePrimerId);
                if (!forwardPrimer || !reversePrimer || !forwardPrimer.sequence || !reversePrimer.sequence) {
                    throw new Error(`Incomplete primer details for combination. Please provide sequences for all primers.`);
                }
                const program = generateThermocyclerProgram(polymerase, combo.fragmentSize, forwardPrimer, reversePrimer);
                return {
                    combinationId: combo.id,
                    name: `Program for ${forwardPrimer.name} / ${reversePrimer.name}`,
                    program: program,
                };
            });
            setThermocyclerPrograms(results);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to generate thermocycler program. Please check primer sequences.");
        }
    }, [polymerase, primerCombinations, primers]);

    const calculateMasterMix = useCallback((reactions: number) => {
        const recipe = POLYMERASE_RECIPES[polymerase];
        const standardRecipeVolume = 25; 
        const volumeScaleFactor = finalVolume / standardRecipeVolume;

        const mixComponents = Object.values(recipe).filter(
            r => !r.name.includes('Template DNA') && 
                 !r.name.includes('Nuclease-free water') && 
                 !r.name.includes('(optional)')
        );

        const scaledMixComponents = mixComponents.map(c => ({
            ...c,
            volumePerReaction: c.volumePerReaction * volumeScaleFactor,
        }));

        const totalVolOfScaledComponents = scaledMixComponents.reduce(
            (acc, comp) => acc + comp.volumePerReaction,
            0
        );

        const scaledTemplateVolume = (recipe.templateDNA.volumePerReaction || 0) * volumeScaleFactor;
        const waterVolumePerReaction = finalVolume - totalVolOfScaledComponents - scaledTemplateVolume;

        const waterReagent = {
            ...recipe.water,
            volumePerReaction: waterVolumePerReaction,
        };

        const finalMasterMixComponents = [...scaledMixComponents, waterReagent];
        const reactionScaleFactor = reactions * 1.1;

        return finalMasterMixComponents
            .filter(c => c.volumePerReaction > 0)
            .map(component => ({
                ...component,
                totalVolume: (component.volumePerReaction * reactionScaleFactor).toFixed(2),
            }));
    }, [polymerase, finalVolume]);
    
    const simpleMasterMixData = useMemo(() => {
        if (isAdvancedMode) return [];
        return calculateMasterMix(numReactions);
    }, [isAdvancedMode, numReactions, calculateMasterMix]);

    const advancedMasterMixes = useMemo(() => {
        if (!isAdvancedMode) return [];
        return primerCombinations.map(combo => ({
            combinationId: combo.id,
            numReactions: combo.numReactions,
            mix: calculateMasterMix(combo.numReactions),
        }));
    }, [isAdvancedMode, primerCombinations, calculateMasterMix]);

    const recipe = POLYMERASE_RECIPES[polymerase];
    const standardRecipeVolume = 25;
    const volumeScaleFactor = finalVolume / standardRecipeVolume;
    const templateVolumePerReaction = (recipe.templateDNA.volumePerReaction || 0) * volumeScaleFactor;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <img src="/mr-pcr-logo.png" alt="Mr. PCR logo" className="h-10 w-10" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                            Mr. PCR
                        </h1>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Inputs */}
                    <div className="flex flex-col space-y-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400">1. Reaction Setup</h2>
                                <ModeToggle isAdvanced={isAdvancedMode} setIsAdvanced={setIsAdvancedMode} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <PolymeraseSelector selected={polymerase} onSelect={setPolymerase} />
                               <ReactionInput 
                                  numReactions={numReactions} 
                                  setNumReactions={setNumReactions}
                                  finalVolume={finalVolume}
                                  setFinalVolume={setFinalVolume}
                                  isAdvancedMode={isAdvancedMode}
                               />
                            </div>
                        </div>
                        <fieldset disabled={!isAdvancedMode} className="space-y-8 disabled:opacity-50 transition-opacity">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                <h2 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400">2. Primer Configuration</h2>
                                <PrimerInput 
                                    primers={primers}
                                    setPrimers={setPrimers}
                                    primerCombinations={primerCombinations}
                                    setPrimerCombinations={setPrimerCombinations}
                                />
                            </div>
                        </fieldset>
                    </div>

                    {/* Right Column: Outputs */}
                    <div className="flex flex-col space-y-8">
                       <MasterMixDisplay 
                            isAdvancedMode={isAdvancedMode}
                            simpleData={simpleMasterMixData}
                            advancedData={advancedMasterMixes}
                            numReactions={numReactions} 
                            finalVolume={finalVolume} 
                            polymerase={polymerase}
                            templateVolume={templateVolumePerReaction}
                            primers={primers}
                            primerCombinations={primerCombinations}
                       />
                       <fieldset disabled={!isAdvancedMode} className="disabled:opacity-50 transition-opacity">
                         <button 
                             onClick={handleGenerateProgram}
                             disabled={!isAdvancedMode}
                             className="w-full mb-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                         >
                             <i className="fa-solid fa-microchip"></i>
                             <span>Generate Thermocycler Program</span>
                         </button>
                         {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                         <ThermocyclerProgramDisplay programs={thermocyclerPrograms} primers={primers} primerCombinations={primerCombinations}/>
                       </fieldset>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;