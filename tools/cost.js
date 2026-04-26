import OpenAI from "openai";

export async function getCostSummary() {
  try {
    const client = new OpenAI({
      baseURL: process.env.PHI4_ENDPOINT,
      apiKey: process.env.PHI4_KEY,
      defaultQuery: {
        "api-version": "2024-02-15-preview"
      }
    });

    const completion = await client.chat.completions.create({
      model: process.env.PHI4_AGENT_NAME || "Phi-4-reasoning-1",
      messages: [
        {
          role: "system",
          content:
            "You are a FinOps assistant. Provide clear Azure cost summaries."
        },
        {
          role: "user",
          content:
            "Analyze my Azure costs for the month to date and summarize by service."
        }
      ]
    });

    const summary = completion.choices?.[0]?.message?.content;

    return { summary };

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);

    return {
      error: true,
      message: error.message,
      details: error.response?.data
    };
  }
}