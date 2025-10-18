import { searchDocuments } from "@/lib/search";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
  stepCountIs,
  InferUITools,
  UIDataTypes,
} from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const tools = {
  searchKnowledgeBase: tool({
    description: "search the knowledge base for relevant information",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant document"),
    }),
    execute: async ({ query }) => {
      try {
        // Search the vector database
        console.log("tool ran");
        const results = await searchDocuments(query, 3, 0.5);

        if (results.length === 0) {
          return "No relevant information found in the knowledge base.";
        }

        // Format results for the AI
        const formattedResults = results
          .map((r, i) => `[${i + 1}] ${r.content}`)
          .join("\n\n");

        return formattedResults;
      } catch (error) {
        console.error("Search error:", error);
        return "Error searching the knowledge base.";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();
  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are a helpful assistant with access to a knowledge base. 
          When users ask questions, search the knowledge base for relevant information.
          Always search before answering if the question might relate to uploaded documents.
          Base your answers on the search results when available. If the question is not related to the uploaded document then answer the question of the user based on the data that you've been trained on.`,
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(2), // stop after a maximum of 5 steps if tools were called
  });

  return result.toUIMessageStreamResponse();
}
