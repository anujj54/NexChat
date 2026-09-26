import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import ChatClient from "./ChatClient";
import LogoutButton from "./LogoutButton";
import GoogleProfile from "./GoogleProfile";
import NotificationBell from "./NotificationBell";
import NewChatButton from "./NewChatButton";
import ChatWindow from "./ChatWindow";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ chat?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { chat: chatId } = await searchParams;

  const userName = session.user.name ?? "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen overflow-hidden bg-[#07070a] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-float absolute left-[15%] top-[-15%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="animate-float-delayed absolute right-[5%] top-[30%] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/5 blur-[140px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[270px] flex-col border-r border-white/[0.06] bg-white/[0.015] backdrop-blur-xl md:flex">
          {/* Logo */}
          <div className="flex h-[72px] items-center gap-3 border-b border-white/[0.06] px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
              <span className="text-lg font-bold">N</span>
            </div>

            <div>
              <h1 className="text-[15px] font-semibold">NexChat</h1>
              <p className="text-[10px] text-white/35">AI Workspace</p>
            </div>
          </div>

          {/* New Chat */}
          <div className="p-4">
            <NewChatButton />
          </div>

          {/* Search */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-white/35 transition-colors focus-within:border-white/[0.15]">
              <span className="text-sm">⌕</span>
              <span className="text-xs">Search chats...</span>

              <span className="ml-auto rounded-md border border-white/10 px-1.5 py-0.5 text-[9px]">
                ⌘ K
              </span>
            </div>
          </div>

          {/* Chat history */}
          <div className="flex-1 overflow-y-auto px-3">
            <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/25">
              Recent
            </p>

            <ChatClient />
          </div>

          {/* User */}
          <div className="border-t border-white/[0.06] p-3">
            <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-semibold">
                {userInitial}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{userName}</p>

                <p className="text-[10px] text-white/30">
                  Free workspace
                </p>
              </div>

              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-[72px] items-center justify-between border-b border-white/[0.06] px-5 md:px-8">
            <div className="flex items-center gap-3 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
                <span className="text-sm font-bold">N</span>
              </div>

              <span className="font-semibold">NexChat</span>
            </div>

            <div className="hidden items-center gap-2 text-xs text-white/30 md:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              AI workspace ready
            </div>

            <div className="ml-auto flex items-center gap-3">
              <NotificationBell />

              <GoogleProfile
                name={session.user.name ?? "User"}
                email={session.user.email ?? ""}
                image={session.user.image}
              />
            </div>
          </header>

          {/* Chat */}
          <div className="flex flex-1 flex-col">
            {chatId ? (
              <ChatWindow chatId={chatId} />
            ) : (
              <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-8 md:px-8 md:py-12">
                {/* Welcome */}
                <div className="flex flex-1 flex-col items-center justify-center pb-10">
                  <div className="animate-scale-in mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-violet-500/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
                      <span className="text-xl font-bold">N</span>
                    </div>
                  </div>

                  <h2 className="animate-fade-up text-center text-3xl font-semibold tracking-tight md:text-4xl">
                    How can I help you?
                  </h2>

                  <p className="animate-fade-up mt-3 max-w-md text-center text-sm leading-6 text-white/35">
                    Ask questions, explore ideas, write code, or start a
                    conversation with NexChat.
                  </p>

                  {/* Suggestions */}
                  <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      [
                        "Explain a concept",
                        "Explain something in simple terms",
                      ],
                      ["Write some code", "Help me build a feature"],
                      [
                        "Brainstorm ideas",
                        "Explore ideas and possibilities",
                      ],
                      ["Learn something", "Teach me something new"],
                    ].map(([title, description]) => (
                      <button
                        key={title}
                        className="animate-fade-up group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-white/5"
                      >
                        <p className="text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                          {title}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="animate-fade-up">
                  <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 focus-within:border-white/[0.18] focus-within:bg-white/[0.045]">
                    <div className="flex items-end gap-2">
                      <textarea
                        placeholder="Message NexChat..."
                        rows={1}
                        className="max-h-32 min-h-[46px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/25"
                      />

                      <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 active:scale-95">
                        ↑
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-2 pb-1 pt-1">
                      <button className="rounded-lg p-1.5 text-white/25 transition hover:bg-white/5 hover:text-white/60">
                        +
                      </button>

                      <span className="text-[10px] text-white/20">
                        NexChat can make mistakes
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-center text-[10px] text-white/20">
                    Press Enter to send · Shift + Enter for new line
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(25px, 20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-20px, -25px);
          }
        }

        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out both;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}