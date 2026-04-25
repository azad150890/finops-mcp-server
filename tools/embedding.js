import axios from "axios";

export async function getEmbedding(text) {
  const response = await axios.post(
    process.env.EMBEDDING_ENDPOINT,
    {
      input: text
    },
    {
      headers: {
        "api-key": process.env.EMBEDDING_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}