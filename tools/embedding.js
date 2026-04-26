import axios from "axios";

export async function getEmbedding(text) {
  const response = await axios.post(
    process.env.EMBED_ENDPOINT,
    {
      input: text
    },
    {
      headers: {
        "api-key": process.env.embed_key,
        "Content-Type": "application/json"
      }
    }
  );

  const data = response.data;

  // Handle different response formats
  let embedding = [];
  if (data.data && Array.isArray(data.data) && data.data[0] && data.data[0].embedding) {
    embedding = data.data[0].embedding;
  } else if (data.embedding) {
    embedding = data.embedding;
  } else if (Array.isArray(data)) {
    embedding = data;
  }

  const dimensions = embedding.length || 'unknown';

  const summary = `Embedding generated successfully for text: "${text}". Dimensions: ${dimensions}`;

  return { summary, embedding };
}