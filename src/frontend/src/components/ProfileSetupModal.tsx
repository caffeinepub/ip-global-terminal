import { Loader2, Shield } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();

  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");

  // Show modal only when: authenticated, profile data fetched, and no profile exists
  const showModal =
    isAuthenticated && !isLoading && isFetched && userProfile === null;

  if (!showModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");

    if (!name.trim()) {
      setNameError("Display name is required.");
      return;
    }

    try {
      await saveMutation.mutateAsync({
        name: name.trim(),
        organisation: organisation.trim(),
        email: email.trim() || undefined,
      });
    } catch (err: any) {
      setNameError(err?.message ?? "Failed to save profile. Please try again.");
    }
  };

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
    textTransform: "uppercase",
    color: "oklch(0.78 0.15 85)",
    marginBottom: "0.4rem",
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* Modal panel */}
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: "oklch(0.10 0 0)",
          border: "1.5px solid oklch(0.78 0.15 85 / 0.35)",
          boxShadow: "0 0 40px oklch(0.78 0.15 85 / 0.20)",
        }}
      >
        {/* Icon + heading */}
        <div className="text-center mb-7">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{
              backgroundColor: "oklch(0.78 0.15 85 / 0.12)",
              border: "1px solid oklch(0.78 0.15 85 / 0.4)",
            }}
          >
            <Shield
              className="w-7 h-7"
              style={{ color: "oklch(0.78 0.15 85)" }}
            />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              color: "oklch(0.78 0.15 85)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Welcome to IPGT
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.55 0 0)" }}
          >
            Set up your profile to start registering intellectual property on
            the blockchain.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Display name */}
          <div>
            <label htmlFor="profile-name" style={labelStyle}>
              Display Name *
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name or alias"
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
            {nameError && (
              <p
                className="mt-1.5 text-xs"
                style={{ color: "oklch(0.70 0.20 25)" }}
              >
                {nameError}
              </p>
            )}
          </div>

          {/* Organisation */}
          <div>
            <label htmlFor="profile-org" style={labelStyle}>
              Organisation{" "}
              <span
                style={{
                  color: "oklch(0.45 0 0)",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </label>
            <input
              id="profile-org"
              type="text"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Company, university, or individual"
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
          </div>

          {/* Email */}
          <div>
            <label htmlFor="profile-email" style={labelStyle}>
              Email{" "}
              <span
                style={{
                  color: "oklch(0.45 0 0)",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{
              backgroundColor: "oklch(0.78 0.15 85)",
              color: "oklch(0.08 0 0)",
              boxShadow: "0 0 20px oklch(0.78 0.15 85 / 0.30)",
            }}
            onMouseEnter={(e) => {
              if (!saveMutation.isPending) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "oklch(0.85 0.14 85)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 28px oklch(0.78 0.15 85 / 0.45)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.78 0.15 85)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px oklch(0.78 0.15 85 / 0.30)";
            }}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
