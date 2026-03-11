# Requirements Document

## 1. Application Overview

- **Application Name:** ScoreToSolfa
- **Description:** A web-based tool that allows users to upload a musical score (PDF or JPG) and automatically transcribes it into movable-do solfa notation (relative, based on the key detected in the uploaded file), supporting multi-staff and multi-voice scores.

---

## 2. Page Structure and Core Features

### Page Overview

```
ScoreToSolfa
├── Upload Page
└── Result Page
```

### 2.1 Upload Page

- **File Upload Area**
  - Accepts PDF and JPG file formats only
  - Supports single file upload per session
  - Displays the uploaded file name upon successful selection
  - Upload button to trigger transcription
- **Instructions Panel**
  - Brief guidance on supported formats and expected output

### 2.2 Result Page

- **Solfa Notation Output**
  - Displays transcribed solfa notation in plain text format
  - Output is organized by staff/voice (e.g., Treble Clef, Bass Clef) when multiple staves are detected
  - Each staff's solfa notation is clearly labeled and separated
  - Solfa syllables follow the movable-do system, derived from the key signature detected in the uploaded score
- **Copy to Clipboard Button**
  - Allows users to copy the full solfa notation text output
- **Upload Another File Button**
  - Returns the user to the Upload Page to process a new file

---

## 3. Business Rules and Logic

1. **Key Detection:** The system must detect the key signature from the uploaded score and apply movable-do mapping accordingly (e.g., in C major: C=Do, D=Re, E=Mi; in G major: G=Do, A=Re, B=Mi, etc.).
2. **Multi-Staff Handling:** When the score contains multiple staves (e.g., treble and bass clef for piano), each staff is transcribed independently and labeled in the output.
3. **Multi-Voice Handling:** If multiple voices exist within a single staff, each voice is transcribed and presented separately within that staff section.
4. **Solfa Syllables:** Standard movable-do syllables used: Do, Re, Mi, Fa, Sol, La, Ti (or Si). Accidentals are represented with standard sharp/flat suffixes (e.g., Di for raised Do, Ra for lowered Re).
5. **File Processing:** Only one file is processed per transcription session. The file is processed server-side upon upload submission.

---

## 4. Exceptions and Edge Cases

| Scenario | Handling |
|---|---|
| Unsupported file format uploaded | Display error: 「Only PDF and JPG files are supported.」 |
| File size exceeds limit (>10MB) | Display error: 「File size exceeds the 10MB limit. Please upload a smaller file.」 |
| Key signature cannot be detected | Display warning: 「Key signature not detected. Defaulting to C major.」 and proceed with C=Do |
| Score contains no recognizable notes | Display message: 「No musical notes were detected in the uploaded file.」 |
| Multi-page PDF uploaded | Process all pages and present output sequentially by page and staff |
| Corrupted or unreadable file | Display error: 「The uploaded file could not be read. Please try a different file.」 |

---

## 5. Acceptance Criteria

1. Users can upload a PDF or JPG file of a musical score from the Upload Page.
2. The system detects the key signature from the uploaded file and applies movable-do solfa mapping correctly.
3. The transcribed solfa notation is displayed in plain text on the Result Page.
4. Multi-staff scores produce labeled, separated solfa output per staff.
5. Multi-voice scores within a staff produce labeled, separated solfa output per voice.
6. Users can copy the solfa notation output to clipboard.
7. Users can return to the Upload Page to process a new file.
8. All defined error and edge case messages are displayed correctly under the corresponding conditions.

---

## 6. Out of Scope for This Version

- Support for file formats other than PDF and JPG (e.g., MusicXML, MIDI, PNG, audio files)
- Fixed-do solfa notation system
- Export of solfa notation to PDF or other document formats
- Batch upload of multiple files
- Editing or correcting the transcription output within the app
- User accounts, history, or saved sessions
- Mobile-native application versions