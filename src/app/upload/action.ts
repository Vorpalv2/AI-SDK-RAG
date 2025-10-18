"use server";

import { chunkContent } from "@/lib/chunking";
import { db } from "@/lib/db-config";
import { documents } from "@/lib/db-schema";
import { generateEmbeddings } from "@/lib/embeddings";
import * as pdf from "pdf-parse";

export async function processPDFFile(formdata: FormData) {
  try {
    const file = formdata.get("pdf") as File;
    const byte = await file.arrayBuffer();
    const buffer = Buffer.from(byte);
    const parser = new pdf.PDFParse({ data: buffer });
    const pdfText = (await parser.getText()).text;

    if (!pdfText || pdfText.trim().length === 0) {
      return {
        success: false,
        error: "No text found in PDF",
      };
    }
    const chunkedContent = await chunkContent(pdfText);
    const embeddedContent = await generateEmbeddings(chunkedContent);
    // console.log(embeddedContent, "embedded content");

    const records = chunkedContent.map((chunk, index) => ({
      content: chunk,
      embedding: embeddedContent[index],
    }));
    console.log(records[0]);
    await db.insert(documents).values(records);

    return {
      success: true,
      message: `Created ${records.length} searchable chunks`,
    };
    // to upload it into neon database
  } catch (error) {
    console.error("PDF processing error", error);
    return {
      success: false,
      error: "failed to process PDF",
    };
  }
}
