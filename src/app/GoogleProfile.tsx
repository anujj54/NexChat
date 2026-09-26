
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type GoogleProfileProps = {
  name: string;
  email: string;
  image?: string | null;
};

export default function GoogleProfile({
  name,
  email,
  image,
}: GoogleProfileProps) {
  const [open, setOpen] = useState(false);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Google account"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-semibold transition hover:ring-2 hover:ring-violet-500/40"
      >
        {image ? (
          <img
            src={image}
            alt={name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/10 bg-[#17171f] p-3 shadow-2xl">
          <div className="flex items-center gap-3 p-2">
            {image ? (
              <img
                src={image}
                alt={name}
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 font-semibold">
                {initial}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {name}
              </p>
              <p className="truncate text-xs text-white/40">
                {email}
              </p>
            </div>
          </div>

          <div className="my-3 border-t border-white/10" />

          <button
            type="button"
            onClick={() =>
              signOut({ callbackUrl: "/login" })
            }
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}