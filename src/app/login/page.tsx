"use client";

import { signIn } from "next-auth/react";


export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07070a] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <span className="text-xl font-bold">N</span>
          </div>

          <h1 className="text-2xl font-semibold">Welcome to NexChat</h1>

          <p className="mt-2 text-sm text-white/35">
            Sign in to continue to your AI workspace
          </p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.99] cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.805 12.23c0-.79-.07-1.55-.225-2.27H12v4.3h5.49a4.69 4.69 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.055-4.4 3.055-7.67Z"
              fill="#4285F4"
            />
            <path
              d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.3-2.56c-.91.61-2.07.97-3.47.97-2.67 0-4.93-1.8-5.74-4.22H2.85v2.64A10.23 10.23 0 0 0 12 22Z"
              fill="#34A853"
            />
            <path
              d="M6.26 13.72A6.15 6.15 0 0 1 5.94 12c0-.6.11-1.18.32-1.72V7.64H2.85A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.36l3.18-2.64Z"
              fill="#FBBC05"
            />
            <path
              d="M12 6.06c1.5 0 2.85.52 3.91 1.54l2.93-2.93C17.08 3.03 14.76 2 12 2a10.23 10.23 0 0 0-9.15 5.64l3.41 2.64C7.07 7.86 9.33 6.06 12 6.06Z"
              fill="#EA4335"
            />
          </svg>

          Continue with Google
        </button>

        <p className="mt-6 text-center text-[11px] leading-5 text-white/20">
          By continuing, you agree to use NexChat responsibly.
        </p>
      </div>
    </main>
  );
}