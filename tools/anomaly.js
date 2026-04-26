import OpenAI from "openai";

export async function detectAnomaly() {
  try {
    const client = new OpenAI({
      apiKey: process.env.PHI4_KEY,
      baseURL: process.env.PHI4_ENDPOINT,
    });

    const response = await client.chat.completions.create({
      model: "phi-4",
      messages: [
        {
          role: "user",
          content: "Detect any anomalies in my Azure costs. Provide details on detected anomalies including service, spike percentage, possible cause, and severity."
        }
      ],
      max_tokens: 1000,
    });

    const summary = response.choices[0]?.message?.content || "Unable to detect anomalies.";

    return { summary };
  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);

    return {
      error: true,
      raw: error.response?.data || error.message
    };
  }
}