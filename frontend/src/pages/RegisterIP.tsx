import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, FileText, AlertCircle } from 'lucide-react';
import { useRegisterIP } from '../hooks/useQueries';
import { IPCategory, ExternalBlob } from '../backend';
import RegistrationSuccessModal from '../components/RegistrationSuccessModal';

const JURISDICTIONS = ['US', 'EU', 'UK', 'CN', 'JP', 'CA', 'AU', 'IN', 'BR', 'Global'];

/** Convert a Uint8Array to a lowercase hex string */
function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Compute SHA-256 of arbitrary bytes and return as hex string */
async function computeSha256Hex(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return uint8ArrayToHex(new Uint8Array(hashBuffer));
}

export default function RegisterIP() {
  const navigate = useNavigate();
  const { mutateAsync: registerIP, isPending } = useRegisterIP();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IPCategory | ''>('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<Uint8Array | null>(null);
  const [fileHashHex, setFileHashHex] = useState<string>('');
  const [isHashing, setIsHashing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [successIpId, setSuccessIpId] = useState<bigint | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setIsHashing(true);
    setFileHash(null);
    setFileHashHex('');
    try {
      const buffer = await f.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashBytes = new Uint8Array(hashBuffer);
      const hashHex = uint8ArrayToHex(hashBytes);
      setFileHash(hashBytes);
      setFileHashHex(hashHex);
    } catch {
      setError('Failed to hash file. Please try again.');
    } finally {
      setIsHashing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !category || !jurisdiction) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      let externalBlob: ExternalBlob | null = null;
      let documentHash: Uint8Array;
      let hashHex: string;

      if (file) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
          setUploadProgress(pct)
        );
        // Use the already-computed file hash, or recompute if needed
        if (fileHashHex && fileHash) {
          documentHash = fileHash;
          hashHex = fileHashHex;
        } else {
          const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
          documentHash = new Uint8Array(hashBuffer);
          hashHex = uint8ArrayToHex(documentHash);
        }
      } else {
        // No file: compute SHA-256 from title + description as the content hash
        const contentString = `${title.trim()}|${description.trim()}|${category}|${jurisdiction}`;
        const encoder = new TextEncoder();
        const contentBuffer = encoder.encode(contentString).buffer as ArrayBuffer;
        hashHex = await computeSha256Hex(contentBuffer);
        const hashBuffer = await crypto.subtle.digest('SHA-256', contentBuffer);
        documentHash = new Uint8Array(hashBuffer);
      }

      const ipId = await registerIP({
        title: title.trim(),
        description: description.trim(),
        category: category as IPCategory,
        documentHash,
        fileBlob: externalBlob,
        jurisdiction,
        hash: hashHex,
      });

      setSuccessIpId(ipId);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate({ to: '/database' });
  };

  const inputStyle = { background: 'oklch(0.10 0.025 240)' };
  const inputClass = 'border-gold/25 text-gray-100 placeholder:text-gray-600 focus:border-gold/50';

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'oklch(0.12 0.025 240)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gold mb-2">Register IP</h1>
          <p className="text-gray-400">
            Protect your intellectual property on the blockchain with an immutable on-chain record.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 rounded-sm border border-gold/20"
          style={{ background: 'oklch(0.13 0.03 240)' }}
        >
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-gray-300">
              Title <span className="text-gold">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Novel Compression Algorithm"
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-gray-300">
              Description <span className="text-gold">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your intellectual property in detail…"
              rows={4}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Category & Jurisdiction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-300">
                Category <span className="text-gold">*</span>
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as IPCategory)}>
                <SelectTrigger className={inputClass} style={inputStyle}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent style={{ background: 'oklch(0.13 0.03 240)' }} className="border-gold/25">
                  <SelectItem value={IPCategory.patent} className="text-gray-300">Patent</SelectItem>
                  <SelectItem value={IPCategory.trademark} className="text-gray-300">Trademark</SelectItem>
                  <SelectItem value={IPCategory.copyright} className="text-gray-300">Copyright</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-300">
                Jurisdiction <span className="text-gold">*</span>
              </Label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger className={inputClass} style={inputStyle}>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent style={{ background: 'oklch(0.13 0.03 240)' }} className="border-gold/25">
                  {JURISDICTIONS.map((j) => (
                    <SelectItem key={j} value={j} className="text-gray-300">{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload (optional) */}
          <div className="space-y-1.5">
            <Label className="text-gray-300">
              Document <span className="text-gray-500 text-xs font-normal">(optional)</span>
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 rounded-sm border border-dashed border-gold/25 hover:border-gold/50 transition-colors"
              style={{ background: 'oklch(0.10 0.025 240)' }}
            >
              {file ? (
                <>
                  <FileText className="w-8 h-8 text-gold" />
                  <span className="text-gray-300 text-sm font-medium">{file.name}</span>
                  <span className="text-gray-500 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                  {isHashing && (
                    <span className="text-gold text-xs flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Hashing…
                    </span>
                  )}
                  {fileHashHex && !isHashing && (
                    <span className="text-green-400 text-xs">✓ Hash computed</span>
                  )}
                  {fileHashHex && !isHashing && (
                    <span className="text-gray-600 text-xs font-mono truncate max-w-full px-2">
                      {fileHashHex.slice(0, 16)}…{fileHashHex.slice(-8)}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-600" />
                  <span className="text-gray-500 text-sm">Click to upload document</span>
                  <span className="text-gray-600 text-xs">PDF, DOCX, PNG, JPG, etc.</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {!file && (
              <p className="text-gray-600 text-xs">
                No file? A SHA-256 hash will be derived from your title, description, category, and jurisdiction.
              </p>
            )}
          </div>

          {/* Upload progress */}
          {isPending && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || isHashing}
            className="w-full bg-gold text-navy font-semibold hover:bg-gold/90 disabled:opacity-50 py-3"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Registering…
              </>
            ) : (
              'Register IP'
            )}
          </Button>
        </form>
      </div>

      <RegistrationSuccessModal
        open={showSuccess}
        onClose={handleSuccessClose}
        ipId={successIpId}
      />
    </div>
  );
}
