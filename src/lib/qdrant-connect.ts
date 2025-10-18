import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "dotenv";

config({ path: ".env" });

function connectToQdrantDB() {
  // console.log(process.env.QDRANT_API_KEY, "Qdrant Api Key log");

  const client = new QdrantClient({
    url: "https://945e14d0-1f8a-412a-af46-89d792b29c04.eu-central-1-0.aws.cloud.qdrant.io:6333",
    apiKey: process.env.QDRANT_API_KEY,
  });

  return client;
}

async function getCollection() {
  try {
    const qdrantClient = connectToQdrantDB();

    const result = await qdrantClient.getCollections();
    // console.log("List of collections:", result.collections);
    return result;
  } catch (err) {
    console.error("Could not get collections:", err);
  }
}

export { connectToQdrantDB, getCollection };
