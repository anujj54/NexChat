"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function ChatClient() {
  const router = useRouter();

  const { data: chats, isLoading } = api.chat.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-1">
        <p className="px-2 text-[10px] text-white/25">
          Loading chats...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {chats?.map((chat) => {
        const firstMessage = chat.messages?.[0]?.content;

        const displayTitle =
          chat.title ||
          (firstMessage
            ? firstMessage.length > 30
              ? `${firstMessage.slice(0, 30)}...`
              : firstMessage
            : "New conversation");

        return (
          <button
            key={chat.id}
            onClick={() => router.push(`/?chat=${chat.id}`)}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-white/45 transition-all duration-200 hover:bg-white/5 hover:text-white/80"
          >
            <span className="text-white/35">◌</span>

            <span className="truncate">
              {displayTitle}
            </span>
          </button>
        );
      })}

      {chats?.length === 0 && (
        <p className="px-2 py-2 text-xs text-white/25">
          No conversations yet
        </p>
      )}
    </div>
  );
}