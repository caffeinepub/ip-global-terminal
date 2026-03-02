import React, { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Shield, Upload, FileText, Hash, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { IPCategory } from '../backend';
import { useRegisterIP } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import RegistrationSuccessModal from '../components/RegistrationSuccessModal';

const JURISDICTIONS = [
  'Global', 'United States', 'European Union', 'United Kingdom', 'China',
  'Japan', 'India', 'Australia', 'Canada', 'Brazil', 'South Korea',
  'Singapore', 'Switzerland', 'Germany', 'France', 'Netherlands',
  'Sweden', 'Israel', 'South Africa', 'Nigeria', 'Kenya', 'UAE',
];

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function RegisterIP() {
  const navigate = useNavigate();
  const registerMutation = useRegisterIP();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IPCategory>(IPCategory.patent);
  const [jurisdiction, setJurisdiction] = useState('Global');
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [registeredId, setRegisteredId] = useState<bigint | null>(null);
  const [error, setError] = useState('');

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setFileHash('');
    const buf = await f.arrayBuffer();
    const hex = await sha256Hex(buf);
    setFileHash(hex);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) { setError('Title is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }

    try {
      const docHashBytes = fileHash
        ? new Uint8Array(fileHash.match(/.{2}/g)!.map(h => parseInt(h, 16)))
        : new Uint8Array(32);

      const id = await registerMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category,
        documentHash: docHashBytes,
        fileBlob: null,
        jurisdiction,
        hash: fileHash,
      });

      setRegisteredId(id);
      setSuccessOpen(true);
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed. Please try again.');
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'oklch(0.97 0 0)',
    borderRadius: '0.5rem',
    padding: '0.625rem 0.875rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'oklch(0.78 0.15 85)',
    marginBottom: '0.5rem',
  };

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center" style={{ backgroundColor: 'oklch(0.08 0 0)' }}>
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.12)', border: '1px solid oklch(0.78 0.15 85 / 0.4)' }}
          >
            <Shield className="w-8 h-8" style={{ color: 'oklch(0.78 0.15 85)' }} />
          </div>

          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
          >
            Sign In to Register IP
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'oklch(0.55 0 0)' }}>
            Authentication is required to register intellectual property on the blockchain.
            Sign in or create an account to get started — it only takes a moment.
          </p>

          {/* Sign-in card */}
          <div
            className="rounded-xl p-8"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.40)',
              border: '1.5px solid oklch(0.78 0.15 85 / 0.30)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 0 20px oklch(0.78 0.15 85 / 0.15)',
            }}
          >
            <div className="space-y-4">
              <div
                className="flex items-start gap-3 p-3 rounded-lg text-left"
                style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.06)', border: '1px solid oklch(0.78 0.15 85 / 0.15)' }}
              >
                <Shield className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
                <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.65 0 0)' }}>
                  Your identity is secured by Internet Identity — a privacy-preserving authentication system on the Internet Computer.
                </p>
              </div>

              <button
                onClick={() => login()}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'oklch(0.78 0.15 85)',
                  color: 'oklch(0.08 0 0)',
                  boxShadow: '0 0 20px oklch(0.78 0.15 85 / 0.30)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoggingIn) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.85 0.14 85)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px oklch(0.78 0.15 85 / 0.45)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.78 0.15 85)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px oklch(0.78 0.15 85 / 0.30)';
                }}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In / Create Account
                  </>
                )}
              </button>

              <p className="text-xs" style={{ color: 'oklch(0.40 0 0)' }}>
                The IP Database is publicly viewable without signing in.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate({ to: '/database' })}
            className="mt-6 text-sm underline underline-offset-4 transition-colors"
            style={{ color: 'oklch(0.55 0 0)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.78 0.15 85)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.55 0 0)'; }}
          >
            Browse the IP Database instead →
          </button>
        </div>
      </div>
    );
  }

  // ── Registration form (authenticated) ─────────────────────────────────────
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'oklch(0.08 0 0)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.12)', border: '1px solid oklch(0.78 0.15 85 / 0.4)' }}
          >
            <Shield className="w-7 h-7" style={{ color: 'oklch(0.78 0.15 85)' }} />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
          >
            Register Intellectual Property
          </h1>
          <p className="text-sm" style={{ color: 'oklch(0.55 0 0)' }}>
            Permanently record your IP on the Internet Computer blockchain.
          </p>
        </div>

        {/* Form card — gold border glass panel, matching IPDatabase search panel */}
        <div
          className="rounded-xl p-8"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.40)',
            border: '1.5px solid oklch(0.78 0.15 85 / 0.30)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 0 20px oklch(0.78 0.15 85 / 0.15)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Quantum Encryption Algorithm v2"
                style={inputStyle}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.8)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your intellectual property in detail..."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.8)'; }}
                onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}
              />
            </div>

            {/* Category & Jurisdiction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IPCategory)}
                  style={inputStyle}
                >
                  <option value={IPCategory.patent}>Patent</option>
                  <option value={IPCategory.trademark}>Trademark</option>
                  <option value={IPCategory.copyright}>Copyright</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Jurisdiction</label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  style={inputStyle}
                >
                  {JURISDICTIONS.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File upload */}
            <div>
              <label style={labelStyle}>Document (optional)</label>
              <div
                className="rounded-lg p-6 text-center cursor-pointer transition-all duration-200"
                style={{
                  border: `2px dashed ${dragOver ? 'oklch(0.78 0.15 85)' : 'oklch(0.78 0.15 85 / 0.30)'}`,
                  backgroundColor: dragOver ? 'oklch(0.78 0.15 85 / 0.05)' : 'rgba(0,0,0,0.2)',
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
                {file ? (
                  <div>
                    <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: 'oklch(0.78 0.15 85)' }} />
                    <p className="text-sm font-medium" style={{ color: 'oklch(0.90 0 0)' }}>{file.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'oklch(0.60 0 0)' }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'oklch(0.78 0.15 85 / 0.5)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Drop a file here or <span style={{ color: 'oklch(0.78 0.15 85)' }}>browse</span>
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      PDF, DOCX, PNG, JPG — any format
                    </p>
                  </div>
                )}
              </div>

              {fileHash && (
                <div
                  className="mt-3 flex items-start gap-2 p-3 rounded-lg"
                  style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.08)', border: '1px solid oklch(0.78 0.15 85 / 0.25)' }}
                >
                  <Hash className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'oklch(0.78 0.15 85)' }} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold mb-0.5" style={{ color: 'oklch(0.78 0.15 85)' }}>SHA-256</p>
                    <p className="text-xs font-mono break-all" style={{ color: 'oklch(0.70 0 0)' }}>{fileHash}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{ backgroundColor: 'oklch(0.20 0.05 25 / 0.3)', border: '1px solid oklch(0.55 0.22 25 / 0.5)' }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'oklch(0.70 0.20 25)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.80 0.15 25)' }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'oklch(0.78 0.15 85)',
                color: 'oklch(0.08 0 0)',
                boxShadow: '0 0 20px oklch(0.78 0.15 85 / 0.30)',
              }}
              onMouseEnter={(e) => {
                if (!registerMutation.isPending) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.85 0.14 85)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px oklch(0.78 0.15 85 / 0.45)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.78 0.15 85)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px oklch(0.78 0.15 85 / 0.30)';
              }}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering on Blockchain…
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Register IP On-Chain
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <RegistrationSuccessModal
        open={successOpen}
        ipId={registeredId}
        ipTitle={title}
        onClose={() => {
          setSuccessOpen(false);
          setTitle('');
          setDescription('');
          setCategory(IPCategory.patent);
          setJurisdiction('Global');
          setFile(null);
          setFileHash('');
          navigate({ to: '/database' });
        }}
      />
    </div>
  );
}
