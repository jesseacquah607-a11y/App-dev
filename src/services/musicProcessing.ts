import type { TranscriptionResult, ProcessingError } from '@/types';

/**
 * Music Processing Service
 * 
 * NOTE: This is a demonstration implementation. In a production environment,
 * this would integrate with a real OMR (Optical Music Recognition) service such as:
 * - Audiveris (open-source OMR engine)
 * - Commercial OMR APIs
 * - Custom ML models trained on music notation
 * 
 * The real implementation would:
 * 1. Send the uploaded file to an OMR service
 * 2. Receive structured music data (notes, rhythms, key signatures)
 * 3. Apply movable-do conversion based on detected key
 * 4. Handle multi-staff and multi-voice parsing
 */

// Movable-do solfa mapping for each key
const KEY_MAPPINGS: Record<string, string[]> = {
  'C': ['Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'Sol', 'Si', 'La', 'Li', 'Ti'],
  'G': ['Sol', 'Si', 'La', 'Li', 'Ti', 'Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi'],
  'D': ['Re', 'Ri', 'Mi', 'Fa', 'Fi', 'Sol', 'Si', 'La', 'Li', 'Ti', 'Do', 'Di'],
  'A': ['La', 'Li', 'Ti', 'Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'Sol', 'Si'],
  'E': ['Mi', 'Fa', 'Fi', 'Sol', 'Si', 'La', 'Li', 'Ti', 'Do', 'Di', 'Re', 'Ri'],
  'B': ['Ti', 'Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'Sol', 'Si', 'La', 'Li'],
  'F': ['Fa', 'Fi', 'Sol', 'Si', 'La', 'Li', 'Ti', 'Do', 'Di', 'Re', 'Ri', 'Mi'],
  'Bb': ['Ti', 'Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'Sol', 'Si', 'La', 'Li'],
  'Eb': ['Mi', 'Fa', 'Fi', 'Sol', 'Si', 'La', 'Li', 'Ti', 'Do', 'Di', 'Re', 'Ri'],
  'Ab': ['La', 'Li', 'Ti', 'Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'Sol', 'Si'],
  'Db': ['Re', 'Ri', 'Mi', 'Fa', 'Fi', 'Sol', 'Si', 'La', 'Li', 'Ti', 'Do', 'Di'],
  'Gb': ['Sol', 'Si', 'La', 'Li', 'Ti', 'Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi'],
};

/**
 * Simulates OMR processing and returns demo transcription
 * In production, this would call a real OMR service
 */
export async function processScore(file: File): Promise<TranscriptionResult> {
  // Validate file
  const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw {
      code: 'INVALID_FORMAT',
      message: 'Only PDF and JPG files are supported.'
    } as ProcessingError;
  }

  if (file.size > 10 * 1024 * 1024) {
    throw {
      code: 'FILE_TOO_LARGE',
      message: 'File size exceeds the 10MB limit. Please upload a smaller file.'
    } as ProcessingError;
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // DEMO: Generate sample transcription
  // In production, this would be replaced with actual OMR processing
  const demoResult: TranscriptionResult = generateDemoTranscription();

  return demoResult;
}

/**
 * Generates a demo transcription result
 * This simulates what a real OMR service would return
 */
function generateDemoTranscription(): TranscriptionResult {
  // Simulate detecting C major key
  const key = 'C';
  
  return {
    keySignature: `${key} Major`,
    timeSignature: '4/4',
    staves: [
      {
        staffNumber: 1,
        clef: 'Treble Clef',
        voices: [
          {
            voiceNumber: 1,
            solfa: 'Do Re Mi Fa | Sol Sol Sol - | Fa Fa Fa - | Mi Mi Mi - | Re Re Re - | Do - - - ||'
          }
        ]
      },
      {
        staffNumber: 2,
        clef: 'Bass Clef',
        voices: [
          {
            voiceNumber: 1,
            solfa: 'Do, - Sol, - | Do - Sol, - | Do, - Sol, - | Do - Sol, - | Do, - Sol, - | Do, - - - ||'
          }
        ]
      }
    ],
    warnings: [
      'This is a demonstration output. In production, real OMR (Optical Music Recognition) would analyze your uploaded score.'
    ]
  };
}

/**
 * Converts note names to solfa syllables based on key signature
 * This would be used by the real OMR integration
 */
export function noteToSolfa(noteName: string, key: string): string {
  const mapping = KEY_MAPPINGS[key] || KEY_MAPPINGS['C'];
  const noteIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(noteName);
  
  if (noteIndex === -1) return noteName;
  return mapping[noteIndex];
}

/**
 * Formats transcription result as plain text for display
 */
export function formatTranscriptionText(result: TranscriptionResult): string {
  let output = '';
  
  output += `Key Signature: ${result.keySignature}\n`;
  output += `Time Signature: ${result.timeSignature}\n\n`;
  
  if (result.warnings && result.warnings.length > 0) {
    output += '⚠️ Warnings:\n';
    result.warnings.forEach(warning => {
      output += `  • ${warning}\n`;
    });
    output += '\n';
  }
  
  output += '═══════════════════════════════════════\n\n';
  
  result.staves.forEach((staff, index) => {
    output += `Staff ${staff.staffNumber} - ${staff.clef}\n`;
    output += '─────────────────────────────────────\n';
    
    staff.voices.forEach(voice => {
      if (staff.voices.length > 1) {
        output += `  Voice ${voice.voiceNumber}:\n`;
        output += `  ${voice.solfa}\n\n`;
      } else {
        output += `${voice.solfa}\n\n`;
      }
    });
    
    if (index < result.staves.length - 1) {
      output += '\n';
    }
  });
  
  return output;
}
