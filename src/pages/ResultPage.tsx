import { useLocation, useNavigate } from 'react-router-dom';
import { FileMusic, Copy, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatTranscriptionText } from '@/services/musicProcessing';
import type { TranscriptionResult } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const result = location.state?.result as TranscriptionResult | undefined;

  // Redirect to upload page if no result
  if (!result) {
    navigate('/');
    return null;
  }

  const formattedText = formatTranscriptionText(result);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleUploadAnother = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileMusic className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ScoreToSolfa</h1>
                <p className="text-sm text-muted-foreground">Transcription Result</p>
              </div>
            </div>
            <Button onClick={handleUploadAnother} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Another
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Success Message */}
          <Alert className="border-primary/50 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              Your musical score has been successfully transcribed to solfa notation!
            </AlertDescription>
          </Alert>

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <Alert variant="default" className="border-warning/50 bg-warning/5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription>
                <div className="space-y-1">
                  {result.warnings.map((warning, index) => (
                    <p key={index} className="text-sm text-foreground">
                      {warning}
                    </p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Key and Time Signature Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Key Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{result.keySignature}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Time Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{result.timeSignature}</p>
              </CardContent>
            </Card>
          </div>

          {/* Solfa Notation Output */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Solfa Notation</CardTitle>
                  <CardDescription>
                    Movable-do notation based on detected key signature
                  </CardDescription>
                </div>
                <Button
                  onClick={handleCopyToClipboard}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Individual Staff Display */}
              <div className="space-y-6">
                {result.staves.map((staff) => (
                  <div key={staff.staffNumber} className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-border pb-2">
                      <h3 className="font-semibold text-foreground">
                        Staff {staff.staffNumber}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {staff.clef}
                      </span>
                    </div>
                    
                    {staff.voices.map((voice) => (
                      <div key={voice.voiceNumber} className="space-y-2">
                        {staff.voices.length > 1 && (
                          <p className="text-sm font-medium text-muted-foreground">
                            Voice {voice.voiceNumber}
                          </p>
                        )}
                        <div className="rounded-lg bg-muted/50 p-4">
                          <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">
                            {voice.solfa}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Full Text Output (Hidden, for copying) */}
              <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="mb-3 text-sm font-semibold text-foreground">
                  Complete Transcription
                </h4>
                <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                  {formattedText}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleCopyToClipboard} className="flex-1" size="lg">
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
            <Button onClick={handleUploadAnother} variant="outline" className="flex-1" size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Upload Another File
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 ScoreToSolfa. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
