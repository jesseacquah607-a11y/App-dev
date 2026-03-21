import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileMusic, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { processScore } from '@/services/musicProcessing';
import type { TranscriptionResult, ProcessingError } from '@/types';

export default function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (file: File) => {
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result: TranscriptionResult = await processScore(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);

      // Navigate to result page with transcription data
      setTimeout(() => {
        navigate('/result', { state: { result } });
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      const error = err as ProcessingError;
      setError(error.message || 'An error occurred while processing the file.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileMusic className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ScoreToSolfa</h1>
              <p className="text-sm text-muted-foreground">Convert musical scores to solfa notation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Upload Area - Takes 2 columns */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Musical Score</CardTitle>
                  <CardDescription>
                    Upload a PDF or JPG file of your musical score to transcribe it into movable-do solfa notation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Drop Zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                      relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center
                      rounded-lg border-2 border-dashed transition-colors
                      ${isDragging ? 'border-primary bg-accent' : 'border-border bg-muted/30'}
                      ${selectedFile ? 'border-primary bg-accent/50' : ''}
                    `}
                  >
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      disabled={isProcessing}
                    />
                    
                    <div className="flex flex-col items-center gap-3 text-center">
                      {selectedFile ? (
                        <>
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <FileMusic className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          {!isProcessing && (
                            <p className="text-sm text-muted-foreground">
                              Click or drag to replace file
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Drop your file here, or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground">
                              PDF or JPG files only, max 10MB
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-center text-sm text-muted-foreground">
                        Processing your score... {progress}%
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Upload Button */}
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : 'Transcribe to Solfa'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Instructions Panel */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Supported Formats</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• PDF documents</li>
                      <li>• JPG/JPEG images</li>
                      <li>• Maximum file size: 10MB</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">What to Expect</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Automatic key detection</li>
                      <li>• Movable-do solfa notation</li>
                      <li>• Multi-staff support</li>
                      <li>• Multi-voice handling</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Solfa System</h4>
                    <p className="text-muted-foreground">
                      Uses movable-do notation where "Do" represents the tonic of the detected key signature.
                    </p>
                  </div>

                  <div className="rounded-lg bg-accent/50 p-3">
                    <p className="text-xs text-accent-foreground">
                      <strong>Note:</strong> For best results, ensure your score is clear and well-lit with minimal background noise.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
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
