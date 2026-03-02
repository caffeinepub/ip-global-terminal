import React, { useState } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { useAddIPRecord } from '../hooks/useQueries';
import type { IPDatabaseRecord } from '../backend';

interface AddIPRecordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_REGEX = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

function isValidIP(ip: string): boolean {
  return IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip);
}

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(0,0,0,0.45)',
  border: '1px solid rgba(255,255,255,0.20)',
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
  textTransform: 'uppercase' as const,
  color: 'oklch(0.78 0.15 85)',
  marginBottom: '0.4rem',
};

export default function AddIPRecordModal({ open, onClose, onSuccess }: AddIPRecordModalProps) {
  const addMutation = useAddIPRecord();

  const [ipAddress, setIpAddress] = useState('');
  const [owner, setOwner] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [status, setStatus] = useState<'active' | 'flagged' | 'blocked'>('active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!ipAddress.trim()) newErrors.ipAddress = 'IP address is required.';
    else if (!isValidIP(ipAddress.trim())) newErrors.ipAddress = 'Enter a valid IPv4 or IPv6 address.';
    if (!owner.trim()) newErrors.owner = 'Owner / organisation is required.';
    if (!country.trim()) newErrors.country = 'Country is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!registrationDate) newErrors.registrationDate = 'Registration date is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const record: IPDatabaseRecord = {
      ipAddress: ipAddress.trim(),
      owner: owner.trim(),
      country: country.trim(),
      city: city.trim(),
      registrationDate: BigInt(new Date(registrationDate).getTime()),
      status,
    };

    try {
      await addMutation.mutateAsync(record);
      // Reset form
      setIpAddress('');
      setOwner('');
      setCountry('');
      setCity('');
      setRegistrationDate('');
      setStatus('active');
      setErrors({});
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrors({ submit: err?.message ?? 'Failed to add record. Please try again.' });
    }
  };

  const handleClose = () => {
    if (addMutation.isPending) return;
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'oklch(0.10 0 0)',
          border: '1.5px solid oklch(0.78 0.15 85 / 0.35)',
          boxShadow: '0 0 40px oklch(0.78 0.15 85 / 0.20)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={addMutation.isPending}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors disabled:opacity-50"
          style={{ color: 'oklch(0.55 0 0)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.78 0.15 85)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.55 0 0)'; }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.12)', border: '1px solid oklch(0.78 0.15 85 / 0.4)' }}
          >
            <Plus className="w-5 h-5" style={{ color: 'oklch(0.78 0.15 85)' }} />
          </div>
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
            >
              Add IP Record
            </h2>
            <p className="text-xs" style={{ color: 'oklch(0.50 0 0)' }}>
              New record will be persisted to the blockchain
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* IP Address */}
          <div>
            <label style={labelStyle}>IP Address *</label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="e.g. 192.168.1.1 or 2001:db8::1"
              style={inputStyle}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.8)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.20)'; }}
            />
            {errors.ipAddress && <p className="mt-1 text-xs" style={{ color: 'oklch(0.70 0.20 25)' }}>{errors.ipAddress}</p>}
          </div>

          {/* Owner */}
          <div>
            <label style={labelStyle}>Owner / Organisation *</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. Acme Corporation"
              style={inputStyle}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.8)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.20)'; }}
            />
            {errors.owner && <p className="mt-1 text-xs" style={{ color: 'oklch(0.70 0.20 25)' }}>{errors.owner}</p>}
          </div>

          {/* Country + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Country *</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United States"
                style={inputStyle}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.8)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.20)'; }}
              />
              {errors.country && <p className="mt-1 text-xs" style={{ color: 'oklch(0.70 0.20 25)' }}>{errors.country}</p>}
            </div>
            <div>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New York"
                style={inputStyle}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.8)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.20)'; }}
              />
              {errors.city && <p className="mt-1 text-xs" style={{ color: 'oklch(0.70 0.20 25)' }}>{errors.city}</p>}
            </div>
          </div>

          {/* Registration Date */}
          <div>
            <label style={labelStyle}>Registration Date *</label>
            <input
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.8)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.20)'; }}
            />
            {errors.registrationDate && <p className="mt-1 text-xs" style={{ color: 'oklch(0.70 0.20 25)' }}>{errors.registrationDate}</p>}
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'flagged' | 'blocked')}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.8)'; }}
              onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.20)'; }}
            >
              <option value="active">Active</option>
              <option value="flagged">Flagged</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Submit error */}
          {errors.submit && (
            <p className="text-sm text-center" style={{ color: 'oklch(0.70 0.20 25)' }}>{errors.submit}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={addMutation.isPending}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'oklch(0.75 0 0)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'oklch(0.78 0.15 85)',
                color: 'oklch(0.08 0 0)',
                boxShadow: '0 0 20px oklch(0.78 0.15 85 / 0.30)',
              }}
            >
              {addMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Add Record'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
