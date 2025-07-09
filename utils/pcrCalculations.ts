import { PolymeraseType, type ThermocyclerStep, type Primer } from '../types';

// Polymerase-specific parameters, previously in geminiService
const POLYMERASE_DETAILS = {
    [PolymeraseType.Taq]: {
        name: "Taq Polymerase",
        extensionRatePerKb: 60, // seconds per kb
        denaturation: "95°C",
        annealingTempRule: (tmFwd: number, tmRev: number) => Math.min(tmFwd, tmRev) - 5,
        finalExtension: "5-10 minutes",
    },
    [PolymeraseType.Phusion]: {
        name: "Phusion High-Fidelity DNA Polymerase",
        extensionRatePerKb: 15, // seconds per kb (using faster end of 15-30 range)
        denaturation: "98°C",
        annealingTempRule: (tmFwd: number, tmRev: number) => Math.min(tmFwd, tmRev), // using lower Tm as a baseline
        finalExtension: "5-10 minutes",
    },
    [PolymeraseType.Q5]: {
        name: "Q5® High-Fidelity DNA Polymerase",
        extensionRatePerKb: 10, // seconds per kb (using faster end of 10-30 range)
        denaturation: "98°C",
        annealingTempRule: (tmFwd: number, tmRev: number) => Math.min(tmFwd, tmRev), // using lower Tm as a baseline
        finalExtension: "2 minutes",
    },
};

/**
 * Calculates the melting temperature (Tm) of a primer sequence.
 * Uses two different formulas based on primer length:
 * - For sequences < 14 nt: Tm = (wA+xT)*2 + (yG+zC)*4
 * - For sequences >= 14 nt: Tm = 64.9 + 41*(yG+zC-16.4)/(wA+xT+yG+zC)
 * @param sequence The DNA sequence of the primer.
 * @returns The calculated Tm in degrees Celsius.
 */
export const calculateTm = (sequence: string): number => {
    if (!sequence) return 0;
    const seq = sequence.toUpperCase().replace(/[^ATGC]/g, '');
    const len = seq.length;

    if (len === 0) return 0;
    
    let tm: number;
    
    if (len < 14) {
        const countA = (seq.match(/A/g) || []).length;
        const countT = (seq.match(/T/g) || []).length;
        const countG = (seq.match(/G/g) || []).length;
        const countC = (seq.match(/C/g) || []).length;
        tm = (countA + countT) * 2 + (countG + countC) * 4;
    } else {
        const gcCount = (seq.match(/[GC]/g) || []).length;
        tm = 64.9 + 41 * (gcCount - 16.4) / len;
    }
    
    return tm;
};


/**
 * Generates a thermocycler program based on polymerase, primers, and fragment size.
 * @returns An array of ThermocyclerStep objects.
 */
export const generateThermocyclerProgram = (
    polymerase: PolymeraseType,
    fragmentSize: number,
    forwardPrimer: Primer,
    reversePrimer: Primer
): ThermocyclerStep[] => {
    const polymeraseDetails = POLYMERASE_DETAILS[polymerase];
    const fragmentSizeKb = fragmentSize / 1000;

    // 1. Calculate Tms
    const tmFwd = calculateTm(forwardPrimer.sequence);
    const tmRev = calculateTm(reversePrimer.sequence);

    // 2. Calculate Annealing Temperature
    const annealingTemp = polymeraseDetails.annealingTempRule(tmFwd, tmRev);

    // 3. Calculate Extension Time
    const extensionTimeSeconds = Math.max(10, Math.ceil(fragmentSizeKb * polymeraseDetails.extensionRatePerKb));
    const extensionTimeFormatted = extensionTimeSeconds < 60 ? `${extensionTimeSeconds} sec` : `${Math.ceil(extensionTimeSeconds / 60)} min`;
    const cyclicExtensionFormatted = extensionTimeSeconds < 60 ? `${extensionTimeSeconds}s` : `${Math.ceil(extensionTimeSeconds/60)}m`;


    // 4. Assemble and combine the program steps for display
    const program: ThermocyclerStep[] = [
        { step: "Initial Denaturation", temperature: `${polymeraseDetails.denaturation}`, duration: "30 seconds" },
        {
            step: "Cycling (30-35x)",
            temperature: `${polymeraseDetails.denaturation} → ${annealingTemp.toFixed(1)}°C → 72°C`,
            duration: `10s → 20s → ${cyclicExtensionFormatted}`,
        },
        { step: "Final Extension", temperature: "72°C", duration: polymeraseDetails.finalExtension },
        { step: "Hold", temperature: "4-10°C", duration: "∞" },
    ];

    return program;
};
