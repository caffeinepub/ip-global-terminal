import { Loader2, Pencil, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { IPDatabaseRecord } from "../backend";
import { useUpdateIPRecord } from "../hooks/useQueries";

export interface EditableRecord {
  ipAddress: string;
  owner: string;
  country: string;
  city: string;
  registrationDate: number; // ms timestamp
  status: "active" | "flagged" | "blocked";
  isBackend: boolean;
}

interface EditIPRecordModalProps {
  open: boolean;
  record: EditableRecord | null;
  onClose: () => void;
  onSuccess: (updated: EditableRecord) => void;
}

const inputStyle: React.CSSProperties = {
  backgroundColor: "rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.20)",
  color: "oklch(0.97 0 0)",
  borderRadius: "0.5rem",
  padding: "0.625rem 0.875rem",
  width: "100%",
  fontSize: "0.875rem",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "oklch(0.78 0.15 85)",
  marginBottom: "0.4rem",
};

export default function EditIPRecordModal({
  open,
  record,
  onClose,
  onSuccess,
}: EditIPRecordModalProps) {
  const updateMutation = useUpdateIPRecord();

  const [owner, setOwner] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [status, setStatus] = useState<"active" | "flagged" | "blocked">(
    "active",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record) {
      setOwner(record.owner);
      setCountry(record.country);
      setCity(record.city);
      setRegistrationDate(
        new Date(record.registrationDate).toISOString().split("T")[0],
      );
      setStatus(record.status);
      setErrors({});
    }
  }, [record]);

  if (!open || !record) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!owner.trim()) newErrors.owner = "Owner / organisation is required.";
    if (!country.trim()) newErrors.country = "Country is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!registrationDate)
      newErrors.registrationDate = "Registration date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedRecord: EditableRecord = {
      ipAddress: record.ipAddress,
      owner: owner.trim(),
      country: country.trim(),
      city: city.trim(),
      registrationDate: new Date(registrationDate).getTime(),
      status,
      isBackend: record.isBackend,
    };

    if (record.isBackend) {
      const backendRecord: IPDatabaseRecord = {
        ipAddress: record.ipAddress,
        owner: owner.trim(),
        country: country.trim(),
        city: city.trim(),
        registrationDate: BigInt(new Date(registrationDate).getTime()),
        status,
      };
      try {
        await updateMutation.mutateAsync({
          ipAddress: record.ipAddress,
          updatedRecord: backendRecord,
        });
        onSuccess(updatedRecord);
        onClose();
      } catch (err: any) {
        setErrors({
          submit: err?.message ?? "Failed to update record. Please try again.",
        });
      }
    } else {
      // Mock record — update locally
      onSuccess(updatedRecord);
      onClose();
    }
  };

  const handleClose = () => {
    if (updateMutation.isPending) return;
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
      }}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "oklch(0.10 0 0)",
          border: "1.5px solid oklch(0.78 0.15 85 / 0.35)",
          boxShadow: "0 0 40px oklch(0.78 0.15 85 / 0.20)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={updateMutation.isPending}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors disabled:opacity-50"
          style={{ color: "oklch(0.55 0 0)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.78 0.15 85)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.55 0 0)";
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: "oklch(0.78 0.15 85 / 0.12)",
              border: "1px solid oklch(0.78 0.15 85 / 0.4)",
            }}
          >
            <Pencil
              className="w-5 h-5"
              style={{ color: "oklch(0.78 0.15 85)" }}
            />
          </div>
          <div>
            <h2
              className="text-xl font-bold"
              style={{
                color: "oklch(0.97 0 0)",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Edit IP Record
            </h2>
            <p
              className="text-xs font-mono"
              style={{ color: "oklch(0.50 0 0)" }}
            >
              {record.ipAddress}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* IP Address (read-only) */}
          <div>
            <label htmlFor="edit-ip-address" style={labelStyle}>
              IP Address
            </label>
            <input
              id="edit-ip-address"
              type="text"
              value={record.ipAddress}
              readOnly
              style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }}
            />
          </div>

          {/* Owner */}
          <div>
            <label htmlFor="edit-owner" style={labelStyle}>
              Owner / Organisation *
            </label>
            <input
              id="edit-owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. Acme Corporation"
              style={inputStyle}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor =
                  "oklch(0.78 0.15 85 / 0.8)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor =
                  "rgba(255,255,255,0.20)";
              }}
            />
            {errors.owner && (
              <p
                className="mt-1 text-xs"
                style={{ color: "oklch(0.70 0.20 25)" }}
              >
                {errors.owner}
              </p>
            )}
          </div>

          {/* Country + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-country" style={labelStyle}>
                Country *
              </label>
              <input
                id="edit-country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United States"
                style={inputStyle}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    "oklch(0.78 0.15 85 / 0.8)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    "rgba(255,255,255,0.20)";
                }}
              />
              {errors.country && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: "oklch(0.70 0.20 25)" }}
                >
                  {errors.country}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="edit-city" style={labelStyle}>
                City *
              </label>
              <input
                id="edit-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New York"
                style={inputStyle}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    "oklch(0.78 0.15 85 / 0.8)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    "rgba(255,255,255,0.20)";
                }}
              />
              {errors.city && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: "oklch(0.70 0.20 25)" }}
                >
                  {errors.city}
                </p>
              )}
            </div>
          </div>

          {/* Registration Date */}
          <div>
            <label htmlFor="edit-reg-date" style={labelStyle}>
              Registration Date *
            </label>
            <input
              id="edit-reg-date"
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor =
                  "oklch(0.78 0.15 85 / 0.8)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor =
                  "rgba(255,255,255,0.20)";
              }}
            />
            {errors.registrationDate && (
              <p
                className="mt-1 text-xs"
                style={{ color: "oklch(0.70 0.20 25)" }}
              >
                {errors.registrationDate}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="edit-status" style={labelStyle}>
              Status *
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "active" | "flagged" | "blocked")
              }
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={(e) => {
                (e.target as HTMLSelectElement).style.borderColor =
                  "oklch(0.78 0.15 85 / 0.8)";
              }}
              onBlur={(e) => {
                (e.target as HTMLSelectElement).style.borderColor =
                  "rgba(255,255,255,0.20)";
              }}
            >
              <option value="active">Active</option>
              <option value="flagged">Flagged</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Submit error */}
          {errors.submit && (
            <p
              className="text-sm text-center"
              style={{ color: "oklch(0.70 0.20 25)" }}
            >
              {errors.submit}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={updateMutation.isPending}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "oklch(0.75 0 0)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "oklch(0.78 0.15 85)",
                color: "oklch(0.08 0 0)",
                boxShadow: "0 0 20px oklch(0.78 0.15 85 / 0.30)",
              }}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
