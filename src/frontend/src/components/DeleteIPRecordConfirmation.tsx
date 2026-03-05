import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import React from "react";

interface DeleteIPRecordConfirmationProps {
  open: boolean;
  ipAddress: string;
  owner: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteIPRecordConfirmation({
  open,
  ipAddress,
  owner,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteIPRecordConfirmationProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.80)",
        backdropFilter: "blur(4px)",
      }}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onCancel();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isDeleting) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-7"
        style={{
          backgroundColor: "oklch(0.10 0 0)",
          border: "1.5px solid oklch(0.65 0.20 25 / 0.40)",
          boxShadow: "0 0 40px oklch(0.65 0.20 25 / 0.15)",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "oklch(0.65 0.20 25 / 0.12)",
              border: "1px solid oklch(0.65 0.20 25 / 0.35)",
            }}
          >
            <AlertTriangle
              className="w-7 h-7"
              style={{ color: "oklch(0.70 0.20 25)" }}
            />
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-xl font-bold text-center mb-2"
          style={{
            color: "oklch(0.97 0 0)",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Delete IP Record
        </h2>
        <p
          className="text-sm text-center mb-5"
          style={{ color: "oklch(0.55 0 0)" }}
        >
          Are you sure you want to delete this record? This action cannot be
          undone.
        </p>

        {/* Record info */}
        <div
          className="rounded-lg px-4 py-3 mb-6"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs font-mono"
              style={{ color: "oklch(0.78 0.15 85)" }}
            >
              {ipAddress}
            </span>
            <span
              className="text-xs truncate max-w-[140px]"
              style={{ color: "oklch(0.60 0 0)" }}
            >
              {owner}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
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
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "oklch(0.55 0.20 25)",
              color: "oklch(0.97 0 0)",
              boxShadow: "0 0 16px oklch(0.55 0.20 25 / 0.30)",
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
