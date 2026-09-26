import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const chatRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                title: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.chat.create({
                data: {
                    title: input.title,
                    userId: ctx.session.user.id,
                },
            });
        }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.chat.findMany({
            where: {
                userId: ctx.session.user.id,
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                messages: {
                    where: {
                        role: "user",
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: 1,
                },
            },
        });
    }),

    getById: protectedProcedure
        .input(
            z.object({
                chatId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            return ctx.db.chat.findFirst({
                where: {
                    id: input.chatId,
                    userId: ctx.session.user.id,
                },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            });
        }),

    sendMessage: protectedProcedure
        .input(
            z.object({
                chatId: z.string(),
                content: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Check that the chat belongs to the logged-in user
            const chat = await ctx.db.chat.findFirst({
                where: {
                    id: input.chatId,
                    userId: ctx.session.user.id,
                },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            });

            if (!chat) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Chat not found",
                });
            }

            // Save user message
            const userMessage = await ctx.db.message.create({
                data: {
                    content: input.content,
                    role: "user",
                    chatId: input.chatId,
                },
            });

            // Set chat title from the first user message
            if (!chat.title) {
                const title =
                    input.content.length > 30
                        ? `${input.content.slice(0, 30)}...`
                        : input.content;

                await ctx.db.chat.update({
                    where: {
                        id: input.chatId,
                    },
                    data: {
                        title,
                    },
                });
            }

            // Prepare conversation
            const messages = [
                ...chat.messages.map((message) => ({
                    role: message.role as "user" | "assistant",
                    content: message.content,
                })),
                {
                    role: "user" as const,
                    content: input.content,
                },
            ];

            // Call OpenRouter
            const response = await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "openrouter/free",
                        messages,
                    }),
                },
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error("OpenRouter API error:", errorText);

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to get AI response",
                });
            }

            const data = await response.json();

            const assistantContent =
                data.choices?.[0]?.message?.content?.trim();

            if (!assistantContent) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "AI returned an empty response",
                });
            }

            // Save AI response
            const assistantMessage = await ctx.db.message.create({
                data: {
                    content: assistantContent,
                    role: "assistant",
                    chatId: input.chatId,
                },
            });

            // Update chat timestamp
            await ctx.db.chat.update({
                where: {
                    id: input.chatId,
                },
                data: {
                    updatedAt: new Date(),
                },
            });

            return {
                userMessage,
                assistantMessage,
            };
        }),

    delete: protectedProcedure
        .input(
            z.object({
                chatId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.chat.deleteMany({
                where: {
                    id: input.chatId,
                    userId: ctx.session.user.id,
                },
            });
        }),
});