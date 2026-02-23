"use client";

import { useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: Props) {
  const { signInWithGoogle } = useAuth();

  const handleGoogle = useCallback(() => {
    signInWithGoogle();
    onClose();
  }, [signInWithGoogle, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1628]/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-lg bg-[#0a1628] p-8 text-[#EDE8D0] shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#EDE8D0]/70 hover:text-[#EDE8D0]"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <h2 id="auth-modal-title" className="font-serif text-2xl font-medium tracking-wide text-[#EDE8D0]">
          Welcome to Prime Aroma
        </h2>
        <p className="mt-4 text-sm text-[#EDE8D0]/80">
          Your orders and details are saved to your account.
        </p>
        <button
          type="button"
          onClick={handleGoogle}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-[#EDE8D0]/30 bg-[#EDE8D0] py-3 font-sans text-sm font-medium text-[#0a1628] hover:bg-[#EDE8D0]/90"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
