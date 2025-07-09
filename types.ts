export enum PolymeraseType {
  Taq = 'Taq',
  Phusion = 'Phusion',
  Q5 = 'Q5',
}

export interface Reagent {
  name: string;
  stockConcentration?: string;
  finalConcentration: string;
  volumePerReaction: number; // in µL
}

export interface PolymeraseRecipe {
  buffer: Reagent;
  dNTPs: Reagent;
  polymerase: Reagent;
  mgcl2?: Reagent; // Optional for polymerases like Taq
  gcEnhancer?: Reagent; // Optional for Phusion/Q5
  water: Reagent;
  templateDNA: Reagent;
  forwardPrimer: Reagent;
  reversePrimer: Reagent;
}

export interface Primer {
  id: string;
  name: string;
  sequence: string;
}

export interface PrimerCombination {
  id: string;
  forwardPrimerId: string;
  reversePrimerId: string;
  fragmentSize: number;
  numReactions: number;
}


export interface ThermocyclerStep {
  step: string;
  temperature: string;
  duration: string;
}

export interface ThermocyclerProgram {
  combinationId: string; // to link with primer combination
  name: string;
  program: ThermocyclerStep[];
}