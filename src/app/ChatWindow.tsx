"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

type ChatWindowProps = {
  chatId: string;
};

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [message, setMessage] = useState("");

  const utils = api.useUtils();

  const { data: chat, isLoading } = api.chat.getById.useQuery({
    chatId,
  });

  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: async () => {
      setMessage("");

      await utils.chat.getById.invalidate({ chatId });
      await utils.chat.getAll.invalidate();
    },
  });

  const handleSend = () => {
    const content = message.trim();

    if (!content || sendMessage.isPending) return;

    sendMessage.mutate({
      chatId,
      content,
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-white/30">
          Loading conversation...
        </p>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-white/30">
          Conversation not found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Chat Header */}
      <div className="border-b border-white/[0.06] px-5 py-4 md:px-8">
        <h2 className="truncate text-sm font-medium text-white/80">
          {chat.title ?? "New conversation"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
        {chat.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-white/25">
              Start a conversation with NexChat.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {chat.messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-md bg-white px-4 py-3 text-sm text-black"
                      : "max-w-[80%] rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white/80"
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 focus-within:border-white/[0.18]">
            <div className="flex items-end gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message NexChat..."
                rows={1}
                className="max-h-32 min-h-[46px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/25"
              />

              <button
                onClick={handleSend}
                disabled={!message.trim() || sendMessage.isPending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition-all hover:scale-105 hover:bg-white/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {sendMessage.isPending ? "..." : "↑"}
              </button>
            </div>

            <div className="flex items-center justify-between px-2 pb-1 pt-1">
              <button className="rounded-lg p-1.5 text-white/25 transition hover:bg-white/5 hover:text-white/60">
                +
              </button>

              <span className="text-[10px] text-white/20">
                Enter to send · Shift + Enter for new line
              </span>
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-white/20">
            NexChat can make mistakes
          </p>
        </div>
      </div>
    </div>
  );
}