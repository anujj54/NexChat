"use client";

import { useState } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative rounded-lg p-2 text-white/35 transition hover:bg-white/5 hover:text-white cursor-pointer"
      >
        🔔

        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/10 bg-[#17171f] p-3 shadow-2xl">
          <div className="flex items-center justify-between px-2 py-2">
            <h3 className="text-sm font-semibold text-white">
              Notifications
            </h3>

            <span className="text-[10px] text-white/30">
              0 unread
            </span>
          </div>

          <div className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-center">
            <div className="mb-2 text-xl">🔔</div>

            <p className="text-xs font-medium text-white/60">
              You&apos;re all caught up
            </p>

            <p className="mt-1 text-[10px] text-white/25">
              New notifications will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}