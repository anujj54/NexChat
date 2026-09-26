"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function NewChatButton() {
  const router = useRouter();

  const createChat = api.chat.create.useMutation({
    onSuccess: (chat) => {
      router.push(`/?chat=${chat.id}`);
      router.refresh();
    },
  });

  return (
    <button
      onClick={() => createChat.mutate({ title: "New conversation" })}
      disabled={createChat.isPending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
    >
      <span className="text-lg">+</span>
      {createChat.isPending ? "Creating..." : "New conversation"}
    </button>
  );
}