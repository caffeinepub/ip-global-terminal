import { useState, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRegisterIP } from '../hooks/useQueries';
import { IPCategory } from '../backend';
import { ExternalBlob } from '../backend';
import RegistrationSuccessModal from '../components/RegistrationSuccessModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Hash, AlertCircle, Lock, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

async function computeSHA256(file: File): Promise<{ hex: string; bytes: Uint8Array }> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { hex, bytes: new Uint8Array(hashBuffer) };
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s/g, '');
  if (clean.length % 2 !== 0) return new Uint8Array(0);
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}

export default function RegisterIP() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { mutateAsync: registerIP, isPending } = useRegisterIP();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IPCategory | ''>('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [documentHash, setDocumentHash] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBlob, setFileBlob] = useState<ExternalBlob | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<bigint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1/50th of 1 IPGT = 0.02 IPGT
  const BURN_AMOUNT = 0.02;
  const BURN_AMOUNT_DISPLAY = '0.02';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsHashing(true);
    setError(null);

    try {
      const { hex, bytes: _bytes } = await computeSHA256(file);
      setDocumentHash(hex);

      const fileBytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(fileBytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
      setFileBlob(blob);
    } catch (err) {
      setError('Failed to process file. Please try again.');
    } finally {
      setIsHashing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) { setError('Title is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }
    if (!category) { setError('Category is required.'); return; }
    if (!jurisdiction.trim()) { setError('Jurisdiction is required.'); return; }
    if (!documentHash.trim()) { setError('Document hash is required. Upload a file or enter a hash manually.'); return; }

    const hashBytes = hexToBytes(documentHash.trim());
    if (hashBytes.length === 0) {
      setError('Invalid document hash format. Please enter a valid hex string.');
      return;
    }

    try {
      const ipId = await registerIP({
        title: title.trim(),
        description: description.trim(),
        category: category as IPCategory,
        documentHash: hashBytes,
        fileBlob: fileBlob,
        jurisdiction: jurisdiction.trim(),
      });
      setSuccessId(ipId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Insufficient IPGT')) {
        setError(`Insufficient IPGT balance. You need at least ${BURN_AMOUNT_DISPLAY} IPGT coins to register an IP.`);
      } else if (msg.includes('Unauthorized')) {
        setError('You must be logged in to register an IP.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    }
  };

  const handleSuccessClose = () => {
    setSuccessId(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setJurisdiction('');
    setDocumentHash('');
    setSelectedFile(null);
    setFileBlob(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.12)' }}
        >
          <Lock className="w-8 h-8" style={{ color: 'oklch(0.78 0.14 85)' }} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-8">
          You must be logged in with Internet Identity and hold IPGT coins to register intellectual property.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/database">
            <Button variant="outline" className="border-border text-foreground hover:bg-charcoal">
              Browse IP Database
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {successId !== null && (
        <RegistrationSuccessModal
          ipId={successId}
          burnAmount={BURN_AMOUNT}
          onClose={handleSuccessClose}
        />
      )}

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.15)' }}
          >
            <FileText className="w-5 h-5" style={{ color: 'oklch(0.78 0.14 85)' }} />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Register IP</h1>
            <p className="text-sm text-muted-foreground">Secure your intellectual property on the IPGT blockchain</p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm mt-4"
          style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.08)', border: '1px solid oklch(0.78 0.14 85 / 0.25)' }}
        >
          <Hash className="w-4 h-4 flex-shrink-0" style={{ color: 'oklch(0.78 0.14 85)' }} />
          <span className="text-muted-foreground">
            Registration burns <strong style={{ color: 'oklch(0.78 0.14 85)' }}>{BURN_AMOUNT_DISPLAY} IPGT</strong> from your balance permanently.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground font-medium">
            Title <span style={{ color: 'oklch(0.78 0.14 85)' }}>*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Method for Quantum Data Compression"
            className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground font-medium">
            Description <span style={{ color: 'oklch(0.78 0.14 85)' }}>*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed description of your intellectual property..."
            rows={5}
            className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground resize-none"
            required
          />
        </div>

        {/* Category + Jurisdiction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              Category <span style={{ color: 'oklch(0.78 0.14 85)' }}>*</span>
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as IPCategory)}>
              <SelectTrigger className="bg-charcoal border-border text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'oklch(0.18 0.025 240)', borderColor: 'oklch(0.28 0.03 240)' }}>
                <SelectItem value={IPCategory.patent}>Patent</SelectItem>
                <SelectItem value={IPCategory.trademark}>Trademark</SelectItem>
                <SelectItem value={IPCategory.copyright}>Copyright</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jurisdiction" className="text-foreground font-medium">
              Jurisdiction <span style={{ color: 'oklch(0.78 0.14 85)' }}>*</span>
            </Label>
            <Input
              id="jurisdiction"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="e.g., United States, EU, Global"
              className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Supporting Document</Label>
          <div
            className="relative rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors"
            style={{ borderColor: selectedFile ? 'oklch(0.78 0.14 85 / 0.5)' : 'oklch(0.28 0.03 240)' }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file && fileInputRef.current) {
                const dt = new DataTransfer();
                dt.items.add(file);
                fileInputRef.current.files = dt.files;
                handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            {isHashing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'oklch(0.78 0.14 85)' }} />
                <p className="text-sm text-muted-foreground">Computing SHA-256 hash...</p>
              </div>
            ) : selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8" style={{ color: 'oklch(0.78 0.14 85)' }} />
                <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Click to change
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop a file here or <span style={{ color: 'oklch(0.78 0.14 85)' }}>click to upload</span>
                </p>
                <p className="text-xs text-muted-foreground">PDF, PNG, JPG, DOC up to any size</p>
              </div>
            )}
          </div>
        </div>

        {/* Document Hash */}
        <div className="space-y-2">
          <Label htmlFor="docHash" className="text-foreground font-medium">
            Document Hash (SHA-256) <span style={{ color: 'oklch(0.78 0.14 85)' }}>*</span>
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="docHash"
              value={documentHash}
              onChange={(e) => setDocumentHash(e.target.value)}
              placeholder="Auto-filled when file uploaded, or enter manually"
              className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground font-mono text-sm pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Upload a file to auto-compute, or enter a SHA-256 hex hash manually.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isPending || isHashing}
          className="w-full font-semibold h-12 text-base"
          style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Registering on Blockchain...
            </span>
          ) : (
            `Register IP — Burn ${BURN_AMOUNT_DISPLAY} IPGT`
          )}
        </Button>
      </form>
    </div>
  );
}
