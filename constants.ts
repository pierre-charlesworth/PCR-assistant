import { PolymeraseType, type PolymeraseRecipe } from './types';

export const POLYMERASE_DISPLAY_NAMES: Record<PolymeraseType, string> = {
  [PolymeraseType.Taq]: 'Taq',
  [PolymeraseType.Phusion]: 'Phusion',
  [PolymeraseType.Q5]: 'NEB Q5 High-Fidelity Polymerase',
};

export const POLYMERASE_RECIPES: Record<PolymeraseType, PolymeraseRecipe> = {
  [PolymeraseType.Taq]: {
    buffer: { name: '10x Standard Taq Buffer', stockConcentration: '10x', finalConcentration: '1x', volumePerReaction: 2.5 },
    dNTPs: { name: 'dNTPs (10 mM)', stockConcentration: '10 mM', finalConcentration: '200 µM', volumePerReaction: 0.5 },
    mgcl2: { name: 'MgCl₂ (50 mM)', stockConcentration: '50 mM', finalConcentration: '1.5 mM', volumePerReaction: 0.75 },
    polymerase: { name: 'Taq Polymerase (5 U/µL)', stockConcentration: '5 U/µL', finalConcentration: '1.25 U / 25 µL', volumePerReaction: 0.25 },
    forwardPrimer: { name: 'Forward Primer (10 µM)', stockConcentration: '10 µM', finalConcentration: '0.4 µM', volumePerReaction: 1 },
    reversePrimer: { name: 'Reverse Primer (10 µM)', stockConcentration: '10 µM', finalConcentration: '0.4 µM', volumePerReaction: 1 },
    templateDNA: { name: 'Template DNA', finalConcentration: '1-10 ng', volumePerReaction: 1 },
    water: { name: 'Nuclease-free water', finalConcentration: 'N/A', volumePerReaction: 17 },
  },
  [PolymeraseType.Phusion]: {
    buffer: { name: '5x Phusion HF/GC Buffer', stockConcentration: '5x', finalConcentration: '1x', volumePerReaction: 5 },
    dNTPs: { name: 'dNTPs (10 mM)', stockConcentration: '10 mM', finalConcentration: '200 µM', volumePerReaction: 0.5 },
    polymerase: { name: 'Phusion Polymerase (2 U/µL)', stockConcentration: '2 U/µL', finalConcentration: '0.5 U / 25 µL', volumePerReaction: 0.25 },
    forwardPrimer: { name: 'Forward Primer (10 µM)', stockConcentration: '10 µM', finalConcentration: '0.5 µM', volumePerReaction: 1.25 },
    reversePrimer: { name: 'Reverse Primer (10 µM)', stockConcentration: '10 µM', finalConcentration: '0.5 µM', volumePerReaction: 1.25 },
    templateDNA: { name: 'Template DNA', finalConcentration: '1-10 ng', volumePerReaction: 1 },
    gcEnhancer: { name: '5x Phusion GC Enhancer (optional)', stockConcentration: '5x', finalConcentration: '1x', volumePerReaction: 5},
    water: { name: 'Nuclease-free water', finalConcentration: 'N/A', volumePerReaction: 15.75 },
  },
  [PolymeraseType.Q5]: {
    buffer: { name: '5X Q5 Reaction Buffer', stockConcentration: '5x', finalConcentration: '1x', volumePerReaction: 5 },
    dNTPs: { name: '10 mM dNTPs', stockConcentration: '10 mM', finalConcentration: '200 µM', volumePerReaction: 0.5 },
    polymerase: { name: 'Q5® High-Fidelity DNA Polymerase (2 U/µL)', stockConcentration: '2 U/µL', finalConcentration: '0.02 U/µl', volumePerReaction: 0.25 },
    forwardPrimer: { name: 'Forward Primer (10 µM)', stockConcentration: '10 µM', finalConcentration: '0.5 µM', volumePerReaction: 1.25 },
    reversePrimer: { name: 'Reverse Primer (10 µM)', stockConcentration: '10 µM', finalConcentration: '0.5 µM', volumePerReaction: 1.25 },
    templateDNA: { name: 'Template DNA', finalConcentration: '< 1,000 ng', volumePerReaction: 1 },
    gcEnhancer: { name: '5X Q5 High GC Enhancer (optional)', stockConcentration: '5x', finalConcentration: '1X', volumePerReaction: 5},
    water: { name: 'Nuclease-free water', finalConcentration: 'N/A', volumePerReaction: 15.75 },
  },
};