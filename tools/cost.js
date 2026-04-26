import OpenAI from "openai";

/**
 * Use Phi-4 via Azure OpenAI-compatible endpoint
 */
export async function getCostSummary() {
  try {
    if (!process.env.PHI4_ENDPOINT || !process.env.PHI4_KEY) {
      return {
        error: true,
        message: "Missing PHI4_ENDPOINT or PHI4_KEY"
      };
    }

    const endpoint = process.env.PHI4_ENDPOINT.trim();
    const deployment = process.env.PHI4_AGENT_NAME || "Phi-4-reasoning-1";

    console.log("Endpoint:", endpoint);
    console.log("Deployment:", deployment);

    const client = new OpenAI({
      baseURL: endpoint, // must include /openai/v1/
      apiKey: process.env.PHI4_KEY
    });

    const completion = await client.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a FinOps assistant. Provide clear, structured Azure cost summaries."
        },
        {
          role: "user",
          content:
            "Analyze my Azure costs for the month to date and summarize by service."
        }
      ]
    });

    const summary = completion.choices?.[0]?.message?.content;

    if (!summary) {
      return {
        error: true,
        message: "Empty response from model",
        raw: completion
      };
    }

    return { summary };

  } catch (error) {
    console.error("ERROR:", error);

    return {
      error: true,
      message: error.message,
      details: error.response?.data || null
    };
  }
}