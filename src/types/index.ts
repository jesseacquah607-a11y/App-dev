export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// Musical score transcription types
export interface Voice {
  voiceNumber: number;
  solfa: string;
}

export interface Staff {
  staffNumber: number;
  clef: string;
  voices: Voice[];
}

export interface TranscriptionResult {
  keySignature: string;
  timeSignature: string;
  staves: Staff[];
  warnings?: string[];
}

export interface ProcessingError {
  code: string;
  message: string;
}
