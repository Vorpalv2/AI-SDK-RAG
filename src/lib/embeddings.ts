import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

// 'embedding' is a single embedding object (number[])

export async function generateEmbedding(text: string) {
  let input = text.replace("\n", " ");

  const { embedding } = await embed({
    //   model: google.textEmbeddingModel('gemini-embedding-001'),
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: input,
  });
  return embedding;
}

export async function generateEmbeddings(texts: string[]) {
  let inputs = texts.map((text) => text.replace("\n", " "));

  const { embeddings } = await embedMany({
    //   model: google.textEmbeddingModel('gemini-embedding-001'),
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    values: inputs,
  });
  return embeddings;
}
